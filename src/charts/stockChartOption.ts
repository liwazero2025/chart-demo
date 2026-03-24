/**
 * @format
 */
import type {EChartsOption} from 'echarts';
import {INDEX_LABELS, type IndexId, type StockBundle, type StockChartMode} from '../domain/stockTypes';

export type BuildStockChartInput = {
    bundle: StockBundle;
    chartMode: StockChartMode;
    activeIndexId: IndexId;
    /** 折线 id（如 ma5）是否显示；缺省为 true */
    visibleLineIds: Record<string, boolean>;
};

function formatDay(ts: number): string {
    const d = new Date(ts);
    const y = d.getUTCFullYear();
    const m = `${d.getUTCMonth() + 1}`.padStart(2, '0');
    const day = `${d.getUTCDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function isLineVisible(visibleLineIds: Record<string, boolean>, id: string): boolean {
    return visibleLineIds[id] !== false;
}

/**
 * 根据切片后的 bundle 构建 ECharts option（含双 Y 轴：价格 / 指数）
 */
export function buildStockChartOption(input: BuildStockChartInput): EChartsOption {
    const {bundle, chartMode, activeIndexId, visibleLineIds} = input;
    const {ohlc, indices, overlayLines} = bundle;

    if (ohlc.length === 0) {
        return {
            title: {text: '暂无数据', left: 'center', top: 'middle'},
            xAxis: {type: 'category', data: []},
            yAxis: [{type: 'value'}, {type: 'value'}],
            series: []
        };
    }

    const categories = ohlc.map(b => formatDay(b.time));
    const closes = ohlc.map(b => b.close);

    const mainSeries =
        chartMode === 'candlestick'
            ? {
                  name: 'K线',
                  type: 'candlestick' as const,
                  yAxisIndex: 0,
                  data: ohlc.map(b => [b.open, b.close, b.low, b.high])
              }
            : {
                  name: '收盘价',
                  type: 'line' as const,
                  yAxisIndex: 0,
                  smooth: true,
                  showSymbol: false,
                  data: closes
              };

    const indexValues = indices[activeIndexId];
    const indexSeries = {
        name: INDEX_LABELS[activeIndexId],
        type: 'line' as const,
        yAxisIndex: 1,
        smooth: true,
        showSymbol: false,
        lineStyle: {width: 2},
        data: indexValues
    };

    const overlaySeries = overlayLines
        .filter(ol => isLineVisible(visibleLineIds, ol.id))
        .map(ol => ({
            name: ol.name,
            type: 'line' as const,
            yAxisIndex: 0,
            smooth: true,
            showSymbol: false,
            data: ol.values
        }));

    const series: EChartsOption['series'] = [mainSeries, indexSeries, ...overlaySeries];

    return {
        animation: false,
        legend: {
            top: 0,
            type: 'scroll'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {type: 'cross'}
        },
        grid: {
            left: 56,
            right: 56,
            top: 40,
            bottom: 80
        },
        xAxis: {
            type: 'category',
            data: categories,
            boundaryGap: chartMode === 'candlestick',
            axisLine: {onZero: false},
            splitLine: {show: false}
        },
        yAxis: [
            {
                type: 'value',
                scale: true,
                splitArea: {show: true},
                name: '价格'
            },
            {
                type: 'value',
                scale: true,
                position: 'right',
                name: '指数',
                splitLine: {show: false}
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'none'
            },
            {
                type: 'slider',
                xAxisIndex: 0,
                height: 22,
                bottom: 8,
                filterMode: 'none'
            }
        ],
        series
    };
}
