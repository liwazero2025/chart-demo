/**
 * @format
 */
import {Link} from 'react-router-dom';

/** 子页返回首页目录（手机端） */
export function MobileHomeLink() {
    return (
        <Link
            to="/"
            className="inline-flex min-h-11 items-center text-sm font-medium text-violet-600 active:opacity-80 dark:text-violet-400"
        >
            ← 返回目录
        </Link>
    );
}
