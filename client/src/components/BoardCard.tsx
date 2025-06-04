import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { Board } from '../types/Board';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button } from '@mui/material';

interface BoardCardProps {
  board: Board;
  onClick?: () => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, onClick }) => (
  <Card
    variant="outlined"
    sx={{
      cursor: onClick ? 'pointer' : 'default',
      position: 'relative',
      mb: 2,
    }}
    onClick={onClick}
  >
    <CardContent sx={{ position: 'relative', p: 2, pb: 6 }}>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h6" component="div" textAlign="left">
            {board.name}
          </Typography>
          <Box sx={{ minWidth: '2rem', flexGrow: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Задач: {board.taskCount}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" textAlign="left">
          {board.description}
        </Typography>
      </Stack>
      <Box
        display="flex"
        alignItems="center"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
      >
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          <OpenInNewIcon fontSize="small" />
          <Typography variant="body2" sx={{ ml: 0.5 }} color="primary">
            Перейти к доске
          </Typography>
        </Button>
      </Box>
    </CardContent>
  </Card>
);

export default BoardCard;
