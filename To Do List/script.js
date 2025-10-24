// Swarnadip's To-Do List Pro ✨ with Animated Progress Bar

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');
const categorySelect = document.getElementById('categorySelect');
const dueDate = document.getElementById('dueDate');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.completed) li.classList.add('done');

    li.innerHTML = `
      <div class="task-header">
        <span class="task-text">${task.text}</span>
        <span class="category">${task.category}</span>
      </div>
      <div class="task-meta">
        Due: ${task.dueDate ? task.dueDate : '—'}
      </div>
      <div class="task-actions">
        <button onclick="toggleComplete(${index})">${task.completed ? '✅' : '☐'}</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  updateProgress();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return alert('Please enter a task!');
  const category = categorySelect.value;
  const date = dueDate.value;
  tasks.push({ text, category, dueDate: date, completed: false });
  taskInput.value = '';
  dueDate.value = '';
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function editTask(index) {
  const newText = prompt('Edit task:', tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText.trim();
    renderTasks();
  }
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  progressBar.style.width = percent + '%';
  progressText.textContent = `${percent}% Completed`;
}

// Theme toggle with smooth animation
themeToggle.addEventListener('click', () => {
  document.body.classList.add('theme-transition');
  setTimeout(() => {
    document.body.classList.toggle('theme-dark');
    document.body.classList.toggle('theme-light');
    document.body.classList.remove('theme-transition');
  }, 300);
});

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Initial render
renderTasks();
