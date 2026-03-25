/**
 * @format
 */
import {useMemo, useState} from 'react';
import {buildRadarScoreOption} from '../charts/radarScoreOption';
import {EChartsView} from '../components/EChartsView';
import {MobileHomeLink} from '../components/MobileHomeLink';
import {RADAR_SCORE_DIMENSIONS, type RadarScoreValues} from '../domain/radarScoreTypes';

const LABELS = [...RADAR_SCORE_DIMENSIONS] as const;

const DEFAULT_VALUES: RadarScoreValues = [72, 65, 82, 58];

export function RadarScorePage() {
    const [values, setValues] = useState<RadarScoreValues>(DEFAULT_VALUES);

    const option = useMemo(() => buildRadarScoreOption({title: '等级评分雷达', values}), [values]);

    const setAt = (index: number, raw: string) => {
        const n = Number(raw);
        const v = Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
        setValues(prev => {
            const next: RadarScoreValues = [prev[0], prev[1], prev[2], prev[3]];
            (next as number[])[index] = v;
            return next;
        });
    };

    return (
        <div className="flex min-h-svh min-h-dvh flex-col space-y-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] text-left">
            <MobileHomeLink />
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">等级评分（蜘蛛图）</h1>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                四个维度：大类、行业、持仓、品类；分值范围为 0–100。通过内外双半径，0 分显示在内圈（几何中心留白），100 分在最外圈，外圈刻度旁标注「等级评分」。
            </p>

            <div className="grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
                {LABELS.map((label, i) => (
                    <label
                        key={label}
                        className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300"
                    >
                        <span className="font-medium">{label}</span>
                        <input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                            value={values[i] ?? 0}
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
