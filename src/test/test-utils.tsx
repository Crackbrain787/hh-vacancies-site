import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MantineProvider } from '@mantine/core';
import vacanciesReducer from '../store/slices/vacanciesSlice';

// Мокаем window.matchMedia перед рендерингом
const mockMatchMedia = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

// Мокаем ResizeObserver для Mantine компонентов
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Создаем тип для состояния вакансий
type VacanciesState = {
  filters: {
    skills: string[];
    search: string;
    area: string;
    page: number;
  };
  vacancies: Array<{
    id: string;
    name: string;
    salary: null | {
      from: number;
      to: number;
      currency: string;
      gross: boolean;
    };
    area: { id: string; name: string };
    employer: { id: string; name: string };
    experience: { id: string; name: string };
    alternate_url: string;
  }>;
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
};

// Тип для состояния всего store
type RootState = {
  vacancies: VacanciesState;
};

export const createTestStore = (preloadedState: Partial<RootState> = {}) => {
  return configureStore({
    reducer: {
      vacancies: vacanciesReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
        immutableCheck: false,
      }),
  });
};

interface RenderOptions {
  store?: ReturnType<typeof createTestStore>;
}

export const renderWithProviders = (
  ui: ReactElement,
  { store = createTestStore(), ...renderOptions }: RenderOptions = {}
) => {
  // Мокаем matchMedia перед рендерингом
  mockMatchMedia();
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MantineProvider 
      theme={{}} 
      forceColorScheme="light"
    >
      <Provider store={store}>{children}</Provider>
    </MantineProvider>
  );
  
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const renderWithMantine = (ui: ReactElement) => {
  // Мокаем matchMedia перед рендерингом
  mockMatchMedia();
  
  return render(
    <MantineProvider 
      theme={{}} 
      forceColorScheme="light"
    >
      {ui}
    </MantineProvider>
  );
};