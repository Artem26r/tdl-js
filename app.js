(function () {
  //Global
  let todos = [];
  let users = [];
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

  const handleSubmit = (event) => {
    event.preventDefault();

    createTodo({
      userId: Number(form.user.value),
      title: form.todo.value,
      completed: false,
    });
  };

  function handleClose() {
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
  }

  function handleTodoChange() {
    const todoId = this.parentElement.dataset.id;
    const completed = this.chacked;

    toggleTodoComplete(todoId, completed);
  }

  //Attach events
  document.addEventListener("DOMContentLoaded", initApp);
  form.addEventListener("submit", handleSubmit);

  //Basic logic
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user.name;
  };
  const createUserOption = (user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.innerText = user.name;
    userSelect.append(option);
  };

  const printTodo = ({ userId, id, title, completed }) => {
    const li = document.createElement("li");
    li.className = "todoItem";
    li.dataset.id = id;
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

    todoList.prepend(li);
    li.prepend(input);
    li.append(close);
  };

  const removeTodo = (todoId) => {
    todos = todos.filter((todo) => todoId !== todoId);

    const todo = todoList.querySelector(`[data-id="${todoId}"]`);

    todo.querySelector("input").removeEventListener("change", handleTodoChange);
    todo.querySelector(".close").removeEventListener("click", handleClose);
    todo.remove();
  };

  let alertError = (error) => {
    alert(error.message);
  };

  //Async logic

  const getAllTodos = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );

      const data = await response.json();

      return data;
    } catch (error) {
      alertError(error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );

      const data = await response.json();

      return data;
    } catch (error) {
      alertError(error);
    }
  };

  const createTodo = async (todo) => {
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
      alertError(error);
    }
  };

  const toggleTodoComplete = async (todoId, completed) => {
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
      alertError(error);
    }
  };

  const deleteTodo = async (todoId) => {
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
      alertError(error);
    }
  };
})();
