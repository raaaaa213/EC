// shared.js — applies theme on every page
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark');
    document.body.classList.remove('dark-mode');
  }
});
window.applyDarkMode = function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark');
    document.body.classList.remove('dark-mode');
  }
};
window.addEventListener('storage', window.applyDarkMode);

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

// === Shared banner translations for all pages ===
window.bannerTranslations = {
  en: {
    title: "StudyPlanner",
    subtitle: {
      index: "Your Intelligent Academic Assistant",
      checkin: "Daily Mood & Study Reflection",
      tasks: "Organise Your Study Life",
      dashboard: "Track Your Progress Visually",
      settings: "Customise Your Experience"
    }
  },
  es: {
    title: "StudyPlanner",
    subtitle: {
      index: "Tu asistente académico inteligente",
      checkin: "Reflexión diaria de ánimo y estudio",
      tasks: "Organiza tu vida de estudio",
      dashboard: "Visualiza tu progreso",
      settings: "Personaliza tu experiencia"
    }
  },
  fr: {
    title: "StudyPlanner",
    subtitle: {
      index: "Votre assistant académique intelligent",
      checkin: "Humeur quotidienne et réflexion d'étude",
      tasks: "Organisez votre vie d'étude",
      dashboard: "Suivez vos progrès visuellement",
      settings: "Personnalisez votre expérience"
    }
  },
  zh: {
    title: "StudyPlanner",
    subtitle: {
      index: "您的智能学业助手",
      checkin: "每日心情与学习反思",
      tasks: "规划你的学习生活",
      dashboard: "可视化追踪你的进步",
      settings: "自定义您的体验"
    }
  },
  hi: {
    title: "StudyPlanner",
    subtitle: {
      index: "आपका बुद्धिमान शैक्षिक सहायक",
      checkin: "दैनिक मूड और अध्ययन प्रतिबिंब",
      tasks: "अपनी अध्ययन जीवन व्यवस्थित करें",
      dashboard: "अपनी प्रगति को दृश्य रूप में ट्रैक करें",
      settings: "अपने अनुभव को अनुकूलित करें"
    }
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

window.checkinFormTranslations = {
  en: {
    reflectionLabel: "Reflection:",
    reflectionPlaceholder: "What went well? What could improve?",
    goalLabel: "Tomorrow's Goal:",
    goalPlaceholder: "e.g. Revise Biology notes",
    hoursLabel: "Study Hours:",
    submit: "Submit Entry"
  },
  es: {
    reflectionLabel: "Reflexión:",
    reflectionPlaceholder: "¿Qué salió bien? ¿Qué podría mejorar?",
    goalLabel: "Meta para mañana:",
    goalPlaceholder: "p.ej. Repasar apuntes de Biología",
    hoursLabel: "Horas de estudio:",
    submit: "Enviar entrada"
  },
  fr: {
    reflectionLabel: "Réflexion:",
    reflectionPlaceholder: "Qu'est-ce qui s'est bien passé ? Que peut-on améliorer ?",
    goalLabel: "Objectif pour demain:",
    goalPlaceholder: "par ex. Réviser les notes de biologie",
    hoursLabel: "Heures d'étude:",
    submit: "Soumettre l'entrée"
  },
  zh: {
    reflectionLabel: "反思：",
    reflectionPlaceholder: "哪些做得好？哪些可以改进？",
    goalLabel: "明日目标：",
    goalPlaceholder: "例如：复习生物笔记",
    hoursLabel: "学习时长：",
    submit: "提交记录"
  },
  hi: {
    reflectionLabel: "प्रतिबिंब:",
    reflectionPlaceholder: "क्या अच्छा हुआ? क्या सुधार हो सकता है?",
    goalLabel: "कल का लक्ष्य:",
    goalPlaceholder: "जैसे: बायोलॉजी नोट्स दोहराएं",
    hoursLabel: "अध्ययन घंटे:",
    submit: "प्रविष्टि सबमिट करें"
  }
};

window.applyCheckinFormTranslations = function() {
  if (!(document.body.dataset.page === 'checkin')) return;
  const lang = localStorage.getItem('language') || 'en';
  const t = window.checkinFormTranslations[lang] || window.checkinFormTranslations['en'];
  const reflectionLabel = document.querySelector('label[for="reflection"]');
  const reflectionInput = document.getElementById('reflection');
  const goalLabel = document.querySelector('label[for="goal"]');
  const goalInput = document.getElementById('goal');
  const hoursLabel = document.querySelector('label[for="hours"]');
  const submitBtn = document.querySelector('button[type="submit"]');
  if(reflectionLabel) reflectionLabel.textContent = t.reflectionLabel;
  if(reflectionInput) reflectionInput.placeholder = t.reflectionPlaceholder;
  if(goalLabel) goalLabel.textContent = t.goalLabel;
  if(goalInput) goalInput.placeholder = t.goalPlaceholder;
  if(hoursLabel) hoursLabel.textContent = t.hoursLabel;
  if(submitBtn) submitBtn.textContent = t.submit;
};
document.addEventListener('DOMContentLoaded', window.applyCheckinFormTranslations);
window.addEventListener('storage', function(e) { if(e.key === 'language') window.applyCheckinFormTranslations(); });

window.settingsTranslations = {
  en: {
    appearance: "Appearance",
    theme: "Theme:",
    fontSize: "Font Size:",
    language: "Language",
    chooseLanguage: "Choose Language:",
    data: "Data",
    export: "Export Check-ins to CSV",
    reset: "Reset All Data",
    enableAdmin: "Enable Administrator Mode",
    admin: "Administrator",
    themeOptions: ["Light", "Dark"],
    fontSizeOptions: ["Normal", "Large", "Extra Large"],
    welcome: "Adjust preferences, reset data, and control appearance.",
    addDemoCheckins: "Add Demo Check-Ins",
    addDemoTasks: "Add Demo Tasks"
  },
  es: {
    appearance: "Apariencia",
    theme: "Tema:",
    fontSize: "Tamaño de fuente:",
    language: "Idioma",
    chooseLanguage: "Elige idioma:",
    data: "Datos",
    export: "Exportar registros a CSV",
    reset: "Restablecer todos los datos",
    enableAdmin: "Habilitar modo administrador",
    admin: "Administrador",
    themeOptions: ["Claro", "Oscuro"],
    fontSizeOptions: ["Normal", "Grande", "Extra grande"],
    welcome: "Ajusta las preferencias, restablece los datos y controla la apariencia.",
    addDemoCheckins: "Agregar registros de demostración",
    addDemoTasks: "Agregar tareas de demostración"
  },
  fr: {
    appearance: "Apparence",
    theme: "Thème:",
    fontSize: "Taille de police:",
    language: "Langue",
    chooseLanguage: "Choisir la langue:",
    data: "Données",
    export: "Exporter les bilans en CSV",
    reset: "Réinitialiser toutes les données",
    enableAdmin: "Activer le mode administrateur",
    admin: "Administrateur",
    themeOptions: ["Clair", "Sombre"],
    fontSizeOptions: ["Normal", "Grand", "Très grand"],
    welcome: "Ajustez les préférences, réinitialisez les données et contrôlez l'apparence.",
    addDemoCheckins: "Ajouter des bilans de démonstration",
    addDemoTasks: "Ajouter des tâches de démonstration"
  },
  zh: {
    appearance: "外观",
    theme: "主题：",
    fontSize: "字体大小：",
    language: "语言",
    chooseLanguage: "选择语言：",
    data: "数据",
    export: "导出签到为CSV",
    reset: "重置所有数据",
    enableAdmin: "启用管理员模式",
    admin: "管理员",
    themeOptions: ["浅色", "深色"],
    fontSizeOptions: ["正常", "大", "特大"],
    welcome: "调整偏好设置，重置数据并控制外观。",
    addDemoCheckins: "添加演示签到",
    addDemoTasks: "添加演示任务"
  },
  hi: {
    appearance: "रूप",
    theme: "थीम:",
    fontSize: "फ़ॉन्ट आकार:",
    language: "भाषा",
    chooseLanguage: "भाषा चुनें:",
    data: "डेटा",
    export: "चेक-इन को CSV में निर्यात करें",
    reset: "सभी डेटा रीसेट करें",
    enableAdmin: "प्रशासक मोड सक्षम करें",
    admin: "प्रशासक",
    themeOptions: ["हल्का", "गहरा"],
    fontSizeOptions: ["सामान्य", "बड़ा", "अतिरिक्त बड़ा"],
    welcome: "वरीयताएँ समायोजित करें, डेटा रीसेट करें, और रूप नियंत्रित करें।",
    addDemoCheckins: "डेमो चेक-इन जोड़ें",
    addDemoTasks: "डेमो कार्य जोड़ें"
  }
};

window.applySettingsTranslations = function() {
  if (!(document.body.dataset.page === 'settings')) return;
  const lang = localStorage.getItem('language') || 'en';
  const t = window.settingsTranslations[lang] || window.settingsTranslations['en'];
  // Section titles
  const appearanceSection = document.querySelector('section.form-card h3');
  if(appearanceSection) appearanceSection.textContent = t.appearance;
  // Translate page title (h2)
  const settingsTitle = document.querySelector('.welcome-section h2');
  if(settingsTitle) settingsTitle.textContent = (window.studyPlannerTranslations[lang] && window.studyPlannerTranslations[lang].settings) || 'Settings';
  // Theme label
  const themeLabel = document.querySelector('label[for="themeSelect"]');
  if(themeLabel) themeLabel.textContent = t.theme;
  // Font size label
  const fontSizeLabel = document.querySelector('label[for="fontSizeSelect"]');
  if(fontSizeLabel) fontSizeLabel.textContent = t.fontSize;
  // Welcome/description
  const welcomeDesc = document.querySelector('.welcome-section p');
  if(welcomeDesc) welcomeDesc.textContent = t.welcome;
  // Language section
  const languageSection = document.querySelectorAll('section.form-card h3')[1];
  if(languageSection) languageSection.textContent = t.language;
  const chooseLangLabel = document.querySelector('label[for="languageSelect"]');
  if(chooseLangLabel) chooseLangLabel.textContent = t.chooseLanguage;
  // Data section
  const dataSection = document.querySelectorAll('section.form-card h3')[2];
  if(dataSection) dataSection.textContent = t.data;
  const exportBtn = document.querySelector('button.export-btn, button[onclick*="export"]');
  if(exportBtn) exportBtn.textContent = t.export;
  const resetBtn = document.querySelector('button.reset-btn, button[onclick*="reset"]');
  if(resetBtn) resetBtn.textContent = t.reset;
  // Admin section
  const adminSection = document.querySelectorAll('section.form-card h3')[3];
  if(adminSection) adminSection.textContent = t.admin;
  const enableAdminLabel = document.querySelector('label[for="adminMode"]');
  if(enableAdminLabel) enableAdminLabel.textContent = t.enableAdmin;
  const addDemoCheckinsBtn = document.querySelector('button#addDemoCheckins');
  if(addDemoCheckinsBtn) addDemoCheckinsBtn.textContent = t.addDemoCheckins;
  const addDemoTasksBtn = document.querySelector('button#addDemoTasks');
  if(addDemoTasksBtn) addDemoTasksBtn.textContent = t.addDemoTasks;
  // Theme options
  const themeSelect = document.getElementById('themeSelect');
  if(themeSelect && t.themeOptions) {
    Array.from(themeSelect.options).forEach((opt, idx) => {
      if(t.themeOptions[idx]) opt.textContent = t.themeOptions[idx];
    });
  }
  // Font size options
  const fontSizeSelect = document.getElementById('fontSizeSelect');
  if(fontSizeSelect && t.fontSizeOptions) {
    Array.from(fontSizeSelect.options).forEach((opt, idx) => {
      if(t.fontSizeOptions[idx]) opt.textContent = t.fontSizeOptions[idx];
    });
  }
};
document.addEventListener('DOMContentLoaded', window.applySettingsTranslations);
window.addEventListener('storage', function(e) { if(e.key === 'language') window.applySettingsTranslations(); });

window.dashboardTranslations = {
  en: {
    overviewTitle: "Dashboard Overview",
    overviewSubtitle: "Visualise your study patterns, mood trends, and task completion progress over time.",
    guideTitle: "Dashboard Guide",
    tutorialSteps: [
      "Welcome! This dashboard shows your mood and task progress. Click 'Next' to see how it works.",
      "This graph shows your mood over time. A higher mood score means a better mood!",
      "This graph shows your task completion rate. Aim for a higher percentage!",
      "You're all set! Use the Task Board and Daily Check-In for detailed tracking."
    ]
  },
  es: {
    overviewTitle: "Resumen del Tablero",
    overviewSubtitle: "Visualiza tus patrones de estudio, tendencias de ánimo y progreso en tareas a lo largo del tiempo.",
    guideTitle: "Guía del Tablero",
    tutorialSteps: [
      "¡Bienvenido! Este tablero muestra tu estado de ánimo y progreso en tareas. Haz clic en 'Siguiente' para ver cómo funciona.",
      "Este gráfico muestra tu estado de ánimo a lo largo del tiempo. ¡Un puntaje más alto significa mejor ánimo!",
      "Este gráfico muestra tu tasa de finalización de tareas. ¡Apunta a un porcentaje más alto!",
      "¡Listo! Usa el Tablero de Tareas y el Registro Diario para un seguimiento detallado."
    ]
  },
  fr: {
    overviewTitle: "Aperçu du Tableau de Bord",
    overviewSubtitle: "Visualisez vos habitudes d'étude, tendances d'humeur et progression des tâches au fil du temps.",
    guideTitle: "Guide du Tableau de Bord",
    tutorialSteps: [
      "Bienvenue ! Ce tableau de bord montre votre humeur et la progression de vos tâches. Cliquez sur 'Suivant' pour voir comment cela fonctionne.",
      "Ce graphique montre votre humeur au fil du temps. Un score plus élevé signifie une meilleure humeur !",
      "Ce graphique montre votre taux d'achèvement des tâches. Visez un pourcentage plus élevé !",
      "C'est tout ! Utilisez le Tableau des Tâches et le Bilan Quotidien pour un suivi détaillé."
    ]
  },
  zh: {
    overviewTitle: "仪表板概览",
    overviewSubtitle: "可视化你的学习模式、心情趋势和任务完成进度。",
    guideTitle: "仪表板指南",
    tutorialSteps: [
      "欢迎！此仪表板显示你的心情和任务进展。点击‘下一步’了解其工作方式。",
      "此图表显示你的心情变化。分数越高，心情越好！",
      "此图表显示你的任务完成率。目标是更高的百分比！",
      "全部完成！使用任务板和每日签到进行详细跟踪。"
    ]
  },
  hi: {
    overviewTitle: "डैशबोर्ड अवलोकन",
    overviewSubtitle: "समय के साथ अपने अध्ययन पैटर्न, मूड ट्रेंड्स और कार्य पूर्णता प्रगति को देखें।",
    guideTitle: "डैशबोर्ड गाइड",
    tutorialSteps: [
      "स्वागत है! यह डैशबोर्ड आपके मूड और कार्य प्रगति को दिखाता है। यह कैसे काम करता है देखने के लिए 'Next' पर क्लिक करें।",
      "यह ग्राफ़ समय के साथ आपके मूड को दिखाता है। उच्च स्कोर का अर्थ है बेहतर मूड!",
      "यह ग्राफ़ आपके कार्य पूर्णता दर को दिखाता है। उच्च प्रतिशत का लक्ष्य रखें!",
      "आप तैयार हैं! विस्तृत ट्रैकिंग के लिए कार्य बोर्ड और दैनिक चेक-इन का उपयोग करें।"
    ]
  }
};

window.applyDashboardTranslations = function() {
  if (!(document.body.dataset.page === 'dashboard')) return;
  const lang = localStorage.getItem('language') || 'en';
  const t = window.dashboardTranslations[lang] || window.dashboardTranslations['en'];
  const overviewTitle = document.querySelector('.welcome-section h2');
  const overviewSubtitle = document.querySelector('.welcome-section p');
  const guideTitle = document.querySelector('.tutorial-section h3');
  if(overviewTitle) overviewTitle.textContent = t.overviewTitle;
  if(overviewSubtitle) overviewSubtitle.textContent = t.overviewSubtitle;
  if(guideTitle) guideTitle.textContent = t.guideTitle;
  // Tutorial steps
  if(window.tutorialSteps && Array.isArray(window.tutorialSteps)) {
    window.tutorialSteps = t.tutorialSteps;
    if(typeof window.updateTutorialStep === 'function') window.updateTutorialStep();
  }
};
document.addEventListener('DOMContentLoaded', window.applyDashboardTranslations);
window.addEventListener('storage', function(e) { if(e.key === 'language') window.applyDashboardTranslations(); });

window.dashboardChartTranslations = {
  en: {
    charts: [
      "Mood Over Time",
      "Hours Spent Per Day",
      "Task Progress Overview",
      "Tasks Added Per Day",
      "Task Completion Trend",
      "Category Distribution",
      "Task Priority Breakdown",
      "Overdue Tasks Trend"
    ],
    legends: {
      mood: "Mood Level",
      hours: "Hours",
      progress: ["Completed", "Active"],
      completion: "Tasks Completed",
      overdue: "Overdue Tasks",
      categories: ["Math", "Science", "History", "Music", "Computer Science"],
      priority: ["High", "Medium", "Low"]
    },
    next: "Next",
    finish: "Finish"
  },
  es: {
    charts: [
      "Ánimo a lo largo del tiempo",
      "Horas estudiadas por día",
      "Resumen de progreso de tareas",
      "Tareas añadidas por día",
      "Tendencia de finalización de tareas",
      "Distribución por categoría",
      "Desglose de prioridad de tareas",
      "Tendencia de tareas atrasadas"
    ],
    legends: {
      mood: "Nivel de ánimo",
      hours: "Horas",
      progress: ["Completadas", "Activas"],
      completion: "Tareas completadas",
      overdue: "Tareas atrasadas",
      categories: ["Matemáticas", "Ciencias", "Historia", "Música", "Informática"],
      priority: ["Alta", "Media", "Baja"]
    },
    next: "Siguiente",
    finish: "Finalizar"
  },
  fr: {
    charts: [
      "Humeur au fil du temps",
      "Heures passées par jour",
      "Aperçu de la progression des tâches",
      "Tâches ajoutées par jour",
      "Tendance d'achèvement des tâches",
      "Répartition par catégorie",
      "Répartition des priorités des tâches",
      "Tendance des tâches en retard"
    ],
    legends: {
      mood: "Niveau d'humeur",
      hours: "Heures",
      progress: ["Terminées", "Actives"],
      completion: "Tâches terminées",
      overdue: "Tâches en retard",
      categories: ["Maths", "Sciences", "Histoire", "Musique", "Informatique"],
      priority: ["Haute", "Moyenne", "Basse"]
    },
    next: "Suivant",
    finish: "Terminer"
  },
  zh: {
    charts: [
      "心情变化趋势",
      "每日学习时长",
      "任务进度概览",
      "每日新增任务数",
      "任务完成趋势",
      "类别分布",
      "任务优先级分布",
      "逾期任务趋势"
    ],
    legends: {
      mood: "心情等级",
      hours: "小时",
      progress: ["已完成", "进行中"],
      completion: "已完成任务",
      overdue: "逾期任务",
      categories: ["数学", "科学", "历史", "音乐", "计算机科学"],
      priority: ["高", "中", "低"]
    },
    next: "下一步",
    finish: "完成"
  },
  hi: {
    charts: [
      "समय के साथ मूड",
      "प्रति दिन अध्ययन घंटे",
      "कार्य प्रगति अवलोकन",
      "प्रति दिन जोड़े गए कार्य",
      "कार्य पूर्णता प्रवृत्ति",
      "श्रेणी वितरण",
      "कार्य प्राथमिकता विभाजन",
      "अतिदेय कार्य प्रवृत्ति"
    ],
    legends: {
      mood: "मूड स्तर",
      hours: "घंटे",
      progress: ["पूर्ण", "सक्रिय"],
      completion: "पूर्ण कार्य",
      overdue: "अतिदेय कार्य",
      categories: ["गणित", "विज्ञान", "इतिहास", "संगीत", "कंप्यूटर विज्ञान"],
      priority: ["उच्च", "मध्यम", "निम्न"]
    },
    next: "अगला",
    finish: "समाप्त"
  }
};

window.applyDashboardChartTranslations = function() {
  if (!(document.body.dataset.page === 'dashboard')) return;
  const lang = localStorage.getItem('language') || 'en';
  const t = window.dashboardChartTranslations[lang] || window.dashboardChartTranslations['en'];
  // Chart titles
  const chartTitles = document.querySelectorAll('.feature-card h3');
  chartTitles.forEach((el, idx) => { if(t.charts[idx]) el.textContent = t.charts[idx]; });
  // Next/Finish button
  const tutorialNextBtn = document.getElementById('tutorialNext');
  if(tutorialNextBtn) {
    const currentStep = window.currentStep || 0;
    tutorialNextBtn.textContent = (currentStep === (window.tutorialSteps?.length||4)-1) ? t.finish : t.next;
  }
  // Tutorial steps (handled by previous translation function)
  // Chart legends/labels: update via chart.js if charts are initialized globally
  if(window.updateDashboardChartsWithTranslations) window.updateDashboardChartsWithTranslations(t.legends);
};
document.addEventListener('DOMContentLoaded', window.applyDashboardChartTranslations);
window.addEventListener('storage', function(e) { if(e.key === 'language') window.applyDashboardChartTranslations(); });

window.tasksTranslations = {
  en: {
    search: "Search tasks...",
    sortBy: "Sort by:",
    sortOptions: [
      "Date Enlisted (Newest)",
      "Date Enlisted (Oldest)",
      "Priority (High to Low)",
      "Priority (Low to High)",
      "Days Left (Soonest)",
      "Days Left (Furthest)",
      "Name (A-Z)",
      "Name (Z-A)"
    ],
    filters: ["All", "Completed", "Due Today", "Due This Week", "Overdue", "Active"],
    selectSubject: "Select Subject",
    subjects: ["Maths", "Physics", "Chemistry", "Biology", "Business Studies", "Legal Studies", "English", "History", "Geography", "Economics", "Other..."],
    recurring: "Recurring:",
    recurringOptions: ["None", "Daily", "Weekly", "Monthly"],
    progress: "Progress:",
    priorityLabel: "Priority:",
    priorityOptions: ["Low Priority", "Medium Priority", "High Priority"]
  },
  es: {
    search: "Buscar tareas...",
    sortBy: "Ordenar por:",
    sortOptions: [
      "Fecha de registro (más reciente)",
      "Fecha de registro (más antigua)",
      "Prioridad (alta a baja)",
      "Prioridad (baja a alta)",
      "Días restantes (más próximos)",
      "Días restantes (más lejanos)",
      "Nombre (A-Z)",
      "Nombre (Z-A)"
    ],
    filters: ["Todas", "Completadas", "Para hoy", "Esta semana", "Atrasadas", "Activas"],
    selectSubject: "Seleccionar materia",
    subjects: ["Matemáticas", "Física", "Química", "Biología", "Estudios empresariales", "Estudios legales", "Inglés", "Historia", "Geografía", "Economía", "Otro..."],
    recurring: "Recurrente:",
    recurringOptions: ["Ninguno", "Diario", "Semanal", "Mensual"],
    progress: "Progreso:",
    priorityLabel: "Prioridad:",
    priorityOptions: ["Prioridad baja", "Prioridad media", "Prioridad alta"]
  },
  fr: {
    search: "Rechercher des tâches...",
    sortBy: "Trier par:",
    sortOptions: [
      "Date d'ajout (plus récent)",
      "Date d'ajout (plus ancien)",
      "Priorité (haute à basse)",
      "Priorité (basse à haute)",
      "Jours restants (plus proche)",
      "Jours restants (plus éloigné)",
      "Nom (A-Z)",
      "Nom (Z-A)"
    ],
    filters: ["Toutes", "Terminées", "Pour aujourd'hui", "Cette semaine", "En retard", "Actives"],
    selectSubject: "Sélectionner la matière",
    subjects: ["Maths", "Physique", "Chimie", "Biologie", "Études commerciales", "Études juridiques", "Anglais", "Histoire", "Géographie", "Économie", "Autre..."],
    recurring: "Récurrent:",
    recurringOptions: ["Aucun", "Quotidien", "Hebdomadaire", "Mensuel"],
    progress: "Progrès:",
    priorityLabel: "Priorité:",
    priorityOptions: ["Priorité basse", "Priorité moyenne", "Priorité haute"]
  },
  zh: {
    search: "搜索任务...",
    sortBy: "排序方式：",
    sortOptions: [
      "添加日期（最新）",
      "添加日期（最早）",
      "优先级（高到低）",
      "优先级（低到高）",
      "剩余天数（最近）",
      "剩余天数（最远）",
      "名称（A-Z）",
      "名称（Z-A）"
    ],
    filters: ["全部", "已完成", "今日到期", "本周到期", "逾期", "进行中"],
    selectSubject: "选择科目",
    subjects: ["数学", "物理", "化学", "生物", "商学", "法律", "英语", "历史", "地理", "经济学", "其他..."],
    recurring: "重复：",
    recurringOptions: ["无", "每日", "每周", "每月"],
    progress: "进度：",
    priorityLabel: "优先级：",
    priorityOptions: ["低优先级", "中优先级", "高优先级"]
  },
  hi: {
    search: "कार्य खोजें...",
    sortBy: "क्रमबद्ध करें:",
    sortOptions: [
      "तिथि (नवीनतम)",
      "तिथि (सबसे पुराना)",
      "प्राथमिकता (उच्च से निम्न)",
      "प्राथमिकता (निम्न से उच्च)",
      "शेष दिन (सबसे निकट)",
      "शेष दिन (सबसे दूर)",
      "नाम (A-Z)",
      "नाम (Z-A)"
    ],
    filters: ["सभी", "पूर्ण", "आज देय", "इस सप्ताह देय", "अतिदेय", "सक्रिय"],
    selectSubject: "विषय चुनें",
    subjects: ["गणित", "भौतिकी", "रसायन", "जीवविज्ञान", "व्यापार अध्ययन", "कानूनी अध्ययन", "अंग्रेज़ी", "इतिहास", "भूगोल", "अर्थशास्त्र", "अन्य..."],
    recurring: "आवृत्ति:",
    recurringOptions: ["कोई नहीं", "दैनिक", "साप्ताहिक", "मासिक"],
    progress: "प्रगति:",
    priorityLabel: "प्राथमिकता:",
    priorityOptions: ["निम्न प्राथमिकता", "मध्यम प्राथमिकता", "उच्च प्राथमिकता"]
  }
};

window.applyTasksTranslations = function() {
  if (!(document.body.dataset.page === 'tasks')) return;
  const lang = localStorage.getItem('language') || 'en';
  const t = window.tasksTranslations[lang] || window.tasksTranslations['en'];
  // Search box
  const searchBox = document.querySelector('input[type="search"], input[placeholder*="Search"], input[placeholder*="Buscar"], input[placeholder*="Rechercher"], input[placeholder*="搜索"], input[placeholder*="कार्य"]');
  if(searchBox) searchBox.placeholder = t.search;
  // Sort by label
  const sortByLabel = Array.from(document.querySelectorAll('label')).find(l => l.textContent.trim().toLowerCase().includes('sort by') || l.textContent.trim().toLowerCase().includes('ordenar por') || l.textContent.trim().toLowerCase().includes('trier par') || l.textContent.trim().includes('排序方式') || l.textContent.trim().includes('क्रमबद्ध करें'));
  if(sortByLabel) sortByLabel.textContent = t.sortBy;
  // Sort options (force update value and text)
  const sortSelect = document.querySelector('select');
  if(sortSelect && t.sortOptions) {
    Array.from(sortSelect.options).forEach((opt, idx) => {
      if(t.sortOptions[idx]) {
        opt.textContent = t.sortOptions[idx];
        opt.value = t.sortOptions[idx];
      }
    });
  }
  // Filter buttons
  const filterBtns = document.querySelectorAll('button, .filter-btn');
  let filterIdx = 0;
  filterBtns.forEach(btn => {
    if(btn.textContent.trim() === '' || filterIdx >= t.filters.length) return;
    if(["All","Completed","Due Today","Due This Week","Overdue","Active","Todas","Completadas","Para hoy","Esta semana","Atrasadas","Activas","Toutes","Terminées","Pour aujourd'hui","Cette semaine","En retard","Actives","全部","已完成","今日到期","本周到期","逾期","进行中","सभी","पूर्ण","आज देय","इस सप्ताह देय","अतिदेय","सक्रिय"].includes(btn.textContent.trim())) {
      btn.textContent = t.filters[filterIdx++];
    }
  });
  // Select Subject dropdown
  const subjectSelect = document.getElementById('categoryInput');
  if(subjectSelect && t.subjects) {
    Array.from(subjectSelect.options).forEach((opt, idx) => {
      if(idx === 0) {
        opt.textContent = t.selectSubject;
        opt.value = t.selectSubject;
      } else if(t.subjects[idx-1]) {
        opt.textContent = t.subjects[idx-1];
        opt.value = t.subjects[idx-1];
      }
    });
  }
  // Recurring label and options
  const recurringLabel = Array.from(document.querySelectorAll('label')).find(l => l.textContent.trim().toLowerCase().includes('recurring') || l.textContent.trim().toLowerCase().includes('recurrente') || l.textContent.trim().toLowerCase().includes('récurrent') || l.textContent.trim().includes('重复') || l.textContent.trim().includes('आवृत्ति'));
  if(recurringLabel) recurringLabel.textContent = t.recurring;
  const recurringSelect = document.querySelector('select[name="recurring"], #recurringInput');
  if(recurringSelect && t.recurringOptions) {
    Array.from(recurringSelect.options).forEach((opt, idx) => {
      if(t.recurringOptions[idx]) opt.textContent = t.recurringOptions[idx];
    });
  }
  // Priority label and options
  const priorityLabel = Array.from(document.querySelectorAll('label')).find(l => l.textContent.trim().toLowerCase().includes('priority') || l.textContent.trim().toLowerCase().includes('prioridad') || l.textContent.trim().toLowerCase().includes('priorité') || l.textContent.trim().includes('优先级') || l.textContent.trim().includes('प्राथमिकता'));
  if(priorityLabel) priorityLabel.textContent = t.priorityLabel;
  const prioritySelect = document.getElementById('priorityInput');
  if(prioritySelect && t.priorityOptions) {
    Array.from(prioritySelect.options).forEach((opt, idx) => {
      if(t.priorityOptions[idx]) opt.textContent = t.priorityOptions[idx];
    });
  }
  // Progress label
  const progressLabel = Array.from(document.querySelectorAll('label')).find(l => l.textContent.trim().toLowerCase().includes('progress') || l.textContent.trim().toLowerCase().includes('progreso') || l.textContent.trim().toLowerCase().includes('progrès') || l.textContent.trim().includes('进度') || l.textContent.trim().includes('प्रगति'));
  if(progressLabel) progressLabel.textContent = t.progress;
};

window.checkinViewTranslations = {
  en: {
    viewTitle: "View Past Check-In",
    viewSubtitle: "Toggle and view check-ins for any date or year.",
    mood: "Mood:",
    reflection: "Reflection:",
    hours: "Study Hours:",
    goal: "Tomorrow's Goal:",
    notFound: "No check-in found for this date."
  },
  es: {
    viewTitle: "Ver registro anterior",
    viewSubtitle: "Alterna y visualiza registros para cualquier fecha o año.",
    mood: "Ánimo:",
    reflection: "Reflexión:",
    hours: "Horas de estudio:",
    goal: "Meta para mañana:",
    notFound: "No se encontró registro para esta fecha."
  },
  fr: {
    viewTitle: "Voir les bilans précédents",
    viewSubtitle: "Afficher les bilans pour n'importe quelle date ou année.",
    mood: "Humeur:",
    reflection: "Réflexion:",
    hours: "Heures d'étude:",
    goal: "Objectif pour demain:",
    notFound: "Aucun bilan trouvé pour cette date."
  },
  zh: {
    viewTitle: "查看过往签到",
    viewSubtitle: "切换并查看任意日期或年份的签到记录。",
    mood: "心情：",
    reflection: "反思：",
    hours: "学习时长：",
    goal: "明日目标：",
    notFound: "该日期没有签到记录。"
  },
  hi: {
    viewTitle: "पिछला चेक-इन देखें",
    viewSubtitle: "किसी भी तिथि या वर्ष के लिए चेक-इन देखें।",
    mood: "मूड:",
    reflection: "प्रतिबिंब:",
    hours: "अध्ययन घंटे:",
    goal: "कल का लक्ष्य:",
    notFound: "इस तिथि के लिए कोई चेक-इन नहीं मिला।"
  }
};

window.applyCheckinViewTranslations = function() {
  if (!(document.body.dataset.page === 'checkin')) return;
  const lang = localStorage.getItem('language') || 'en';
  const t = window.checkinViewTranslations[lang] || window.checkinViewTranslations['en'];
  // Title
  const viewTitle = document.querySelector('.checkin-viewer h3');
  if(viewTitle) viewTitle.textContent = t.viewTitle;
  // Subtitle
  const viewSubtitle = document.querySelector('.checkin-viewer > div');
  if(viewSubtitle && viewSubtitle.childNodes.length === 1 && viewSubtitle.childNodes[0].nodeType === 3) {
    viewSubtitle.textContent = t.viewSubtitle;
  }
  // Field labels
  const moodLabel = Array.from(document.querySelectorAll('.checkin-viewer strong')).find(e => e.textContent.trim().toLowerCase().includes('mood'));
  if(moodLabel) moodLabel.textContent = t.mood;
  const reflectionLabel = Array.from(document.querySelectorAll('.checkin-viewer strong')).find(e => e.textContent.trim().toLowerCase().includes('reflection'));
  if(reflectionLabel) reflectionLabel.textContent = t.reflection;
  const hoursLabel = Array.from(document.querySelectorAll('.checkin-viewer strong')).find(e => e.textContent.trim().toLowerCase().includes('study hours'));
  if(hoursLabel) hoursLabel.textContent = t.hours;
  const goalLabel = Array.from(document.querySelectorAll('.checkin-viewer strong')).find(e => e.textContent.trim().toLowerCase().includes("tomorrow's goal"));
  if(goalLabel) goalLabel.textContent = t.goal;
  // Not found message
  const notFound = Array.from(document.querySelectorAll('.checkin-viewer')).map(v => v.querySelector('span, div, p')).find(e => e && e.textContent && e.textContent.trim().toLowerCase().includes('no check-in'));
  if(notFound) notFound.textContent = t.notFound;
};
document.addEventListener('DOMContentLoaded', window.applyCheckinViewTranslations);
window.addEventListener('storage', function(e) { if(e.key === 'language') window.applyCheckinViewTranslations(); });

