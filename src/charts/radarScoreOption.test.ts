/**
 * @format
 */
import {describe, expect, it} from 'vitest';
import {buildRadarScoreOption, getCompositeRatingLabel} from './radarScoreOption';

const defaultIndicators = ['大类', '行业', '持仓', '品类'];

describe('buildRadarScoreOption', () => {
    it('uses configured indicators and default 0–100 radial with hollow center radius', () => {
        const opt = buildRadarScoreOption({
            title: '测试',
            indicators: defaultIndicators,
            values: [10, 20, 30, 40]
        });

        expect(opt.title).toMatchObject({text: '测试'});
        const radar = opt.radar;
        expect(radar && !Array.isArray(radar)).toBe(true);
        if (!radar || Array.isArray(radar)) return;

        expect(Array.isArray(radar.radius)).toBe(true);
        expect((radar.radius as string[]).length).toBe(2);

        const indicators = radar.indicator ?? [];
        expect(indicators.map(i => i.name)).toEqual(defaultIndicators);
        expect(indicators.every(i => i.min === 0 && i.max === 100)).toBe(true);
        const splitColors = (radar.splitLine as {lineStyle?: {color?: string[]}})?.lineStyle?.color;
        expect(radar.splitLine).toMatchObject({show: true});
        expect(Array.isArray(splitColors)).toBe(true);
        expect(splitColors?.length).toBe(6);
        expect(splitColors?.slice(0, -1).every(c => c === 'rgba(0,0,0,0)')).toBe(true);
        const s0ForColor = (opt.series as Array<{lineStyle?: {color?: string}}>)[0];
        expect(splitColors?.[5]).toBe(s0ForColor?.lineStyle?.color);
        expect(radar.axisTick).toEqual({show: false});
        expect(radar.axisLabel).toEqual({show: false});

        const series = opt.series;
        expect(Array.isArray(series)).toBe(true);
        const s0 = (series as Array<{type?: string; data?: {value: number[]}[]}>)[0];
        expect(s0?.type).toBe('radar');
        expect(s0?.data?.[0]?.value).toEqual([10, 20, 30, 40]);
        const area = (s0 as {areaStyle?: {color?: string}}).areaStyle?.color;
        expect(area).toMatch(/^#/);
        const lineColor = (s0 as {lineStyle?: {color?: string}}).lineStyle?.color;
        expect((s0 as {itemStyle?: {color?: string}}).itemStyle?.color).toBe(lineColor);
        expect((s0 as {itemStyle?: {borderColor?: string}}).itemStyle?.borderColor).toBe(lineColor);
    });

    it('supports n dimensions and custom radial range', () => {
        const opt = buildRadarScoreOption({
            indicators: ['A', 'B'],
            radialMin: 10,
            radialMax: 20,
            values: [12, 18]
        });
        const radar = opt.radar;
        if (!radar || Array.isArray(radar)) return;
        const ind = radar.indicator ?? [];
        expect(ind.map(i => i.name)).toEqual(['A', 'B']);
        expect(ind.every(i => i.min === 10 && i.max === 20)).toBe(true);
        const s0 = (opt.series as Array<{data?: {value: number[]}[]}>)[0];
        expect(s0?.data?.[0]?.value).toEqual([12, 18]);
    });

    it('clamps values to radial range', () => {
        const opt = buildRadarScoreOption({
            indicators: defaultIndicators,
            values: [-5, 200, NaN, 50] as unknown as number[]
        });
        const s0 = (opt.series as Array<{data?: {value: number[]}[]}>)[0];
        expect(s0?.data?.[0]?.value).toEqual([0, 100, 0, 50]);
    });

    it('throws when values length mismatches indicators', () => {
        expect(() =>
            buildRadarScoreOption({
                indicators: ['a', 'b'],
                values: [1]
            })
        ).toThrow(/values\.length/);
    });

    it('shows composite average and level in center graphic', () => {
        const opt = buildRadarScoreOption({
            indicators: defaultIndicators,
            values: [60, 60, 60, 60]
        });
        const g = opt.graphic;
        expect(Array.isArray(g)).toBe(true);
        const el = (g as Array<{type?: string; style?: {text?: string}}>)[0];
        expect(el?.type).toBe('text');
        const text = el?.style?.text ?? '';
        expect(text).toContain('各项平均分 60.0');
        expect(text).toContain('良好');
        const st = el?.style as {
            fill?: string;
            rich?: Record<string, {color?: string}>;
        };
        const series0 = (opt.series as Array<{lineStyle?: {color?: string}}>)[0];
        const lineColor = series0?.lineStyle?.color;
        expect(st?.fill).toBe(lineColor);
        expect(st?.rich?.t?.color).toBe(lineColor);
        expect(st?.rich?.a?.color).toBe(lineColor);
        expect(st?.rich?.lv?.color).toBe(lineColor);
    });
});

describe('getCompositeRatingLabel', () => {
    it('maps thresholds: 一般 / 良好 / 优秀 / 卓越', () => {
        expect(getCompositeRatingLabel(54)).toBe('一般');
        expect(getCompositeRatingLabel(55)).toBe('一般');
        expect(getCompositeRatingLabel(55.1)).toBe('良好');
        expect(getCompositeRatingLabel(70)).toBe('良好');
        expect(getCompositeRatingLabel(70.1)).toBe('优秀');
        expect(getCompositeRatingLabel(80)).toBe('优秀');
        expect(getCompositeRatingLabel(80.1)).toBe('卓越');
    });
});
