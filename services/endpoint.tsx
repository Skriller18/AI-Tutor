import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.12:8000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = {
  async solve(question: string) {
    try {
      const response = await axiosInstance.post(`/solve?question=${encodeURIComponent(question)}`);
      return response.data.solution;
    } catch (error: any) {
      if (error.response?.status === 422) {
        console.error('Invalid request format:', error.response.data);
      }
      throw error;
    }
  },

  async getHint(question: string, drawboardImage: Blob) {
    try {
      const formData = new FormData();
      formData.append('image', drawboardImage);
      
      const response = await axiosInstance.post(`/hint?question=${encodeURIComponent(question)}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.hint;
    } catch (error) {
      console.error('Hint error:', error);
      throw error;
    }
  },

  async checkSolution(question: string, drawboardImage: Blob) {
    try {
      const formData = new FormData();
      formData.append('image', drawboardImage);
      
      const response = await axiosInstance.post(`/correct?question=${encodeURIComponent(question)}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.hint;
    } catch (error) {
      console.error('Check solution error:', error);
      throw error;
    }
  }
};