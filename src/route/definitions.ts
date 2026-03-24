/**
 * @format
 */
import {lazy, type ComponentType, type LazyExoticComponent} from 'react';

const Home = lazy(() => import('../pages/Home').then(m => ({default: m.Home})));
const ChartPage = lazy(() => import('../pages/ChartPage').then(m => ({default: m.ChartPage})));
const StockChartPage = lazy(() => import('../pages/StockChartPage').then(m => ({default: m.StockChartPage})));

export type AppRouteConfig = {
    path: string;
    Component: LazyExoticComponent<ComponentType>;
};

/** 默认路由表（可按需从外部传入覆盖） */
export const APP_ROUTE_CONFIGS: AppRouteConfig[] = [
    {path: '/', Component: Home},
    {path: '/chart', Component: ChartPage},
    {path: '/stock', Component: StockChartPage}
];
