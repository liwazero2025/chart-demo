/**
 * @format
 */
import {Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import {APP_ROUTE_CONFIGS, type AppRouteConfig} from './definitions';

export type {AppRouteConfig};
export {APP_ROUTE_CONFIGS};

function RouteFallback() {
    return <div className="p-6 text-slate-500 dark:text-slate-400">加载中…</div>;
}

export type AppRoutesProps = {
    routes?: AppRouteConfig[];
};

export function AppRoutes({routes = APP_ROUTE_CONFIGS}: AppRoutesProps) {
    return (
        <Suspense fallback={<RouteFallback />}>
            <Routes>
                {routes.map(({path, Component}) => (
                    <Route
                        key={path}
                        path={path}
                        element={<Component />}
                    />
                ))}
            </Routes>
        </Suspense>
    );
}
