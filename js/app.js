// Game Edukasi TKA SMPN 1 Segah - Core Engine (App Logic with Admin Panel)

document.addEventListener('DOMContentLoaded', () => {
  // Global App State
  const state = {
    student: {
      name: '',
      classGrade: 'IX-A',
      avatar: 'avatar1'
    },
    adminSettings: {
      masterPassword: 'admin123',
      requirePassword: true
    },
    participantAccounts: [
      { id: 'p1', name: 'Siswa 1', classGrade: 'IX-A', password: '123' },
      { id: 'p2', name: 'Siswa 2', classGrade: 'IX-B', password: '123' },
      { id: 'p3', name: 'Siswa 3', classGrade: 'IX-C', password: '123' }
    ],
    mode: 'game', // 'game' | 'exam'
    currentPackageId: null,
    currentPackage: null,
    currentQuestionIndex: 0,
    userAnswers: {}, // { qId: answerValue }
    flaggedQuestions: {}, // { qId: boolean }
    hintsUsed: {}, // { qId: boolean }
    fiftyFiftyUsed: {}, // { qId: boolean }
    disabledOptions: {}, // { qId: [array of disabled option indexes] }
    scorePoints: 0,
    comboStreak: 0,
    timerSeconds: 0,
    timerInterval: null,
    packagesProgress: {} // { packageId: { bestScore, completedAt } }
  };

  // Avatar Icons Mapping
  const AVATARS = {
    avatar1: { name: 'Andi Pejuang Literasi', icon: '👨‍🎓', desc: 'Fokus & Tekun' },
    avatar2: { name: 'Siti Master Numerasi', icon: '👩‍🎓', desc: 'Analis & Cerdas' },
    avatar3: { name: 'Budi Penjelajah Segah', icon: '🧑‍🌾', desc: 'Penuh Semangat' },
    avatar4: { name: 'Dewi Sang Juara', icon: '👧', desc: 'Kritis & Teliti' }
  };

  // DOM Elements
  const DOM = {
    // Views
    viewProfile: document.getElementById('view-profile'),
    viewLobby: document.getElementById('view-lobby'),
    viewQuiz: document.getElementById('view-quiz'),
    viewResult: document.getElementById('view-result'),
    viewReview: document.getElementById('view-review'),
    viewLeaderboard: document.getElementById('view-leaderboard'),
    viewAdminPanel: document.getElementById('view-admin-panel'),

    // Profile Form
    profileForm: document.getElementById('profile-form'),
    inputName: document.getElementById('student-name-input'),
    selectClass: document.getElementById('student-class-select'),
    inputPassword: document.getElementById('student-password-input'),
    pwdRequiredBadge: document.getElementById('pwd-required-badge'),
    pwdHelpText: document.getElementById('pwd-help-text'),
    avatarOptions: document.querySelectorAll('.avatar-option'),

    // Header Student Info & Buttons
    headerStudentName: document.getElementById('header-student-name'),
    headerStudentClass: document.getElementById('header-student-class'),
    headerAvatarIcon: document.getElementById('header-avatar-icon'),
    btnSoundToggle: document.getElementById('btn-sound-toggle'),
    btnChangeProfile: document.getElementById('btn-change-profile'),
    btnLeaderboard: document.getElementById('btn-leaderboard'),
    btnAdminLogin: document.getElementById('btn-admin-login'),

    // Lobby
    packageContainer: document.getElementById('package-container'),
    modeGameBtn: document.getElementById('mode-game-btn'),
    modeExamBtn: document.getElementById('mode-exam-btn'),
    modeDescription: document.getElementById('mode-description'),

    // Quiz Area
    quizPackageTitle: document.getElementById('quiz-package-title'),
    quizProgressText: document.getElementById('quiz-progress-text'),
    quizProgressBar: document.getElementById('quiz-progress-bar'),
    quizTimerDisplay: document.getElementById('quiz-timer-display'),
    quizScoreDisplay: document.getElementById('quiz-score-display'),
    comboContainer: document.getElementById('combo-container'),
    comboCount: document.getElementById('combo-count'),
    
    stimulusContainer: document.getElementById('stimulus-container'),
    questionBadge: document.getElementById('question-badge'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    
    btnPower5050: document.getElementById('btn-power-5050'),
    btnPowerHint: document.getElementById('btn-power-hint'),
    btnFlagQuestion: document.getElementById('btn-flag-question'),
    hintBox: document.getElementById('hint-box'),
    hintText: document.getElementById('hint-text'),

    btnPrevQuestion: document.getElementById('btn-prev-question'),
    btnNextQuestion: document.getElementById('btn-next-question'),
    btnSubmitQuiz: document.getElementById('btn-submit-quiz'),
    questionGridNav: document.getElementById('question-grid-nav'),

    // Result Screen
    resultStudentName: document.getElementById('result-student-name'),
    resultScorePercent: document.getElementById('result-score-percent'),
    resultScoreGrade: document.getElementById('result-score-grade'),
    resultBadge: document.getElementById('result-badge'),
    resultCorrectCount: document.getElementById('result-correct-count'),
    resultTimeSpent: document.getElementById('result-time-spent'),
    resultPoints: document.getElementById('result-points'),
    
    btnReviewAnswers: document.getElementById('btn-review-answers'),
    btnPrintCertificate: document.getElementById('btn-print-certificate'),
    btnBackToLobby: document.getElementById('btn-back-to-lobby'),

    // Review View
    reviewPackageTitle: document.getElementById('review-package-title'),
    reviewListContainer: document.getElementById('review-list-container'),
    btnReviewBackResult: document.getElementById('btn-review-back-result'),

    // Leaderboard View
    historyTableBody: document.getElementById('history-table-body'),
    btnExportExcelHistory: document.getElementById('btn-export-excel-history'),
    btnExportData: document.getElementById('btn-export-data'),
    btnClearData: document.getElementById('btn-clear-data'),
    btnLeaderboardBackLobby: document.getElementById('btn-leaderboard-back-lobby'),

    // Admin Auth Modal & Panel
    modalAdminAuth: document.getElementById('modal-admin-auth'),
    formAdminLogin: document.getElementById('form-admin-login'),
    inputAdminPassword: document.getElementById('admin-password-input'),
    btnAdminCancel: document.getElementById('btn-admin-cancel'),
    btnAdminClose: document.getElementById('btn-admin-close'),
    toggleRequirePassword: document.getElementById('toggle-require-password'),
    inputNewMasterPassword: document.getElementById('input-new-master-password'),
    btnUpdateMasterPwd: document.getElementById('btn-update-master-pwd'),
    formAddParticipant: document.getElementById('form-add-participant'),
    addPartName: document.getElementById('add-part-name'),
    addPartClass: document.getElementById('add-part-class'),
    addPartPassword: document.getElementById('add-part-password'),
    btnGenerateDefaultPasswords: document.getElementById('btn-generate-default-passwords'),
    adminParticipantTableBody: document.getElementById('admin-participant-table-body'),

    // Excel Import & Export Template
    btnDownloadTemplate: document.getElementById('btn-download-template'),
    inputImportFile: document.getElementById('input-import-file'),
    btnTriggerImport: document.getElementById('btn-trigger-import'),

    // Certificate Elements
    certStudentName: document.getElementById('cert-student-name'),
    certStudentClass: document.getElementById('cert-student-class'),
    certPackageTitle: document.getElementById('cert-package-title'),
    certScore: document.getElementById('cert-score'),
    certDate: document.getElementById('cert-date'),
    certBadgeText: document.getElementById('cert-badge-text')
  };

  // --- INITIALIZATION & STORAGE ---
  function initApp() {
    loadSavedData();
    setupEventListeners();
    updateProfilePasswordUI();
    
    if (state.student.name) {
      showView('lobby');
      renderHeaderInfo();
      renderPackages();
    } else {
      showView('profile');
    }
  }

  function loadSavedData() {
    const savedStudent = localStorage.getItem('smpn1segah_tka_student');
    if (savedStudent) {
      state.student = JSON.parse(savedStudent);
    }
    const savedProgress = localStorage.getItem('smpn1segah_tka_progress');
    if (savedProgress) {
      state.packagesProgress = JSON.parse(savedProgress);
    }
    const savedAdmin = localStorage.getItem('smpn1segah_tka_admin');
    if (savedAdmin) {
      state.adminSettings = JSON.parse(savedAdmin);
    }
    const savedAccounts = localStorage.getItem('smpn1segah_tka_accounts');
    if (savedAccounts) {
      state.participantAccounts = JSON.parse(savedAccounts);
    }
  }

  function saveStudentProfile() {
    localStorage.setItem('smpn1segah_tka_student', JSON.stringify(state.student));
  }

  function saveAdminSettings() {
    localStorage.setItem('smpn1segah_tka_admin', JSON.stringify(state.adminSettings));
  }

  function saveParticipantAccounts() {
    localStorage.setItem('smpn1segah_tka_accounts', JSON.stringify(state.participantAccounts));
  }

  function saveProgress() {
    localStorage.setItem('smpn1segah_tka_progress', JSON.stringify(state.packagesProgress));
  }

  function saveAttemptToHistory(attempt) {
    let history = JSON.parse(localStorage.getItem('smpn1segah_tka_history') || '[]');
    history.unshift(attempt);
    localStorage.setItem('smpn1segah_tka_history', JSON.stringify(history));
  }

  function updateProfilePasswordUI() {
    if (state.adminSettings.requirePassword) {
      DOM.pwdRequiredBadge.className = 'badge-status-on';
      DOM.pwdRequiredBadge.textContent = '🔒 Wajib';
      DOM.inputPassword.required = true;
      DOM.pwdHelpText.textContent = 'Hubungi Guru/Admin jika Anda belum memiliki password peserta.';
    } else {
      DOM.pwdRequiredBadge.className = 'badge-status-off';
      DOM.pwdRequiredBadge.textContent = '🔓 Opsional (Proteksi Nonaktif)';
      DOM.inputPassword.required = false;
      DOM.pwdHelpText.textContent = 'Proteksi password saat ini dinonaktifkan oleh Admin.';
    }
  }

  // --- NAVIGATION / VIEW ROUTING ---
  function showView(viewName) {
    const views = {
      profile: DOM.viewProfile,
      lobby: DOM.viewLobby,
      quiz: DOM.viewQuiz,
      result: DOM.viewResult,
      review: DOM.viewReview,
      leaderboard: DOM.viewLeaderboard,
      admin: DOM.viewAdminPanel
    };

    Object.keys(views).forEach(name => {
      if (views[name]) {
        views[name].classList.toggle('hidden', name !== viewName);
      }
    });

    window.scrollTo(0, 0);
  }

  function renderHeaderInfo() {
    DOM.headerStudentName.textContent = state.student.name || 'Siswa Segah';
    DOM.headerStudentClass.textContent = `Kelas ${state.student.classGrade}`;
    const avatarInfo = AVATARS[state.student.avatar] || AVATARS.avatar1;
    DOM.headerAvatarIcon.textContent = avatarInfo.icon;
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Sound toggle
    DOM.btnSoundToggle.addEventListener('click', () => {
      const isMuted = window.soundManager.toggleMute();
      DOM.btnSoundToggle.textContent = isMuted ? '🔇 Sound Off' : '🔊 Sound On';
    });

    // Profile Avatar Selection
    DOM.avatarOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        DOM.avatarOptions.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        state.student.avatar = opt.dataset.avatar;
        window.soundManager.playClick();
      });
    });

    // Profile Submit with Participant Password Validation
    DOM.profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = DOM.inputName.value.trim();
      const classVal = DOM.selectClass.value;
      const pwdVal = DOM.inputPassword.value.trim();

      if (!nameVal) return;

      // Validate Password if Admin Protection is ON
      if (state.adminSettings.requirePassword) {
        if (!pwdVal) {
          alert('⚠️ Silakan masukkan Password Peserta Anda.');
          return;
        }

        // Find existing student account
        const existingAccount = state.participantAccounts.find(
          acc => acc.name.toLowerCase() === nameVal.toLowerCase()
        );

        if (existingAccount) {
          if (existingAccount.password !== pwdVal) {
            alert(`❌ Password peserta untuk ${nameVal} salah!\nSilakan periksa kembali password Anda atau hubungi Admin/Guru.`);
            return;
          }
        } else {
          // Register new student account with the entered password automatically
          state.participantAccounts.push({
            id: 'p_' + Date.now(),
            name: nameVal,
            classGrade: classVal,
            password: pwdVal
          });
          saveParticipantAccounts();
        }
      }

      state.student.name = nameVal;
      state.student.classGrade = classVal;
      saveStudentProfile();
      renderHeaderInfo();
      renderPackages();
      showView('lobby');
      window.soundManager.playFanfare();
    });

    // Change Profile
    DOM.btnChangeProfile.addEventListener('click', () => {
      DOM.inputName.value = state.student.name;
      DOM.selectClass.value = state.student.classGrade;
      showView('profile');
      window.soundManager.playClick();
    });

    // Mode Selector
    DOM.modeGameBtn.addEventListener('click', () => {
      state.mode = 'game';
      DOM.modeGameBtn.classList.add('active');
      DOM.modeExamBtn.classList.remove('active');
      DOM.modeDescription.textContent = '⚡ Mode Petualangan: Skor combo streak, efek suara interaktif, dan bantuan power-up (50:50 / Hint).';
      window.soundManager.playClick();
    });

    DOM.modeExamBtn.addEventListener('click', () => {
      state.mode = 'exam';
      DOM.modeExamBtn.classList.add('active');
      DOM.modeGameBtn.classList.remove('active');
      DOM.modeDescription.textContent = '⏱️ Mode Simulasi Ujian: Timer countdown resmi, penanda ragu-ragu, tanpa bantuan power-up untuk simulasi TKA sejati.';
      window.soundManager.playClick();
    });

    // Leaderboard open/back
    DOM.btnLeaderboard.addEventListener('click', () => {
      renderLeaderboard();
      showView('leaderboard');
      window.soundManager.playClick();
    });

    DOM.btnLeaderboardBackLobby.addEventListener('click', () => {
      showView('lobby');
      window.soundManager.playClick();
    });

    // --- ADMIN PANEL CONTROLS ---
    DOM.btnAdminLogin.addEventListener('click', () => {
      DOM.inputAdminPassword.value = '';
      DOM.modalAdminAuth.classList.remove('hidden');
      DOM.inputAdminPassword.focus();
      window.soundManager.playClick();
    });

    DOM.btnAdminCancel.addEventListener('click', () => {
      DOM.modalAdminAuth.classList.add('hidden');
    });

    DOM.formAdminLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPwd = DOM.inputAdminPassword.value.trim();
      if (enteredPwd === state.adminSettings.masterPassword) {
        DOM.modalAdminAuth.classList.add('hidden');
        renderAdminPanel();
        showView('admin');
        window.soundManager.playFanfare();
      } else {
        alert('❌ Password Master Admin Salah! (Default: admin123)');
        window.soundManager.playWrong();
      }
    });

    DOM.btnAdminClose.addEventListener('click', () => {
      showView('lobby');
      window.soundManager.playClick();
    });

    DOM.toggleRequirePassword.addEventListener('change', (e) => {
      state.adminSettings.requirePassword = e.target.checked;
      saveAdminSettings();
      updateProfilePasswordUI();
      window.soundManager.playClick();
    });

    DOM.btnUpdateMasterPwd.addEventListener('click', () => {
      const newPwd = DOM.inputNewMasterPassword.value.trim();
      if (!newPwd) {
        alert('⚠️ Masukkan password master admin baru.');
        return;
      }
      state.adminSettings.masterPassword = newPwd;
      saveAdminSettings();
      DOM.inputNewMasterPassword.value = '';
      alert('✅ Password Master Admin berhasil diperbarui!');
      window.soundManager.playCorrect();
    });

    DOM.formAddParticipant.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = DOM.addPartName.value.trim();
      const cls = DOM.addPartClass.value;
      const pwd = DOM.addPartPassword.value.trim();

      if (!name || !pwd) return;

      state.participantAccounts.push({
        id: 'p_' + Date.now(),
        name: name,
        classGrade: cls,
        password: pwd
      });
      saveParticipantAccounts();
      renderAdminParticipantTable();
      DOM.addPartName.value = '';
      DOM.addPartPassword.value = '';
      alert(`✅ Akun peserta ${name} berhasil ditambahkan dengan password: ${pwd}`);
      window.soundManager.playCorrect();
    });

    DOM.btnGenerateDefaultPasswords.addEventListener('click', () => {
      const defaultPwd = prompt('Masukkan password seragam/default untuk semua peserta:', 'segah2026');
      if (defaultPwd) {
        state.participantAccounts.forEach(acc => {
          acc.password = defaultPwd;
        });
        saveParticipantAccounts();
        renderAdminParticipantTable();
        alert(`✅ Seluruh password peserta telah dirubah menjadi: ${defaultPwd}`);
      }
    });

    // Excel Template Download & Import Listeners
    if (DOM.btnDownloadTemplate) {
      DOM.btnDownloadTemplate.addEventListener('click', () => downloadExcelTemplate());
    }

    if (DOM.btnTriggerImport && DOM.inputImportFile) {
      DOM.btnTriggerImport.addEventListener('click', () => {
        DOM.inputImportFile.value = '';
        DOM.inputImportFile.click();
      });

      DOM.inputImportFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          importExcelFile(file);
        }
      });
    }

    // Quiz Buttons
    DOM.btnPrevQuestion.addEventListener('click', () => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        renderCurrentQuestion();
        window.soundManager.playClick();
      }
    });

    DOM.btnNextQuestion.addEventListener('click', () => {
      const pkg = state.currentPackage;
      if (state.currentQuestionIndex < pkg.questions.length - 1) {
        state.currentQuestionIndex++;
        renderCurrentQuestion();
        window.soundManager.playClick();
      }
    });

    DOM.btnSubmitQuiz.addEventListener('click', () => {
      confirmSubmitQuiz();
    });

    // Powerups
    DOM.btnPower5050.addEventListener('click', () => useFiftyFifty());
    DOM.btnPowerHint.addEventListener('click', () => useHint());
    DOM.btnFlagQuestion.addEventListener('click', () => toggleFlagQuestion());

    // Result Buttons
    DOM.btnReviewAnswers.addEventListener('click', () => {
      renderReviewView();
      showView('review');
      window.soundManager.playClick();
    });

    DOM.btnReviewBackResult.addEventListener('click', () => {
      showView('result');
      window.soundManager.playClick();
    });

    DOM.btnBackToLobby.addEventListener('click', () => {
      renderPackages();
      showView('lobby');
      window.soundManager.playClick();
    });

    DOM.btnPrintCertificate.addEventListener('click', () => {
      window.print();
    });

    // Export & Clear Leaderboard
    if (DOM.btnExportExcelHistory) {
      DOM.btnExportExcelHistory.addEventListener('click', () => exportLeaderboardToExcel());
    }
    DOM.btnExportData.addEventListener('click', () => exportHistoryData());
    DOM.btnClearData.addEventListener('click', () => clearHistoryData());
  }

  // --- ADMIN PANEL RENDERING ---
  function renderAdminPanel() {
    DOM.toggleRequirePassword.checked = state.adminSettings.requirePassword;
    renderAdminParticipantTable();
  }

  function downloadExcelTemplate() {
    const csvHeader = "Nama Lengkap,Kelas,Password Peserta\n";
    const sampleRows = [
      "Siswa 1,IX-A,12345",
      "Siswa 2,IX-B,12345",
      "Siswa 3,IX-C,12345",
      "Siswa 4,IX-D,12345",
      "Siswa 5,IX-E,12345",
      "Siswa 6,IX-F,12345",
      "Siswa 7,IX-G,12345"
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvHeader + sampleRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Template_Import_Peserta_TKA_SMPN1Segah.csv";
    a.click();
    URL.revokeObjectURL(url);
    window.soundManager.playCorrect();
  }

  function importExcelFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      const lines = content.split(/\r\n|\n/);
      let importedCount = 0;
      const validClasses = ['IX-A', 'IX-B', 'IX-C', 'IX-D', 'IX-E', 'IX-F', 'IX-G'];

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Auto-detect delimiter (, or ;)
        const delimiter = trimmed.includes(';') ? ';' : ',';
        const cols = trimmed.split(delimiter).map(c => c.replace(/^["']|["']$/g, '').trim());

        if (cols.length >= 1) {
          const name = cols[0];
          // Skip header row if matches "Nama" or "Nama Lengkap"
          if (index === 0 && (name.toLowerCase().includes('nama') || name.toLowerCase().includes('name'))) {
            return;
          }

          if (!name) return;

          let rawClass = (cols[1] || 'IX-A').toUpperCase();
          if (!rawClass.startsWith('IX-')) {
            rawClass = 'IX-' + rawClass.replace(/^IX/i, '');
          }
          const classGrade = validClasses.includes(rawClass) ? rawClass : 'IX-A';
          const password = cols[2] || '123';

          const existingIdx = state.participantAccounts.findIndex(a => a.name.toLowerCase() === name.toLowerCase());
          if (existingIdx >= 0) {
            state.participantAccounts[existingIdx].classGrade = classGrade;
            state.participantAccounts[existingIdx].password = password;
          } else {
            state.participantAccounts.push({
              id: 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
              name: name,
              classGrade: classGrade,
              password: password
            });
          }
          importedCount++;
        }
      });

      if (importedCount > 0) {
        saveParticipantAccounts();
        renderAdminParticipantTable();
        alert(`✅ Berhasil mengimpor/memperbarui ${importedCount} data akun siswa dari file Excel/CSV!`);
        window.soundManager.playFanfare();
      } else {
        alert('⚠️ Tidak ada data siswa valid yang ditemukan di dalam file.');
      }
    };
    reader.readAsText(file);
  }

  function renderAdminParticipantTable() {
    DOM.adminParticipantTableBody.innerHTML = '';

    if (state.participantAccounts.length === 0) {
      DOM.adminParticipantTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 16px;">Belum ada akun peserta terdaftar. Tambahkan akun peserta baru di atas.</td></tr>`;
      return;
    }

    state.participantAccounts.forEach((acc, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><strong>${acc.name}</strong></td>
        <td>${acc.classGrade}</td>
        <td>
          <input type="text" class="form-control input-edit-pwd" data-id="${acc.id}" value="${acc.password}" style="width: 140px; padding: 4px 8px; font-size: 0.88rem;">
        </td>
        <td><span class="badge-status-on">🔒 Aktif</span></td>
        <td>
          <button class="btn btn-primary btn-save-pwd" data-id="${acc.id}" style="padding: 4px 10px; font-size: 0.78rem;">Simpan</button>
          <button class="btn btn-secondary btn-del-acc" data-id="${acc.id}" style="padding: 4px 10px; font-size: 0.78rem; color: #ef4444;">Hapus</button>
        </td>
      `;

      tr.querySelector('.btn-save-pwd').addEventListener('click', () => {
        const newPwd = tr.querySelector('.input-edit-pwd').value.trim();
        if (!newPwd) {
          alert('⚠️ Password tidak boleh kosong.');
          return;
        }
        acc.password = newPwd;
        saveParticipantAccounts();
        alert(`✅ Password peserta ${acc.name} berhasil diperbarui menjadi: ${newPwd}`);
        window.soundManager.playCorrect();
      });

      tr.querySelector('.btn-del-acc').addEventListener('click', () => {
        if (confirm(`Apakah Anda yakin ingin menghapus akun peserta ${acc.name}?`)) {
          state.participantAccounts = state.participantAccounts.filter(a => a.id !== acc.id);
          saveParticipantAccounts();
          renderAdminParticipantTable();
        }
      });

      DOM.adminParticipantTableBody.appendChild(tr);
    });
  }

  // --- LOBBY & PACKAGE RENDERING ---
  function renderPackages() {
    DOM.packageContainer.innerHTML = '';
    const packages = window.QUESTION_PACKAGES || [];

    packages.forEach(pkg => {
      const prog = state.packagesProgress[pkg.id] || { bestScore: null };
      const card = document.createElement('div');
      card.className = 'package-card glass-card';
      
      const categoryClass = pkg.category.toLowerCase();
      
      card.innerHTML = `
        <div class="package-card-header">
          <span class="package-icon">${pkg.icon}</span>
          <span class="badge badge-${categoryClass}">${pkg.category} • ${pkg.level}</span>
        </div>
        <h3 class="package-title">${pkg.title}</h3>
        <p class="package-subtitle">${pkg.subtitle}</p>
        <p class="package-desc">${pkg.description}</p>
        <div class="package-meta">
          <span>⏱️ ${pkg.durationMinutes} Menit</span>
          <span>❓ ${pkg.questions.length} Soal</span>
        </div>
        <div class="package-score">
          ${prog.bestScore !== null ? `<span>Skor Terbaik: <strong>${prog.bestScore}%</strong></span>` : '<span>Belum dikerjakan</span>'}
        </div>
        <button class="btn btn-primary btn-start-pkg" data-pkgid="${pkg.id}">
          ${prog.bestScore !== null ? '⚡ Ulangi Paket' : '🚀 Mulai Paket'}
        </button>
      `;

      card.querySelector('.btn-start-pkg').addEventListener('click', () => {
        startPackageQuiz(pkg.id);
      });

      DOM.packageContainer.appendChild(card);
    });
  }

  // --- QUIZ ENGINE ---
  function startPackageQuiz(pkgId) {
    const pkg = (window.QUESTION_PACKAGES || []).find(p => p.id === pkgId);
    if (!pkg) return;

    state.currentPackageId = pkgId;
    state.currentPackage = pkg;
    state.currentQuestionIndex = 0;
    state.userAnswers = {};
    state.flaggedQuestions = {};
    state.hintsUsed = {};
    state.fiftyFiftyUsed = {};
    state.disabledOptions = {};
    state.scorePoints = 0;
    state.comboStreak = 0;
    state.timerSeconds = state.mode === 'exam' ? pkg.durationMinutes * 60 : 0;

    // Powerups visibility based on mode
    if (state.mode === 'exam') {
      DOM.btnPower5050.style.display = 'none';
      DOM.btnPowerHint.style.display = 'none';
      DOM.comboContainer.style.display = 'none';
    } else {
      DOM.btnPower5050.style.display = 'inline-flex';
      DOM.btnPowerHint.style.display = 'inline-flex';
      DOM.comboContainer.style.display = 'inline-flex';
    }

    DOM.quizPackageTitle.textContent = pkg.title;
    showView('quiz');
    renderCurrentQuestion();
    renderQuestionGridNav();
    startTimer();
    window.soundManager.playFanfare();
  }

  function startTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    updateTimerDisplay();

    state.timerInterval = setInterval(() => {
      if (state.mode === 'exam') {
        state.timerSeconds--;
        if (state.timerSeconds <= 0) {
          clearInterval(state.timerInterval);
          alert('⏱️ Waktu Ujian Telah Habis! Jawaban Anda akan dihitung secara otomatis.');
          finishQuiz();
        }
      } else {
        state.timerSeconds++;
      }
      updateTimerDisplay();
    }, 1000);
  }

  function updateTimerDisplay() {
    const mins = Math.floor(Math.abs(state.timerSeconds) / 60);
    const secs = Math.abs(state.timerSeconds) % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    DOM.quizTimerDisplay.textContent = state.mode === 'exam' ? `⏱️ Sisa Waktu: ${formatted}` : `⏱️ Waktu: ${formatted}`;
  }

  function renderCurrentQuestion() {
    const pkg = state.currentPackage;
    const q = pkg.questions[state.currentQuestionIndex];
    
    // Progress UI
    const totalQ = pkg.questions.length;
    DOM.quizProgressText.textContent = `Soal ${state.currentQuestionIndex + 1} dari ${totalQ}`;
    DOM.quizProgressBar.style.width = `${((state.currentQuestionIndex + 1) / totalQ) * 100}%`;
    DOM.quizScoreDisplay.textContent = `⭐ Poin: ${state.scorePoints}`;
    DOM.comboCount.textContent = `${state.comboStreak}x`;

    // Stimulus & Question Text
    DOM.stimulusContainer.innerHTML = q.stimulus || '';
    DOM.questionBadge.textContent = `${q.category} • ${q.level}`;
    DOM.questionText.textContent = q.question;

    // Hint Box
    DOM.hintBox.classList.add('hidden');
    if (state.hintsUsed[q.id]) {
      DOM.hintText.textContent = getHintForQuestion(q);
      DOM.hintBox.classList.remove('hidden');
    }

    // Flag Question Toggle UI
    if (state.flaggedQuestions[q.id]) {
      DOM.btnFlagQuestion.classList.add('active');
      DOM.btnFlagQuestion.textContent = '🚩 Ragu-ragu (Aktif)';
    } else {
      DOM.btnFlagQuestion.classList.remove('active');
      DOM.btnFlagQuestion.textContent = '🚩 Ragu-ragu';
    }

    // Render Options by Type
    renderOptionsForQuestion(q);

    // Prev / Next Nav Buttons
    DOM.btnPrevQuestion.disabled = state.currentQuestionIndex === 0;
    if (state.currentQuestionIndex === totalQ - 1) {
      DOM.btnNextQuestion.style.display = 'none';
      DOM.btnSubmitQuiz.style.display = 'inline-flex';
    } else {
      DOM.btnNextQuestion.style.display = 'inline-flex';
      DOM.btnSubmitQuiz.style.display = 'none';
    }

    renderQuestionGridNav();
  }

  function renderOptionsForQuestion(q) {
    DOM.optionsContainer.innerHTML = '';
    const currentAns = state.userAnswers[q.id];
    const disabledIndexes = state.disabledOptions[q.id] || [];

    if (q.type === 'single') {
      q.options.forEach((optText, index) => {
        const isSelected = currentAns === index;
        const isDisabled = disabledIndexes.includes(index);

        const btn = document.createElement('div');
        btn.className = `option-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
        btn.innerHTML = `
          <span class="option-prefix">${String.fromCharCode(65 + index)}</span>
          <span class="option-text">${optText}</span>
        `;

        if (!isDisabled) {
          btn.addEventListener('click', () => {
            selectSingleOption(q, index);
          });
        }
        DOM.optionsContainer.appendChild(btn);
      });
    } else if (q.type === 'complex') {
      const selectedAnswers = Array.isArray(currentAns) ? currentAns : [];
      
      const helper = document.createElement('p');
      helper.className = 'type-helper';
      helper.textContent = '☑️ Pilihan Ganda Kompleks: Anda dapat memilih lebih dari satu jawaban.';
      DOM.optionsContainer.appendChild(helper);

      q.options.forEach((optText, index) => {
        const isChecked = selectedAnswers.includes(index);
        const item = document.createElement('div');
        item.className = `option-item ${isChecked ? 'selected' : ''}`;
        item.innerHTML = `
          <input type="checkbox" ${isChecked ? 'checked' : ''} id="opt-chk-${index}">
          <label for="opt-chk-${index}" class="option-text">${optText}</label>
        `;
        item.addEventListener('click', (e) => {
          if (e.target.tagName !== 'INPUT') {
            const chk = item.querySelector('input');
            chk.checked = !chk.checked;
          }
          toggleComplexOption(q, index);
        });
        DOM.optionsContainer.appendChild(item);
      });
    } else if (q.type === 'table_tf') {
      const answersObj = currentAns || {};
      
      const tableWrapper = document.createElement('div');
      tableWrapper.className = 'table-tf-wrapper';
      
      let html = `
        <table class="table-tf">
          <thead>
            <tr>
              <th>Pernyataan Evaluasi</th>
              <th style="width: 90px; text-align:center;">Benar</th>
              <th style="width: 90px; text-align:center;">Salah</th>
            </tr>
          </thead>
          <tbody>
      `;

      q.statements.forEach((stmt, idx) => {
        const userChoice = answersObj[idx];
        html += `
          <tr>
            <td>${stmt.text}</td>
            <td style="text-align:center;">
              <input type="radio" name="tf_${q.id}_${idx}" value="true" ${userChoice === true ? 'checked' : ''} data-idx="${idx}">
            </td>
            <td style="text-align:center;">
              <input type="radio" name="tf_${q.id}_${idx}" value="false" ${userChoice === false ? 'checked' : ''} data-idx="${idx}">
            </td>
          </tr>
        `;
      });
      html += `</tbody></table>`;
      tableWrapper.innerHTML = html;

      tableWrapper.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          const idx = parseInt(e.target.dataset.idx);
          const val = e.target.value === 'true';
          setTableTFAnswer(q, idx, val);
        });
      });

      DOM.optionsContainer.appendChild(tableWrapper);
    }
  }

  function selectSingleOption(q, optionIndex) {
    const isFirstAnswer = state.userAnswers[q.id] === undefined;
    state.userAnswers[q.id] = optionIndex;

    // Scoring & Combo feedback in Game Mode
    if (state.mode === 'game' && isFirstAnswer) {
      if (optionIndex === q.answer) {
        state.comboStreak++;
        const comboBonus = state.comboStreak * 5;
        state.scorePoints += (10 + comboBonus);
        window.soundManager.playCorrect();
        if (state.comboStreak > 1) window.soundManager.playCombo();
      } else {
        state.comboStreak = 0;
        window.soundManager.playWrong();
      }
    } else {
      window.soundManager.playClick();
    }

    renderCurrentQuestion();
  }

  function toggleComplexOption(q, optionIndex) {
    let selected = Array.isArray(state.userAnswers[q.id]) ? [...state.userAnswers[q.id]] : [];
    const idxInArray = selected.indexOf(optionIndex);

    if (idxInArray >= 0) {
      selected.splice(idxInArray, 1);
    } else {
      selected.push(optionIndex);
    }
    state.userAnswers[q.id] = selected;
    window.soundManager.playClick();
    renderCurrentQuestion();
  }

  function setTableTFAnswer(q, statementIdx, isTrue) {
    let currentObj = state.userAnswers[q.id] || {};
    currentObj[statementIdx] = isTrue;
    state.userAnswers[q.id] = currentObj;
    window.soundManager.playClick();
    renderQuestionGridNav();
  }

  // --- POWER-UPS & TOOLS ---
  function useFiftyFifty() {
    const q = state.currentPackage.questions[state.currentQuestionIndex];
    if (q.type !== 'single') {
      alert('⚠️ Bantuan 50:50 hanya dapat digunakan pada soal Pilihan Ganda Tunggal.');
      return;
    }
    if (state.fiftyFiftyUsed[q.id]) {
      alert('ℹ️ Anda sudah menggunakan bantuan 50:50 pada soal ini.');
      return;
    }

    state.fiftyFiftyUsed[q.id] = true;
    state.scorePoints = Math.max(0, state.scorePoints - 5); // penalty 5 points

    const wrongIndexes = [];
    q.options.forEach((_, idx) => {
      if (idx !== q.answer) wrongIndexes.push(idx);
    });

    wrongIndexes.sort(() => Math.random() - 0.5);
    state.disabledOptions[q.id] = [wrongIndexes[0], wrongIndexes[1]];

    window.soundManager.playCombo();
    renderCurrentQuestion();
  }

  function useHint() {
    const q = state.currentPackage.questions[state.currentQuestionIndex];
    if (state.hintsUsed[q.id]) {
      DOM.hintBox.classList.toggle('hidden');
      return;
    }

    state.hintsUsed[q.id] = true;
    state.scorePoints = Math.max(0, state.scorePoints - 3); // penalty 3 points

    DOM.hintText.textContent = getHintForQuestion(q);
    DOM.hintBox.classList.remove('hidden');
    window.soundManager.playCombo();
  }

  function getHintForQuestion(q) {
    if (q.explanation) {
      return `💡 Petunjuk: Perhatikan fokus kata kunci "${q.category}" dan konsep ${q.level}. Bacalah stimulus secara seksama untuk menemukan data/gagasan utama.`;
    }
    return '💡 Petunjuk: Eliminasi opsi yang tidak sesuai dengan konteks stimulus teks.';
  }

  function toggleFlagQuestion() {
    const q = state.currentPackage.questions[state.currentQuestionIndex];
    state.flaggedQuestions[q.id] = !state.flaggedQuestions[q.id];
    window.soundManager.playClick();
    renderCurrentQuestion();
  }

  // --- QUESTION GRID NAVIGATION ---
  function renderQuestionGridNav() {
    DOM.questionGridNav.innerHTML = '';
    const pkg = state.currentPackage;
    if (!pkg) return;

    pkg.questions.forEach((q, idx) => {
      const item = document.createElement('button');
      item.className = 'grid-nav-item';
      if (idx === state.currentQuestionIndex) item.classList.add('current');

      const isAnswered = isQuestionAnswered(q);
      const isFlagged = state.flaggedQuestions[q.id];

      if (isFlagged) {
        item.classList.add('flagged');
      } else if (isAnswered) {
        item.classList.add('answered');
      }

      item.textContent = idx + 1;
      item.addEventListener('click', () => {
        state.currentQuestionIndex = idx;
        renderCurrentQuestion();
        window.soundManager.playClick();
      });

      DOM.questionGridNav.appendChild(item);
    });
  }

  function isQuestionAnswered(q) {
    const ans = state.userAnswers[q.id];
    if (ans === undefined || ans === null) return false;
    if (q.type === 'complex') return Array.isArray(ans) && ans.length > 0;
    if (q.type === 'table_tf') return Object.keys(ans).length === q.statements.length;
    return true;
  }

  // --- SUBMISSION & SCORING ---
  function confirmSubmitQuiz() {
    const pkg = state.currentPackage;
    let unansweredCount = 0;
    let flaggedCount = 0;

    pkg.questions.forEach(q => {
      if (!isQuestionAnswered(q)) unansweredCount++;
      if (state.flaggedQuestions[q.id]) flaggedCount++;
    });

    let msg = 'Apakah Anda yakin ingin mengakhiri dan mengumpulkan Paket TKA ini?';
    if (unansweredCount > 0 || flaggedCount > 0) {
      msg = `⚠️ Catatan Ujian:\n`;
      if (unansweredCount > 0) msg += `- Ada ${unansweredCount} soal yang BELUM dijawab.\n`;
      if (flaggedCount > 0) msg += `- Ada ${flaggedCount} soal yang ditandai RAGU-RAGU.\n`;
      msg += `\nKumpulkan sekarang?`;
    }

    if (confirm(msg)) {
      finishQuiz();
    }
  }

  function finishQuiz() {
    if (state.timerInterval) clearInterval(state.timerInterval);

    const pkg = state.currentPackage;
    let correctCount = 0;

    pkg.questions.forEach(q => {
      if (checkQuestionAnswerCorrect(q, state.userAnswers[q.id])) {
        correctCount++;
      }
    });

    const totalQ = pkg.questions.length;
    const scorePercent = Math.round((correctCount / totalQ) * 100);

    // Save Progress
    const prevProg = state.packagesProgress[pkg.id] || {};
    const bestScore = Math.max(prevProg.bestScore || 0, scorePercent);
    state.packagesProgress[pkg.id] = {
      bestScore: bestScore,
      completedAt: new Date().toLocaleDateString('id-ID')
    };
    saveProgress();

    // Time spent calculation
    let timeSpentSecs = 0;
    if (state.mode === 'exam') {
      timeSpentSecs = (pkg.durationMinutes * 60) - state.timerSeconds;
    } else {
      timeSpentSecs = state.timerSeconds;
    }
    const minsSpent = Math.floor(timeSpentSecs / 60);
    const secsSpent = timeSpentSecs % 60;
    const timeSpentStr = `${minsSpent} m ${secsSpent} s`;

    // Save Attempt to History
    const attemptRecord = {
      date: new Date().toLocaleString('id-ID'),
      studentName: state.student.name,
      studentClass: state.student.classGrade,
      packageTitle: pkg.title,
      scorePercent: scorePercent,
      correctCount: `${correctCount}/${totalQ}`,
      points: state.scorePoints,
      mode: state.mode === 'exam' ? 'Simulasi Ujian' : 'Petualangan'
    };
    saveAttemptToHistory(attemptRecord);

    // Render Results & Certificate
    renderResults(correctCount, totalQ, scorePercent, timeSpentStr);
    renderCertificate(pkg, scorePercent);

    showView('result');
    window.confettiFX.launch(4000);
    window.soundManager.playFanfare();
  }

  function checkQuestionAnswerCorrect(q, userAns) {
    if (userAns === undefined || userAns === null) return false;

    if (q.type === 'single') {
      return userAns === q.answer;
    } else if (q.type === 'complex') {
      if (!Array.isArray(userAns)) return false;
      const expected = [...q.answer].sort();
      const actual = [...userAns].sort();
      return JSON.stringify(expected) === JSON.stringify(actual);
    } else if (q.type === 'table_tf') {
      if (typeof userAns !== 'object') return false;
      return q.statements.every((stmt, idx) => userAns[idx] === stmt.correct);
    }
    return false;
  }

  // --- RESULT & CERTIFICATE RENDERING ---
  function renderResults(correctCount, totalQ, scorePercent, timeSpentStr) {
    DOM.resultStudentName.textContent = state.student.name;
    DOM.resultScorePercent.textContent = `${scorePercent}%`;
    DOM.resultCorrectCount.textContent = `${correctCount} dari ${totalQ}`;
    DOM.resultTimeSpent.textContent = timeSpentStr;
    DOM.resultPoints.textContent = state.scorePoints;

    let grade = '';
    let badgeText = '';

    if (scorePercent >= 85) {
      grade = '🏆 Sangat Memuaskan (Cum Laude)';
      badgeText = 'JUARA LITERASI & NUMERASI';
    } else if (scorePercent >= 70) {
      grade = '🌟 Sangat Baik (Mahir)';
      badgeText = 'MAHIR TKA SMP';
    } else if (scorePercent >= 55) {
      grade = '👍 Baik (Cakap)';
      badgeText = 'CAKAP TKA';
    } else {
      grade = '📚 Cukup (Perlu Latihan Intensif)';
      badgeText = 'PESERTA TKA';
    }

    DOM.resultScoreGrade.textContent = grade;
    DOM.resultBadge.textContent = badgeText;
  }

  function renderCertificate(pkg, scorePercent) {
    DOM.certStudentName.textContent = state.student.name;
    DOM.certStudentClass.textContent = `Kelas ${state.student.classGrade} - SMP Negeri 1 Segah`;
    DOM.certPackageTitle.textContent = pkg.title;
    DOM.certScore.textContent = `${scorePercent}%`;
    DOM.certDate.textContent = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    
    if (scorePercent >= 85) {
      DOM.certBadgeText.textContent = 'PREDIKAT: SANGAT MEMUASKAN (CUM LAUDE)';
    } else if (scorePercent >= 70) {
      DOM.certBadgeText.textContent = 'PREDIKAT: SANGAT BAIK (MAHIR)';
    } else {
      DOM.certBadgeText.textContent = 'PREDIKAT: LULUS EVALUASI TKA';
    }
  }

  // --- REVIEW ANSWERS VIEW ---
  function renderReviewView() {
    const pkg = state.currentPackage;
    DOM.reviewPackageTitle.textContent = `Pembahasan Soal - ${pkg.title}`;
    DOM.reviewListContainer.innerHTML = '';

    pkg.questions.forEach((q, idx) => {
      const userAns = state.userAnswers[q.id];
      const isCorrect = checkQuestionAnswerCorrect(q, userAns);

      const card = document.createElement('div');
      card.className = `review-item glass-card ${isCorrect ? 'correct-border' : 'wrong-border'}`;

      let userAnsDisplay = formatUserAnswerDisplay(q, userAns);
      let correctAnsDisplay = formatCorrectAnswerDisplay(q);

      card.innerHTML = `
        <div class="review-item-header">
          <span class="review-no">Soal No. ${idx + 1} (${q.category} - ${q.level})</span>
          <span class="status-pill ${isCorrect ? 'pill-success' : 'pill-danger'}">
            ${isCorrect ? '✅ Jawaban Benar (+10)' : '❌ Jawaban Salah / Belum Tepat'}
          </span>
        </div>
        <div class="review-stimulus">${q.stimulus || ''}</div>
        <div class="review-question">${q.question}</div>
        
        <div class="review-answers-grid">
          <div class="user-ans-box">
            <strong>Jawaban Anda:</strong>
            <p>${userAnsDisplay}</p>
          </div>
          <div class="correct-ans-box">
            <strong>Kunci Jawaban Resmi:</strong>
            <p>${correctAnsDisplay}</p>
          </div>
        </div>

        <div class="explanation-box">
          <strong>💡 Pembahasan Lengkap:</strong>
          <p>${q.explanation}</p>
        </div>
      `;

      DOM.reviewListContainer.appendChild(card);
    });
  }

  function formatUserAnswerDisplay(q, userAns) {
    if (userAns === undefined || userAns === null) return '<em class="text-muted">(Tidak Dijawab)</em>';
    
    if (q.type === 'single') {
      return `${String.fromCharCode(65 + userAns)}. ${q.options[userAns]}`;
    } else if (q.type === 'complex') {
      if (!Array.isArray(userAns) || userAns.length === 0) return '<em class="text-muted">(Tidak Dijawab)</em>';
      return userAns.map(i => `${String.fromCharCode(65 + i)}. ${q.options[i]}`).join('<br>');
    } else if (q.type === 'table_tf') {
      let res = [];
      q.statements.forEach((stmt, i) => {
        const val = userAns[i];
        res.push(`- Stmt ${i+1}: ${val === true ? 'Benar' : val === false ? 'Salah' : 'Belum Dijawab'}`);
      });
      return res.join('<br>');
    }
    return String(userAns);
  }

  function formatCorrectAnswerDisplay(q) {
    if (q.type === 'single') {
      return `${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}`;
    } else if (q.type === 'complex') {
      return q.answer.map(i => `${String.fromCharCode(65 + i)}. ${q.options[i]}`).join('<br>');
    } else if (q.type === 'table_tf') {
      return q.statements.map((stmt, i) => `- Stmt ${i+1}: ${stmt.correct ? 'BENAR' : 'SALAH'}`).join('<br>');
    }
    return '';
  }

  // --- LEADERBOARD & REKAP ---
  function renderLeaderboard() {
    const history = JSON.parse(localStorage.getItem('smpn1segah_tka_history') || '[]');
    DOM.historyTableBody.innerHTML = '';

    if (history.length === 0) {
      DOM.historyTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px;">Belum ada data riwayat ujian. Silakan selesaikan Paket Soal terlebih dahulu.</td></tr>`;
      return;
    }

    history.forEach((rec, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><strong>${rec.studentName}</strong></td>
        <td>${rec.studentClass}</td>
        <td>${rec.packageTitle}</td>
        <td><strong style="color: #059669;">${rec.scorePercent}%</strong> (${rec.correctCount})</td>
        <td>⭐ ${rec.points || 0}</td>
        <td>${rec.date}</td>
      `;
      DOM.historyTableBody.appendChild(tr);
    });
  }

  function exportLeaderboardToExcel() {
    const history = JSON.parse(localStorage.getItem('smpn1segah_tka_history') || '[]');
    if (history.length === 0) {
      alert('⚠️ Belum ada data riwayat ujian yang tersimpan untuk diexport.');
      return;
    }

    const csvHeader = "No,Nama Siswa,Kelas,Paket Soal,Nilai (%),Jawaban Benar,Poin Perolehan,Mode Ujian,Tanggal & Waktu\n";
    const rows = history.map((rec, idx) => {
      const cleanName = `"${(rec.studentName || '').replace(/"/g, '""')}"`;
      const cleanPkg = `"${(rec.packageTitle || '').replace(/"/g, '""')}"`;
      return [
        idx + 1,
        cleanName,
        rec.studentClass || 'IX-A',
        cleanPkg,
        rec.scorePercent + '%',
        rec.correctCount || '-',
        (rec.points || 0) + ' Poin',
        rec.mode || 'Petualangan',
        `"${rec.date || ''}"`
      ].join(',');
    }).join('\n');

    const blob = new Blob(["\uFEFF" + csvHeader + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Nilai_TKA_SMPN1Segah_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    window.soundManager.playFanfare();
  }

  function exportHistoryData() {
    const history = localStorage.getItem('smpn1segah_tka_history') || '[]';
    const blob = new Blob([history], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_TKA_SMPN1Segah_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearHistoryData() {
    if (confirm('⚠️ Apakah Anda yakin ingin menghapus semua data riwayat ujian di perangkat ini?')) {
      localStorage.removeItem('smpn1segah_tka_history');
      renderLeaderboard();
    }
  }

  // Initialize Application
  initApp();
});
