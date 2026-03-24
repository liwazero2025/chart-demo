/**
 * @format
 */
import {lazy, Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';

const Home = lazy(() => import('../pages/Home').then(m => ({default: m.Home})));
const ChartPage = lazy(() => import('../pages/ChartPage').then(m => ({default: m.ChartPage})));
const StockChartPage = lazy(() => import('../pages/StockChartPage').then(m => ({default: m.StockChartPage})));

function RouteFallback() {
    return <div className="p-6 text-slate-500 dark:text-slate-400">加载中…</div>;
}

export function AppRoutes() {
    return (
        <Suspense fallback={<RouteFallback />}>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/chart"
                    element={<ChartPage />}
                />
                <Route
                    path="/stock"
                    element={<StockChartPage />}
                />
            </Routes>
        </Suspense>
    );
}
