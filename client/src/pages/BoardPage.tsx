import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { boardsStore } from '../store/boardsStore';
import { issuesStore } from '../store/issuesStore';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IssueCard from '../components/IssueCard';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import IssueDialogContent from '../components/IssueDialogContent';
import Button from '@mui/material/Button';
import CreateIssueDialog, {
  type CreateIssueDialogRef,
} from '../components/CreateIssueDialog';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { Issue } from '../types/Issue';

const statusLabels: Record<Issue['status'], string> = {
  Backlog: 'Бэклог',
  InProgress: 'В работе',
  Done: 'Готово',
};

const BoardPage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);
  const createDialogRef = useRef<CreateIssueDialogRef>(null);

  useEffect(() => {
    if (!boardsStore.boards.length) boardsStore.fetchBoards();
    if (!issuesStore.issues.length) issuesStore.fetchIssues();
  }, [boardId]);

  const board = boardsStore.boards.find((b) => b.id === boardId);
  const issues = issuesStore.issues.filter(
    (issue) => issue.boardId === boardId
  );

  const { openDialog, openEditDialog, closeDialog, selectedIssue } =
    issuesStore;

  const handleOpen = (id: number) => {
    openDialog(id);
  };
  const handleEdit = (id: number) => {
    openEditDialog(id);
  };
  const handleClose = () => {
    closeDialog();
  };

  const handleCreateIssue = () => {
    createDialogRef.current?.open();
  };

  const isEditMode = issuesStore.isEditMode;

  if (boardsStore.loading || issuesStore.loading) return <CircularProgress />;
  if (boardsStore.error)
    return <Alert severity="error">{boardsStore.error}</Alert>;
  if (!board) return <Alert severity="warning">Проект не найден</Alert>;

  const issuesByStatus = {
    Backlog: issues.filter((issue) => issue.status === 'Backlog'),
    InProgress: issues.filter((issue) => issue.status === 'InProgress'),
    Done: issues.filter((issue) => issue.status === 'Done'),
  };

  return (
    <div>
      <Stack>
        <Typography variant="h4" mb={2}>
          {board.name}
        </Typography>
        <Typography variant="body1" mb={2}>
          {board.description}
        </Typography>
        <Typography variant="subtitle1" mb={2}>
          Всего задач: {issues.length}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ float: 'right', mb: 3 }}
          onClick={handleCreateIssue}
        >
          Создать задачу
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {(['Backlog', 'InProgress', 'Done'] as const).map((status) => (
          <Box key={status} sx={{ flex: 1 }}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                height: '100%',
                minHeight: 'calc(100vh - 300px)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {statusLabels[status]} ({issuesByStatus[status].length})
              </Typography>
              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <Stack spacing={2}>
                  {issuesByStatus[status].map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onClick={() => handleOpen(issue.id)}
                      onEdit={() => handleEdit(issue.id)}
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>

      <Dialog
        open={!!selectedIssue}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        {selectedIssue && (
          <IssueDialogContent
            issue={selectedIssue}
            onClose={handleClose}
            editModeDefault={isEditMode}
          />
        )}
      </Dialog>
      <CreateIssueDialog ref={createDialogRef} />
    </div>
  );
});

export default BoardPage;
