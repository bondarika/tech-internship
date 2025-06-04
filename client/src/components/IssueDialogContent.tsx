import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import type { Issue } from '../types/Issue';

interface IssueDialogContentProps {
  issue: Issue;
  onClose: () => void;
}

const statusLabels: Record<Issue['status'], string> = {
  Backlog: 'Бэклог',
  InProgress: 'В работе',
  Done: 'Готово',
};
const priorityLabels: Record<Issue['priority'], string> = {
  Low: 'Низкий',
  Medium: 'Средний',
  High: 'Высокий',
};

const IssueDialogContent: React.FC<IssueDialogContentProps> = ({
  issue,
  onClose,
}) => (
  <>
    <DialogTitle>{issue.title}</DialogTitle>
    <DialogContent dividers>
      <Stack direction="row" spacing={1} mb={2}>
        <Chip label={statusLabels[issue.status]} />
        <Chip label={priorityLabels[issue.priority]} />
      </Stack>
      <Typography variant="body1" gutterBottom>
        {issue.description}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Проект: {issue.boardName}
      </Typography>
      <Stack direction="row" spacing={1} mt={2}>
        <Avatar src={issue.assignee.avatarUrl} alt={issue.assignee.fullName} />
        <Typography variant="body2">{issue.assignee.fullName}</Typography>
        <Typography variant="caption" color="text.secondary">
          {issue.assignee.email}
        </Typography>
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Закрыть</Button>
    </DialogActions>
  </>
);

export default IssueDialogContent;
