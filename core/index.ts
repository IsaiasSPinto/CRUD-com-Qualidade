/* eslint-disable no-console */
import fs from "fs";
import { v4 as uuid } from "uuid";

const DB_FILE_PATH = "./db";

//console.log("[CRUD]");

type UUID = string;

interface Todo {
  id: UUID;
  date: string;
  content: string;
  done: boolean;
}

function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };

  const todos: Todo[] = [...read(), todo];

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );

  return todo;
}

export function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");

  if (!db.todos) {
    return [];
  }

  return db.todos;
}

function update(id: UUID, partialTodo: Partial<Todo>) {
  const todos: Todo[] = read();
  let updatedTodo;
  todos.forEach((currentTodo) => {
    const isToUpdate = currentTodo.id === id;
    if (isToUpdate) {
      updatedTodo = Object.assign(currentTodo, partialTodo);
    }
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );

  if (!updatedTodo) {
    throw new Error("Please Provide another ID");
  }

  return updatedTodo;
}

function updateContentById(id: UUID, content: string) {
  return update(id, { content });
}

function deleteById(id: UUID) {
  const todos: Todo[] = read();
  const todosWihoutOne = todos.filter((x) => x.id != id);

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: todosWihoutOne,
      },
      null,
      2
    )
  );
}

function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, "{}");
}

//[Simulation]
// CLEAR_DB();
// const primeiraTodo = create("Primeira TODO");
// const segundaTodo = create("Segunda TODO");
// create("Terceira TODO");
// updateContentById(segundaTodo.id, "Segunda todo com novo Content");
// deleteById(primeiraTodo.id);

// console.log(read());
