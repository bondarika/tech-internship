import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { boardsStore } from '../store/boardsStore';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import BoardCard from '../components/BoardCard';

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
          Array.isArray(boards) &&
          boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onClick={() => navigate(`/board/${board.id}`)}
            />
          ))}
      </Stack>
    </div>
  );
});

export default BoardsPage;
