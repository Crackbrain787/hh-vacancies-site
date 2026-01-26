import { Center, Loader, Text, Box, Button, Group } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { setCurrentPage, loadVacancies } from '../store/slices/vacanciesSlice';
import { useEffect } from 'react';
import VacancyCard from './VacancyCard';

const VacanciesList = () => {
  const dispatch = useAppDispatch();
  const { 
    vacancies, 
    loading, 
    error, 
    totalPages, 
    currentPage,
    filters
  } = useAppSelector((state) => state.vacancies);

  useEffect(() => {
    dispatch(loadVacancies({
      text: filters.search || undefined,
      area: filters.area || undefined,
      skill_set: filters.skills,
      page: currentPage,
    }));
  }, [dispatch, currentPage, filters.search, filters.area, filters.skills]);

  const handlePageChange = (page: number) => {
    const newPage = page - 1;
    dispatch(setCurrentPage(newPage));
  };

  // Создаем массив страниц для отображения (максимум 5 страниц)
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  if (loading) {
    return (
      <Center style={{ height: '200px' }}>
        <Loader color="#4263EB" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center style={{ height: '200px' }}>
        <Text 
          c="red" 
          style={{ fontFamily: '"Open Sans", sans-serif' }}
        >
          Ошибка при загрузке вакансий: {error}
        </Text>
      </Center>
    );
  }

  return (
    <Box>
      {/* Список вакансий */}
      {vacancies.length === 0 ? (
        <Center style={{ height: '200px' }}>
          <Text style={{ fontFamily: '"Open Sans", sans-serif' }}>
            Вакансии не найдены. Попробуйте изменить параметры поиска.
          </Text>
        </Center>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {vacancies.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>
          
          {/* Пагинация */}
          {totalPages > 1 && (
            <Center mt={32}>
              <Group gap="10px">
                {/* Кнопка "<" */}
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handlePageChange(currentPage)}
                  disabled={currentPage === 0}
                  style={{
                    width: '34px',
                    height: '32px',
                    border: '1px solid rgba(15, 15, 16, 0.2)',
                    borderRadius: '2px',
                    opacity: currentPage === 0 ? 0.3 : 0.6,
                    padding: '1px 9px',
                    minWidth: '34px',
                    minHeight: '32px',
                  }}
                >
                  &lt;
                </Button>

                {/* Номера страниц */}
                {visiblePages.map((page) => (
                  <Button
                    key={page}
                    variant={currentPage + 1 === page ? "filled" : "outline"}
                    size="xs"
                    onClick={() => handlePageChange(page)}
                    style={{
                      width: '34px',
                      height: '32px',
                      border: '1px solid rgba(15, 15, 16, 0.2)',
                      borderRadius: '2px',
                      opacity: 0.6,
                      padding: '1px 9px',
                      minWidth: '34px',
                      minHeight: '32px',
                      backgroundColor: currentPage + 1 === page ? '#4263EB' : 'transparent',
                      borderColor: currentPage + 1 === page ? '#4263EB' : 'rgba(15, 15, 16, 0.2)',
                      color: currentPage + 1 === page ? '#FFFFFF' : '#0F0F10',
                    }}
                  >
                    {page}
                  </Button>
                ))}

                {/* Кнопка ">" */}
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handlePageChange(currentPage + 2)}
                  disabled={currentPage === totalPages - 1}
                  style={{
                    width: '34px',
                    height: '32px',
                    border: '1px solid rgba(15, 15, 16, 0.2)',
                    borderRadius: '2px',
                    opacity: currentPage === totalPages - 1 ? 0.3 : 0.6,
                    padding: '1px 9px',
                    minWidth: '34px',
                    minHeight: '32px',
                  }}
                >
                  &gt;
                </Button>
              </Group>
            </Center>
          )}
        </>
      )}
    </Box>
  );
};

export default VacanciesList;