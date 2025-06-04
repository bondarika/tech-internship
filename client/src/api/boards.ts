import axios from 'axios';
import { axiosInstance } from './axiosInstance';
import type { Board } from '../types/Board';
import type { ServerError } from '../types/ServerError';

export const getBoards = async (): Promise<Board[]> => {
  try {
    const response = await axiosInstance.get<Board[]>('/boards');
    if (response.data) {
      return response.data;
    } else {
      throw new Error('Не удалось получить список досок');
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
