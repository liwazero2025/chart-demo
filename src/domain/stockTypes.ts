/**
 * @format
 */

/** 对比指数（下拉切换数据源） */
export type IndexId = 'hs300' | 'sz50' | 'zz500';

export const INDEX_IDS: IndexId[] = ['hs300', 'sz50', 'zz500'];

export const INDEX_LABELS: Record<IndexId, string> = {
    hs300: '沪深300',
    sz50: '上证50',
    zz500: '中证500'
};

export interface OhlcBar {
    /** 交易日 0 点 UTC 时间戳（ms） */
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

/** 与 K 线逐根对齐的辅助折线 */
export interface OverlayLineSpec {
    id: string;
    name: string;
    values: number[];
}

export interface StockBundle {
    ohlc: OhlcBar[];
    /** 各指数收盘价，与 ohlc 等长、下标对齐 */
    indices: Record<IndexId, number[]>;
    overlayLines: OverlayLineSpec[];
}

export type TimeRangePreset = '5d' | '1m' | '3m' | '1y' | 'all';

export type TimeRange =
    | {type: 'preset'; preset: TimeRangePreset}
    | {type: 'absolute'; from: number; to: number};

export type StockChartMode = 'line' | 'candlestick';

/** 在全量 ohlc 上的闭区间下标 */
export type IndexRange = {start: number; end: number};
