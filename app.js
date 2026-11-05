/**
 * ChronoMaster — Study Skill | Yassmine Guizani
 * Logique Applicative Complète & Gestion d'État Interactive
 */

(function () {
  'use strict';

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const STORAGE_KEY = 'chronomaster_yassmine_v2';

  const defaultState = {
    currentProfile: 'etudiant',
    tasks: [],
    paretoFilterOnly: false,
    activeTaskId: null,
    pomodoro: {
      mode: 'focus', // 'focus' (25m), 'short' (5m), 'long' (15m)
      duration: 25 * 60,
      remaining: 25 * 60,
      isRunning: false,
      completedCycles: 0,
      totalCompletedToday: 0
    },
    smartGoal: {
      s: '',
      m: '',
      a: '',
      r: '',
      t: ''
    },
    timelineChecks: {},
    activeTab: 'all',
    isDarkMode: true
  };

  let state = { ...defaultState };
  let timerInterval = null;
  let audioCtx = null;

  // Initialize Lucide icons helper
  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // =========================================================================
  // AUDIO SYNTHESIZER (Web Audio API - 100% Reliable Offline)
  // =========================================================================
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Play a pleasant, melodic mindfulness Tibetan bell / chime
  function playChime(isCompletion = false) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = isCompletion ? [523.25, 659.25, 783.99, 1046.50] : [587.33, 880.0]; // C5, E5, G5, C6 (chord arpeggio)
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        // Gentle envelope: fast attack, slow resonant decay
        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.9);
      });
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Confetti trigger
  function fireConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6']
      });
    }
  }

  // =========================================================================
  // LOCAL STORAGE PERSISTENCE
  // =========================================================================
  function saveStateToStorage() {
    try {
      const stateToSave = {
        currentProfile: state.currentProfile,
        tasks: state.tasks,
        paretoFilterOnly: state.paretoFilterOnly,
        activeTaskId: state.activeTaskId,
        pomodoro: {
          mode: state.pomodoro.mode,
          duration: state.pomodoro.duration,
          remaining: state.pomodoro.remaining,
          completedCycles: state.pomodoro.completedCycles,
          totalCompletedToday: state.pomodoro.totalCompletedToday
        },
        smartGoal: state.smartGoal,
        timelineChecks: state.timelineChecks,
        isDarkMode: state.isDarkMode
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Error saving state to localStorage', e);
    }
  }

  function loadStateFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state = {
          ...defaultState,
          ...parsed,
          pomodoro: {
            ...defaultState.pomodoro,
            ...(parsed.pomodoro || {}),
            isRunning: false // Always start paused on load
          }
        };
        return true;
      }
    } catch (e) {
      console.warn('Error loading state from localStorage', e);
    }
    return false;
  }

  // =========================================================================
  // PROFILE SWITCHER (Module 4)
  // =========================================================================
  function switchProfile(profileKey, forceReset = false) {
    const profiles = (typeof window !== 'undefined' && window.PROFILES_DATA) ? window.PROFILES_DATA : (typeof PROFILES_DATA !== 'undefined' ? PROFILES_DATA : {});
    if (!profiles[profileKey]) return;
    const profile = profiles[profileKey];
    state.currentProfile = profileKey;

    // Load sample data for this profile if no tasks or forced
    if (forceReset || !state.tasks || state.tasks.length === 0) {
      // Deep copy sample tasks
      state.tasks = JSON.parse(JSON.stringify(profile.eisenhowerTasks));
      state.smartGoal = { ...profile.smartGoal };
      state.timelineChecks = {};
      state.activeTaskId = state.tasks[0]?.id || null;
    }

    // Update Profile Hero Section
    const badgeEl = document.getElementById('hero-profile-badge');
    const titleEl = document.getElementById('hero-profile-title');
    const descEl = document.getElementById('hero-profile-desc');
    if (badgeEl) badgeEl.innerHTML = `<span>${profile.emoji}</span> Profil Actif : ${profile.name}`;
    if (titleEl) titleEl.textContent = profile.heroTitle;
    if (descEl) descEl.textContent = profile.heroDesc;

    // Update Time-blocking texts from profile
    if (profile.timeline) {
      const matinTitle = document.getElementById('timeline-matin-title');
      const matinDesc = document.getElementById('timeline-matin-desc');
      if (matinTitle) matinTitle.textContent = profile.timeline.matin.title;
      if (matinDesc) matinDesc.textContent = profile.timeline.matin.desc;
    }

    // Update SMART Goal Inputs
    if (state.smartGoal) {
      ['s', 'm', 'a', 'r', 't'].forEach(k => {
        const el = document.getElementById(`smart-${k}`);
        if (el) el.value = state.smartGoal[k] || '';
      });
      evaluateSMARTScore();
    }

    // Update Profile Selector Buttons UI
    document.querySelectorAll('#profile-selector-container .profile-btn').forEach(btn => {
      if (btn.getAttribute('data-profile') === profileKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // If active task is not in tasks, reset active task
    if (!state.tasks.some(t => t.id === state.activeTaskId)) {
      state.activeTaskId = state.tasks[0]?.id || null;
    }

    renderAll();
    saveStateToStorage();
  }

  // =========================================================================
  // EISENHOWER MATRIX & PARETO 80/20 (Module 1)
  // =========================================================================
  function renderEisenhowerTasks() {
    const quadrants = {
      1: document.getElementById('list-q1'),
      2: document.getElementById('list-q2'),
      3: document.getElementById('list-q3'),
      4: document.getElementById('list-q4')
    };

    // Clear quadrant containers
    Object.values(quadrants).forEach(q => {
      if (q) q.innerHTML = '';
    });

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    let paretoCount = 0;
    let completedCount = 0;

    const visibleTasks = state.tasks.filter(task => {
      if (state.paretoFilterOnly) {
        return task.isPareto;
      }
      return true;
    });

    visibleTasks.forEach(task => {
      const q = task.quadrant;
      counts[q] = (counts[q] || 0) + 1;
      if (task.isPareto) paretoCount++;
      if (task.completed) completedCount++;

      const container = quadrants[q];
      if (!container) return;

      const card = createTaskCardElement(task);
      container.appendChild(card);
    });

    // Handle empty state message for quadrants
    for (let q = 1; q <= 4; q++) {
      const container = quadrants[q];
      const countEl = document.getElementById(`count-q${q}`);
      if (countEl) countEl.textContent = counts[q] || 0;

      if (container && container.children.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'text-center py-6 text-slate-500 text-xs italic border border-dashed border-slate-800 rounded-xl';
        emptyMsg.textContent = state.paretoFilterOnly 
          ? 'Aucune tâche Top 20% dans ce cadran' 
          : 'Aucune action dans ce cadran. Glissez-en une ici !';
        container.appendChild(emptyMsg);
      }
    }

    // Update KPI Header Bar
    const kpiPareto = document.getElementById('kpi-pareto-count');
    if (kpiPareto) {
      kpiPareto.textContent = `${paretoCount} clé(s) (Top 20%)`;
    }

    const totalTasks = state.tasks.length;
    const q2Count = state.tasks.filter(t => t.quadrant === 2).length;
    const q2Ratio = totalTasks > 0 ? Math.round((q2Count / totalTasks) * 100) : 0;
    const kpiQ2 = document.getElementById('kpi-q2-ratio');
    if (kpiQ2) {
      kpiQ2.textContent = `${q2Ratio}% (Objectif: >50%)`;
    }

    // Active Linked Task display
    updateLinkedTaskDisplay();
    refreshIcons();
  }

  function createTaskCardElement(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.isPareto ? 'is-pareto' : ''} ${task.completed ? 'completed' : ''}`;
    card.setAttribute('draggable', 'true');
    card.setAttribute('data-task-id', task.id);

    // Is active pomodoro task?
    const isActivePomodoro = state.activeTaskId === task.id;

    card.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-start space-x-2 flex-1">
          <button class="btn-toggle-complete mt-0.5 text-slate-400 hover:text-emerald-400 transition" title="Marquer comme fait">
            <i data-lucide="${task.completed ? 'check-circle-2' : 'circle'}" class="w-4 h-4 ${task.completed ? 'text-emerald-400' : ''}"></i>
          </button>
          <div class="flex-1">
            <div class="flex items-center gap-1.5 flex-wrap">
              ${task.isPareto ? `
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <i data-lucide="star" class="w-2.5 h-2.5 fill-amber-400"></i> Pareto 20%
                </span>
              ` : ''}
              ${isActivePomodoro ? `
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  <i data-lucide="timer" class="w-2.5 h-2.5"></i> Focus Actif
                </span>
              ` : ''}
              <span class="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <i data-lucide="clock" class="w-2.5 h-2.5"></i> ${task.pomodoros || 2} pomo(s)
              </span>
            </div>
            <p class="task-title font-medium text-xs text-white mt-1 leading-snug">
              ${escapeHtml(task.title)}
            </p>
            ${task.notes ? `<p class="text-[11px] text-slate-400 mt-1 italic">${escapeHtml(task.notes)}</p>` : ''}
          </div>
        </div>

        <!-- Task Actions Dropdown / Icons -->
        <div class="flex items-center space-x-1 shrink-0">
          <!-- Toggle Pareto Star -->
          <button class="btn-toggle-pareto p-1 rounded hover:bg-slate-850 ${task.isPareto ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'} transition" title="Basculer Top 20% Pareto">
            <i data-lucide="star" class="w-3.5 h-3.5 ${task.isPareto ? 'fill-amber-400' : ''}"></i>
          </button>

          <!-- Select for Pomodoro -->
          <button class="btn-work-pomodoro p-1 rounded hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition" title="Travailler sur cette tâche au Pomodoro">
            <i data-lucide="play" class="w-3.5 h-3.5"></i>
          </button>

          <!-- Edit & Delete -->
          <button class="btn-edit-task p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition" title="Modifier">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
          </button>
          <button class="btn-delete-task p-1 rounded hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition" title="Supprimer">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;

    // Bind event listeners on card elements
    const btnComplete = card.querySelector('.btn-toggle-complete');
    btnComplete.addEventListener('click', (e) => {
      e.stopPropagation();
      task.completed = !task.completed;
      if (task.completed) {
        fireConfetti();
        playChime(true);
      }
      renderAll();
      saveStateToStorage();
    });

    const btnPareto = card.querySelector('.btn-toggle-pareto');
    btnPareto.addEventListener('click', (e) => {
      e.stopPropagation();
      task.isPareto = !task.isPareto;
      renderAll();
      saveStateToStorage();
    });

    const btnPomodoro = card.querySelector('.btn-work-pomodoro');
    btnPomodoro.addEventListener('click', (e) => {
      e.stopPropagation();
      setActivePomodoroTask(task.id);
      // Switch to Pomodoro tab smoothly or scroll if tab is all
      if (state.activeTab === 'pomodoro') {
        // already on tab
      } else if (state.activeTab !== 'all') {
        switchTab('pomodoro');
      } else {
        const pomoSection = document.getElementById('section-pomodoro');
        if (pomoSection) pomoSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    const btnEdit = card.querySelector('.btn-edit-task');
    btnEdit.addEventListener('click', (e) => {
      e.stopPropagation();
      openTaskModal(task);
    });

    const btnDelete = card.querySelector('.btn-delete-task');
    btnDelete.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Supprimer la tâche "${task.title}" ?`)) {
        state.tasks = state.tasks.filter(t => t.id !== task.id);
        if (state.activeTaskId === task.id) {
          state.activeTaskId = state.tasks[0]?.id || null;
        }
        renderAll();
        saveStateToStorage();
      }
    });

    // Drag and Drop listeners
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    return card;
  }

  // Drag and Drop Logic
  let draggedTaskId = null;

  function handleDragStart(e) {
    draggedTaskId = this.getAttribute('data-task-id');
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', draggedTaskId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.task-list').forEach(list => {
      list.classList.remove('drag-over');
    });
  }

  function setupDragAndDropZones() {
    const dropZones = document.querySelectorAll('.task-list');
    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
        const targetQuadrant = parseInt(zone.getAttribute('data-quadrant'), 10);

        if (taskId && targetQuadrant >= 1 && targetQuadrant <= 4) {
          const task = state.tasks.find(t => t.id === taskId);
          if (task && task.quadrant !== targetQuadrant) {
            task.quadrant = targetQuadrant;
            renderAll();
            saveStateToStorage();
            playChime(false);
          }
        }
      });
    });
  }

  // =========================================================================
  // POMODORO TIMER (Module 2)
  // =========================================================================
  function setActivePomodoroTask(taskId) {
    state.activeTaskId = taskId;
    updateLinkedTaskDisplay();
    renderEisenhowerTasks();
    saveStateToStorage();
  }

  function updateLinkedTaskDisplay() {
    const activeTask = state.tasks.find(t => t.id === state.activeTaskId);
    const kpiActive = document.getElementById('kpi-active-task');
    const pomoLinkedTitle = document.getElementById('pomo-linked-task-title');
    const pomoBadge = document.getElementById('pomo-quadrant-badge');
    const btnCompleteTask = document.getElementById('btn-pomo-complete-task');

    if (activeTask) {
      if (kpiActive) kpiActive.textContent = activeTask.title;
      if (pomoLinkedTitle) pomoLinkedTitle.textContent = activeTask.title;
      if (pomoBadge) {
        pomoBadge.textContent = `Q${activeTask.quadrant}`;
        const colors = {
          1: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          2: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          3: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          4: 'bg-slate-700/40 text-slate-400 border-slate-700'
        };
        pomoBadge.className = `px-2.5 py-1 rounded-md text-xs font-bold border uppercase ${colors[activeTask.quadrant] || ''}`;
      }
      if (btnCompleteTask) {
        btnCompleteTask.disabled = activeTask.completed;
        btnCompleteTask.innerHTML = activeTask.completed 
          ? `<i data-lucide="check" class="w-4 h-4"></i><span>Tâche déjà terminée</span>`
          : `<i data-lucide="check-check" class="w-4 h-4"></i><span>Marquer Terminée</span>`;
      }
    } else {
      if (kpiActive) kpiActive.textContent = 'Aucune sélectionnée';
      if (pomoLinkedTitle) pomoLinkedTitle.textContent = 'Aucune tâche liée — Cliquez sur une tâche de la matrice';
      if (pomoBadge) pomoBadge.textContent = 'Q-';
      if (btnCompleteTask) btnCompleteTask.disabled = true;
    }
    refreshIcons();
  }

  function setPomodoroMode(mode, customSeconds = null) {
    state.pomodoro.mode = mode;
    state.pomodoro.isRunning = false;
    clearInterval(timerInterval);

    let durationSeconds = 25 * 60;
    if (customSeconds) {
      durationSeconds = customSeconds;
    } else if (mode === 'focus') {
      durationSeconds = 25 * 60;
    } else if (mode === 'short') {
      durationSeconds = 5 * 60;
    } else if (mode === 'long') {
      durationSeconds = 15 * 60;
    }

    state.pomodoro.duration = durationSeconds;
    state.pomodoro.remaining = durationSeconds;

    updatePomodoroUI();
    saveStateToStorage();
  }

  function togglePomodoro() {
    if (state.pomodoro.isRunning) {
      pausePomodoro();
    } else {
      startPomodoro();
    }
  }

  function startPomodoro() {
    getAudioContext(); // Ensure audio context is warm
    state.pomodoro.isRunning = true;
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      if (state.pomodoro.remaining > 0) {
        state.pomodoro.remaining--;
        updatePomodoroTimerDisplay();
      } else {
        completePomodoroSession();
      }
    }, 1000);

    updatePomodoroControlsUI();
  }

  function pausePomodoro() {
    state.pomodoro.isRunning = false;
    clearInterval(timerInterval);
    updatePomodoroControlsUI();
    saveStateToStorage();
  }

  function resetPomodoro() {
    pausePomodoro();
    state.pomodoro.remaining = state.pomodoro.duration;
    updatePomodoroTimerDisplay();
    saveStateToStorage();
  }

  function skipPomodoro() {
    pausePomodoro();
    // Advance to next sensible mode
    if (state.pomodoro.mode === 'focus') {
      const nextCycle = state.pomodoro.completedCycles + 1;
      if (nextCycle >= 4) {
        setPomodoroMode('long');
      } else {
        setPomodoroMode('short');
      }
    } else {
      setPomodoroMode('focus');
    }
  }

  function completePomodoroSession() {
    pausePomodoro();
    playChime(true);
    fireConfetti();

    if (state.pomodoro.mode === 'focus') {
      state.pomodoro.completedCycles = (state.pomodoro.completedCycles || 0) + 1;
      state.pomodoro.totalCompletedToday = (state.pomodoro.totalCompletedToday || 0) + 1;

      // Update KPI banner
      const kpiPomo = document.getElementById('kpi-pomodoro-count');
      if (kpiPomo) kpiPomo.textContent = `${state.pomodoro.totalCompletedToday} session(s)`;

      if (state.pomodoro.completedCycles >= 4) {
        alert('🎉 Félicitations ! 4 cycles Pomodoro complétés ! Prenez une grande pause de 15 minutes.');
        state.pomodoro.completedCycles = 0;
        setPomodoroMode('long');
      } else {
        alert('🎯 Session de Focus terminée ! Prenez 5 minutes de pause pour respirer.');
        setPomodoroMode('short');
      }
    } else {
      alert('☕ Fin de la pause ! Prêt pour un nouveau bloc de concentration pure ?');
      setPomodoroMode('focus');
    }

    renderPomodoroCycleDots();
    saveStateToStorage();
  }

  function updatePomodoroTimerDisplay() {
    const mins = Math.floor(state.pomodoro.remaining / 60);
    const secs = state.pomodoro.remaining % 60;
    const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const displayEl = document.getElementById('pomo-timer-display');
    if (displayEl) displayEl.textContent = timeFormatted;

    // Browser title sync
    document.title = state.pomodoro.isRunning 
      ? `(${timeFormatted}) ChronoMaster — Focus` 
      : 'ChronoMaster — Study Skill | Yassmine Guizani';

    // SVG Circular Ring Update
    const ringEl = document.getElementById('pomo-progress-ring');
    if (ringEl && state.pomodoro.duration > 0) {
      const circumference = 640.88; // 2 * PI * 102
      const progress = 1 - (state.pomodoro.remaining / state.pomodoro.duration);
      const offset = circumference * (1 - progress);
      ringEl.style.strokeDashoffset = offset;
    }
  }

  function updatePomodoroControlsUI() {
    const toggleBtn = document.getElementById('btn-pomo-toggle');
    const toggleIcon = document.getElementById('pomo-toggle-icon');
    const toggleText = document.getElementById('pomo-toggle-text');
    const statusSubtext = document.getElementById('pomo-status-subtext');

    if (state.pomodoro.isRunning) {
      if (toggleText) toggleText.textContent = 'Mettre en Pause';
      if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'pause');
      if (toggleBtn) {
        toggleBtn.classList.remove('from-rose-500', 'to-pink-600');
        toggleBtn.classList.add('from-amber-500', 'to-orange-600');
      }
      if (statusSubtext) {
        statusSubtext.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span><span>Concentration active</span>`;
      }
    } else {
      if (toggleText) {
        toggleText.textContent = state.pomodoro.mode === 'focus' ? 'Démarrer le Focus' : 'Démarrer la Pause';
      }
      if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'play');
      if (toggleBtn) {
        toggleBtn.classList.remove('from-amber-500', 'to-orange-600');
        toggleBtn.classList.add('from-rose-500', 'to-pink-600');
      }
      if (statusSubtext) {
        statusSubtext.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>Prêt à démarrer</span>`;
      }
    }
    refreshIcons();
  }

  function updatePomodoroUI() {
    // Mode switcher buttons
    document.querySelectorAll('#pomodoro-mode-switch .pomo-mode-btn').forEach(btn => {
      const mode = btn.getAttribute('data-mode');
      if (mode === state.pomodoro.mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Ring color depending on mode
    const ringEl = document.getElementById('pomo-progress-ring');
    const labelEl = document.getElementById('pomo-current-mode-label');
    if (ringEl && labelEl) {
      if (state.pomodoro.mode === 'focus') {
        ringEl.setAttribute('class', 'text-rose-500 transition-all duration-500 ease-linear');
        labelEl.textContent = 'Concentration Pure';
        labelEl.className = 'text-xs font-bold uppercase tracking-widest text-rose-400 mb-1';
      } else if (state.pomodoro.mode === 'short') {
        ringEl.setAttribute('class', 'text-emerald-500 transition-all duration-500 ease-linear');
        labelEl.textContent = 'Pause Courte (Détente)';
        labelEl.className = 'text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1';
      } else {
        ringEl.setAttribute('class', 'text-blue-500 transition-all duration-500 ease-linear');
        labelEl.textContent = 'Grande Pause Régénérante';
        labelEl.className = 'text-xs font-bold uppercase tracking-widest text-blue-400 mb-1';
      }
    }

    updatePomodoroTimerDisplay();
    updatePomodoroControlsUI();
    renderPomodoroCycleDots();
  }

  function renderPomodoroCycleDots() {
    const dotsContainer = document.getElementById('pomo-cycle-dots');
    const cycleText = document.getElementById('pomo-cycle-text');
    if (!dotsContainer) return;

    const completed = state.pomodoro.completedCycles || 0;
    if (cycleText) cycleText.textContent = `${completed} / 4 complétés`;

    const dots = dotsContainer.querySelectorAll('.pomo-cycle-dot');
    dots.forEach((dot, idx) => {
      if (idx < completed) {
        dot.classList.add('completed');
      } else {
        dot.classList.remove('completed');
      }
    });
  }

  // =========================================================================
  // SMART GOAL ASSISTANT (Module 3)
  // =========================================================================
  function evaluateSMARTScore() {
    const s = document.getElementById('smart-s')?.value.trim() || '';
    const m = document.getElementById('smart-m')?.value.trim() || '';
    const a = document.getElementById('smart-a')?.value.trim() || '';
    const r = document.getElementById('smart-r')?.value.trim() || '';
    const t = document.getElementById('smart-t')?.value.trim() || '';

    state.smartGoal = { s, m, a, r, t };

    let score = 0;
    const checks = {
      s: s.length >= 6,
      m: m.length >= 4 && (/\d/.test(m) || m.toLowerCase().includes('chapitre') || m.toLowerCase().includes('note')),
      a: a.length >= 5,
      r: r.length >= 5,
      t: t.length >= 4 && (/\d/.test(t) || t.toLowerCase().includes('h') || t.toLowerCase().includes('midi'))
    };

    ['s', 'm', 'a', 'r', 't'].forEach(key => {
      const icon = document.getElementById(`check-${key}`);
      if (icon) {
        if (checks[key]) {
          score++;
          icon.classList.remove('text-slate-600');
          icon.classList.add('text-emerald-400');
        } else {
          icon.classList.remove('text-emerald-400');
          icon.classList.add('text-slate-600');
        }
      }
    });

    const pill = document.getElementById('smart-score-pill');
    if (pill) pill.textContent = `${score} / 5`;

    const feedback = document.getElementById('smart-feedback-msg');
    if (feedback) {
      if (score === 5) {
        feedback.className = 'text-xs p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 flex items-center gap-2';
        feedback.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400 shrink-0"></i><span>Objectif d’une précision chirurgicale ! Prêt à transformer en action prioritaire.</span>`;
      } else if (score >= 3) {
        feedback.className = 'text-xs p-2.5 rounded-lg bg-amber-950/50 border border-amber-500/30 text-amber-200 flex items-center gap-2';
        feedback.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4 text-amber-400 shrink-0"></i><span>Bon début ! Vérifiez la mesure chiffrée (M) ou l'échéance précise (T).</span>`;
      } else {
        feedback.className = 'text-xs p-2.5 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-200 flex items-center gap-2';
        feedback.innerHTML = `<i data-lucide="x-circle" class="w-4 h-4 text-rose-400 shrink-0"></i><span>Objectif encore trop vague. Définissez exactement Quoi, Combien et Quand.</span>`;
      }
    }

    refreshIcons();
    saveStateToStorage();
  }

  function convertSmartGoalToTask() {
    const s = document.getElementById('smart-s')?.value.trim();
    const t = document.getElementById('smart-t')?.value.trim();
    if (!s) {
      alert('Veuillez renseigner au moins le champ Spécifique (S) pour créer la tâche.');
      return;
    }

    const newTask = {
      id: 'task-smart-' + Date.now(),
      title: s,
      quadrant: 2, // Priorité Q2 recommandée
      isPareto: true, // Haute valeur ajoutée
      pomodoros: 3,
      completed: false,
      notes: t ? `Échéance SMART : ${t}` : 'Généré via l’assistant SMART'
    };

    state.tasks.unshift(newTask);
    state.activeTaskId = newTask.id;

    fireConfetti();
    playChime(true);
    renderAll();
    saveStateToStorage();

    alert(`✅ Tâche créée avec succès dans la Matrice d'Eisenhower (Cadran Q2 - Zone d'Excellence & Badge Pareto) !`);
  }

  // =========================================================================
  // TIME-BLOCKING TIMELINE (Module 3 Part B)
  // =========================================================================
  function setupTimelineListeners() {
    const slots = document.querySelectorAll('.timeline-slot');
    slots.forEach(slot => {
      const slotId = slot.getAttribute('data-slot');
      const checkbox = slot.querySelector('.timeline-check');
      if (checkbox) {
        checkbox.checked = !!state.timelineChecks[slotId];
        if (checkbox.checked) slot.classList.add('checked');

        checkbox.addEventListener('change', () => {
          state.timelineChecks[slotId] = checkbox.checked;
          if (checkbox.checked) {
            slot.classList.add('checked');
            playChime(false);
          } else {
            slot.classList.remove('checked');
          }
          saveStateToStorage();
        });
      }
    });

    const btnResetTimeline = document.getElementById('btn-reset-timeline-checks');
    if (btnResetTimeline) {
      btnResetTimeline.addEventListener('click', () => {
        state.timelineChecks = {};
        slots.forEach(slot => {
          slot.classList.remove('checked');
          const cb = slot.querySelector('.timeline-check');
          if (cb) cb.checked = false;
        });
        saveStateToStorage();
      });
    }
  }

  // =========================================================================
  // TASK MODAL (Add / Edit)
  // =========================================================================
  const modalTask = document.getElementById('modal-task');
  const formTask = document.getElementById('form-task');

  function openTaskModal(taskToEdit = null, defaultQuadrant = 2) {
    if (!modalTask) return;
    const titleInput = document.getElementById('task-title-input');
    const quadrantSelect = document.getElementById('task-quadrant-select');
    const pomosInput = document.getElementById('task-pomos-input');
    const notesInput = document.getElementById('task-notes-input');
    const paretoInput = document.getElementById('task-pareto-input');
    const idInput = document.getElementById('task-id');
    const modalTitle = document.getElementById('modal-task-title');

    if (taskToEdit) {
      modalTitle.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-brand-400"></i><span>Modifier l'Action</span>`;
      idInput.value = taskToEdit.id;
      titleInput.value = taskToEdit.title;
      quadrantSelect.value = String(taskToEdit.quadrant);
      pomosInput.value = taskToEdit.pomodoros || 2;
      notesInput.value = taskToEdit.notes || '';
      paretoInput.checked = !!taskToEdit.isPareto;
    } else {
      modalTitle.innerHTML = `<i data-lucide="plus-circle" class="w-5 h-5 text-brand-400"></i><span>Ajouter une Action</span>`;
      idInput.value = '';
      titleInput.value = '';
      quadrantSelect.value = String(defaultQuadrant);
      pomosInput.value = 2;
      notesInput.value = '';
      paretoInput.checked = (defaultQuadrant === 1 || defaultQuadrant === 2);
    }

    refreshIcons();
    modalTask.classList.remove('hidden');
    setTimeout(() => titleInput.focus(), 50);
  }

  function closeTaskModal() {
    if (modalTask) modalTask.classList.add('hidden');
  }

  if (formTask) {
    formTask.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('task-id').value;
      const title = document.getElementById('task-title-input').value.trim();
      const quadrant = parseInt(document.getElementById('task-quadrant-select').value, 10);
      const pomodoros = parseInt(document.getElementById('task-pomos-input').value, 10) || 1;
      const notes = document.getElementById('task-notes-input').value.trim();
      const isPareto = document.getElementById('task-pareto-input').checked;

      if (!title) return;

      if (id) {
        // Edit existing
        const task = state.tasks.find(t => t.id === id);
        if (task) {
          task.title = title;
          task.quadrant = quadrant;
          task.pomodoros = pomodoros;
          task.notes = notes;
          task.isPareto = isPareto;
        }
      } else {
        // Create new
        const newTask = {
          id: 'task-' + Date.now(),
          title,
          quadrant,
          pomodoros,
          notes,
          isPareto,
          completed: false
        };
        state.tasks.unshift(newTask);
        state.activeTaskId = newTask.id;
      }

      closeTaskModal();
      renderAll();
      saveStateToStorage();
      playChime(false);
    });
  }

  // =========================================================================
  // TASK SELECTION MODAL FOR POMODORO
  // =========================================================================
  function openSelectTaskPicker() {
    const relevantTasks = state.tasks.filter(t => !t.completed);
    if (relevantTasks.length === 0) {
      alert('Aucune tâche active disponible.');
      return;
    }
    const taskNames = relevantTasks.map((t, idx) => `${idx + 1}. [Q${t.quadrant}] ${t.title}`).join('\n');
    const choice = prompt(`Choisissez le numéro de la tâche à lier au Pomodoro :\n\n${taskNames}`);
    const chosenIndex = parseInt(choice, 10) - 1;
    if (!isNaN(chosenIndex) && relevantTasks[chosenIndex]) {
      setActivePomodoroTask(relevantTasks[chosenIndex].id);
    }
  }

  // =========================================================================
  // NAVIGATION TABS & FILTERING
  // =========================================================================
  function switchTab(tabKey) {
    state.activeTab = tabKey;
    document.querySelectorAll('.nav-tab').forEach(tab => {
      if (tab.getAttribute('data-tab') === tabKey) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    const sections = {
      eisenhower: document.getElementById('section-eisenhower'),
      pomodoro: document.getElementById('section-pomodoro'),
      smart: document.getElementById('section-smart-and-timeblocking'),
      timeblocking: document.getElementById('section-smart-and-timeblocking')
    };

    if (tabKey === 'all') {
      Object.values(sections).forEach(s => {
        if (s) s.classList.remove('hidden');
      });
    } else {
      Object.entries(sections).forEach(([key, section]) => {
        if (!section) return;
        if (tabKey === 'smart' || tabKey === 'timeblocking') {
          if (key === 'smart') section.classList.remove('hidden');
          else section.classList.add('hidden');
        } else {
          if (key === tabKey) {
            section.classList.remove('hidden');
          } else {
            section.classList.add('hidden');
          }
        }
      });
    }
  }

  // =========================================================================
  // RENDER ALL
  // =========================================================================
  function renderAll() {
    renderEisenhowerTasks();
    updatePomodoroUI();
  }

  // =========================================================================
  // EVENT LISTENERS & INITIALIZATION
  // =========================================================================
  function bindGlobalEvents() {
    // Profile Preset Buttons
    document.querySelectorAll('#profile-selector-container .profile-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const profile = btn.getAttribute('data-profile');
        switchProfile(profile, true); // true forces loading of preset
      });
    });

    // Pareto Filter Toggle
    const paretoToggle = document.getElementById('pareto-filter-toggle');
    if (paretoToggle) {
      paretoToggle.checked = state.paretoFilterOnly;
      paretoToggle.addEventListener('change', (e) => {
        state.paretoFilterOnly = e.target.checked;
        renderEisenhowerTasks();
        saveStateToStorage();
      });
    }

    // Navigation Tabs
    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.getAttribute('data-tab'));
      });
    });

    // Quick Add Task Buttons
    const btnQuickAdd = document.getElementById('btn-quick-add-task');
    if (btnQuickAdd) btnQuickAdd.addEventListener('click', () => openTaskModal(null, 2));

    const btnMatrixAdd = document.getElementById('btn-add-task-matrix');
    if (btnMatrixAdd) btnMatrixAdd.addEventListener('click', () => openTaskModal(null, 1));

    document.querySelectorAll('.btn-quick-add-to-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = parseInt(btn.getAttribute('data-target-q'), 10);
        openTaskModal(null, q);
      });
    });

    // Stats button in Eisenhower Matrix
    const btnMatrixStats = document.getElementById('btn-show-matrix-stats');
    if (btnMatrixStats) {
      btnMatrixStats.addEventListener('click', () => {
        const total = state.tasks.length;
        if (total === 0) {
          alert('Aucune tâche enregistrée actuellement.');
          return;
        }
        const q1 = state.tasks.filter(t => t.quadrant === 1).length;
        const q2 = state.tasks.filter(t => t.quadrant === 2).length;
        const q3 = state.tasks.filter(t => t.quadrant === 3).length;
        const q4 = state.tasks.filter(t => t.quadrant === 4).length;
        const pareto = state.tasks.filter(t => t.isPareto).length;
        const completed = state.tasks.filter(t => t.completed).length;

        const pQ1 = Math.round((q1 / total) * 100);
        const pQ2 = Math.round((q2 / total) * 100);
        const pQ3 = Math.round((q3 / total) * 100);
        const pQ4 = Math.round((q4 / total) * 100);
        const pPareto = Math.round((pareto / total) * 100);
        const pCompleted = Math.round((completed / total) * 100);

        const diagnostic = pQ2 >= 40 
          ? '🌟 Excellent équilibre ! Vous accordez une part majeure à la zone de planification proactive (Q2).'
          : '⚠️ Attention : Vous passez trop de temps dans l\'urgence réactive (Q1/Q3). Transférez plus d\'énergie vers le cadran Q2.';

        alert(
          `📊 ANALYSE COMPARATIVE EISENHOWER & PARETO\n\n` +
          `• Total des actions : ${total}\n` +
          `• Tâches terminées : ${completed} (${pCompleted}%)\n` +
          `• Top 20% Pareto : ${pareto} (${pPareto}% des actions générant 80% des résultats)\n\n` +
          `RÉPARTITION PAR CADRAN :\n` +
          `  - Q1 (Faire Maintenant) : ${q1} (${pQ1}%)\n` +
          `  - Q2 (Planifier / Excellence) : ${q2} (${pQ2}%)\n` +
          `  - Q3 (Déléguer / Interruptions) : ${q3} (${pQ3}%)\n` +
          `  - Q4 (Éliminer / Distractions) : ${q4} (${pQ4}%)\n\n` +
          `${diagnostic}`
        );
      });
    }

    // Modal Close buttons
    const btnModalClose = document.getElementById('btn-modal-close');
    const btnModalCancel = document.getElementById('btn-modal-cancel');
    if (btnModalClose) btnModalClose.addEventListener('click', closeTaskModal);
    if (btnModalCancel) btnModalCancel.addEventListener('click', closeTaskModal);

    // Pomodoro Mode Switch
    document.querySelectorAll('#pomodoro-mode-switch .pomo-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        setPomodoroMode(mode);
      });
    });

    // Pomodoro Controls
    const btnPomoToggle = document.getElementById('btn-pomo-toggle');
    if (btnPomoToggle) btnPomoToggle.addEventListener('click', togglePomodoro);

    const btnPomoReset = document.getElementById('btn-pomo-reset');
    if (btnPomoReset) btnPomoReset.addEventListener('click', resetPomodoro);

    const btnPomoSkip = document.getElementById('btn-pomo-skip');
    if (btnPomoSkip) btnPomoSkip.addEventListener('click', skipPomodoro);

    const btnTestSound = document.getElementById('btn-test-sound');
    if (btnTestSound) btnTestSound.addEventListener('click', () => playChime(true));

    // Pomodoro Demo duration shortcuts (10s, 5m, 25m)
    document.querySelectorAll('.btn-demo-duration').forEach(btn => {
      btn.addEventListener('click', () => {
        const sec = parseInt(btn.getAttribute('data-sec'), 10);
        setPomodoroMode(state.pomodoro.mode, sec);
      });
    });

    // Complete active linked task from Pomodoro
    const btnCompleteLinked = document.getElementById('btn-pomo-complete-task');
    if (btnCompleteLinked) {
      btnCompleteLinked.addEventListener('click', () => {
        const active = state.tasks.find(t => t.id === state.activeTaskId);
        if (active) {
          active.completed = true;
          fireConfetti();
          playChime(true);
          renderAll();
          saveStateToStorage();
        }
      });
    }

    const btnSelectTaskModal = document.getElementById('btn-select-task-modal');
    if (btnSelectTaskModal) btnSelectTaskModal.addEventListener('click', openSelectTaskPicker);

    // SMART Goal Inputs
    ['s', 'm', 'a', 'r', 't'].forEach(k => {
      const el = document.getElementById(`smart-${k}`);
      if (el) el.addEventListener('input', evaluateSMARTScore);
    });

    const btnConvertSmart = document.getElementById('btn-convert-smart-to-task');
    if (btnConvertSmart) btnConvertSmart.addEventListener('click', convertSmartGoalToTask);

    // Pedagogical Guide Modal
    const modalGuide = document.getElementById('modal-guide');
    const openGuideBtns = [
      document.getElementById('btn-open-guide'),
      document.getElementById('btn-open-guide-mobile'),
      document.getElementById('btn-hero-learn-frog'),
      document.getElementById('btn-hero-learn-pareto')
    ];
    openGuideBtns.forEach(b => {
      if (b) b.addEventListener('click', () => {
        if (modalGuide) modalGuide.classList.remove('hidden');
      });
    });

    const closeGuideBtns = [
      document.getElementById('btn-guide-close'),
      document.getElementById('btn-guide-ok')
    ];
    closeGuideBtns.forEach(b => {
      if (b) b.addEventListener('click', () => {
        if (modalGuide) modalGuide.classList.add('hidden');
      });
    });

    // Reset button
    const btnResetData = document.getElementById('btn-reset-data');
    if (btnResetData) {
      btnResetData.addEventListener('click', () => {
        if (confirm('Voulez-vous réinitialiser toutes les données pour ce scénario ?')) {
          switchProfile(state.currentProfile, true);
        }
      });
    }

    // Print / PDF button
    const btnPrint = document.getElementById('btn-print-summary');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    // Fullscreen / Projection mode
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn('Fullscreen error:', err);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    };
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const btnFullscreenMob = document.getElementById('btn-fullscreen-mobile');
    if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);
    if (btnFullscreenMob) btnFullscreenMob.addEventListener('click', toggleFullscreen);

    // Theme toggle
    const btnTheme = document.getElementById('btn-theme-toggle');
    if (btnTheme) {
      btnTheme.addEventListener('click', () => {
        state.isDarkMode = !state.isDarkMode;
        if (state.isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        saveStateToStorage();
      });
    }

    // Keyboard Shortcuts (Space = Play/Pause Pomodoro, R = Reset Pomodoro)
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePomodoro();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetPomodoro();
      }
    });

    // Close modals on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeTaskModal();
        if (modalGuide) modalGuide.classList.add('hidden');
      }
    });
  }

  // Escape HTML helper for XSS prevention
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // BOOTSTRAP APP
  // =========================================================================
  function init() {
    const hasExistingState = loadStateFromStorage();
    if (!hasExistingState) {
      switchProfile('etudiant', true);
    } else {
      switchProfile(state.currentProfile, false);
    }

    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setupDragAndDropZones();
    setupTimelineListeners();
    bindGlobalEvents();
    renderAll();
    evaluateSMARTScore();
    refreshIcons();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
