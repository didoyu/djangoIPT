import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

export const getBooks = () => api.get('books/');
export const getAuthors = () => api.get('authors/');
export const createAuthor = (data) => api.post('authors/', data); // Add this
export const createBook = (data) => api.post('books/', data);     // Add this
export const deleteBook = (id) => api.delete(`books/${id}/`);
// Add this to your src/api.js
export const updateBook = (id, data) => api.put(`books/${id}/`, data);
export const updateAuthor = (id, data) => api.put(`authors/${id}/`, data);
export default api;