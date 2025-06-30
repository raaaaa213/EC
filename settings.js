// Wrap everything in DOMContentLoaded to ensure it loads after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const resetBtn = document.getElementById('resetAll');
  const exportBtn = document.getElementById('exportCSV');

  // Theme selection logic
  const themeSelect = document.getElementById('themeSelect');
  function applyTheme(theme) {
    document.body.classList.remove('dark-mode', 'light-mode');
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else if (theme === 'system') {
      // Use system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.add('light-mode');
      }
    }
  }
  if (themeSelect) {
    themeSelect.value = localStorage.getItem('theme') || 'system';
    applyTheme(themeSelect.value);
    themeSelect.addEventListener('change', () => {
      localStorage.setItem('theme', themeSelect.value);
      applyTheme(themeSelect.value);
    });
    // Listen for system theme changes if system is selected
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if ((localStorage.getItem('theme') || 'system') === 'system') {
        applyTheme('system');
      }
    });
  } else {
    // Fallback for old toggle button (if present)
    const toggleBtn = document.getElementById('toggleDark');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
      });
      if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
      }
    }
  }

  // Reset all data
  resetBtn.addEventListener('click', () => {
    if (confirm('Reset all data?')) {
      localStorage.removeItem('checkins');
      localStorage.removeItem('tasks');
      location.reload();
    }
  });

  // Export check-ins to CSV
  exportBtn.addEventListener('click', () => {
    const checkins = JSON.parse(localStorage.getItem('checkins')) || [];
    if (!checkins.length) return alert('No check-in data to export.');

    const csv = ['Date,Mood,Intensity,Task,Reflection'];
    checkins.forEach(c => {
      csv.push(`${c.date},${c.mood},${c.intensity},${c.task},${c.reflection}`);
    });

    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'checkin_log.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  // Font size adjustment
  const fontSizeSelect = document.getElementById('fontSizeSelect');
  if (fontSizeSelect) {
    fontSizeSelect.value = localStorage.getItem('fontSize') || 'normal';
    fontSizeSelect.addEventListener('change', () => {
      document.body.classList.remove('font-large', 'font-xlarge');
      if (fontSizeSelect.value === 'large') document.body.classList.add('font-large');
      if (fontSizeSelect.value === 'xlarge') document.body.classList.add('font-xlarge');
      localStorage.setItem('fontSize', fontSizeSelect.value);
    });
    // Apply on load
    if (fontSizeSelect.value === 'large') document.body.classList.add('font-large');
    if (fontSizeSelect.value === 'xlarge') document.body.classList.add('font-xlarge');
  }

  // Language selection
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.value = localStorage.getItem('language') || 'en';
    languageSelect.addEventListener('change', () => {
      localStorage.setItem('language', languageSelect.value);
      location.reload();
    });
  }

  // Admin features
  const adminToggle = document.getElementById('adminToggle');
  const adminFeatures = document.getElementById('adminFeatures');
  if (adminToggle && adminFeatures) {
    adminToggle.addEventListener('change', function() {
      adminFeatures.style.display = adminToggle.checked ? '' : 'none';
      localStorage.setItem('adminMode', adminToggle.checked ? '1' : '0');
    });
    // Persist admin mode
    if (localStorage.getItem('adminMode') === '1') {
      adminToggle.checked = true;
      adminFeatures.style.display = '';
    }
  }

  // Demo check-ins for any date
  const addDemoCheckins = document.getElementById('addDemoCheckins');
  if (addDemoCheckins) {
    addDemoCheckins.onclick = function() {
      if (typeof window.insertDemoCheckins === 'function') {
        window.insertDemoCheckins();
      } else {
        alert('Demo check-in function not available.');
      }
    };
  }

  // Demo tasks for Task Board
  const addDemoTasks = document.getElementById('addDemoTasks');
  if (addDemoTasks) {
    addDemoTasks.onclick = function() {
      if (typeof window.insertDemoTasks === 'function') {
        window.insertDemoTasks();
        // Reload dashboard if on dashboard page to update charts
        if (window.location.pathname.endsWith('dashboard.html')) {
          window.location.reload();
        }
      } else {
        alert('Demo task function not available.');
      }
    };
  }

  // Admin info modal logic
  const adminInfoIcon = document.getElementById('adminInfoIcon');
  const adminInfoModal = document.getElementById('adminInfoModal');
  const closeAdminInfoModal = document.getElementById('closeAdminInfoModal');
  if (adminInfoIcon && adminInfoModal && closeAdminInfoModal) {
    adminInfoIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      adminInfoModal.style.display = 'block';
    });
    closeAdminInfoModal.addEventListener('click', function(e) {
      e.stopPropagation();
      adminInfoModal.style.display = 'none';
    });
    // Close modal when clicking outside modal content
    window.addEventListener('click', function(event) {
      if (event.target === adminInfoModal) {
        adminInfoModal.style.display = 'none';
      }
    });
  }
});

