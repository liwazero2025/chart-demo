/**
 * @format
 */
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, expect, it} from 'vitest';
import {Home} from './Home';

describe('Home', () => {
    it('renders heading and directory nav', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', {level: 1, name: '首页'})).toBeInTheDocument();
        expect(screen.getByRole('navigation', {name: '页面目录'})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: '股票图'})).toBeInTheDocument();
    });
});
