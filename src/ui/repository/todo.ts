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
    const { todos } = parseTodosFromSever(await response.json());

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

function parseTodosFromSever(responseBody: unknown): { todos: Array<Todo> } {
  if (
    responseBody != null &&
    typeof responseBody == "object" &&
    "todos" in responseBody &&
    Array.isArray(responseBody.todos)
  ) {
    return {
      todos: responseBody.todos.map((todo) => {
        if (todo == null && typeof todo != "object")
          throw new Error("Invalid todo from Api");

        const { id, content, date, done } = todo as {
          id: string;
          content: string;
          date: string;
          done: string;
        };

        return {
          id,
          content,
          done: String(done).toLowerCase() === "true",
          date: new Date(date),
        };
      }),
    };
  }

  return {
    todos: [],
  };
}
