/**
 * @format
 */
import {describe, expect, it} from 'vitest';
import {buildBarSalesOption} from './barOption';
import {sampleBarSalesData} from '../domain/chartTypes';

describe('buildBarSalesOption', () => {
    it('maps domain data to bar chart option', () => {
        const opt = buildBarSalesOption(sampleBarSalesData);

        expect(opt.title).toEqual({text: sampleBarSalesData.title});
        expect(opt.xAxis).toEqual({
            type: 'category',
            data: sampleBarSalesData.categories
        });
        expect(opt.yAxis).toEqual({type: 'value'});
        expect(opt.series).toEqual([
            {
                name: sampleBarSalesData.seriesName,
                type: 'bar',
                data: sampleBarSalesData.values
            }
        ]);
    });
});
