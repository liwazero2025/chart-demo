/**
 * @format
 */

/** 雷达维度顺序：大类、行业、持仓、品类 */
export const RADAR_SCORE_DIMENSIONS = ['大类', '行业', '持仓', '品类'] as const;

export type RadarScoreDimension = (typeof RADAR_SCORE_DIMENSIONS)[number];

/** 与 {@link RADAR_SCORE_DIMENSIONS} 等长，每项为 0–100 的等级评分 */
export type RadarScoreValues = [
    category: number,
    industry: number,
    position: number,
    productType: number
];

export type RadarScoreBundle = {
    /** 图表标题 */
    title?: string;
    /** 各维度得分 */
    values: RadarScoreValues;
};
