import { makeAutoObservable, runInAction } from 'mobx';
import { getIssues } from '../api/issues';
import type { Issue } from '../types/Issue';

class IssuesStore {
  issues: Issue[] = [];
  loading = false;
  error: string | null = null;
  openId: number | null = null;

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
  };

  closeDialog = () => {
    this.openId = null;
  };

  get selectedIssue() {
    return Array.isArray(this.issues)
      ? this.issues.find((issue) => issue.id === this.openId)
      : undefined;
  }
}

export const issuesStore = new IssuesStore();
