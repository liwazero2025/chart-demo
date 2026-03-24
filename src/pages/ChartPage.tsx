/**
 * @format
 */
import {useMemo} from 'react';
import {buildBarSalesOption} from '../charts/barOption';
import {EChartsView} from '../components/EChartsView';
import {MobileHomeLink} from '../components/MobileHomeLink';
import {sampleBarSalesData} from '../domain/chartTypes';

export function ChartPage() {
    const option = useMemo(() => buildBarSalesOption(sampleBarSalesData), []);

    return (
        <div className="flex min-h-svh min-h-dvh flex-col space-y-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] text-left">
            <MobileHomeLink />
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">图表示例</h1>
            <EChartsView
                option={option}
                className="h-[400px] w-full border border-slate-200 dark:border-slate-700"
            />
        </div>
    );
}
