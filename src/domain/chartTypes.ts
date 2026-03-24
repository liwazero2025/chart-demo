/**
 * @format
 */
/** 柱状图示例：领域数据（与 ECharts option 形状无关） */
export interface BarSalesDomainData {
    title: string;
    categories: string[];
    values: number[];
    seriesName: string;
}

export const sampleBarSalesData: BarSalesDomainData = {
    title: 'ECharts 柱状图示例',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [5, 20, 36, 10, 10, 20, 15],
    seriesName: '销量'
};
