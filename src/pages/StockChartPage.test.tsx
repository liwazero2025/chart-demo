/**
 * @format
 */
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, expect, it, vi} from 'vitest';
import {StockChartPage} from './StockChartPage';

vi.mock('../components/EChartsView', () => ({
    EChartsView: () => <div data-testid="mock-chart" />
}));

describe('StockChartPage', () => {
    it('renders title and preset controls', () => {
        render(
            <MemoryRouter>
                <StockChartPage />
            </MemoryRouter>
        );
        expect(screen.getByRole('heading', {name: '股票图表示例'})).toBeInTheDocument();
        expect(screen.getByRole('tab', {name: '1月'})).toBeInTheDocument();
        expect(screen.getByRole('tab', {name: '3月'})).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
    });
});
