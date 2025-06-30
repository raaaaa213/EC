// shared.js — applies theme on every page
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
});

// === Shared i18n translations for all pages ===
window.studyPlannerTranslations = {
  en: {
    dashboard: "Dashboard",
    checkin: "Daily Check-In",
    tasks: "Task Board",
    settings: "Settings",
    home: "Home"
  },
  es: {
    dashboard: "Tablero",
    checkin: "Registro Diario",
    tasks: "Tablero de Tareas",
    settings: "Configuración",
    home: "Inicio"
  },
  fr: {
    dashboard: "Tableau de bord",
    checkin: "Bilan quotidien",
    tasks: "Tableau des Tâches",
    settings: "Paramètres",
    home: "Accueil"
  },
  zh: {
    dashboard: "仪表板",
    checkin: "每日签到",
    tasks: "任务板",
    settings: "设置",
    home: "首页"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    checkin: "दैनिक चेक-इन",
    tasks: "कार्य बोर्ड",
    settings: "सेटिंग्स",
    home: "होम"
  }
};

window.applyNavTranslations = function() {
  const lang = localStorage.getItem('language') || 'en';
  const t = window.studyPlannerTranslations[lang] || window.studyPlannerTranslations['en'];
  const navLinks = document.querySelectorAll('.nav-links a');
  if (navLinks.length === 4) {
    // Home, Dashboard, Check-In, Tasks, Settings (order may vary by page)
    if (navLinks[0].href.includes('index.html')) navLinks[0].textContent = t.home;
    if (navLinks[0].href.includes('dashboard.html')) navLinks[0].textContent = t.dashboard;
    if (navLinks[0].href.includes('checkin.html')) navLinks[0].textContent = t.checkin;
    if (navLinks[0].href.includes('tasks.html')) navLinks[0].textContent = t.tasks;
    if (navLinks[0].href.includes('settings.html')) navLinks[0].textContent = t.settings;
    for (let i = 1; i < navLinks.length; i++) {
      if (navLinks[i].href.includes('index.html')) navLinks[i].textContent = t.home;
      if (navLinks[i].href.includes('dashboard.html')) navLinks[i].textContent = t.dashboard;
      if (navLinks[i].href.includes('checkin.html')) navLinks[i].textContent = t.checkin;
      if (navLinks[i].href.includes('tasks.html')) navLinks[i].textContent = t.tasks;
      if (navLinks[i].href.includes('settings.html')) navLinks[i].textContent = t.settings;
    }
  }
};

document.addEventListener('DOMContentLoaded', window.applyNavTranslations);
window.addEventListener('storage', window.applyNavTranslations);

// === Real-time Clock for Main Banner ===
function updateClock() {
  const clock = document.getElementById('realtimeClock');
  if (!clock) return;
  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  clock.textContent = `${dateStr} | ${timeStr}`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);
});

// DEMO: Insert a wide range of check-in data for the last 7 days
window.insertDemoCheckins = function() {
  const today = new Date();
  const moods = [1, 5, 2, 4, 3, 5, 1];
  const demo = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    demo.push({
      date: dateStr,
      mood: moods[i],
      reflection: `Demo reflection for ${dateStr}`,
      hours: Math.floor(Math.random()*5)+1,
      goal: `Demo goal for ${dateStr}`
    });
  }
  localStorage.setItem('checkins', JSON.stringify(demo));
  alert('Demo check-in data inserted! Refresh the dashboard to see the change.');
};

// DEMO: Insert demo tasks for the Task Board
window.insertDemoTasks = function() {
  const today = new Date();
  const demoTasks = [
    {
      text: "Finish math worksheet",
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString().split('T')[0],
      done: false,
      priority: "High",
      category: "Math",
      notes: "Algebra and geometry problems.",
      recurring: "none",
      progress: 0
    },
    {
      text: "Read science chapter",
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().split('T')[0],
      done: false,
      priority: "Medium",
      category: "Science",
      notes: "Chapter 5: Photosynthesis.",
      recurring: "none",
      progress: 20
    },
    {
      text: "Submit history essay",
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split('T')[0],
      done: false,
      priority: "High",
      category: "History",
      notes: "World War II analysis.",
      recurring: "none",
      progress: 50
    },
    {
      text: "Practice piano",
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString().split('T')[0],
      done: false,
      priority: "Low",
      category: "Music",
      notes: "15 minutes scales.",
      recurring: "daily",
      progress: 0
    },
    {
      text: "Complete coding challenge",
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5).toISOString().split('T')[0],
      done: false,
      priority: "Medium",
      category: "Computer Science",
      notes: "Arrays and loops.",
      recurring: "none",
      progress: 0
    }
  ];
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.concat(demoTasks);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  alert('Demo tasks added! Go to the Task Board to see them.');
};

