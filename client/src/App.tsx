import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import './App.css';
import BoardsPage from './pages/BoardsPage';
import BoardPage from './pages/BoardPage';
import IssuesPage from './pages/IssuesPage';
import { useRef } from 'react';
import CreateIssueDialog, {
  type CreateIssueDialogRef,
} from './components/CreateIssueDialog';

function App() {
  const createDialogRef = useRef<CreateIssueDialogRef>(null);

  const handleCreateOpen = () => {
    createDialogRef.current?.open();
  };

  return (
    <>
      <Header onCreateIssue={handleCreateOpen} />
      <div className="container">
        <Routes>
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/board/:id" element={<BoardPage />} />
          <Route
            path="/issues"
            element={<IssuesPage onCreateIssue={handleCreateOpen} />}
          />
          <Route path="*" element={<Navigate to="/boards" replace />} />
        </Routes>
      </div>
      <CreateIssueDialog ref={createDialogRef} />
    </>
  );
}

export default App;
