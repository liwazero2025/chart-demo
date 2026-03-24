/**
 * @format
 */
import {INDEX_IDS, type IndexId, type IndexRange, type OhlcBar, type StockBundle, type TimeRange, type TimeRangePreset} from './stockTypes';

const DAY_MS = 86_400_000;

const PRESET_MS: Record<TimeRangePreset, number> = {
    '5d': 5 * DAY_MS,
    '1m': 30 * DAY_MS,
    '3m': 90 * DAY_MS,
    '1y': 365 * DAY_MS,
    all: Number.POSITIVE_INFINITY
};

function emptyIndicesRecord(): Record<IndexId, number[]> {
    return {hs300: [], sz50: [], zz500: []};
}

/**
 * 根据时间范围得到在全量 ohlc 上的 [start, end] 闭区间下标
 */
export function resolveRangeToIndices(ohlc: OhlcBar[], range: TimeRange): IndexRange {
    const n = ohlc.length;
    if (n === 0) {
        return {start: 0, end: -1};
    }

    if (range.type === 'absolute') {
        let start = ohlc.findIndex(b => b.time >= range.from);
        if (start < 0) {
            start = 0;
        }
        let end = -1;
        for (let i = ohlc.length - 1; i >= 0; i--) {
            if (ohlc[i]!.time <= range.to) {
                end = i;
                break;
            }
        }
        if (end < 0) {
            end = n - 1;
        }
        if (start > end) {
            return {start: n - 1, end: n - 1};
        }
        return {start, end};
    }

    if (range.preset === 'all') {
        return {start: 0, end: n - 1};
    }

    const lastT = ohlc[n - 1]!.time;
    const ms = PRESET_MS[range.preset];
    const cutoff = lastT - ms;
    const start = Math.max(0, ohlc.findIndex(b => b.time >= cutoff));
    return {start, end: n - 1};
}

export function sliceStockBundle(bundle: StockBundle, ir: IndexRange): StockBundle {
    const {start, end} = ir;
    if (end < start || bundle.ohlc.length === 0) {
        return {
            ohlc: [],
            indices: emptyIndicesRecord(),
            overlayLines: bundle.overlayLines.map(l => ({...l, values: []}))
        };
    }

    const ohlc = bundle.ohlc.slice(start, end + 1);
    const indices = Object.fromEntries(
        INDEX_IDS.map(id => [id, bundle.indices[id].slice(start, end + 1)])
    ) as Record<IndexId, number[]>;

    return {
        ohlc,
        indices,
        overlayLines: bundle.overlayLines.map(l => ({
            ...l,
            values: l.values.slice(start, end + 1)
        }))
    };
}

/**
 * 根据 dataZoom 的 start/end（0–100）与当前外层窗口在全量中的下标，换算新的绝对下标窗口
 */
export function indicesFromDataZoomBatch(outer: IndexRange, batchStart: number, batchEnd: number, fullLen: number): IndexRange {
    const wLen = outer.end - outer.start + 1;
    if (wLen <= 0 || fullLen <= 0) {
        return outer;
    }
    const lo = outer.start + Math.floor((wLen * batchStart) / 100);
    const hi = outer.start + Math.ceil((wLen * batchEnd) / 100) - 1;
    const start = Math.max(0, Math.min(fullLen - 1, lo));
    const end = Math.max(start, Math.min(fullLen - 1, hi));
    return {start, end};
}
