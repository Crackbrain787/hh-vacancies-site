import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchVacancies } from './api';
import { mockVacanciesResponse } from './mockData';

vi.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches vacancies successfully', async () => {
    const params = {
      text: 'frontend',
      area: '1',
      skill_set: ['JavaScript'],
      page: 0,
    };

    const mockAxiosInstance = {
      get: vi.fn().mockResolvedValue({ data: mockVacanciesResponse }),
    };
    
    (axios.create as vi.Mock).mockReturnValue(mockAxiosInstance);

    const result = await fetchVacancies(params);

    expect(axios.create).toHaveBeenCalled();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/vacancies', {
      params: {
        text: 'frontend',
        area: '1',
        skill_set: ['JavaScript'],
        page: 0,
      },
    });
    
    expect(result).toEqual(mockVacanciesResponse);
  });

  it('handles API error', async () => {
    const params = {
      text: 'frontend',
    };

    const mockAxiosInstance = {
      get: vi.fn().mockRejectedValue(new Error('Network error')),
    };
    
    (axios.create as vi.Mock).mockReturnValue(mockAxiosInstance);

    await expect(fetchVacancies(params)).rejects.toThrow('Network error');
    expect(axios.create).toHaveBeenCalled();
  });
});