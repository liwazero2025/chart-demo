/**
 * @format
 */

/**
 * 雷达可配置项：角向维度名称（1～n 项）、径向数值范围。
 */
export type RadarChartConfig = {
    /** 各维度名称，顺序即雷达顶点顺序，长度 ≥ 1 */
    indicators: string[];
    /** 径向轴最小值，默认 0 */
    radialMin?: number;
    /** 径向轴最大值，默认 100 */
    radialMax?: number;
};

/**
 * 构建雷达图 option 的入参：`values` 与 `indicators` 等长。
 */
export type RadarScoreBundle = RadarChartConfig & {
    /** 图表标题 */
    title?: string;
    /** 各维度得分，与 indicators 一一对应 */
    values: number[];
};
