type ID = string | number;

interface Todo {
  userId: ID;
  id: ID;
  title: ID;
  completed: boolean;
}
interface User {
  id: ID;
  name: string;
}

(function () {
  //Global
  let todos: Todo[] = [];
  let users: User[] = [];
  const todoList = document.getElementById("todo-list");
  const userSelect = document.getElementById("user-todo");
  const form = document.querySelector("form");

  // Event logic

  const initApp = () => {
    Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
      [todos, users] = values;
      todos.forEach((todo) => {
        printTodo(todo);
      });
      users.forEach((user) => {
        createUserOption(user);
      });
    });
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (form) {
      createTodo({
        userId: Number(form.user.value),
        title: form.todo.value,
        completed: false,
      });
    }
  };

  function handleClose(this: HTMLSpanElement) {
    const parent = this.parentElement;
    if (parent) {
      const todoId = parent.dataset.id;
      todoId && deleteTodo(todoId);
    }
  }

  function handleTodoChange(this: HTMLInputElement) {
    const parent = this.parentElement;
    if (parent) {
      const todoId = parent.dataset.id;
      const completed = this.checked;

      todoId && toggleTodoComplete(todoId, completed);
    }
  }

  //Attach events
  document.addEventListener("DOMContentLoaded", initApp);
  form?.addEventListener("submit", handleSubmit);

  //Basic logic
  const getUserName = (userId: ID) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || "";
  };
  const createUserOption = (user: User) => {
    if (userSelect) {
      const option = document.createElement("option");
      option.value = String(user.id);
      option.innerText = user.name;
      userSelect.append(option);
    }
  };

  const printTodo = ({ userId, id, title, completed }: Todo) => {
    const li = document.createElement("li");
    li.className = "todoItem";
    li.dataset.id = String(id);
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
      userId
    )}</b></span>`;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = completed;
    input.addEventListener("change", handleTodoChange);

    const close = document.createElement("span");
    close.innerHTML = "&times";
    close.className = "close";
    close.addEventListener("click", handleClose);

    todoList?.prepend(li);
    li.prepend(input);
    li.append(close);
  };

  const removeTodo = (todoId: ID) => {
    if (todoList) {
      todos = todos.filter((todo) => todoId !== todoId);

      const todo = todoList.querySelector(`[data-id="${todoId}"]`);
      if (todo) {
        todo
          .querySelector("input")
          ?.removeEventListener("change", handleTodoChange);
        todo.querySelector(".close")?.removeEventListener("click", handleClose);
        todo.remove();
      }
    }
  };

  let alertError = (error: Error) => {
    alert(error.message);
  };

  //Async logic

  const getAllTodos = async (): Promise<Todo[]> => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );

      const data = await response.json();

      return data;
    } catch (error) {
      if (error instanceof Error) alertError(error);

      return []
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );

      const data = await response.json();

      return data;
    } catch (error) {
      if (error instanceof Error) alertError(error);
      return []
    }
  };

  const createTodo = async (todo: Omit<Todo, "id">) => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos ",
        {
          method: "POST",
          body: JSON.stringify(todo),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newTodo = await response.json();
      printTodo(newTodo);
    } catch (error) {
      if (error instanceof Error) alertError(error);
    }
  };

  const toggleTodoComplete = async (todoId: ID, completed: boolean) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ completed }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Fail");
      }
    } catch (error) {
      if (error instanceof Error) alertError(error);
    }
  };

  const deleteTodo = async (todoId: ID) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        removeTodo(todoId);
      } else {
        throw new Error("Fail");
      }
    } catch (error) {
      if (error instanceof Error) alertError(error);
    }
  };
})();
