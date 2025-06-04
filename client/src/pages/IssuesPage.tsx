import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import IssueCard from '../components/IssueCard';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { issuesStore } from '../store/issuesStore';
import IssueDialogContent from '../components/IssueDialogContent';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { boardsStore } from '../store/boardsStore';

interface IssuesPageProps {
  onCreateIssue?: () => void;
}

const IssuesPage = observer(({ onCreateIssue }: IssuesPageProps) => {
  useEffect(() => {
    issuesStore.fetchIssues();
    boardsStore.fetchBoards();
  }, []);

  const { issues, loading, error, openDialog, closeDialog, selectedIssue } =
    issuesStore;

  const [editId, setEditId] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    openDialog(id);
    setEditId(id);
  };

  const handleClose = () => {
    closeDialog();
    setEditId(null);
  };

  const handleGoToBoard = (issue: (typeof issuesStore.issues)[0]) => {
    navigate(`/board/${issue.boardId}`);
    setTimeout(() => {
      issuesStore.openDialog(issue.id);
    }, 0);
  };

  return (
    <div>
      <Typography variant="h4" mb={3}>
        Все задачи
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading &&
        !error &&
        Array.isArray(issues) &&
        issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onClick={() => issuesStore.openDialog(issue.id)}
            onEdit={() => handleEdit(issue.id)}
            onGoToBoard={() => handleGoToBoard(issue)}
          />
        ))}
      <Button
        variant="contained"
        color="primary"
        sx={{  float: 'right', mb: 3 }}
        onClick={onCreateIssue}
      >
        Создать задачу
      </Button>
      <Dialog
        open={!!selectedIssue}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        {selectedIssue && (
          <IssueDialogContent
            issue={selectedIssue}
            onClose={handleClose}
            editModeDefault={editId === selectedIssue?.id}
          />
        )}
      </Dialog>
    </div>
  );
});

export default IssuesPage;
