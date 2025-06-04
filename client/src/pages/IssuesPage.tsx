import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Issue from '../components/Issue';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { issuesStore } from '../store/issuesStore';

const IssuesPage = observer(() => {
  useEffect(() => {
    issuesStore.fetchIssues();
  }, []);

  const {
    issues,
    loading,
    error,
    openDialog,
    closeDialog,
    selectedIssue,
  } = issuesStore;

  return (
    <div>
      <Typography variant="h4" mb={3}>
        Все задачи
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading &&
        !error &&
        issues.map((issue) => (
          <div
            key={issue.id}
            onClick={() => openDialog(issue.id)}
            style={{ cursor: 'pointer' }}
          >
            <Issue issue={issue} />
          </div>
        ))}
      <Dialog
        open={!!selectedIssue}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedIssue && (
          <>
            <DialogTitle>{selectedIssue.title}</DialogTitle>
            <DialogContent dividers>
              <Stack direction="row" spacing={1} mb={2}>
                <Chip label={selectedIssue.status} />
                <Chip label={selectedIssue.priority} />
              </Stack>
              <Typography variant="body1" gutterBottom>
                {selectedIssue.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Проект: {selectedIssue.boardName}
              </Typography>
              <Stack direction="row" spacing={1} mt={2}>
                <Avatar
                  src={selectedIssue.assignee.avatarUrl}
                  alt={selectedIssue.assignee.fullName}
                />
                <Typography variant="body2">
                  {selectedIssue.assignee.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedIssue.assignee.email}
                </Typography>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog}>Закрыть</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
});

export default IssuesPage;
