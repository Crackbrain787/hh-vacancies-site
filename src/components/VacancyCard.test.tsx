import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import VacancyCard from './VacancyCard';
import { Vacancy } from '../types/vacancy';
import { renderWithMantine } from '../test/test-utils';
import '@testing-library/jest-dom';

const mockVacancy: Vacancy = {
  id: '1',
  name: 'Frontend Developer',
  salary: {
    from: 100000,
    to: 200000,
    currency: 'RUR',
    gross: true,
  },
  area: { id: '1', name: 'Москва' },
  employer: { id: '1', name: 'Tech Company' },
  experience: { id: '2', name: '1–3 года' },
  employment: { id: 'full', name: 'Полная занятость' },
  schedule: { id: 'remote', name: 'Удаленная работа' },
  key_skills: [
    { name: 'React' },
    { name: 'TypeScript' },
  ],
  alternate_url: 'https://hh.ru/vacancy/1',
  published_at: '2024-01-01T12:00:00+0300',
  snippet: {
    requirement: 'Опыт работы с React.',
    responsibility: 'Разработка интерфейсов.',
  },
};

describe('VacancyCard', () => {
  beforeEach(() => {
    // Мокаем window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
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
    
    window.open = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders vacancy information correctly', () => {
    renderWithMantine(<VacancyCard vacancy={mockVacancy} />);
    
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('100 000 - 200 000 ₽ до вычета налогов')).toBeInTheDocument();
    expect(screen.getByText('1–3 года')).toBeInTheDocument();
    expect(screen.getByText('Tech Company')).toBeInTheDocument();
    expect(screen.getByText('Можно удалённо')).toBeInTheDocument();
    expect(screen.getByText('Москва')).toBeInTheDocument();
  });

  it('handles missing salary', () => {
    const vacancyWithoutSalary = {
      ...mockVacancy,
      salary: null,
    };
    
    renderWithMantine(<VacancyCard vacancy={vacancyWithoutSalary} />);
    expect(screen.getByText('Зарплата не указана')).toBeInTheDocument();
  });

  it('opens vacancy URL when "Смотреть вакансию" button is clicked', () => {
    renderWithMantine(<VacancyCard vacancy={mockVacancy} />);
    
    const viewButton = screen.getByText('Смотреть вакансию');
    fireEvent.click(viewButton);
    
    expect(window.open).toHaveBeenCalledWith('https://hh.ru/vacancy/1', '_blank');
  });

  it('opens vacancy URL when "Откликнуться" button is clicked', () => {
    renderWithMantine(<VacancyCard vacancy={mockVacancy} />);
    
    const applyButton = screen.getByText('Откликнуться');
    fireEvent.click(applyButton);
    
    expect(window.open).toHaveBeenCalledWith('https://hh.ru/vacancy/1', '_blank');
  });
});