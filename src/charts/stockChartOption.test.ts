/**
 * @format
 */
import {describe, expect, it} from 'vitest';
import {buildStockChartOption} from './stockChartOption';
import type {StockBundle} from '../domain/stockTypes';

function makeBundle(len: number): StockBundle {
    const start = Date.UTC(2024, 0, 1);
    const ohlc = Array.from({length: len}, (_, i) => {
        const t = start + i * 86_400_000;
        const c = 100 + i;
        return {time: t, open: c, high: c + 1, low: c - 1, close: c};
    });
    const closes = ohlc.map(b => b.close);
    const idx = closes.map(c => c * 0.5);
    return {
        ohlc,
        indices: {hs300: idx, sz50: idx.map(v => v * 0.9), zz500: idx.map(v => v * 1.1)},
        overlayLines: [
            {id: 'ma5', name: 'MA5', values: closes},
            {id: 'ma20', name: 'MA20', values: closes}
        ]
    };
}

describe('buildStockChartOption', () => {
    it('uses candlestick series when chartMode is candlestick', () => {
        const bundle = makeBundle(3);
        const opt = buildStockChartOption({
            bundle,
            chartMode: 'candlestick',
            activeIndexId: 'hs300',
            visibleLineIds: {}
        });
        const series = opt.series;
        expect(Array.isArray(series)).toBe(true);
        const list = series as Array<{type?: string; name?: string; data?: unknown}>;
        expect(list[0]?.type).toBe('candlestick');
        expect(list[0]?.data).toEqual([
            [100, 100, 99, 101],
            [101, 101, 100, 102],
            [102, 102, 101, 103]
        ]);
    });

    it('uses line for close when chartMode is line', () => {
        const bundle = makeBundle(2);
        const opt = buildStockChartOption({
            bundle,
            chartMode: 'line',
            activeIndexId: 'hs300',
            visibleLineIds: {}
        });
        const list = opt.series as Array<{type?: string; data?: number[]}>;
        expect(list[0]?.type).toBe('line');
        expect(list[0]?.data).toEqual([100, 101]);
    });

    it('switches benchmark index series name and data by activeIndexId', () => {
        const bundle = makeBundle(2);
        const optHs = buildStockChartOption({
            bundle,
            chartMode: 'line',
            activeIndexId: 'hs300',
            visibleLineIds: {}
        });
        const optSz = buildStockChartOption({
            bundle,
            chartMode: 'line',
            activeIndexId: 'sz50',
            visibleLineIds: {}
        });
        const sHs = (optHs.series as Array<{name?: string; data?: number[]}>) [1];
        const sSz = (optSz.series as Array<{name?: string; data?: number[]}>) [1];
        expect(sHs?.name).toBe('沪深300');
        expect(sSz?.name).toBe('上证50');
        expect(sHs?.data).toEqual([50, 50.5]);
        expect(sSz?.data).toEqual([45, 45.45]);
    });

    it('hides overlay lines when visibleLineIds is false', () => {
        const bundle = makeBundle(2);
        const opt = buildStockChartOption({
            bundle,
            chartMode: 'line',
            activeIndexId: 'hs300',
            visibleLineIds: {ma5: false, ma20: true}
        });
        const list = opt.series as Array<{name?: string}>;
        const names = list.map(s => s.name);
        expect(names).toContain('MA20');
        expect(names).not.toContain('MA5');
    });
});
