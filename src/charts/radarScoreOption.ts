/**
 * @format
 */
import type {EChartsOption} from 'echarts';
import {RADAR_SCORE_DIMENSIONS, type RadarScoreBundle} from '../domain/radarScoreTypes';

const SCORE_MIN = 0;
const SCORE_MAX = 100;

function clampScore(n: number): number {
    if (Number.isNaN(n)) return SCORE_MIN;
    return Math.min(SCORE_MAX, Math.max(SCORE_MIN, n));
}

/**
 * 构建等级评分雷达图：刻度 0–100，通过内外半径使 0 落在内圈、100 落在外圈（几何中心至内圈留白），外缘展示等级评分刻度。
 */
export function buildRadarScoreOption(bundle: RadarScoreBundle): EChartsOption {
    const [v0, v1, v2, v3] = bundle.values.map(clampScore) as RadarScoreBundle['values'];

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
        radar: {
            center: ['50%', '52%'],
            /** 内圈 = 0 分，外圈 = 100 分；几何中心在内外圈之间留白 */
            radius: ['26%', '62%'],
            startAngle: 90,
            shape: 'polygon',
            splitNumber: 5,
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
                lineStyle: {color: ['rgba(148,163,184,0.35)', 'rgba(148,163,184,0.2)']}
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(139,92,246,0.06)', 'rgba(139,92,246,0.02)']
                }
            },
            axisLine: {lineStyle: {color: 'rgba(148,163,184,0.45)'}},
            axisLabel: {
                show: true,
                color: '#94a3b8',
                fontSize: 11,
                formatter: (val: string | number) => {
                    const n = Number(val);
                    if (Math.round(n) === SCORE_MAX) {
                        return `${SCORE_MAX}\n等级评分`;
                    }
                    return String(val);
                }
            }
        },
        series: [
            {
                name: '综合评分',
                type: 'radar',
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {width: 2, color: '#7c3aed'},
                areaStyle: {color: 'rgba(124,58,237,0.22)'},
                emphasis: {
                    lineStyle: {width: 3},
                    areaStyle: {color: 'rgba(124,58,237,0.32)'}
                },
                data: [{value: [v0, v1, v2, v3], name: '综合评分'}]
            }
        ]
    };
}
