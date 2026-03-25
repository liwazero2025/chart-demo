/**
 * @format
 */
import {describe, expect, it} from 'vitest';
import {buildRadarScoreOption} from './radarScoreOption';
import {RADAR_SCORE_DIMENSIONS} from '../domain/radarScoreTypes';

describe('buildRadarScoreOption', () => {
    it('uses four dimensions 大类/行业/持仓/品类 with 0–100 scale and hollow center radius', () => {
        const opt = buildRadarScoreOption({
            title: '测试',
            values: [10, 20, 30, 40]
        });

        expect(opt.title).toMatchObject({text: '测试'});
        const radar = opt.radar;
        expect(radar && !Array.isArray(radar)).toBe(true);
        if (!radar || Array.isArray(radar)) return;

        expect(Array.isArray(radar.radius)).toBe(true);
        expect((radar.radius as string[]).length).toBe(2);

        const indicators = radar.indicator ?? [];
        expect(indicators.map(i => i.name)).toEqual([...RADAR_SCORE_DIMENSIONS]);
        expect(indicators.every(i => i.min === 0 && i.max === 100)).toBe(true);

        const series = opt.series;
        expect(Array.isArray(series)).toBe(true);
        const s0 = (series as Array<{type?: string; data?: {value: number[]}[]}>) [0];
        expect(s0?.type).toBe('radar');
        expect(s0?.data?.[0]?.value).toEqual([10, 20, 30, 40]);
    });

    it('clamps values to 0–100', () => {
        const opt = buildRadarScoreOption({
            values: [-5, 200, NaN, 50] as unknown as [number, number, number, number]
        });
        const s0 = (opt.series as Array<{data?: {value: number[]}[]}>) [0];
        expect(s0?.data?.[0]?.value).toEqual([0, 100, 0, 50]);
    });
});
