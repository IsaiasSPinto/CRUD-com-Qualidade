async function get() {
  return fetch("api/todos").then(async (response) => {
    const data = await response.json();
    return data.todos;
  });
}

export const todoController = {
  get,
};
