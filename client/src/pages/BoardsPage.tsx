import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { boardsStore } from '../store/boardsStore';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

const BoardsPage = observer(() => {
  const navigate = useNavigate();
  useEffect(() => {
    boardsStore.fetchBoards();
  }, []);

  const { boards, loading, error } = boardsStore;

  return (
    <div>
      <Typography variant="h4" mb={3}>
        Проекты
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Stack spacing={2}>
        {!loading &&
          !error &&
          boards.map((board) => (
            <Card
              key={board.id}
              variant="outlined"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/board/${board.id}`)}
            >
              <CardContent>
                <Typography variant="h6">{board.name}</Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {board.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Задач: {board.taskCount}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </Stack>
    </div>
  );
});

export default BoardsPage;
