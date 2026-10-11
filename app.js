// ===== 상태 및 상수 =====
const STORAGE_KEY = "todos";
let todos = [];
let currentFilter = "all"; // all | active | completed

// ===== DOM 요소 =====
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter-btn");

// ===== 데이터 영속화 (localStorage) =====
function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  todos = raw ? JSON.parse(raw) : [];
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// ===== 기능 1: Todo 추가 =====
function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const newTodo = {
    id: Date.now().toString(),
    text: trimmed,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.unshift(newTodo);
  saveTodos();
  render();
}

// ===== 기능 2: Todo 삭제 =====
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

// ===== 기능 3: 완료/미완료 전환 =====
function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
}

// ===== 기능 4: Todo 목록 표시 =====
function getFilteredTodos() {
  switch (currentFilter) {
    case "active":
      return todos.filter((t) => !t.completed);
    case "completed":
      return todos.filter((t) => t.completed);
    default:
      return todos;
  }
}

function render() {
  const filtered = getFilteredTodos();
  list.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-message";
    empty.textContent = "표시할 할 일이 없습니다.";
    list.appendChild(empty);
  } else {
    filtered.forEach((todo) => {
      const li = document.createElement("li");
      li.className = "todo-item" + (todo.completed ? " completed" : "");
      li.dataset.id = todo.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "todo-checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => toggleTodo(todo.id));

      const span = document.createElement("span");
      span.className = "todo-text";
      span.textContent = todo.text;
      span.addEventListener("click", () => toggleTodo(todo.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-delete";
      deleteBtn.type = "button";
      deleteBtn.textContent = "✕";
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  }

  const remaining = todos.filter((t) => !t.completed).length;
  itemsLeft.textContent = `${remaining}개 남음`;
}

// ===== 필터 버튼 처리 =====
function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  render();
}

// ===== 이벤트 바인딩 =====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(input.value);
  input.value = "";
  input.focus();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

// ===== 기능 5: 데이터 영속화 (초기 로드) =====
loadTodos();
render();
