import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { boardsStore } from '../store/boardsStore';
import { issuesStore } from '../store/issuesStore';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IssueCard from '../components/IssueCard';
import Stack from '@mui/material/Stack';

const BoardPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);

  useEffect(() => {
    if (!boardsStore.boards.length) boardsStore.fetchBoards();
    if (!issuesStore.issues.length) issuesStore.fetchIssues();
  }, []);

  const board = boardsStore.boards.find((b) => b.id === boardId);
  const issues = issuesStore.issues.filter(
    (issue) => issue.boardId === boardId
  );

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
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </Stack>
    </div>
  );
});

export default BoardPage;
