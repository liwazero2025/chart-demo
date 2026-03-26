/**
 * @format
 */
import {useMemo, useState} from 'react';
import {buildRadarScoreOption} from '../charts/radarScoreOption';
import {EChartsView} from '../components/EChartsView';
import {MobileHomeLink} from '../components/MobileHomeLink';
import {type RadarChartConfig} from '../domain/radarScoreTypes';

/** 默认角向维度名（仅本页演示；与 DEFAULT_CELLS 长度一致） */
const DEFAULT_INDICATORS = ['大类', '行业', '持仓', '品类'] as const;

/** 页面级雷达配置：维度名称与径向范围；可改为任意 1～n 项与 [min,max] */
const PAGE_RADAR_CONFIG: RadarChartConfig = {
    indicators: [...DEFAULT_INDICATORS],
    radialMin: 0,
    radialMax: 100
};

const RADIAL_MIN = PAGE_RADAR_CONFIG.radialMin ?? 0;
const RADIAL_MAX = PAGE_RADAR_CONFIG.radialMax ?? 100;

const DIM_COUNT = PAGE_RADAR_CONFIG.indicators.length;

/** 与 indicators 数量一致；单元格可为空串，图表侧空视为 radialMin（见 cellsToNumbers） */
type ScoreCell = number | '';

const DEFAULT_CELLS: ScoreCell[] = [72, 65, 82, 58];

if (DEFAULT_CELLS.length !== DIM_COUNT) {
    throw new Error('DEFAULT_CELLS.length must match PAGE_RADAR_CONFIG.indicators.length');
}

function cellsToNumbers(cells: ScoreCell[]): number[] {
    return cells.map(c => (c === '' ? RADIAL_MIN : c));
}

const maxInputLen = Math.max(String(Math.floor(RADIAL_MAX)).length, String(Math.ceil(RADIAL_MIN)).length) + 1;

export function RadarScorePage() {
    const [cells, setCells] = useState<ScoreCell[]>(() => [...DEFAULT_CELLS]);

    const option = useMemo(
        () =>
            buildRadarScoreOption({
                ...PAGE_RADAR_CONFIG,
                title: '等级评分雷达',
                values: cellsToNumbers(cells)
            }),
        [cells]
    );

    const setAt = (index: number, raw: string) => {
        const trimmed = raw.trim();
        setCells(prev => {
            const next: ScoreCell[] = [...prev];
            if (trimmed === '') {
                next[index] = '';
                return next;
            }
            const n = Number.parseFloat(trimmed);
            if (!Number.isFinite(n)) {
                return prev;
            }
            const v = Math.min(RADIAL_MAX, Math.max(RADIAL_MIN, n));
            next[index] = v;
            return next;
        });
    };

    return (
        <div className="flex min-h-svh min-h-dvh flex-col space-y-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] text-left">
            <MobileHomeLink />
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                等级评分（蜘蛛图）
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                角向维度与径向范围由配置决定（当前 {DIM_COUNT}
                项，{RADIAL_MIN}–{RADIAL_MAX}）。通过内外双半径，最小值在内圈、最大值在外圈。
            </p>

            <div className="grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
                {PAGE_RADAR_CONFIG.indicators.map((label, i) => (
                    <label
                        key={`${label}-${i}`}
                        className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300"
                    >
                        <span className="font-medium">{label}</span>
                        <input
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            maxLength={maxInputLen}
                            aria-label={`${label} 得分 ${RADIAL_MIN}–${RADIAL_MAX}`}
                            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                            value={cells[i] === '' ? '' : String(cells[i])}
                            onChange={e => setAt(i, e.target.value)}
                        />
                    </label>
                ))}
            </div>

            <EChartsView
                option={option}
                className="h-[420px] w-full border border-slate-200 dark:border-slate-700"
            />
        </div>
    );
}
