/**
 * @format
 */
import type {EChartsOption} from 'echarts';
import type {RadarScoreBundle} from '../domain/radarScoreTypes';

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

function clampScore(n: number, min: number, max: number): number {
    if (Number.isNaN(n)) return min;
    return Math.min(max, Math.max(min, n));
}

function average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * 将当前径向区间上的算术平均，归一化到 0–100，供等级阈值比较（与默认 0–100 档一致）。
 */
function averageNormalizedToRatingScale(values: number[], radialMin: number, radialMax: number): number {
    const avg = average(values);
    if (radialMax <= radialMin) return 0;
    return ((avg - radialMin) / (radialMax - radialMin)) * 100;
}

/**
 * 由归一化到 0–100 的均分得到等级：>80 卓越、>70 优秀、>55 良好，否则一般
 */
export function getCompositeRatingLabel(avgNormalized: number): '卓越' | '优秀' | '良好' | '一般' {
    if (avgNormalized > 80) return '卓越';
    if (avgNormalized > 70) return '优秀';
    if (avgNormalized > 55) return '良好';
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
 * 构建等级评分雷达图：角向维度由 `indicators` 配置（1～n 项），径向范围由 `radialMin`/`radialMax` 配置；
 * 通过内外半径使最小值落在内圈、最大值落在外圈；不展示径向刻度数字。
 */
export function buildRadarScoreOption(bundle: RadarScoreBundle): EChartsOption {
    const {indicators, title, values} = bundle;
    const radialMin = bundle.radialMin ?? 0;
    const radialMax = bundle.radialMax ?? 100;

    if (indicators.length === 0) {
        return {
            title: {text: title ?? '等级评分雷达', left: 'center', top: 8},
            radar: {indicator: []},
            series: []
        };
    }

    if (values.length !== indicators.length) {
        throw new Error(
            `RadarScoreBundle: values.length (${values.length}) must match indicators.length (${indicators.length})`
        );
    }

    const clamped = values.map(v => clampScore(v, radialMin, radialMax));
    const avg = average(clamped);
    const avgText = avg.toFixed(1);
    const ratingNorm = averageNormalizedToRatingScale(clamped, radialMin, radialMax);
    const level = getCompositeRatingLabel(ratingNorm);
    const accent = levelAccent(level);

    return {
        animation: true,
        title: {
            text: title ?? '等级评分雷达',
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
                    text: `{t|综合评分}\n{a|各项平均分 ${avgText}}\n{lv|${level}}`,
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
            radius: ['26%', '62%'],
            startAngle: 90,
            shape: 'polygon',
            splitNumber: RADAR_SPLIT_NUMBER,
            indicator: indicators.map(name => ({
                name,
                min: radialMin,
                max: radialMax
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
                data: [{value: clamped, name: '综合评分'}]
            }
        ]
    };
}
