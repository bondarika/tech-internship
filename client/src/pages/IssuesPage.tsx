import { useEffect, useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import IssueCard from '../components/IssueCard';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { issuesStore } from '../store/issuesStore';
import IssueDialogContent from '../components/IssueDialogContent';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { boardsStore } from '../store/boardsStore';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { Issue } from '../types/Issue';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import { getUserIssues } from '../api/users';
import type { UserTasks } from '../types/UserTasks';
import Autocomplete from '@mui/material/Autocomplete';
import type { Assignee } from '../types/Asignee';

interface IssuesPageProps {
  onCreateIssue?: () => void;
}

const statusLabels: Record<Issue['status'], string> = {
  Backlog: 'Бэклог',
  InProgress: 'В работе',
  Done: 'Готово',
};

const IssuesPage = observer(({ onCreateIssue }: IssuesPageProps) => {
  useEffect(() => {
    issuesStore.fetchIssues();
    boardsStore.fetchBoards();
  }, []);

  const { issues, loading, error, openDialog, closeDialog, selectedIssue } =
    issuesStore;

  const [editId, setEditId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<Issue['status'] | ''>('');
  const [boardFilter, setBoardFilter] = useState<number | ''>('');
  const [titleSearch, setTitleSearch] = useState('');
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [userTasks, setUserTasks] = useState<UserTasks | null>(null);
  const [loadingUserTasks, setLoadingUserTasks] = useState(false);
  const [userTasksError, setUserTasksError] = useState<string | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<Assignee | null>(
    null
  );

  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    openDialog(id);
    setEditId(id);
  };

  const handleClose = () => {
    closeDialog();
    setEditId(null);
  };

  const handleGoToBoard = (issue: (typeof issuesStore.issues)[0]) => {
    navigate(`/board/${issue.boardId}`);
    setTimeout(() => {
      issuesStore.openDialog(issue.id);
    }, 0);
  };

  const uniqueAssignees = useMemo(() => {
    const assigneeMap = new Map<number, Assignee>();
    issues.forEach((issue) => {
      if (!assigneeMap.has(issue.assignee.id)) {
        assigneeMap.set(issue.assignee.id, issue.assignee);
      }
    });
    return Array.from(assigneeMap.values());
  }, [issues]);

  const handleAssigneeSearch = async (assignee: Assignee | null) => {
    setSelectedAssignee(assignee);
    setAssigneeSearch(
      assignee ? `${assignee.fullName} (${assignee.email})` : ''
    );

    if (!assignee) {
      setUserTasks(null);
      setUserTasksError(null);
      return;
    }

    setLoadingUserTasks(true);
    setUserTasksError(null);
    try {
      const tasks = await getUserIssues(assignee.id);
      setUserTasks(tasks);
    } catch (error) {
      setUserTasksError('Ошибка при поиске задач пользователя');
      console.error('Error fetching user tasks:', error);
    } finally {
      setLoadingUserTasks(false);
    }
  };

  const filteredIssues = useMemo(() => {
    let filtered = issues;
    if (statusFilter) {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }
    if (boardFilter) {
      filtered = filtered.filter((issue) => issue.boardId === boardFilter);
    }
    if (titleSearch) {
      filtered = filtered.filter((issue) =>
        issue.title.toLowerCase().includes(titleSearch.toLowerCase())
      );
    }
    if (assigneeSearch && userTasks) {
      const userTaskIds = new Set(userTasks.map((task) => task.id));
      filtered = filtered.filter((issue) => userTaskIds.has(issue.id));
    }

    return filtered;
  }, [
    issues,
    statusFilter,
    boardFilter,
    titleSearch,
    assigneeSearch,
    userTasks,
  ]);

  const handleClearFilters = () => {
    setStatusFilter('');
    setBoardFilter('');
    setTitleSearch('');
    setAssigneeSearch('');
    setSelectedAssignee(null);
    setUserTasks(null);
    setUserTasksError(null);
  };

  return (
    <div>
      <Typography variant="h4" mb={3}>
        Все задачи
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Статус</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Статус"
            onChange={(e) =>
              setStatusFilter(e.target.value as Issue['status'] | '')
            }
          >
            <MenuItem value="">Все</MenuItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="board-filter-label">Доска</InputLabel>
          <Select
            labelId="board-filter-label"
            value={boardFilter}
            label="Доска"
            onChange={(e) => setBoardFilter(e.target.value as number | '')}
          >
            <MenuItem value="">Все</MenuItem>
            {boardsStore.boards.map((board) => (
              <MenuItem key={board.id} value={board.id}>
                {board.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Поиск по названию"
          value={titleSearch}
          onChange={(e) => setTitleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: titleSearch && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setTitleSearch('')}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 200 }}
        />

        <Autocomplete
          size="small"
          options={uniqueAssignees}
          getOptionLabel={(option) => `${option.fullName} (${option.email})`}
          value={selectedAssignee}
          onChange={(_, newValue) => handleAssigneeSearch(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Поиск по исполнителю"
              error={!!userTasksError}
              helperText={userTasksError}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
          sx={{ minWidth: 300 }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <li key={key} {...otherProps}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1">{option.fullName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.email}
                  </Typography>
                </Box>
              </li>
            );
          }}
        />

        <Button
          variant="outlined"
          onClick={handleClearFilters}
          startIcon={<ClearIcon />}
        >
          Сбросить фильтры
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {loadingUserTasks && <CircularProgress size={20} sx={{ ml: 2 }} />}
      {!loading &&
        !error &&
        Array.isArray(filteredIssues) &&
        filteredIssues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onClick={() => issuesStore.openDialog(issue.id)}
            onEdit={() => handleEdit(issue.id)}
            onGoToBoard={() => handleGoToBoard(issue)}
          />
        ))}
      {!loading && !error && filteredIssues.length === 0 && (
        <Alert severity="info">Задачи не найдены</Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        sx={{ float: 'right', mb: 3 }}
        onClick={onCreateIssue}
      >
        Создать задачу
      </Button>
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
            editModeDefault={editId === selectedIssue?.id}
            onGoToBoard={() => handleGoToBoard(selectedIssue)}
          />
        )}
      </Dialog>
    </div>
  );
});

export default IssuesPage;
