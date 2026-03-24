/**
 * @format
 */
import {describe, expect, it} from 'vitest';
import {indicesFromDataZoomBatch, resolveRangeToIndices, sliceStockBundle} from './stockRange';
import type {OhlcBar, StockBundle} from './stockTypes';

function days(n: number): OhlcBar[] {
    const start = Date.UTC(2024, 0, 1);
    return Array.from({length: n}, (_, i) => ({
        time: start + i * 86_400_000,
        open: 1,
        high: 2,
        low: 0,
        close: 1
    }));
}

describe('resolveRangeToIndices', () => {
    it('returns full range for all preset', () => {
        const ohlc = days(10);
        const r = resolveRangeToIndices(ohlc, {type: 'preset', preset: 'all'});
        expect(r).toEqual({start: 0, end: 9});
    });

    it('slices last segment for 5d preset', () => {
        const ohlc = days(20);
        const r = resolveRangeToIndices(ohlc, {type: 'preset', preset: '5d'});
        expect(r.end).toBe(19);
        expect(r.start).toBeGreaterThan(0);
        expect(r.end - r.start + 1).toBeLessThanOrEqual(20);
    });
});

describe('sliceStockBundle', () => {
    it('keeps indices and overlays aligned with ohlc slice', () => {
        const ohlc = days(5);
        const bundle: StockBundle = {
            ohlc,
            indices: {
                hs300: [1, 2, 3, 4, 5],
                sz50: [1, 2, 3, 4, 5],
                zz500: [1, 2, 3, 4, 5]
            },
            overlayLines: [{id: 'x', name: 'X', values: [10, 20, 30, 40, 50]}]
        };
        const sliced = sliceStockBundle(bundle, {start: 1, end: 3});
        expect(sliced.ohlc).toHaveLength(3);
        expect(sliced.indices.hs300).toEqual([2, 3, 4]);
        expect(sliced.overlayLines[0]?.values).toEqual([20, 30, 40]);
    });
});

describe('indicesFromDataZoomBatch', () => {
    it('maps zoom batch to global indices', () => {
        const next = indicesFromDataZoomBatch({start: 10, end: 19}, 0, 100, 100);
        expect(next).toEqual({start: 10, end: 19});
        const half = indicesFromDataZoomBatch({start: 0, end: 9}, 50, 100, 100);
        expect(half.start).toBeGreaterThanOrEqual(0);
        expect(half.end).toBeLessThanOrEqual(99);
        expect(half.end).toBeGreaterThanOrEqual(half.start);
    });
});
