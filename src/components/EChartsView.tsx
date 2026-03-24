/**
 * @format
 */
import type {ECharts, EChartsOption} from 'echarts';
import * as echarts from 'echarts';
import {useEffect, useLayoutEffect, useRef, type CSSProperties} from 'react';

export type EChartsViewProps = {
    option?: EChartsOption | null;
    style?: CSSProperties;
    className?: string;
    /**
     * 在 init 后调用一次；若返回函数则在 dispose 前调用，用于解绑事件等
     */
    onChartReady?: (chart: ECharts) => void | (() => void);
};

export function EChartsView({option, style, className, onChartReady}: EChartsViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ECharts | null>(null);
    const onReadyRef = useRef(onChartReady);
    useLayoutEffect(() => {
        onReadyRef.current = onChartReady;
    }, [onChartReady]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const chart = echarts.init(el);
        chartRef.current = chart;

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        const cleanupReady = onReadyRef.current?.(chart);

        return () => {
            if (typeof cleanupReady === 'function') {
                cleanupReady();
            }
            window.removeEventListener('resize', handleResize);
            chart.dispose();
            chartRef.current = null;
        };
    }, []);

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart || option == null) return;
        chart.setOption(option, {notMerge: true});
    }, [option]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={style}
        />
    );
}
