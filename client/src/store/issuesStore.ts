import { makeAutoObservable, runInAction } from 'mobx';
import {
  getIssues,
  updateIssue,
  createIssue as apiCreateIssue,
} from '../api/issues';
import type { Issue } from '../types/Issue';

class IssuesStore {
  issues: Issue[] = [];
  loading = false;
  error: string | null = null;
  openId: number | null = null;
  editModeId: number | null = null;
  createLoading = false;
  createError: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchIssues = async () => {
    this.loading = true;
    this.error = null;
    try {
      const data = await getIssues();
      runInAction(() => {
        this.issues = data;
        this.error = null;
      });
    } catch {
      runInAction(() => {
        this.error = 'Ошибка загрузки задач';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  openDialog = (id: number) => {
    this.openId = id;
    this.editModeId = null;
  };

  openEditDialog = (id: number) => {
    this.openId = id;
    this.editModeId = id;
  };

  closeDialog = () => {
    this.openId = null;
    this.editModeId = null;
  };

  get selectedIssue() {
    return Array.isArray(this.issues)
      ? this.issues.find((issue) => issue.id === this.openId)
      : undefined;
  }

  get isEditMode() {
    return this.openId !== null && this.editModeId === this.openId;
  }

  editIssue = async (
    taskId: number,
    input: {
      assigneeId: number;
      description: string;
      priority: 'Low' | 'Medium' | 'High';
      status: 'Backlog' | 'InProgress' | 'Done';
      title: string;
    }
  ) => {
    this.loading = true;
    this.error = null;
    try {
      await updateIssue(taskId, input);
      runInAction(() => {
        const idx = this.issues.findIndex((issue) => issue.id === taskId);
        if (idx !== -1) {
          this.issues[idx] = { ...this.issues[idx], ...input };
        }
        this.error = null;
      });
    } catch {
      runInAction(() => {
        this.error = 'Ошибка обновления задачи';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  createIssue = async (input: {
    assigneeId: number;
    boardId: number;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    title: string;
  }): Promise<number | null> => {
    this.createLoading = true;
    this.createError = null;
    try {
      const { id } = await apiCreateIssue(input);
      await this.fetchIssues();
      return id;
    } catch {
      runInAction(() => {
        this.createError = 'Ошибка создания задачи';
      });
      return null;
    } finally {
      runInAction(() => {
        this.createLoading = false;
      });
    }
  };
}

export const issuesStore = new IssuesStore();
