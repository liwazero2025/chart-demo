/**
 * @format
 */
import {NavLink} from 'react-router-dom';

function navLinkClassName({isActive}: {isActive: boolean}): string {
    return [
        'flex min-h-12 items-center rounded-lg px-4 text-base font-medium transition-colors active:opacity-90',
        isActive
            ? 'bg-violet-600 text-white'
            : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-100'
    ].join(' ');
}

/**
 * 首页内的页面目录（手机端大触控区域）
 */
export function HomeDirectoryNav() {
    return (
        <nav
            className="flex w-full max-w-md flex-col gap-2"
            aria-label="页面目录"
        >
            <NavLink
                to="/"
                end
                className={navLinkClassName}
            >
                首页
            </NavLink>
            <NavLink
                to="/chart"
                className={navLinkClassName}
            >
                图表示例
            </NavLink>
            <NavLink
                to="/stock"
                className={navLinkClassName}
            >
                股票图
            </NavLink>
        </nav>
    );
}
