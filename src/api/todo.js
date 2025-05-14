import api from './index';

export function fetchTodos() {
  return api.get('todos/').then(res => res.data);
}