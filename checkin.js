// checkin.js
// Handles saving daily check-in data to localStorage

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('checkinForm');
  const cooldownDiv = document.getElementById('checkinCooldown');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  function getLastCheckin() {
    const checkins = JSON.parse(localStorage.getItem('checkins') || '[]');
    if (!checkins.length) return null;
    // Find the most recent check-in by created (datetime) or date
    return checkins.reduce((latest, entry) => {
      if (!latest) return entry;
      if (entry.created && latest.created) {
        return new Date(entry.created) > new Date(latest.created) ? entry : latest;
      }
      // fallback to date only
      return entry.date > latest.date ? entry : latest;
    }, null);
  }

  function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // next 00:00:00
    return midnight - now;
  }

  function showTimerInsteadOfButton() {
    if (!submitBtn) return;
    submitBtn.style.display = 'none';
    cooldownDiv.style.display = 'block';
    function updateTimer() {
      const ms = getTimeUntilMidnight();
      if (ms <= 0) {
        // Reset for new day
        submitBtn.style.display = '';
        cooldownDiv.textContent = '';
        cooldownDiv.style.display = '';
        submitBtn.disabled = false;
        return;
      }
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((ms % (1000 * 60)) / 1000);
      cooldownDiv.textContent = `Next daily check-in in: ${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
      setTimeout(updateTimer, 1000);
    }
    updateTimer();
  }

  function updateCooldown() {
    if (!cooldownDiv || !submitBtn) return;
    const last = getLastCheckin();
    if (!last || !last.created) {
      cooldownDiv.textContent = '';
      submitBtn.style.display = '';
      submitBtn.disabled = false;
      cooldownDiv.style.display = '';
      return;
    }
    const now = new Date();
    if (last.date === now.toISOString().split('T')[0]) {
      // Already checked in today, show timer instead of button
      showTimerInsteadOfButton();
      return;
    } else {
      cooldownDiv.textContent = '';
      submitBtn.style.display = '';
      submitBtn.disabled = false;
      cooldownDiv.style.display = '';
    }
  }

  setInterval(updateCooldown, 10000); // check every 10s for midnight reset
  updateCooldown();

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const mood = document.getElementById('mood').value;
    const reflection = document.getElementById('reflection').value;
    const hours = document.getElementById('hours').value;
    const goal = document.getElementById('goal').value;
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const created = new Date().toISOString(); // Full ISO date-time

    // Prevent double check-in for today
    const checkins = JSON.parse(localStorage.getItem('checkins') || '[]');
    if (checkins.some(entry => entry.date === date)) {
      alert('You have already submitted a check-in for today.');
      updateCooldown();
      return;
    }

    const entry = { date, created, mood, reflection, hours, goal };
    checkins.push(entry);
    localStorage.setItem('checkins', JSON.stringify(checkins));

    form.reset();
    alert('Check-in saved!');
    showTimerInsteadOfButton();
  });

  // View check-in by date
  const viewDate = document.getElementById('viewDate');
  const display = document.getElementById('checkinDisplay');
  const prevDateBtn = document.getElementById('prevDateBtn');
  const nextDateBtn = document.getElementById('nextDateBtn');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');

  function showCheckin(date) {
    if (!date) {
      display.innerHTML = '<p>Please select a date.</p>';
      return;
    }
    const checkins = JSON.parse(localStorage.getItem('checkins') || '[]');
    const entry = checkins.find(c => c.date === date);
    if (entry) {
      display.innerHTML = `
        <div class="entry-card">
          <p><strong>Mood:</strong> ${entry.mood}</p>
          <p><strong>Reflection:</strong> ${entry.reflection}</p>
          <p><strong>Study Hours:</strong> ${entry.hours}</p>
          <p><strong>Tomorrow's Goal:</strong> ${entry.goal}</p>
        </div>
      `;
    } else {
      display.innerHTML = '<p>No check-in found for this date.</p>';
    }
  }

  if (viewDate && display) {
    viewDate.addEventListener('change', function () {
      showCheckin(viewDate.value);
    });
  }

  if (prevDateBtn) {
    prevDateBtn.addEventListener('click', function () {
      let dateStr = viewDate.value;
      if (!dateStr) {
        const today = new Date();
        viewDate.value = today.toISOString().split('T')[0];
        dateStr = viewDate.value;
      }
      const d = new Date(dateStr);
      d.setDate(d.getDate() - 1);
      viewDate.value = d.toISOString().split('T')[0];
      showCheckin(viewDate.value);
    });
  }
  if (nextDateBtn) {
    nextDateBtn.addEventListener('click', function () {
      let dateStr = viewDate.value;
      if (!dateStr) {
        const today = new Date();
        viewDate.value = today.toISOString().split('T')[0];
        dateStr = viewDate.value;
      }
      const d = new Date(dateStr);
      d.setDate(d.getDate() + 1);
      viewDate.value = d.toISOString().split('T')[0];
      showCheckin(viewDate.value);
    });
  }
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', function () {
      let dateStr = viewDate.value;
      if (!dateStr) {
        const today = new Date();
        viewDate.value = today.toISOString().split('T')[0];
        dateStr = viewDate.value;
      }
      const d = new Date(dateStr);
      d.setMonth(d.getMonth() - 1);
      viewDate.value = d.toISOString().split('T')[0];
      showCheckin(viewDate.value);
    });
  }
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function () {
      let dateStr = viewDate.value;
      if (!dateStr) {
        const today = new Date();
        viewDate.value = today.toISOString().split('T')[0];
        dateStr = viewDate.value;
      }
      const d = new Date(dateStr);
      d.setMonth(d.getMonth() + 1);
      viewDate.value = d.toISOString().split('T')[0];
      showCheckin(viewDate.value);
    });
  }

  // Set date picker to today and show today's check-in on page load
  if (viewDate) {
    const today = new Date().toISOString().split('T')[0];
    viewDate.value = today;
    showCheckin(today);
  }
});
