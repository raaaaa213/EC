// --- One-time fixer: Ensure all tasks have a 'created' property ---
(function fixTasksCreatedProperty() {
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  let changed = false;
  const todayStr = new Date().toISOString().slice(0, 10);
  tasks.forEach(t => {
    if (!t.created) {
      // Try to use added, dueDate, or fallback to today
      if (t.added) {
        t.created = t.added.slice(0, 10);
      } else if (t.dueDate) {
        t.created = t.dueDate.slice(0, 10);
      } else {
        t.created = todayStr;
      }
      changed = true;
    }
  });
  if (changed) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
})();

// === Chart.js: Mood & Task Charts ===
const moodCtx = document.getElementById('moodChart').getContext('2d');
const taskCtx = document.getElementById('taskChart').getContext('2d');
const hoursCtx = document.getElementById('hoursChart').getContext('2d');
const tasksAddedCtx = document.getElementById('tasksAddedChart').getContext('2d');
const tasksCompletedCtx = document.getElementById('tasksCompletedChart').getContext('2d');
const categoryCtx = document.getElementById('categoryChart').getContext('2d');
const priorityCtx = document.getElementById('priorityChart').getContext('2d');
const overdueCtx = document.getElementById('overdueChart').getContext('2d');

// --- Mood Over Time (from check-ins) ---
const checkins = JSON.parse(localStorage.getItem('checkins') || '[]');
const today = new Date();
const last7Dates = Array.from({length: 7}, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() - (6 - i));
  return d.toISOString().split('T')[0];
});
const moodLabels = last7Dates.map(d => d.slice(5));
const moodValues = last7Dates.map(date => {
  const entry = checkins.find(e => e.date === date);
  return entry ? Number(entry.mood) : null;
});
const hoursValues = last7Dates.map(date => {
  const entry = checkins.find(e => e.date === date);
  return entry ? Number(entry.hours) : 0;
});
const moodData = {
  labels: moodLabels,
  datasets: [{
    label: 'Mood Level',
    data: moodValues,
    backgroundColor: 'rgba(0, 102, 204, 0.2)',
    borderColor: 'rgba(0, 102, 204, 1)',
    borderWidth: 2,
    tension: 0.3,
    fill: true,
  }]
};
const hoursData = {
  labels: moodLabels,
  datasets: [{
    label: 'Hours Spent',
    data: hoursValues,
    backgroundColor: 'rgba(255, 193, 7, 0.5)',
    borderColor: 'rgba(255, 193, 7, 1)',
    borderWidth: 2,
    type: 'bar',
    borderRadius: 6,
  }]
};

// --- Task Completion Rate (from tasks) ---
const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
// Group by category or just show top 5 most recent
const completed = tasks.filter(t => t.done);
const categories = [...new Set(tasks.map(t => t.category || 'Uncategorized'))];
const taskLabels = categories.slice(0, 5);
const taskCounts = taskLabels.map(cat => completed.filter(t => (t.category || 'Uncategorized') === cat).length);

const taskData = {
  labels: taskLabels,
  datasets: [{
    label: 'Tasks Completed',
    data: taskCounts,
    backgroundColor: 'rgba(0, 153, 76, 0.6)',
    borderRadius: 6,
  }]
};

// --- Task Progress Overview (from tasks) ---
const completedTasks = tasks.filter(t => t.done).length;
const activeTasks = tasks.filter(t => !t.done).length;
const taskProgressData = {
  labels: ['Completed', 'Active'],
  datasets: [{
    data: [completedTasks, activeTasks],
    backgroundColor: [
      'rgba(0, 153, 76, 0.7)',
      'rgba(0, 102, 204, 0.5)'
    ],
    borderWidth: 1
  }]
};

