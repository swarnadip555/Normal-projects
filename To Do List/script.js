// script.js — Swarnadip's To-Do List Pro (complete working file)

// DOM elements
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const dueDate = document.getElementById('dueDate');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const body = document.body;

// LocalStorage key
const STORAGE_KEY = 'swarnadip_tasks_v1';
const THEME_KEY = 'swarnadip_theme_v1';

// tasks array structure: { id, text, category, dueDate, completed, createdAt }
let tasks = [];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  renderTasks();
  restoreTheme();
  updateProgress();
});

// --- Event listeners ---
addBtn.addEventListener('click', handleAdd);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAdd(); });
themeToggle.addEventListener('click', toggleTheme);

// Event delegation for task actions (edit/delete/toggle)
taskList.addEventListener('click', (e) => {
  const el = e.target;
  const li = el.closest('li');
  if (!li) return;
  const id = li.dataset.id;
  if (el.matches('.delete-btn')) {
    removeTask(id, li);
  } else if (el.matches('.edit-btn')) {
    editTaskPrompt(id);
  } else if (el.matches('.toggle-btn')) {
    toggleComplete(id);
  }
});

// --- Functions ---
function handleAdd(){
  const text = taskInput.value.trim();
  if (!text) return alert('Please enter a task');
  const category = categorySelect.value || 'Other';
  const due = dueDate.value || '';
  const newTask = {
    id: String(Date.now()) + Math.random().toString(36).slice(2,7),
    text,
    category,
    dueDate: due,
    completed: false,
    createdAt: Date.now()
  };
  tasks.unshift(newTask); // newest on top
  taskInput.value = '';
  dueDate.value = '';
  saveToStorage();
  renderTasks();
  animateAdd(); // subtle page-level animation
}

function renderTasks(){
  taskList.innerHTML = '';
  if (tasks.length === 0){
    const p = document.createElement('p');
    p.textContent = 'No tasks yet — add one above ✨';
    p.style.color = 'var(--grey)';
    taskList.appendChild(p);
    updateProgress();
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item fade-in' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    li.innerHTML = `
      <div class="task-row">
        <div class="task-left">
          <button class="icon-btn toggle-btn" title="Toggle complete">${task.completed ? '✅' : '☐'}</button>
          <div>
            <div class="task-title">${escapeHtml(task.text)}</div>
            <div class="task-meta">${task.category}${task.dueDate ? ' • Due ' + formatDate(task.dueDate) : ''}</div>
          </div>
        </div>

        <div class="task-actions">
          <button class="icon-btn edit-btn" title="Edit">✏️</button>
          <button class="icon-btn delete-btn" title="Delete">🗑️</button>
        </div>
      </div>
    `;
    taskList.appendChild(li);
  });

  updateProgress();
}

// toggle complete state
function toggleComplete(id){
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  tasks[idx].completed = !tasks[idx].completed;
  saveToStorage();
  renderTasks();
}

// edit prompt
function editTaskPrompt(id){
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  const t = tasks[idx];
  const newText = prompt('Edit task text:', t.text);
  if (newText === null) return; // canceled
  const newCategory = prompt('Category:', t.category) || t.category;
  const newDue = prompt('Due date (YYYY-MM-DD) or empty:', t.dueDate || '');
  tasks[idx].text = newText.trim() || t.text;
  tasks[idx].category = newCategory.trim() || t.category;
  tasks[idx].dueDate = (newDue && isValidDate(newDue)) ? newDue : (newDue ? t.dueDate : '');
  saveToStorage();
  renderTasks();
}

// remove with animation
function removeTask(id, liElement){
  // add fade-out then remove
  if (!liElement) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    tasks.splice(idx,1);
    saveToStorage();
    renderTasks();
    return;
  }
  liElement.classList.remove('fade-in');
  liElement.classList.add('fade-out');
  setTimeout(() => {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) tasks.splice(idx,1);
    saveToStorage();
    renderTasks();
  }, 420);
}

// persistence
function saveToStorage(){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch(e) {
    console.error('Saving failed', e);
  }
}
function loadFromStorage(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  } catch(e) {
    console.error('Load failed', e);
    tasks = [];
  }
}

// progress bar
function updateProgress(){
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  progressText.textContent = `${done} of ${total} tasks completed`;
  const pct = total === 0 ? 0 : Math.round((done/total)*100);
  progressBar.style.width = pct + '%';
  // animate subtle fill
  progressBar.animate(
    [{ transform: 'scaleX(0.98)', opacity: 0.85 }, { transform: 'scaleX(1)', opacity: 1 }],
    { duration: 420, easing: 'cubic-bezier(.2,.9,.2,1)' }
  );
}

// theme toggle & persistence
function toggleTheme(){
  if (body.classList.contains('theme-light')) {
    body.classList.remove('theme-light');
    localStorage.setItem(THEME_KEY, 'dark');
    themeToggle.textContent = '🌙';
  } else {
    body.classList.add('theme-light');
    localStorage.setItem(THEME_KEY, 'light');
    themeToggle.textContent = '☀️';
  }
  // small page animation
  body.animate([{ opacity: .96, transform: 'scale(1.008)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 420, easing: 'ease-out' });
}

function restoreTheme(){
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light') {
    body.classList.add('theme-light');
    themeToggle.textContent = '☀️';
  } else {
    body.classList.remove('theme-light');
    themeToggle.textContent = '🌙';
  }
}

// Small utility functions
function formatDate(d){
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString();
}
function isValidDate(s){
  return !isNaN(new Date(s).getTime());
}
function escapeHtml(str){
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// subtle page animation when adding
function animateAdd(){
  document.querySelector('.app').animate(
    [{ transform: 'translateY(2px)', opacity: 0.98 }, { transform: 'translateY(0)', opacity: 1 }],
    { duration: 300, easing: 'cubic-bezier(.2,.9,.2,1)' }
  );
}
