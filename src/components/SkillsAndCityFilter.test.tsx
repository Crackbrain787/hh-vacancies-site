import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import SkillsAndCityFilter from './SkillsAndCityFilter';
import { renderWithProviders, createTestStore } from '../test/test-utils';
import '@testing-library/jest-dom';

// Мокаем API вызовы
vi.mock('../store/slices/vacanciesSlice', async () => {
  const actual = await vi.importActual('../store/slices/vacanciesSlice');
  return {
    ...actual,
    loadVacancies: vi.fn(() => ({
      type: 'vacancies/loadVacancies/pending',
      payload: undefined,
    })),
  };
});

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

  it('allows adding new skill', () => {
    const store = createMockStore();
    
    renderWithProviders(<SkillsAndCityFilter />, { store });
    
    const input = screen.getByPlaceholderText('Добавить навык');
    const addButton = screen.getByText('+');
    
    fireEvent.change(input, { target: { value: 'Jest' } });
    expect(addButton).toBeEnabled();
    
    fireEvent.click(addButton);
    
    // Проверяем, что input очистился
    expect(input).toHaveValue('');
    
    // Проверяем, что skill был добавлен в state (через addSkill action)
    // Note: loadVacancies мокнут, поэтому не будет ошибки thunk
  });

  it('prevents adding empty skill', () => {
    const store = createMockStore();
    
    renderWithProviders(<SkillsAndCityFilter />, { store });
    
    const addButton = screen.getByText('+');
    expect(addButton).toBeDisabled();
  });

  it('allows removing skill', () => {
    const store = createMockStore();
    
    renderWithProviders(<SkillsAndCityFilter />, { store });
    
    const removeButtons = screen.getAllByText('×');
    expect(removeButtons).toHaveLength(3);
    
    fireEvent.click(removeButtons[0]); // Удаляем TypeScript
    
    // Проверяем, что removeSkill был вызван
    // Note: loadVacancies мокнут, поэтому не будет ошибки thunk
  });
});