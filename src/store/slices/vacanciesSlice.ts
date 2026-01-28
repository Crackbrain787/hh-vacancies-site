import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchVacancies, FetchVacanciesParams } from '../../services/api';
import { VacanciesState, VacancyFilters } from '../../types/vacancy';

const initialState: VacanciesState = {
  vacancies: [],
  total: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
  filters: {
    search: '',
    area: '',
    skills: ['TypeScript', 'React', 'Redux'],
    page: 0,
  },
};

export const loadVacancies = createAsyncThunk(
  'vacancies/loadVacancies',
  async (params: FetchVacanciesParams, { rejectWithValue }) => {
    try {
      
      await new Promise(resolve => setTimeout(resolve, 200));
      const response = await fetchVacancies(params);
      return response;
    } catch (error) {
      
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || (error as Error).message || 'Ошибка при загрузке вакансий';
      console.error('Error in loadVacancies:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState,
  reducers: {
    updateFilters: (state, action: PayloadAction<Partial<VacancyFilters>>) => {
      const newFilters = { ...state.filters, ...action.payload };
      state.filters = newFilters;
    },
    addSkill: (state, action: PayloadAction<string>) => {
      if (!state.filters.skills.includes(action.payload)) {
        state.filters.skills.push(action.payload);
      }
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.filters.skills = state.filters.skills.filter(
        (skill) => skill !== action.payload
      );
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        area: '',
        skills: ['TypeScript', 'React', 'Redux'],
        page: 0,
      };
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
      state.filters.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadVacancies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadVacancies.fulfilled, (state, action) => {
        state.loading = false;
        state.vacancies = action.payload.items;
        state.total = action.payload.found;
        state.totalPages = action.payload.pages;
        state.currentPage = action.payload.page;
        state.filters.page = action.payload.page;
        
        if (action.payload.error) {
          state.error = action.payload.error;
        }
      })
      .addCase(loadVacancies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Неизвестная ошибка';
        state.vacancies = [];
        state.total = 0;
        state.totalPages = 0;
      });
  },
});

export const { updateFilters, addSkill, removeSkill, resetFilters, setCurrentPage } = vacanciesSlice.actions;
export default vacanciesSlice.reducer;