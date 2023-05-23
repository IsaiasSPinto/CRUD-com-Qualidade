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
  return fetch(`api/todos?page=${page}&limit=${limit}`).then(
    async (response) => {
      const { todos, pages, total } = parseTodosFromSever(
        await response.json()
      );

      return {
        todos: todos,
        total,
        pages,
      };
    }
  );
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

function parseTodosFromSever(responseBody: unknown): {
  todos: Array<Todo>;
  pages: number;
  total: number;
} {
  if (
    responseBody != null &&
    typeof responseBody == "object" &&
    "todos" in responseBody &&
    "total" in responseBody &&
    "pages" in responseBody &&
    Array.isArray(responseBody.todos)
  ) {
    return {
      total: Number(responseBody.total),
      pages: Number(responseBody.pages),
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
    pages: 1,
    total: 0,
    todos: [],
  };
}
