import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProgramsPage } from './pages/ProgramsPage';
import { NewsPage } from './pages/NewsPage';
import { PublicLayout } from './components/PublicLayout';

export default function App() {
  return (
    <BrowserRouter>
      <PublicLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PublicLayout>
    </BrowserRouter>
  );
}
