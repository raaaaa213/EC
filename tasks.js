// === Task Manager ===
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskItems = document.getElementById('taskItems');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let searchQuery = '';

// === Sorting Logic ===
function sortTasksArray(tasksArr, sortBy) {
  const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
  switch (sortBy) {
    case 'date-enlisted-desc':
      return tasksArr.slice().sort((a, b) => new Date(b.created || b.dueDate) - new Date(a.created || a.dueDate));
    case 'date-enlisted-asc':
      return tasksArr.slice().sort((a, b) => new Date(a.created || a.dueDate) - new Date(b.created || b.dueDate));
    case 'priority-desc':
      return tasksArr.slice().sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
    case 'priority-asc':
      return tasksArr.slice().sort((a, b) => (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0));
    case 'due-desc':
      return tasksArr.slice().sort((a, b) => {
        const aDays = a.dueDate ? (new Date(a.dueDate) - new Date()) : Infinity;
        const bDays = b.dueDate ? (new Date(b.dueDate) - new Date()) : Infinity;
        return aDays - bDays;
      });
    case 'due-asc':
      return tasksArr.slice().sort((a, b) => {
        const aDays = a.dueDate ? (new Date(a.dueDate) - new Date()) : -Infinity;
        const bDays = b.dueDate ? (new Date(b.dueDate) - new Date()) : -Infinity;
        return bDays - aDays;
      });
    case 'name-asc':
      return tasksArr.slice().sort((a, b) => (a.text || '').localeCompare(b.text || ''));
    case 'name-desc':
      return tasksArr.slice().sort((a, b) => (b.text || '').localeCompare(a.text || ''));
    default:
      return tasksArr;
  }
}

let currentSort = 'date-enlisted-desc';

const sortTasksSelect = document.getElementById('sortTasks');
if (sortTasksSelect) {
  sortTasksSelect.addEventListener('change', function() {
    currentSort = this.value;
    renderTasks();
  });
}

