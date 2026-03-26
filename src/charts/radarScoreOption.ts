/**
 * @format
 */
import type {EChartsOption} from 'echarts';
import {RADAR_SCORE_DIMENSIONS, type RadarScoreBundle} from '../domain/radarScoreTypes';

const SCORE_MIN = 0;
const SCORE_MAX = 100;

/** 设计稿画布宽度（px），用于 rem 换算说明 */
const DESIGN_WIDTH_PX = 750;

/**
 * 750 设计稿：将标注尺寸转为 rem。
 * 配套根节点 `font-size: calc(100vw / 7.5)`（1rem = 视口宽/7.5，375 宽时约 50px）时，
 * 设计 px 与 CSS 尺寸一致缩放，故 rem = 设计 px ÷ (750/7.5) = 设计 px ÷ 100。
 */
const DESIGN_PX_PER_REM = DESIGN_WIDTH_PX / 7.5;

function designPxToRem(designPx: number): string {
    return `${designPx / DESIGN_PX_PER_REM}rem`;
}

/** 雷达绘制区域中心（与 `radar.center` 一致），综合得分文案与之对齐 */
const RADAR_DRAW_CENTER: [string, string] = ['50%', '52%'];

/** 径向分段数（与 `radar.splitNumber` 一致）；分隔线数量为 splitNumber + 1，末条为最外圈 */
const RADAR_SPLIT_NUMBER = 5;

/** 仅最外圈 splitLine 使用得分线色，其余透明（见 ECharts RadarView 多边形分支按 tick 下标上色） */
function splitLineColorsOuterRingOnly(lineColor: string): string[] {
    const lineCount = RADAR_SPLIT_NUMBER + 1;
    return Array.from({length: lineCount}, (_, i) =>
        i === lineCount - 1 ? lineColor : 'rgba(0,0,0,0)'
    );
}

function clampScore(n: number): number {
    if (Number.isNaN(n)) return SCORE_MIN;
    return Math.min(SCORE_MAX, Math.max(SCORE_MIN, n));
}

/** 四项算术平均分 */
function averageFour(v0: number, v1: number, v2: number, v3: number): number {
    return (v0 + v1 + v2 + v3) / 4;
}

/**
 * 由四项均分得到等级：>80 卓越、>70 优秀、>55 良好，否则一般
 */
export function getCompositeRatingLabel(avg: number): '卓越' | '优秀' | '良好' | '一般' {
    if (avg > 80) return '卓越';
    if (avg > 70) return '优秀';
    if (avg > 55) return '良好';
    return '一般';
}

/** 等级对应强调色：一般绿、良好黄、优秀浅红、卓越红（折线与中心文案同色） */
function levelAccent(level: ReturnType<typeof getCompositeRatingLabel>): {
    line: string;
    area: string;
    areaEm: string;
} {
    switch (level) {
        case '一般':
            return {
                line: '#16a34a',
                area: '#4ade80',
                areaEm: '#22c55e'
            };
        case '良好':
            return {
                line: '#ca8a04',
                area: '#facc15',
                areaEm: '#eab308'
            };
        case '优秀':
            return {
                line: '#f87171',
                area: '#fca5a5',
                areaEm: '#f87171'
            };
        case '卓越':
            return {
                line: '#dc2626',
                area: '#f87171',
                areaEm: '#ef4444'
            };
        default: {
            const _x: never = level;
            throw new Error(`unexpected level: ${_x}`);
        }
    }
}

/**
 * 构建等级评分雷达图：刻度 0–100，通过内外半径使 0 落在内圈、100 落在外圈（几何中心至内圈留白）；不展示径向刻度数字。
 */
export function buildRadarScoreOption(bundle: RadarScoreBundle): EChartsOption {
    const [v0, v1, v2, v3] = bundle.values.map(clampScore) as RadarScoreBundle['values'];
    const avg = averageFour(v0, v1, v2, v3);
    const avgText = avg.toFixed(1);
    const level = getCompositeRatingLabel(avg);
    const accent = levelAccent(level);

    return {
        animation: true,
        title: {
            text: bundle.title ?? '等级评分雷达',
            left: 'center',
            top: 8,
            textStyle: {fontSize: 16, fontWeight: 600}
        },
        tooltip: {trigger: 'item'},
        legend: {
            data: ['综合评分'],
            bottom: 8,
            left: 'center'
        },
        graphic: [
            {
                type: 'text',
                left: RADAR_DRAW_CENTER[0],
                top: RADAR_DRAW_CENTER[1],
                z: 10,
                silent: true,
                style: {
                    text: `{t|综合评分}\n{a|四项平均分 ${avgText}}\n{lv|${level}}`,
                    textAlign: 'center',
                    textVerticalAlign: 'middle',
                    fill: accent.line,
                    fontSize: designPxToRem(22),
                    fontWeight: 500,
                    lineHeight: designPxToRem(30),
                    rich: {
                        t: {
                            fontSize: designPxToRem(22),
                            color: accent.line,
                            fontWeight: 500,
                            lineHeight: designPxToRem(30)
                        },
                        a: {
                            fontSize: designPxToRem(30),
                            color: accent.line,
                            fontWeight: 600,
                            lineHeight: designPxToRem(38)
                        },
                        lv: {
                            fontSize: designPxToRem(26),
                            color: accent.line,
                            fontWeight: 700,
                            lineHeight: designPxToRem(34),
                            padding: [designPxToRem(6), 0, 0, 0]
                        }
                    }
                }
            }
        ],
        radar: {
            center: [...RADAR_DRAW_CENTER],
            /** 内圈 = 0 分，外圈 = 100 分；几何中心在内外圈之间留白 */
            radius: ['26%', '62%'],
            startAngle: 90,
            shape: 'polygon',
            splitNumber: RADAR_SPLIT_NUMBER,
            indicator: RADAR_SCORE_DIMENSIONS.map(name => ({
                name,
                min: SCORE_MIN,
                max: SCORE_MAX
            })),
            axisName: {
                color: '#64748b',
                fontSize: 13
            },
            splitLine: {
                show: true,
                lineStyle: {
                    width: 2,
                    color: splitLineColorsOuterRingOnly(accent.line)
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(139,92,246,0.06)', 'rgba(139,92,246,0.02)']
                }
            },
            axisLine: {lineStyle: {color: 'rgba(148,163,184,0.45)'}},
            axisTick: {show: false},
            axisLabel: {show: false}
        },
        series: [
            {
                name: '综合评分',
                type: 'radar',
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: accent.line,
                    borderColor: accent.line
                },
                lineStyle: {width: 2, color: accent.line},
                areaStyle: {color: accent.area},
                emphasis: {
                    itemStyle: {
                        color: accent.line,
                        borderColor: accent.line
                    },
                    lineStyle: {width: 3, color: accent.line},
                    areaStyle: {color: accent.areaEm}
                },
                data: [{value: [v0, v1, v2, v3], name: '综合评分'}]
            }
        ]
    };
}
