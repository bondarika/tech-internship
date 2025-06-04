import axios from 'axios';
import { axiosInstance } from './axiosInstance';
import type { ServerError } from '../types/ServerError';
import type { User } from '../types/User';

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<{ data: User[] }>('/users');
    if (response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Не удалось получить всех пользователей');
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
