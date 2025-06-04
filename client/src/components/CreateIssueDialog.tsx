import { useState, forwardRef, useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import { boardsStore } from '../store/boardsStore';
import { getUsers } from '../api/users';
import type { User } from '../types/User';
import { issuesStore } from '../store/issuesStore';
import { CircularProgress, Typography } from '@mui/material';

export interface CreateIssueDialogRef {
  open: () => void;
}

const CreateIssueDialog = forwardRef<CreateIssueDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: '',
    assigneeId: '',
    boardId: '',
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
      setForm({
        title: '',
        description: '',
        priority: '',
        assigneeId: '',
        boardId: '',
      });
      setError(null);
      setLoadingUsers(true);
      getUsers()
        .then(setUsers)
        .catch(() => setError('Ошибка загрузки пользователей'))
        .finally(() => setLoadingUsers(false));
      boardsStore.fetchBoards();
    },
  }));

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const id = await issuesStore.createIssue({
        title: form.title,
        description: form.description,
        priority: form.priority as 'Low' | 'Medium' | 'High',
        assigneeId: Number(form.assigneeId),
        boardId: Number(form.boardId),
      });
      if (id) {
        setOpen(false);
        setForm({
          title: '',
          description: '',
          priority: '',
          assigneeId: '',
          boardId: '',
        });
      } else {
        setError(issuesStore.createError || 'Ошибка создания задачи');
      }
    } catch {
      setError('Ошибка создания задачи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Создать задачу</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Название"
            name="title"
            value={form.title}
            onChange={handleTextChange}
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Описание"
            name="description"
            value={form.description}
            onChange={handleTextChange}
            fullWidth
            multiline
            minRows={3}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth size="small">
            <InputLabel id="priority-label" shrink>
              Приоритет
            </InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={form.priority}
              label="Приоритет"
              onChange={handleSelectChange}
              notched
            >
              <MenuItem value="Low">Низкий</MenuItem>
              <MenuItem value="Medium">Средний</MenuItem>
              <MenuItem value="High">Высокий</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="board-label" shrink>
              Доска
            </InputLabel>
            <Select
              labelId="board-label"
              name="boardId"
              value={form.boardId}
              label="Доска"
              onChange={handleSelectChange}
              notched
            >
              {boardsStore.boards.map((board) => (
                <MenuItem key={board.id} value={String(board.id)}>
                  {board.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="assignee-label" shrink>
              Исполнитель
            </InputLabel>
            <Select
              labelId="assignee-label"
              name="assigneeId"
              value={form.assigneeId}
              label="Исполнитель"
              onChange={handleSelectChange}
              notched
            >
              {loadingUsers ? (
                <MenuItem disabled>Загрузка...</MenuItem>
              ) : (
                users.map((user) => (
                  <MenuItem key={user.id} value={String(user.id)}>
                    {user.fullName} ({user.email})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          {error && <Typography color="error">{error}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Отмена
        </Button>
        <Button onClick={handleCreate} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default CreateIssueDialog;
