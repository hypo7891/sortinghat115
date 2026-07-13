import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { QuizPage } from './pages/QuizPage';
import { ResultsPage } from './pages/ResultsPage';
import { TeacherLoginPage } from './pages/teacher/TeacherLoginPage';
import { TeacherClassesPage } from './pages/teacher/TeacherClassesPage';
import { TeacherClassDashboardPage } from './pages/teacher/TeacherClassDashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/teacher" element={<TeacherLoginPage />} />
      <Route path="/teacher/classes" element={<TeacherClassesPage />} />
      <Route path="/teacher/classes/:classId" element={<TeacherClassDashboardPage />} />
    </Routes>
  );
}

export default App;
