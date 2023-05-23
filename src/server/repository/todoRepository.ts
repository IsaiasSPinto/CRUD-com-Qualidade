import { read } from "@db-crud-todo";

interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todo: Todo[];
  pages: number;
  total: number;
}

function get({ page, limit }: TodoRepositoryGetParams = {}) {
  const currentPage = page || 1;
  const currentLimit = limit || 10;

  const todos = read();

  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;

  const paginatedTodos = todos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(todos.length / currentLimit);

  return {
    todos: paginatedTodos,
    total: todos.length,
    pages: totalPages,
  };
}

interface Todo {
  id: string;
  content: string;
  date: string;
  done: string;
}

export const todoRepository = {
  get,
};
