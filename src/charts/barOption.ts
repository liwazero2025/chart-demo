/**
 * @format
 */
import type {EChartsOption} from 'echarts';
import type {BarSalesDomainData} from '../domain/chartTypes';

export function buildBarSalesOption(data: BarSalesDomainData): EChartsOption {
    return {
        title: {
            text: data.title
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: data.categories
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: data.seriesName,
                type: 'bar',
                data: data.values
            }
        ]
    };
}
