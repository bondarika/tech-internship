import axios from 'axios';
import { axiosInstance } from './axiosInstance';
import type { Issue } from '../types/Issue';
import type { ServerError } from '../types/ServerError';

export const getIssues = async (): Promise<Issue[]> => {
  try {
    const response = await axiosInstance.get<{ data: Issue[] }>('/tasks');
    if (response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Не удалось получить все задачи');
    }
  } catch (error: unknown) {
    if (axios.isAxiosError<ServerError>(error) && error.response) {
      console.error(
        'API Error:',
        error.response.status,
        error.response.data.message
      );
    } else if (error instanceof Error) {
      console.error('Network Error:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
};

export const updateIssue = async (
  taskId: number,
  input: {
    assigneeId: number;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Backlog' | 'InProgress' | 'Done';
    title: string;
  }
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.put<{ message: string }>(
      `/tasks/update/${taskId}`,
      input
    );
    if (response.data && response.data.message) {
      return response.data;
    } else {
      throw new Error('Не удалось обновить задачу');
    }
  } catch (error: unknown) {
    if (axios.isAxiosError<ServerError>(error) && error.response) {
      console.error(
        'API Error:',
        error.response.status,
        error.response.data.message
      );
    } else if (error instanceof Error) {
      console.error('Network Error:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
};