function renderTasks() {
  taskItems.innerHTML = '';
  let filteredTasks = filterTasks(tasks, currentFilter).filter(task =>
    task.text.toLowerCase().includes(searchQuery) ||
    (task.category && task.category.toLowerCase().includes(searchQuery)) ||
    (task.notes && task.notes.toLowerCase().includes(searchQuery))
  );
  filteredTasks = sortTasksArray(filteredTasks, currentSort);
  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-created', task.created); // For editing
    let dueSoon = '';
    if (!task.done && task.dueDate) {
      const due = new Date(task.dueDate);
      const now = new Date();
      const diff = (due - now) / (1000 * 60 * 60 * 24);
      if (diff < 1 && diff > 0) dueSoon = '<span class="reminder">Due soon</span>';
      if (diff < 0) dueSoon = '<span class="reminder overdue">Overdue</span>';
    }
    // Show notes only as tooltip on hover
    const notesAttr = task.notes ? ` title="${task.notes.replace(/"/g, '&quot;')}"` : '';
    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" data-created="${task.created}" ${task.done ? 'checked' : ''}>
      <label${notesAttr}>${task.text}</label>
      <span class="task-date">Due: ${task.dueDate || '-'}</span>
      <span class="task-priority">${task.priority || ''}</span>
      <span class="task-category">${task.category || ''}</span>
      <span class="task-recurring">${task.recurring && task.recurring !== 'none' ? '🔁 ' + task.recurring : ''}</span>
      <span class="task-progress">Progress: <input type='range' class='progress-slider' data-created='${task.created}' min='0' max='100' value='${task.progress || 0}' style='width:120px;vertical-align:middle;'> <span class='progress-value'>${task.progress || 0}%</span></span>
      ${dueSoon}
      <button class="delete" data-created="${task.created}" type="button">&times;</button>
    `;
    // Add click event for editing (but not on checkbox, delete, or progress slider)
    li.addEventListener('click', function(e) {
      if (e.target.classList.contains('task-checkbox') || e.target.classList.contains('delete') || e.target.classList.contains('progress-slider')) return;
      openEditTaskModal(task);
    });
    // Stop event propagation for delete button so li click doesn't fire
    li.querySelector('.delete').addEventListener('click', function(e) {
      e.stopPropagation();
      deleteTaskByCreated(task.created);
    });
    // Progress slider logic
    const slider = li.querySelector('.progress-slider');
    const valueSpan = li.querySelector('.progress-value');
    slider.addEventListener('input', function(e) {
      valueSpan.textContent = slider.value + '%';
    });
    slider.addEventListener('change', function(e) {
      // Use slider's data-created, not closure's task.created
      const created = slider.getAttribute('data-created');
      const idx = tasks.findIndex(t => t.created === created);
      if (idx !== -1) {
        tasks[idx].progress = parseInt(slider.value, 10) || 0;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
      }
    });
    taskItems.appendChild(li);
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks(tasks, filter) {
  const today = new Date();
  switch (filter) {
    case 'completed':
      return tasks.filter(t => t.done);
    case 'today':
      return tasks.filter(t => t.dueDate === today.toISOString().slice(0,10));
    case 'week':
      const weekFromNow = new Date(today);
      weekFromNow.setDate(today.getDate() + 7);
      return tasks.filter(t => t.dueDate && new Date(t.dueDate) >= today && new Date(t.dueDate) <= weekFromNow);
    case 'overdue':
      return tasks.filter(t => t.dueDate && !t.done && new Date(t.dueDate) < today);
    case 'active':
      return tasks.filter(t => !t.done);
    case 'high':
      return tasks.filter(t => t.priority === 'High');
    default:
      return tasks;
  }
}

function deleteTaskByCreated(created) {
  const idx = tasks.findIndex(t => t.created === created);
  if (idx !== -1) {
    tasks.splice(idx, 1);
    renderTasks();
  }
}

function toggleTaskByCreated(created) {
  const idx = tasks.findIndex(t => t.created === created);
  if (idx !== -1) {
    tasks[idx].done = !tasks[idx].done;
    if (tasks[idx].done) {
      tasks[idx].completedDate = new Date().toISOString().slice(0,10);
    } else {
      tasks[idx].completedDate = '';
    }
    renderTasks();
  }
}

// Initial render
renderTasks();

// --- Event Delegation for Task Checkboxes ---
if (taskItems) {
  taskItems.addEventListener('change', function(e) {
    if (e.target && e.target.classList.contains('task-checkbox')) {
      const created = e.target.getAttribute('data-created');
      toggleTaskByCreated(created);
    }
  });

  // --- Event Delegation for Delete Buttons ---
  taskItems.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('delete')) {
      const created = e.target.getAttribute('data-created');
      deleteTaskByCreated(created);
    }
  });
}

// --- Filter Buttons ---
const filterBtns = document.querySelectorAll('.task-filters .btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    currentFilter = btn.getAttribute('data-filter');
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTasks();
  });
});

// Update taskForm submit logic to use preset and custom category
if (taskForm) {
  taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const newTask = taskInput.value.trim();
    const dueDate = document.getElementById('dueDateInput').value;
    const priority = document.getElementById('priorityInput').value;
    const presetCategory = document.getElementById('categoryInput').value;
    const customCategory = document.getElementById('customCategoryInput').value.trim();
    const category = customCategory || presetCategory;
    const notesInput = document.getElementById('notesInput');
    const notes = notesInput ? notesInput.value : '';
    const recurring = document.getElementById('recurringInput').value;
    const progress = parseInt(document.getElementById('progressInput').value, 10) || 0;
    if (newTask && dueDate) {
      tasks.push({ text: newTask, done: false, dueDate, completedDate: '', priority, category, notes, recurring, progress, created: new Date().toISOString() });
      // Save to localStorage immediately to ensure created is set
      localStorage.setItem('tasks', JSON.stringify(tasks));
      // --- Increment persistent per-day count ---
      const today = new Date().toISOString().slice(0, 10);
      let counts = JSON.parse(localStorage.getItem('tasksAddedPerDayCounts') || '{}');
      counts[today] = (counts[today] || 0) + 1;
      localStorage.setItem('tasksAddedPerDayCounts', JSON.stringify(counts));
      taskInput.value = '';
      document.getElementById('dueDateInput').value = '';
      document.getElementById('priorityInput').value = 'Low';
      document.getElementById('categoryInput').value = '';
      document.getElementById('customCategoryInput').value = '';
      if (notesInput) notesInput.value = '';
      document.getElementById('recurringInput').value = 'none';
      document.getElementById('progressInput').value = 0;
      document.getElementById('progressValue').textContent = '0%';
      renderTasks();
    }
  });
}

document.getElementById('progressInput').addEventListener('input', function() {
  document.getElementById('progressValue').textContent = this.value + '%';
});

document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase();
  renderTasks();
});

document.getElementById('toggleDark').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const csv = [
    'Task,Due Date,Completed,Completed Date,Priority,Category,Notes,Recurring',
    ...tasks.map(t => `"${t.text}",${t.dueDate},${t.done},${t.completedDate},${t.priority},"${t.category}","${t.notes}",${t.recurring}`)
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.csv';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('importBtn').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const lines = evt.target.result.split('\n').slice(1);
      lines.forEach(line => {
        if (!line.trim()) return;
        const [text, dueDate, done, completedDate, priority, category, notes, recurring] = line.split(',');
        tasks.push({
          text: text.replace(/"/g, ''),
          dueDate,
          done: done === 'true',
          completedDate,
          priority,
          category: category.replace(/"/g, ''),
          notes: notes.replace(/"/g, ''),
          recurring: recurring === 'true'
        });
      });
      renderTasks();
    };
    reader.readAsText(file);
  };
  input.click();
});

// === Admin Demo Tasks Logic ===
function activateAdminDemoTasks() {
  // Find demo tasks by a special flag or text (e.g. category === 'Demo')
  const demoTasks = tasks.filter(t => t.category === 'Demo');
  const today = new Date();
  // Remove all demo tasks
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].category === 'Demo') tasks.splice(i, 1);
  }
  // Add 5 demo tasks
  for (let i = 0; i < 5; i++) {
    const dueDate = new Date(today);
    // First 2 are overdue (yesterday, 2 days ago)
    if (i < 2) dueDate.setDate(today.getDate() - (i + 1));
    // Last 3 are active (today, tomorrow, day after)
    else dueDate.setDate(today.getDate() + (i - 2));
    tasks.push({
      text: `Demo Task ${i + 1}`,
      done: false,
      dueDate: dueDate.toISOString().slice(0, 10),
      completedDate: '',
      priority: i < 2 ? 'High' : 'Medium',
      category: 'Demo',
      notes: i < 2 ? 'Overdue demo task' : 'Active demo task',
      recurring: 'none',
      progress: 0,
      created: new Date().toISOString() // Use unique timestamp for each demo task
    });
  }
  renderTasks();
}

function updateAdminDemoTasksDaily() {
  // Only update if demo tasks exist
  const demoTasks = tasks.filter(t => t.category === 'Demo');
  if (demoTasks.length === 5) {
    // Recalculate due dates so 2 are overdue, 3 are active
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const dueDate = new Date(today);
      if (i < 2) dueDate.setDate(today.getDate() - (i + 1));
      else dueDate.setDate(today.getDate() + (i - 2));
      demoTasks[i].dueDate = dueDate.toISOString().slice(0, 10);
      demoTasks[i].done = false;
      demoTasks[i].completedDate = '';
      demoTasks[i].created = today.toISOString().slice(0, 10); // Always update created to today
    }
    // Replace in tasks array
    let j = 0;
    for (let k = 0; k < tasks.length; k++) {
      if (tasks[k].category === 'Demo') {
        tasks[k] = demoTasks[j++];
      }
    }
    renderTasks();
  }
}

// Example: activate demo tasks if admin mode is on (you can trigger this however you want)
if (localStorage.getItem('adminDemo') === 'true') {
  activateAdminDemoTasks();
}
updateAdminDemoTasksDaily();

document.addEventListener('DOMContentLoaded', function() {
  // Remove any element or text containing 'Category or tags' or 'comma separated' on page load
  const removeTextNodes = (root) => {
    if (!root) return;
    // Remove elements with matching text
    const elements = root.querySelectorAll('*');
    elements.forEach(el => {
      if (el.textContent && (el.textContent.match(/Category or tags|comma separated/i))) {
        el.remove();
      }
    });
    // Remove text nodes directly under root
    Array.from(root.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.match(/Category or tags|comma separated/i)) {
        node.remove();
      }
    });
  };
  removeTextNodes(document.body);
  // Move the subject select under "Enter new task"
  const taskForm = document.getElementById('taskForm');
  const categoryInput = document.getElementById('categoryInput');
  if (taskForm && categoryInput) {
    // Remove the label and text for category/tags if present
    const label = document.querySelector('label[for="categoryInput"]');
    if (label) label.remove();
    // Remove any text node or element that says 'Category or tags (comma separated)'
    const allNodes = Array.from(categoryInput.parentNode.childNodes);
    allNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.match(/Category|tags|comma/i)) {
        node.remove();
      }
      if (node.nodeType === Node.ELEMENT_NODE && node.textContent.match(/Category|tags|comma/i)) {
        node.remove();
      }
    });
    // Move the select right under the task input
    const taskInput = document.getElementById('taskInput');
    if (taskInput) {
      taskInput.parentNode.insertBefore(categoryInput, taskInput.nextSibling);
    }
  }
  const customCategoryInput = document.getElementById('customCategoryInput');
  if (customCategoryInput) {
    customCategoryInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && this.value.trim()) {
        e.preventDefault();
        const customValue = this.value.trim();
        // Check if already exists
        let exists = false;
        for (let i = 0; i < categoryInput.options.length; i++) {
          if (categoryInput.options[i].value.toLowerCase() === customValue.toLowerCase()) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          const opt = document.createElement('option');
          opt.value = customValue;
          opt.textContent = customValue;
          categoryInput.appendChild(opt);
        }
        categoryInput.value = customValue;
        this.value = '';
        this.style.display = 'none';
      } 
    });
  }
});
