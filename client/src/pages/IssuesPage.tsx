import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import IssueCard from '../components/IssueCard';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { issuesStore } from '../store/issuesStore';
import IssueDialogContent from '../components/IssueDialogContent';

const IssuesPage = observer(() => {
  useEffect(() => {
    issuesStore.fetchIssues();
  }, []);

  const { issues, loading, error, openDialog, closeDialog, selectedIssue } =
    issuesStore;

  return (
    <div>
      <Typography variant="h4" mb={3}>
        Все задачи
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading &&
        !error &&
        Array.isArray(issues) &&
        issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onClick={() => openDialog(issue.id)}
          />
        ))}
      <Dialog
        open={!!selectedIssue}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedIssue && (
          <IssueDialogContent issue={selectedIssue} onClose={closeDialog} />
        )}
      </Dialog>
    </div>
  );
});

export default IssuesPage;
