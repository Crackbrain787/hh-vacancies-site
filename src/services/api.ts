import axios, { AxiosError } from 'axios';
import { VacanciesResponse, Vacancy } from '../types/vacancy';

const API_BASE_URL = 'https://api.hh.ru/vacancies';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'User-Agent': 'hh-frontend-vacancies/1.0',
    'Accept': 'application/json',
  },
});

export interface FetchVacanciesParams {
  text?: string;
  area?: string;
  skill_set?: string[];
  page?: number;
  per_page?: number;
}


interface ApiError {
  message?: string;
  description?: string;
  errors?: Array<{ type: string; value: string }>;
}


interface HhApiResponse {
  items: Vacancy[];
  found: number;
  pages: number;
  page: number;
  per_page: number;
  clusters?: unknown[];
  arguments?: unknown;
  alternate_url?: string;
}

export const fetchVacancies = async (params: FetchVacanciesParams): Promise<VacanciesResponse> => {
  try {
   
    const baseParams = {
      industry: 7, 
      professional_role: 96, 
      per_page: params.per_page || 10, 
    };

    
    const queryParams: Record<string, string | number | undefined> = {
      ...baseParams,
    };

    
    if (params.text && params.text.trim()) {
      queryParams.text = params.text.trim();
      queryParams.search_field = 'name,company_name';
    }
    
    if (params.area && params.area.trim()) {
      queryParams.area = params.area;
    }
    
    if (params.page !== undefined) {
      queryParams.page = params.page;
    }

  
    if (params.skill_set && params.skill_set.length > 0) {
    
      const validSkills = params.skill_set
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      if (validSkills.length > 0) {
        queryParams.skill_set = validSkills.join(',');
      }
    }

    console.log('Fetching vacancies from hh.ru with params:', queryParams);

   
    const response = await api.get<HhApiResponse>('', {
      params: queryParams,
    });

    console.log('API hh.ru response received:', {
      found: response.data.found,
      pages: response.data.pages,
      itemsCount: response.data.items?.length || 0,
    });

   
    const items = (response.data.items || []).map(item => ({
      ...item,
   
      id: item.id || '',
      name: item.name || 'Без названия',
      alternate_url: item.alternate_url || `https://hh.ru/vacancy/${item.id}`,
      area: item.area || { id: '', name: '' },
      employer: item.employer || { id: '', name: '' },
      experience: item.experience || { id: '', name: '' },
      employment: item.employment || { id: '', name: '' },
      schedule: item.schedule || { id: '', name: '' },
      key_skills: item.key_skills || [],
      snippet: item.snippet || { requirement: '', responsibility: '' },
      salary: item.salary || null,
    }));

    return {
      items,
      found: response.data.found || 0,
      pages: response.data.pages || 0,
      page: response.data.page || 0,
      per_page: response.data.per_page || 10,
    };
    
  } catch (error) {
   
    const axiosError = error as AxiosError<ApiError>;
    
    console.error('Error fetching vacancies from hh.ru API:', {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
    });
    
    
    return {
      items: [],
      found: 0,
      pages: 0,
      page: 0,
      per_page: params.per_page || 10,
      error: axiosError.response?.data?.message || axiosError.message || 'Ошибка при загрузке вакансий',
    };
  }
};

export const fetchVacancyById = async (id: string): Promise<Vacancy> => {
  try {
    const response = await api.get<Vacancy>(`/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    console.error(`Error fetching vacancy ${id}:`, axiosError);
    throw error;
  }
};

export default api;