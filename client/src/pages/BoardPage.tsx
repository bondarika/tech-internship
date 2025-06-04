import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEffect} from 'react';
import { boardsStore } from '../store/boardsStore';
import { issuesStore } from '../store/issuesStore';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IssueCard from '../components/IssueCard';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import IssueDialogContent from '../components/IssueDialogContent';

const BoardPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);

  useEffect(() => {
    if (!boardsStore.boards.length) boardsStore.fetchBoards();
    if (!issuesStore.issues.length) issuesStore.fetchIssues();
  }, [boardId]);

  const board = boardsStore.boards.find((b) => b.id === boardId);
  const issues = issuesStore.issues.filter(
    (issue) => issue.boardId === boardId
  );

  const { openDialog, openEditDialog, closeDialog, selectedIssue } = issuesStore;

  const handleOpen = (id: number) => {
    openDialog(id);
  };
  const handleEdit = (id: number) => {
    openEditDialog(id);
  };
  const handleClose = () => {
    closeDialog();
  };

  const isEditMode = issuesStore.isEditMode;

  if (boardsStore.loading || issuesStore.loading) return <CircularProgress />;
  if (boardsStore.error)
    return <Alert severity="error">{boardsStore.error}</Alert>;
  if (!board) return <Alert severity="warning">Проект не найден</Alert>;

  return (
    <div>
      <Typography variant="h4" mb={2}>
        {board.name}
      </Typography>
      <Typography variant="body1" mb={2}>
        {board.description}
      </Typography>
      <Typography variant="subtitle1" mb={2}>
        Задачи ({issues.length})
      </Typography>
      <Stack spacing={2}>
        {issues.length === 0 && (
          <Typography>В этом проекте нет задач</Typography>
        )}
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onClick={() => handleOpen(issue.id)}
            onEdit={() => handleEdit(issue.id)}
          />
        ))}
      </Stack>
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
            editModeDefault={isEditMode}
          />
        )}
      </Dialog>
    </div>
  );
});

export default BoardPage;
