interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}

function get({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  return fetch("api/todos").then(async (response) => {
    const { todos } = await response.json();

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedTodos = todos.slice(startIndex, endIndex);
    const totalPages = Math.ceil(todos.length / limit);

    return {
      todos: paginatedTodos,
      total: todos.length,
      pages: totalPages,
    };
  });
}

export const todoRepository = {
  get,
};

interface Todo {
  id: string;
  content: string;
  date: Date;
  done: boolean;
}
