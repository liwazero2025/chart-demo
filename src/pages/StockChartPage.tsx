/**
 * @format
 */
import {buildStockChartOption} from '../charts/stockChartOption';
import {EChartsView} from '../components/EChartsView';
import {MobileHomeLink} from '../components/MobileHomeLink';
import {generateMockStockBundle} from '../domain/stockMock';
import {indicesFromDataZoomBatch, resolveRangeToIndices, sliceStockBundle} from '../domain/stockRange';
import {
    INDEX_IDS,
    INDEX_LABELS,
    type IndexId,
    type IndexRange,
    type StockChartMode,
    type TimeRangePreset
} from '../domain/stockTypes';
import type {ECharts} from 'echarts';
import {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react';

const PRESETS: {key: TimeRangePreset; label: string}[] = [
    {key: '5d', label: '5日'},
    {key: '1m', label: '1月'},
    {key: '3m', label: '3月'},
    {key: '1y', label: '1年'},
    {key: 'all', label: '全部'}
];

/** 选中预设 Tab；图表内缩放后变为 custom，任一 Tab 不高亮 */
type RangeTab = TimeRangePreset | 'custom';

export function StockChartPage() {
    const fullBundle = useMemo(() => generateMockStockBundle(200), []);

    const [viewWindow, setViewWindow] = useState<IndexRange>(() =>
        resolveRangeToIndices(fullBundle.ohlc, {type: 'preset', preset: '3m'})
    );

    const [rangeTab, setRangeTab] = useState<RangeTab>('3m');

    const [chartMode, setChartMode] = useState<StockChartMode>('candlestick');
    const [activeIndexId, setActiveIndexId] = useState<IndexId>('hs300');
    const [visibleLineIds, setVisibleLineIds] = useState<Record<string, boolean>>({
        ma5: true,
        ma20: true
    });

    const viewWindowRef = useRef(viewWindow);
    const fullLenRef = useRef(fullBundle.ohlc.length);
    useLayoutEffect(() => {
        viewWindowRef.current = viewWindow;
        fullLenRef.current = fullBundle.ohlc.length;
    }, [viewWindow, fullBundle.ohlc.length]);

    const sliced = useMemo(() => sliceStockBundle(fullBundle, viewWindow), [fullBundle, viewWindow]);

    const option = useMemo(
        () =>
            buildStockChartOption({
                bundle: sliced,
                chartMode,
                activeIndexId,
                visibleLineIds
            }),
        [sliced, chartMode, activeIndexId, visibleLineIds]
    );

    const applyPreset = useCallback(
        (preset: TimeRangePreset) => {
            const next = resolveRangeToIndices(fullBundle.ohlc, {type: 'preset', preset});
            setViewWindow(next);
            setRangeTab(preset);
        },
        [fullBundle.ohlc]
    );

    const onChartReady = useCallback((chart: ECharts) => {
        const onDataZoom = (params: unknown) => {
            const p = params as {batch?: Array<{start?: number; end?: number}>};
            const b = p.batch?.[0];
            if (b?.start === undefined || b?.end === undefined) return;
            const prev = viewWindowRef.current;
            const next = indicesFromDataZoomBatch(prev, b.start, b.end, fullLenRef.current);
            if (next.start === prev.start && next.end === prev.end) return;
            setRangeTab('custom');
            setViewWindow(next);
        };
        chart.on('datazoom', onDataZoom);
        return () => chart.off('datazoom', onDataZoom);
    }, []);

    const toggleOverlay = (id: string) => {
        setVisibleLineIds(prev => ({...prev, [id]: !prev[id]}));
    };

    return (
        <div className="flex min-h-svh min-h-dvh flex-col space-y-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] text-left">
            <MobileHomeLink />
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">股票图表示例</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                演示 K 线 / 走势线切换、时间区间、均线显隐、对比指数切换；图表内缩放会同步收窄数据窗口。
            </p>

            <div className="space-y-2 border-b border-slate-200 pb-4 dark:border-slate-700">
                <span
                    id="range-tabs-label"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                    时间区间
                </span>
                <div
                    role="tablist"
                    aria-labelledby="range-tabs-label"
                    className="inline-flex flex-wrap rounded-lg border border-slate-300 p-0.5 dark:border-slate-600"
                >
                    {PRESETS.map(({key, label}) => {
                        const selected = rangeTab === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                tabIndex={selected ? 0 : -1}
                                className={`rounded-md px-3 py-1.5 text-sm ${
                                    selected
                                        ? 'bg-violet-600 text-white'
                                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                }`}
                                onClick={() => applyPreset(key)}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
                {rangeTab === 'custom' ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400">当前为图表内缩放后的区间，点击上方 Tab 可恢复预设范围</p>
                ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">主图</span>
                <div className="inline-flex rounded-lg border border-slate-300 p-0.5 dark:border-slate-600">
                    {(
                        [
                            {m: 'candlestick' as const, label: 'K 线'},
                            {m: 'line' as const, label: '走势'}
                        ] as const
                    ).map(({m, label}) => (
                        <button
                            key={m}
                            type="button"
                            className={`rounded-md px-3 py-1.5 text-sm ${
                                chartMode === m
                                    ? 'bg-violet-600 text-white'
                                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                            }`}
                            onClick={() => setChartMode(m)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span>对比指数</span>
                    <select
                        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                        value={activeIndexId}
                        onChange={e => setActiveIndexId(e.target.value as IndexId)}
                    >
                        {INDEX_IDS.map(id => (
                            <option
                                key={id}
                                value={id}
                            >
                                {INDEX_LABELS[id]}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">均线</span>
                {['ma5', 'ma20'].map(id => (
                    <label
                        key={id}
                        className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                        <input
                            type="checkbox"
                            checked={visibleLineIds[id] !== false}
                            onChange={() => toggleOverlay(id)}
                        />
                        {id === 'ma5' ? 'MA5' : 'MA20'}
                    </label>
                ))}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-500">
                当前窗口：第 {viewWindow.start + 1} – {viewWindow.end + 1} 根（全量 {fullBundle.ohlc.length} 根）
            </div>

            <EChartsView
                option={option}
                onChartReady={onChartReady}
                className="h-[480px] w-full border border-slate-200 dark:border-slate-700"
            />
        </div>
    );
}
