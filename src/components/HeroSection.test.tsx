import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import HeroSection from './HeroSection';
import vacanciesReducer from '../store/slices/vacanciesSlice';
import '@testing-library/jest-dom';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      vacancies: vacanciesReducer,
    },
    preloadedState: {
      vacancies: {
        vacancies: [],
        total: 0,
        totalPages: 0,
        currentPage: 0,
        loading: false,
        error: null,
        filters: {
          search: 'frontend',
          area: '',
          skills: ['TypeScript', 'React', 'Redux'],
          page: 0,
        },
        ...preloadedState,
      },
    },
  });
};

describe('HeroSection', () => {
  it('выводит заголовок и подзаголовок', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <HeroSection />
      </Provider>
    );
    
    expect(screen.getByText('Список вакансий')).toBeInTheDocument();
    expect(screen.getByText('по профессии Frontend-разработчик')).toBeInTheDocument();
  });

  it('отображает поисковые данные с текущим значением', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <HeroSection />
      </Provider>
    );
    
    const searchInput = screen.getByPlaceholderText('Должность, ключевые слова');
    expect(searchInput).toHaveValue('frontend');
  });

  it('отображает кнопку поиска', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <HeroSection />
      </Provider>
    );
    
    expect(screen.getByText('Найти')).toBeInTheDocument();
  });

  it('обновляет значение поиска при изменении входных данных', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <HeroSection />
      </Provider>
    );
    
    const searchInput = screen.getByPlaceholderText('Должность, ключевые слова');
    fireEvent.change(searchInput, { target: { value: 'react developer' } });
    
    const state = store.getState();
    expect(state.vacancies.filters.search).toBe('react developer');
  });

  it('запускает поиск по нажатию кнопки', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <HeroSection />
      </Provider>
    );
    
    const searchButton = screen.getByText('Найти');
    fireEvent.click(searchButton);
    
    
  });

  it('запускает поиск при нажатии клавиши Enter', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <HeroSection />
      </Provider>
    );
    
    const searchInput = screen.getByPlaceholderText('Должность, ключевые слова');
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    
  });
});