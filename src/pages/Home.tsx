/**
 * @format
 */
import {HomeDirectoryNav} from '../components/HomeDirectoryNav';

export function Home() {
    return (
        <div className="flex min-h-svh min-h-dvh flex-col px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))] text-left">
            <header className="mb-6">
                <p className="text-sm font-medium text-violet-600 dark:text-violet-400">React + Router + ECharts</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">首页</h1>
                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                    移动端全屏浏览各页；从下方目录进入图表示例或股票图。
                </p>
            </header>

            <section aria-labelledby="home-nav-heading">
                <h2
                    id="home-nav-heading"
                    className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                    页面目录
                </h2>
                <HomeDirectoryNav />
            </section>
        </div>
    );
}