// --- Tasks Added Per Day (Dynamic Range: earliest task to today) ---
function getTasksAddedDateRange(tasks) {
  const createdDates = tasks
    .map(t => t.created ? t.created.slice(0, 10) : null)
    .filter(Boolean)
    .sort();
  if (createdDates.length === 0) return [];
  const minDate = new Date(createdDates[0]);
  const maxDate = new Date(); // today
  const range = [];
  for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
    range.push(d.toISOString().split('T')[0]);
  }
  return range;
}
const tasksAddedDateRange = getTasksAddedDateRange(tasks);
const tasksAddedPerDay = tasksAddedDateRange.map(date => tasks.filter(t => t.created && t.created.startsWith(date)).length);
const tasksAddedData = {
  labels: tasksAddedDateRange.map(d => d.slice(5)),
  datasets: [{
    label: 'Tasks Added',
    data: tasksAddedPerDay,
    backgroundColor: 'rgba(0, 102, 204, 0.6)',
    borderRadius: 6
  }]
};

// --- Task Completion Trend (last 7 days) ---
const tasksCompletedPerDay = last7Dates.map(date => tasks.filter(t => t.completedDate && t.completedDate.startsWith(date)).length);
const tasksCompletedData = {
  labels: last7Dates.map(d => d.slice(5)),
  datasets: [{
    label: 'Tasks Completed',
    data: tasksCompletedPerDay,
    backgroundColor: 'rgba(0, 153, 76, 0.3)',
    borderColor: 'rgba(0, 153, 76, 1)',
    borderWidth: 2,
    tension: 0.3,
    fill: true,
    type: 'line'
  }]
};

// --- Category Distribution (Pie Chart) ---
const allCategories = tasks.map(t => t.category || 'Uncategorized');
const uniqueCategories = [...new Set(allCategories)];
const categoryCounts = uniqueCategories.map(cat => allCategories.filter(c => c === cat).length);
const categoryData = {
  labels: uniqueCategories,
  datasets: [{
    data: categoryCounts,
    backgroundColor: [
      'rgba(0, 102, 204, 0.6)',
      'rgba(0, 153, 76, 0.6)',
      'rgba(255, 193, 7, 0.6)',
      'rgba(255, 87, 34, 0.6)',
      'rgba(156, 39, 176, 0.6)',
      'rgba(33, 150, 243, 0.6)',
      'rgba(76, 175, 80, 0.6)'
    ]
  }]
};

// --- Task Priority Breakdown (Pie Chart) ---
const priorities = ['High', 'Medium', 'Low'];
const priorityCounts = priorities.map(p => tasks.filter(t => (t.priority || 'Medium') === p).length);
const priorityData = {
  labels: priorities,
  datasets: [{
    data: priorityCounts,
    backgroundColor: [
      'rgba(255, 87, 34, 0.7)',
      'rgba(255, 193, 7, 0.7)',
      'rgba(0, 153, 76, 0.7)'
    ]
  }]
};

// --- Overdue Tasks Trend (Line Chart, last 7 days) ---
const overduePerDay = last7Dates.map(date =>
  tasks.filter(t =>
    t.dueDate &&
    !t.done &&
    new Date(t.dueDate) < new Date(date)
  ).length
);
const overdueData = {
  labels: last7Dates.map(d => d.slice(5)),
  datasets: [{
    label: 'Overdue Tasks',
    data: overduePerDay,
    backgroundColor: 'rgba(255, 87, 34, 0.2)',
    borderColor: 'rgba(255, 87, 34, 1)',
    borderWidth: 2,
    tension: 0.3,
    fill: true,
    type: 'line'
  }]
};

