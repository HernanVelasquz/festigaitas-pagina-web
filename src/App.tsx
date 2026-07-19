import { Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar';
import MusicPlayer from './components/ui/MusicPlayer';
import { useNavigationViewModel } from './viewModels/useNavigationViewModel';

// Lazy load pages for optimized bundle sizing & faster initial page load
const HomePage = lazy(() => import('./pages/HomePage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ContestsPage = lazy(() => import('./pages/ContestsPage'));

function App() {
  const { page, navigate } = useNavigationViewModel();

  return (
    <div className="min-h-screen bg-ink-900 font-body">
      <Navbar onNavigate={navigate} activePage={page} />

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-ink-900">
            <div className="w-8 h-8 border-2 border-ink-600 border-t-brand-500 rounded-full animate-spin" />
          </div>
        }
      >
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'documents' && <DocumentsPage onBack={() => navigate('/')} />}
        {page === 'history' && <HistoryPage onBack={() => navigate('/')} />}
        {page === 'register' && <RegisterPage onBack={() => navigate('/')} />}
        {page === 'contests' && <ContestsPage onBack={() => navigate('/')} />}
      </Suspense>

      {/* Persistent music player — state survives page navigation */}
      <MusicPlayer />
    </div>
  );
}

export default App;
