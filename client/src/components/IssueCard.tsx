import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import type { Issue } from '../types/Issue';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
  onEdit?: () => void;
  onGoToBoard?: () => void;
}

const statusLabels: Record<Issue['status'], string> = {
  Backlog: 'Бэклог',
  InProgress: 'В работе',
  Done: 'Готово',
};
const statusColors: Record<Issue['status'], 'primary' | 'success' | 'default'> =
  {
    InProgress: 'primary',
    Done: 'success',
    Backlog: 'default',
  };
const priorityLabels: Record<Issue['priority'], string> = {
  Low: 'Низкий',
  Medium: 'Средний',
  High: 'Высокий',
};
const priorityColors: Record<
  Issue['priority'],
  'default' | 'warning' | 'error'
> = {
  Low: 'default',
  Medium: 'warning',
  High: 'error',
};

const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onClick,
  onEdit,
  onGoToBoard,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ position: 'relative', p: 2, pb: 6 }}>
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" component="div">
              {issue.title}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={statusLabels[issue.status]}
                color={statusColors[issue.status]}
                size="small"
              />
              {onEdit && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  aria-label="Редактировать"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            align="left"
            display="block"
          >
            {issue.description}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={priorityLabels[issue.priority]}
              color={priorityColors[issue.priority]}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              Проект: {issue.boardName}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Avatar
              src={issue.assignee.avatarUrl}
              alt={issue.assignee.fullName}
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="caption" color="text.secondary">
              {issue.assignee.fullName}
            </Typography>
          </Stack>
        </Stack>
        {onGoToBoard && (
          <Box
            display="flex"
            alignItems="center"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
          >
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onGoToBoard();
              }}
            >
              <OpenInNewIcon fontSize="small" />
              <Typography variant="body2" sx={{ ml: 0.5 }} color="primary">
                Перейти к доске
              </Typography>
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default IssueCard;