// Remove all individual new Chart(...) calls for each chart.
// Instead, render all charts using chartConfigs:
const chartCanvasMap = {
  mood: moodCtx,
  hours: hoursCtx,
  'task-progress': taskCtx,
  'tasks-added': tasksAddedCtx, // FIX: use 'tasks-added' to match data-graph and chartConfigs
  'tasks-completed': tasksCompletedCtx,
  category: categoryCtx,
  priority: priorityCtx,
  overdue: overdueCtx
};
// DEBUG: Add error handling for chart rendering
window.onload = function() {
  // Modal logic and chart rendering
  Array.from(document.querySelectorAll('.feature-card')).forEach(card => {
    card.onclick = function() {
      const graph = card.getAttribute('data-graph');
      if (!graph) return;
      modal.style.display = 'flex';
      modalTitle.textContent = card.querySelector('h3').textContent;
      modalExplanation.textContent = graphExplanations[graph] || '';
      if (modalChartInstance) modalChartInstance.destroy();
      modalChartInstance = new Chart(modalChart, chartConfigs[graph]);
    };
  });
  if (closeModal) closeModal.onclick = () => {
    modal.style.display = 'none';
    if (modalChartInstance) modalChartInstance.destroy();
  };
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      if (modalChartInstance) modalChartInstance.destroy();
    }
  };
  // Render all dashboard charts
  try {
    for (const key in chartConfigs) {
      if (chartCanvasMap[key]) {
        new Chart(chartCanvasMap[key], chartConfigs[key]);
      }
    }
  } catch (e) {
    alert('Chart rendering error: ' + e.message);
  }
};

// === Interactive Tutorial Section ===
const tutorialSteps = [
  "Welcome! This dashboard shows your mood and task progress. Click 'Next' to see how it works.",
  "For instance, the <b>Mood Over Time</b> graph displays your mood for each day, based on your <a href='checkin.html' style='color:#0066cc;text-decoration:underline;'>Daily Check-In</a> entries. Or, the <b>Task Completion Trend</b> graph shows how many tasks you've completed over time, based on your <a href='tasks.html' style='color:#00994c;text-decoration:underline;'>Task Board</a>.",
  "Tip: You can hide or remove a particular category or value from a graph (such as a category in the pie chart) by clicking its label in the graph legend.",
  "To get the most out of your dashboard, regularly log your mood and study reflections in <a href='checkin.html' style='color:#0066cc;text-decoration:underline;'>Daily Check-In</a> and update your progress in the <a href='tasks.html' style='color:#00994c;text-decoration:underline;'>Task Board</a>.",
  "Ready to try? Click <a href='checkin.html' style='color:#0066cc;text-decoration:underline;'>Daily Check-In</a> to log your mood, or <a href='tasks.html' style='color:#00994c;text-decoration:underline;'>Task Board</a> to add and complete tasks!"
];
let tutorialIdx = 0;
const tutorialStep = document.getElementById('tutorialStep');
const tutorialPrev = document.getElementById('tutorialPrev');
const tutorialNext = document.getElementById('tutorialNext');

function updateTutorial() {
  tutorialStep.innerHTML = tutorialSteps[tutorialIdx];
  tutorialPrev.style.display = tutorialIdx === 0 ? 'none' : '';
  tutorialNext.textContent = tutorialIdx === tutorialSteps.length-1 ? 'Finish' : 'Next';
}
if (tutorialPrev && tutorialNext && tutorialStep) {
  tutorialPrev.onclick = function() {
    if (tutorialIdx > 0) {
      tutorialIdx--;
      updateTutorial();
    }
  };
  tutorialNext.onclick = function() {
    if (tutorialIdx < tutorialSteps.length-1) {
      tutorialIdx++;
      updateTutorial();
    } else {
      // On finish, reset tutorial
      tutorialIdx = 0;
      updateTutorial();
    }
  };
  updateTutorial();
}

