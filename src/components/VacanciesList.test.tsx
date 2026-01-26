import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import SkillsAndCityFilter from './SkillsAndCityFilter';
import { renderWithProviders, createTestStore } from '../test/test-utils';
import { Vacancy } from '../types/vacancy';
import '@testing-library/jest-dom';

// Мокаем API вызовы
vi.mock('../store/slices/vacanciesSlice', async () => {
  const actual = await vi.importActual('../store/slices/vacanciesSlice');
  return {
    ...actual,
    loadVacancies: vi.fn(),
  };
});

// Тип состояния для тестов
interface TestState {
  vacancies: {
    filters: {
      skills: string[];
      search: string;
      area: string;
      page: number;
    };
    vacancies: Vacancy[];
    loading: boolean;
    error: string | null;
    total: number;
    totalPages: number;
    currentPage: number;
  };
}

describe('SkillsAndCityFilter', () => {
  const createMockStore = () => createTestStore({
    vacancies: {
      filters: {
        skills: ['TypeScript', 'React', 'Redux'],
        search: '',
        area: '',
        page: 0,
      },
      vacancies: [],
      loading: false,
      error: null,
      total: 0,
      totalPages: 0,
      currentPage: 0,
    },
  });

  it('renders initial skills', () => {
    const store = createMockStore();
    
    renderWithProviders(<SkillsAndCityFilter />, { store });
    
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
  });

  it('renders skill input and add button', () => {
    const store = createMockStore();
    
    renderWithProviders(<SkillsAndCityFilter />, { store });
    
    expect(screen.getByPlaceholderText('Добавить навык')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('renders city selector', () => {
    const store = createMockStore();
    
    renderWithProviders(<SkillsAndCityFilter />, { store });
    
    expect(screen.getByDisplayValue('Все города')).toBeInTheDocument();
  });

  it('allows adding new skill', () => {
    const store = createMockStore();
    
    const { store: renderedStore } = renderWithProviders(<SkillsAndCityFilter />, { store });
    
    const input = screen.getByPlaceholderText('Добавить навык');
    const addButton = screen.getByText('+');
    
    fireEvent.change(input, { target: { value: 'Jest' } });
    fireEvent.click(addButton);
    
    // Используем приведение типа для доступа к состоянию
    const state = renderedStore.getState() as unknown as TestState;
    expect(state.vacancies.filters.skills).toContain('Jest');
  });

  it('prevents adding empty skill', () => {
    const store = createMockStore();
    
    renderWithProviders(<SkillsAndCityFilter />, { store });
    
    const addButton = screen.getByText('+');
    
    // Проверяем, что кнопка изначально disabled
    expect(addButton).toBeDisabled();
  });

  it('allows removing skill', () => {
    const store = createMockStore();
    
    const { store: renderedStore } = renderWithProviders(<SkillsAndCityFilter />, { store });
    
    const removeButtons = screen.getAllByText('×');
    fireEvent.click(removeButtons[0]); // Удаляем TypeScript
    
    // Используем приведение типа для доступа к состоянию
    const state = renderedStore.getState() as unknown as TestState;
    expect(state.vacancies.filters.skills).not.toContain('TypeScript');
  });
});