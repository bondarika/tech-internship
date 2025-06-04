import type { Assignee } from './Asignee';

export type Issue = {
  id: number;
  title: string;
  description: string;
  status: 'Backlog' | 'InProgress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  boardId: number;
  boardName: string;
  assignee: Assignee;
};