// === Modal logic for expanding graphs ===
const modal = document.getElementById('graphModal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalExplanation = document.getElementById('modalExplanation');
const modalChart = document.getElementById('modalChart');
let modalChartInstance = null;

const graphExplanations = {
  mood: 'Tracks your daily mood from check-ins. Helps you spot trends in your wellbeing.',
  hours: 'Shows how many hours you studied each day, based on your daily check-ins.',
  'task-progress': 'Visualizes your completed vs. active tasks to track your overall progress.',
  'tasks-added': 'See how many new tasks you add each day. Useful for planning and workload awareness.',
  'tasks-completed': 'Shows how many tasks you complete each day. Helps you measure productivity.',
  category: 'Displays the proportion of your tasks in each category. Reveals your focus areas.',
  priority: 'Shows how many tasks you have at each priority level (High, Medium, Low).',
  overdue: 'Tracks the number of overdue tasks each day. Helps you stay on top of deadlines.'
};

const chartConfigs = {
  mood: {
    type: 'line',
    data: moodData,
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { suggestedMin: 1, suggestedMax: 5, ticks: { stepSize: 1 } } }
    }
  },
  hours: {
    type: 'bar',
    data: hoursData,
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  },
  'task-progress': {
    type: 'doughnut',
    data: taskProgressData,
    options: {
      responsive: true,
      plugins: { legend: { display: true } }
    }
  },
  'tasks-added': {
    type: 'bar',
    data: tasksAddedData,
    options: {
      responsive: true,
      plugins: { legend: { display: false }, title: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          suggestedMax: 10 // Set max y-axis value to 10 for better visibility
        }
      }
    }
  },
  'tasks-completed': {
    type: 'line',
    data: tasksCompletedData,
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  },
  category: {
    type: 'pie',
    data: categoryData,
    options: {
      responsive: true,
      plugins: { legend: { display: true } }
    }
  },
  priority: {
    type: 'pie',
    data: priorityData,
    options: {
      responsive: true,
      plugins: { legend: { display: true } }
    }
  },
  overdue: {
    type: 'line',
    data: overdueData,
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  }
};

// === Navigation Arrows for Dashboard Page ===
document.addEventListener('DOMContentLoaded', function() {
  // Remove any duplicate arrows in <main>
  var mainArrows = document.querySelectorAll('main .page-nav-arrow');
  mainArrows.forEach(function(btn) { btn.remove(); });

  // Setup navigation for the two arrows at the top of <body>
  var prevBtn = document.getElementById('prevPageBtn');
  var nextBtn = document.getElementById('nextPageBtn');
  if (prevBtn) {
    prevBtn.style.display = 'flex';
    prevBtn.disabled = false;
    prevBtn.tabIndex = 0;
    prevBtn.setAttribute('aria-label', 'Go to Task Board');
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'tasks.html';
    });
    prevBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = 'tasks.html';
      }
    });
  }
  if (nextBtn) {
    nextBtn.style.display = 'flex';
    nextBtn.disabled = false;
    nextBtn.tabIndex = 0;
    nextBtn.setAttribute('aria-label', 'Go to Settings');
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'settings.html';
    });
    nextBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = 'settings.html';
      }
    });
  }
});

// === Tasks Due Overview Logic ===
function getTasksDueGroups(tasks) {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay()));
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const dueToday = [];
  const dueWeek = [];
  const dueMonth = [];
  const dueLater = [];
  tasks.forEach(task => {
    if (!task.dueDate) return;
    const due = new Date(task.dueDate);
    if (due >= startOfToday && due < endOfToday) {
      dueToday.push(task);
    } else if (due >= endOfToday && due < endOfWeek) {
      dueWeek.push(task);
    } else if (due >= endOfWeek && due < endOfMonth) {
      dueMonth.push(task);
    } else if (due >= endOfMonth) {
      dueLater.push(task);
    }
  });
  return { dueToday, dueWeek, dueMonth, dueLater };
}

function renderTasksDueOverview() {
  const { dueToday, dueWeek, dueMonth, dueLater } = getTasksDueGroups(tasks);
  document.getElementById('dueTodayCount').textContent = dueToday.length;
  document.getElementById('dueWeekCount').textContent = dueWeek.length;
  document.getElementById('dueMonthCount').textContent = dueMonth.length;
  document.getElementById('dueLaterCount').textContent = dueLater.length;

  // Helper to render task list for hover
  function renderTaskList(list, elemId) {
    const elem = document.getElementById(elemId);
    if (!elem) return;
    if (list.length === 0) {
      elem.innerHTML = '<em>No tasks</em>';
      return;
    }
    elem.innerHTML = '<ul style="padding-left:1.2em; margin:0;">' +
      list.map(t => `<li><strong>${t.text}</strong> <span style='color:#888;'>(Due: ${t.dueDate})</span></li>`).join('') + '</ul>';
  }
  renderTaskList(dueToday, 'dueTodayList');
  renderTaskList(dueWeek, 'dueWeekList');
  renderTaskList(dueMonth, 'dueMonthList');
  renderTaskList(dueLater, 'dueLaterList');
}

