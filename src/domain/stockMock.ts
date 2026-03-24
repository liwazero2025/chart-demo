/**
 * @format
 */
import type {IndexId, OhlcBar, OverlayLineSpec, StockBundle} from './stockTypes';

function mulberry32(seed: number) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** 简单滑动平均，前若干位用可用样本平均 */
function movingAverage(values: number[], period: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < values.length; i++) {
        const from = Math.max(0, i - period + 1);
        const slice = values.slice(from, i + 1);
        out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
    }
    return out;
}

/**
 * 生成与 ohlc 等长的 mock 指数序列（收盘价），与股价略相关
 */
function buildIndexSeries(rand: () => number, closes: number[], base: number, drift: number): number[] {
    let v = base;
    return closes.map((c, i) => {
        const noise = (rand() - 0.5) * 2;
        const corr = i > 0 ? (c - closes[i - 1]!) * 0.15 : 0;
        v = v * (1 + drift / 100 + corr / c + noise * 0.008);
        return Math.round(v * 100) / 100;
    });
}

/** 生成约 `dayCount` 根日 K（按自然日递推，仅作演示） */
export function generateMockStockBundle(dayCount = 180): StockBundle {
    const rand = mulberry32(42);
    const start = Date.UTC(2024, 0, 2);
    const ohlc: OhlcBar[] = [];
    let close = 100 + rand() * 20;

    for (let i = 0; i < dayCount; i++) {
        const time = start + i * 86_400_000;
        const dailyVol = 0.02 + rand() * 0.03;
        const change = (rand() - 0.48) * dailyVol;
        const open = close;
        close = Math.max(1, open * (1 + change));
        const high = Math.max(open, close) * (1 + rand() * 0.01);
        const low = Math.min(open, close) * (1 - rand() * 0.01);
        ohlc.push({
            time,
            open: Math.round(open * 100) / 100,
            high: Math.round(high * 100) / 100,
            low: Math.round(low * 100) / 100,
            close: Math.round(close * 100) / 100
        });
    }

    const closes = ohlc.map(b => b.close);
    const indices: Record<IndexId, number[]> = {
        hs300: buildIndexSeries(rand, closes, 3800, 0.02),
        sz50: buildIndexSeries(rand, closes, 2800, 0.018),
        zz500: buildIndexSeries(rand, closes, 5500, 0.025)
    };

    const overlayLines: OverlayLineSpec[] = [
        {id: 'ma5', name: 'MA5', values: movingAverage(closes, 5)},
        {id: 'ma20', name: 'MA20', values: movingAverage(closes, 20)}
    ];

    return {ohlc, indices, overlayLines};
}
