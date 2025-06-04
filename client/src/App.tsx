import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import './App.css';
import BoardsPage from './pages/BoardsPage';
import BoardPage from './pages/BoardPage';
import IssuesPage from './pages/IssuesPage';

function App() {
  return (
    <>
      <Header />
      <div className='container'>
        <Routes>
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/board/:id" element={<BoardPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="*" element={<Navigate to="/boards" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
