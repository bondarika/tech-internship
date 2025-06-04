import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import type { Issue } from '../types/Issue';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
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

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => (
  <Card
    variant="outlined"
    sx={{ mb: 2, cursor: onClick ? 'pointer' : 'default' }}
    onClick={onClick}
  >
    <CardContent>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6" component="div">
          {issue.title}
        </Typography>
        <Chip
          label={statusLabels[issue.status]}
          color={statusColors[issue.status]}
          size="small"
        />
      </Stack>
      <Typography variant="body2" color="text.secondary" mb={1}>
        {issue.description}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip
          label={priorityLabels[issue.priority]}
          color={priorityColors[issue.priority]}
          size="small"
        />
        <Typography variant="caption" color="text.secondary">
          Проект: {issue.boardName}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar
          src={issue.assignee.avatarUrl}
          alt={issue.assignee.fullName}
          sx={{ width: 24, height: 24 }}
        />
        <Typography variant="caption" color="text.secondary">
          {issue.assignee.fullName}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

export default IssueCard;