document.addEventListener('DOMContentLoaded', function() {
  renderTasksDueOverview();
  // Hover logic for advanced options
  document.querySelectorAll('.tasks-due-group').forEach(group => {
    const groupName = group.getAttribute('data-group');
    const hoverElem = group.querySelector('.tasks-due-hover');
    group.addEventListener('mouseenter', () => {
      hoverElem.style.display = 'block';
      hoverElem.style.position = 'absolute';
      hoverElem.style.background = '#fff';
      hoverElem.style.border = '1px solid #e0e0e0';
      hoverElem.style.borderRadius = '8px';
      hoverElem.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      hoverElem.style.padding = '0.7em 1.1em';
      hoverElem.style.zIndex = 1000;
      hoverElem.style.minWidth = '180px';
      hoverElem.style.marginTop = '0.5em';
      hoverElem.style.left = '50%';
      hoverElem.style.transform = 'translateX(-50%)';
      hoverElem.style.color = '#222';
    });
    group.addEventListener('mouseleave', () => {
      hoverElem.style.display = 'none';
    });
  });
});
// If tasks change, re-render
window.addEventListener('storage', function(e) {
  if (e.key === 'tasks') renderTasksDueOverview();
});

// === Tasks Due By Date Chart ===
function getTasksDueChartData(range) {
  const now = new Date();
  let start, end, labelFormat, groupBy;
  if (range === 'today') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    labelFormat = d => d.toLocaleDateString();
    groupBy = 'day';
  } else if (range === 'week') {
    const dayOfWeek = now.getDay();
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - dayOfWeek));
    labelFormat = d => d.toLocaleDateString();
    groupBy = 'day';
  } else if (range === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    labelFormat = d => d.getDate();
    groupBy = 'day';
  } else if (range === 'year') {
    start = new Date(now.getFullYear(), 0, 1);
    end = new Date(now.getFullYear() + 1, 0, 1);
    labelFormat = d => d.toLocaleString('default', { month: 'short' });
    groupBy = 'month';
  }
  // Build labels
  let labels = [];
  let date = new Date(start);
  if (groupBy === 'day') {
    while (date < end) {
      labels.push(labelFormat(new Date(date)));
      date.setDate(date.getDate() + 1);
    }
  } else if (groupBy === 'month') {
    while (date < end) {
      labels.push(labelFormat(new Date(date)));
      date.setMonth(date.getMonth() + 1);
    }
  }
  // Count tasks due on each label
  let counts = Array(labels.length).fill(0);
  tasks.forEach(t => {
    if (!t.dueDate) return;
    const due = new Date(t.dueDate);
    if (due >= start && due < end) {
      let idx;
      if (groupBy === 'day') {
        idx = Math.floor((due - start) / (1000*60*60*24));
      } else if (groupBy === 'month') {
        idx = due.getMonth();
      }
      if (idx >= 0 && idx < counts.length) counts[idx]++;
    }
  });
  return { labels, counts };
}

let tasksDueChart;
function renderTasksDueChart() {
  const range = document.getElementById('dueChartRange').value;
  const ctx = document.getElementById('tasksDueChart').getContext('2d');
  const { labels, counts } = getTasksDueChartData(range);
  if (tasksDueChart) tasksDueChart.destroy();
  tasksDueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Tasks Due',
        data: counts,
        backgroundColor: 'rgba(0, 102, 204, 0.6)',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, stepSize: 1 } }
    }
  });
}
document.addEventListener('DOMContentLoaded', function() {
  const dueChartRange = document.getElementById('dueChartRange');
  if (dueChartRange) {
    renderTasksDueChart();
    dueChartRange.addEventListener('change', renderTasksDueChart);
  }
});
window.addEventListener('storage', function(e) {
  if (e.key === 'tasks') renderTasksDueChart();
});