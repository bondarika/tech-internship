import { makeAutoObservable, runInAction } from 'mobx';
import { getBoards } from '../api/boards';
import type { Board } from '../types/Board';

class BoardsStore {
  boards: Board[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchBoards = async () => {
    this.loading = true;
    this.error = null;
    try {
      const data = await getBoards();
      runInAction(() => {
        this.boards = data;
        this.error = null;
      });
    } catch {
      runInAction(() => {
        this.error = 'Ошибка загрузки проектов';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}

export const boardsStore = new BoardsStore();
