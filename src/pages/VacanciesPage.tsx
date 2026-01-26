import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ScillsAndCityFilter from '../components/SkillsAndCityFilter';
import VacanciesList from '../components/VacanciesList';

const VacanciesPage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        paddingTop: '24px', 
      }}>
        
        <div style={{
          position: 'absolute',
          top: '24px', 
          left: '220px',
          width: '317px',
        }}>
          <ScillsAndCityFilter />
        </div>
        
      
        <div style={{
          position: 'absolute',
          top: '24px', 
          left: '561px',
          width: '659px',
        }}>
          <VacanciesList />
        </div>
      </div>
    </>
  );
};

export default VacanciesPage;