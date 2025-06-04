import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { Board } from '../types/Board';

interface BoardCardProps {
  board: Board;
  onClick?: () => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, onClick }) => (
  <Card
    variant="outlined"
    sx={{
      cursor: onClick ? 'pointer' : 'default',
    }}
    onClick={onClick}
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
);

export default BoardCard;
