import React, { useState, useEffect } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { Issue } from '../types/Issue';
import type { User } from '../types/User';
import { getUsers } from '../api/users';
import { issuesStore } from '../store/issuesStore';

interface IssueDialogContentProps {
  issue: Issue;
  onClose: () => void;
  editModeDefault?: boolean;
  onGoToBoard?: () => void;
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
  editModeDefault = false,
  onGoToBoard,
}) => {
  const [editMode, setEditMode] = useState(editModeDefault);
  const [form, setForm] = useState({
    title: issue.title,
    description: issue.description,
    status: issue.status,
    priority: issue.priority,
    assigneeId: String(issue.assignee.id),
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEditMode(editModeDefault);
  }, [editModeDefault, issue.id]);

  useEffect(() => {
    if (editMode) {
      setLoadingUsers(true);
      getUsers()
        .then(setUsers)
        .catch(() => setError('Ошибка загрузки пользователей'))
        .finally(() => setLoadingUsers(false));
    }
  }, [editMode]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await issuesStore.editIssue(issue.id, {
        ...form,
        assigneeId: Number(form.assigneeId),
      });
      setEditMode(false);
      onClose();
    } catch {
      setError('Ошибка сохранения изменений');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (editModeDefault) {
      onClose();
      return;
    }
    setEditMode(false);
    setForm({
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      assigneeId: String(issue.assignee.id),
    });
    setError(null);
  };

  return (
    <>
      <DialogTitle>
        {editMode ? 'Редактировать задачу' : issue.title}
      </DialogTitle>
      <DialogContent dividers>
        {editMode ? (
          <Stack spacing={2}>
            <TextField
              label="Название"
              name="title"
              value={form.title}
              onChange={handleTextChange}
              fullWidth
              size="small"
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
            />
            <FormControl fullWidth size="small">
              <InputLabel id="status-label">Статус</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={form.status}
                label="Статус"
                onChange={handleSelectChange}
              >
                {Object.entries(statusLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel id="priority-label">Приоритет</InputLabel>
              <Select
                labelId="priority-label"
                name="priority"
                value={form.priority}
                label="Приоритет"
                onChange={handleSelectChange}
              >
                {Object.entries(priorityLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel id="assignee-label">Исполнитель</InputLabel>
              {loadingUsers ? (
                <CircularProgress size={24} />
              ) : (
                <Select
                  labelId="assignee-label"
                  name="assigneeId"
                  value={form.assigneeId}
                  label="Исполнитель"
                  onChange={handleSelectChange}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={String(user.id)}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          src={user.avatarUrl}
                          alt={user.fullName}
                          sx={{ width: 24, height: 24 }}
                        />
                        <span>
                          {user.fullName} ({user.email})
                        </span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        ) : (
          <>
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
            <Stack direction="row" spacing={1} mt={2} alignItems="center">
              <Avatar
                src={issue.assignee.avatarUrl}
                alt={issue.assignee.fullName}
              />
              <Typography variant="body2">{issue.assignee.fullName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {issue.assignee.email}
              </Typography>
            </Stack>
            {onGoToBoard && (
              <Button
                onClick={onGoToBoard}
                startIcon={<OpenInNewIcon />}
                sx={{ mt: 2 }}
              >
                Перейти к доске
              </Button>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        {editMode ? (
          <>
            <Button onClick={handleCancel} disabled={saving}>
              Отмена
            </Button>
            <Button onClick={handleSave} variant="contained" disabled={saving}>
              {saving ? <CircularProgress size={20} /> : 'Сохранить'}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>Закрыть</Button>
            <Button onClick={() => setEditMode(true)} variant="contained">
              Редактировать
            </Button>
          </>
        )}
      </DialogActions>
    </>
  );
};

export default IssueDialogContent;
