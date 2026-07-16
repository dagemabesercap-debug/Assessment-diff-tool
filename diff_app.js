// Comparison Dashboard Logic for Cybersecurity Assessment Diff Tool

document.addEventListener('DOMContentLoaded', () => {
  // Parse query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const activePortco = urlParams.get('portco') || 'Studio Designer';
  const yearA = urlParams.get('yearA') || '2025';
  const yearB = urlParams.get('yearB') || '2026';

  // Update Page Title / Subtitle
  document.title = `${activePortco} Comparison (${yearA} vs ${yearB})`;
  const header = document.querySelector('header');
  if (header) {
    header.innerHTML = `
      <div class="logo-section">
        <a href="index.html" style="text-decoration: none; color: inherit; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 14px; background: rgba(255,255,255,0.06); padding: 4px 10px; border-radius: 99px;">← Portfolio Hub</span>
        </a>
        <h1 style="font-size: 26px; font-weight: 800; background: linear-gradient(to right, #fff, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          ${activePortco} Assessment Comparison
        </h1>
        <p style="color: var(--text-secondary); font-size: 13px; margin-top: 4px;">
          Comparing Year-over-Year changes: <strong>${yearA}</strong> vs <strong>${yearB}</strong>
        </p>
      </div>
      <div>
        <span class="delta-badge" id="global-delta-header" style="padding: 8px 16px;">
          Calculating...
        </span>
      </div>
    `;
  }

  let currentData = [];
  let portcoDetails = null;
  let activeCategory = null;
  let currentFilter = 'all'; // 'all', 'changed', 'new', 'regressions'
  let searchQuery = '';

  let categoryScores = {
    "ORGANIZATION AND PLANNING": { score2025: null, score2026: null, icon: "📋" },
    "TECHNICAL AND TOOLING": { score2025: null, score2026: null, icon: "🛠️" },
    "SECURE PROCESS": { score2025: null, score2026: null, icon: "🔒" },
    "RECURRING HYGIENE": { score2025: null, score2026: null, icon: "🔄" },
    "COMPANY INFORMATION": { score2025: null, score2026: null, icon: "🏢" },
    "SECURITY TOOLS": { score2025: null, score2026: null, icon: "🛡️" },
    "VALIDATION CALL": { score2025: null, score2026: null, icon: "📞" }
  };

  // Fetch Portcos metadata and Diff data
  const diffUrl = `/api/diff?portco=${encodeURIComponent(activePortco)}&yearA=${encodeURIComponent(yearA)}&yearB=${encodeURIComponent(yearB)}`;
  Promise.all([
    fetchJSON('/api/portcos').catch(err => {
      console.error('Failed to load portfolio metadata:', err);
      return null;
    }),
    fetchJSON(diffUrl).then(data => ({ data })).catch(err => ({ error: err.message }))
  ]).then(([portcos, diffResult]) => {
    // 1. Process Portcos metadata
    if (portcos) {
      portcoDetails = portcos.find(p => p.name === activePortco);
      if (portcoDetails) {
        const scoreA = portcoDetails.scores ? portcoDetails.scores[yearA] : undefined;
        const scoreB = portcoDetails.scores ? portcoDetails.scores[yearB] : undefined;
        
        // Update header overall score
        updateHeaderScores(scoreA, scoreB);

        // Update Category scores
        const scoresA = portcoDetails.categoryScores[yearA] || {};
        const scoresB = portcoDetails.categoryScores[yearB] || {};
        Object.keys(categoryScores).forEach(cat => {
          categoryScores[cat].score2025 = scoresA[cat] !== undefined ? scoresA[cat] : null;
          categoryScores[cat].score2026 = scoresB[cat] !== undefined ? scoresB[cat] : null;
        });
      }
    }

    // 2. Process Diff data
    if (diffResult.data) {
      currentData = diffResult.data;
      initializeDashboard();
    } else {
      // Fallback offline mode for Studio Designer 2025 vs 2026
      if (activePortco === 'Studio Designer' && yearA === '2025' && yearB === '2026' && typeof diffReportData !== 'undefined') {
        if (diffResult.error) {
          console.warn('Using bundled diff data after API failure:', diffResult.error);
        }
        currentData = diffReportData;
        
        // Hardcode fallback header scores
        updateHeaderScores(83, 63);
        categoryScores["ORGANIZATION AND PLANNING"] = { score2025: 64, score2026: 72, icon: "📋" };
        categoryScores["TECHNICAL AND TOOLING"] = { score2025: 100, score2026: 64, icon: "🛠️" };
        categoryScores["SECURE PROCESS"] = { score2025: 76, score2026: 73, icon: "🔒" };
        categoryScores["RECURRING HYGIENE"] = { score2025: 55, score2026: 39, icon: "🔄" };

        initializeDashboard();
      } else {
        renderErrorMessage(diffResult.error);
      }
    }
  });

  async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
      const message = (await response.text()).trim() || `${response.status} ${response.statusText}`;
      throw new Error(message);
    }
    return response.json();
  }

  function updateHeaderScores(scoreA, scoreB) {
    const hasScores = Number.isFinite(scoreA) && Number.isFinite(scoreB);
    const delta = scoreB - scoreA;
    const globalHeader = document.getElementById('global-delta-header');
    const heroDelta = document.getElementById('hero-delta-badge');
    const gaugeVal = document.getElementById('gauge-current-val');
    const prevVal = document.querySelector('.score-meta-item strong');
    const profLabel = document.getElementById('hero-proficiency-label');

    // Update gauge number
    if (gaugeVal) gaugeVal.textContent = hasScores ? scoreB : 'N/A';
    if (prevVal) prevVal.textContent = Number.isFinite(scoreA) ? scoreA : 'N/A';

    if (!hasScores) {
      if (globalHeader) {
        globalHeader.className = 'delta-badge';
        globalHeader.textContent = 'Score unavailable';
      }
      if (heroDelta) {
        heroDelta.className = 'delta-badge';
        heroDelta.textContent = 'Score unavailable';
      }
      return;
    }

    // Update proficiency text
    if (profLabel) {
      if (scoreB >= 80) {
        profLabel.textContent = "High";
        profLabel.style.color = "var(--success)";
      } else if (scoreB >= 50) {
        profLabel.textContent = "Moderate";
        profLabel.style.color = "var(--warning)";
      } else {
        profLabel.textContent = "Low";
        profLabel.style.color = "var(--danger)";
      }
    }

    let deltaText = delta === 0 ? "0" : (delta > 0 ? `+${delta}` : `${delta}`);
    let deltaClass = delta === 0 ? "" : (delta > 0 ? "positive" : "negative");
    let arrow = delta > 0 ? "↑" : "↓";

    if (globalHeader) {
      globalHeader.className = `delta-badge ${deltaClass}`;
      globalHeader.innerHTML = `<span style="font-size: 16px;">${arrow}</span> ${deltaText} Points Change`;
    }
    if (heroDelta) {
      heroDelta.className = `delta-badge ${deltaClass}`;
      heroDelta.innerHTML = `<span style="font-size: 16px;">${arrow}</span> ${deltaText} Delta`;
    }
  }

  function initializeDashboard() {
    const scoreB = portcoDetails && portcoDetails.scores ? portcoDetails.scores[yearB] : 63;
    animateGauge(Number.isFinite(scoreB) ? scoreB : 0);
    renderCategoryCards();
    renderQuestions();
    setupEventListeners();
  }

  function renderErrorMessage(errorMessage) {
    const tree = document.getElementById('questions-tree');
    const globalHeader = document.getElementById('global-delta-header');
    if (globalHeader) {
      globalHeader.className = 'delta-badge negative';
      globalHeader.textContent = 'Failed to load';
    }
    tree.innerHTML = `
      <div class="glass-panel" style="padding: 32px; text-align: center; border-color: var(--danger);">
        <h3 style="color: var(--danger); font-size: 18px; margin-bottom: 8px;">Failed to Load Diff Report</h3>
        <p style="color: var(--text-secondary); font-size: 14px;">
          The system was unable to load comparison between <strong>${yearA}</strong> and <strong>${yearB}</strong> for <strong>${activePortco}</strong>.
        </p>
        <p style="color: var(--text-muted); font-size: 13px; margin-top: 12px;">
          Please make sure the assessment files have been uploaded and processed on the server.
        </p>
        ${errorMessage ? `<p style="color: var(--danger); font-size: 12px; margin-top: 12px;">${escapeHTML(errorMessage)}</p>` : ''}
      </div>
    `;
  }

  function animateGauge(score) {
    const circle = document.getElementById('gauge-circle');
    if (!circle) return;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (score / 100) * circumference;
    setTimeout(() => {
      circle.style.strokeDashoffset = offset;
    }, 100);
  }

  function renderCategoryCards() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    container.innerHTML = '';

    const categories = Object.keys(categoryScores);

    categories.forEach(cat => {
      const stats = categoryScores[cat];
      const questionsInCat = currentData.filter(q => q.category === cat);
      
      const regressions = questionsInCat.filter(q => {
        const hasScoreDrop = q.score_delta && q.score_delta < 0;
        const hasOptionsRemoved = q.options_diff && q.options_diff.some(o => o.status === 'removed');
        return hasScoreDrop || hasOptionsRemoved;
      }).length;

      const delta = stats.score2026 !== null && stats.score2025 !== null ? (stats.score2026 - stats.score2025) : null;
      let scoreDisplay = 'N/A';
      let prevScoreDisplay = '';
      let deltaDisplay = '';

      if (stats.score2026 !== null) {
        scoreDisplay = stats.score2026;
        prevScoreDisplay = stats.score2025;
        
        if (delta > 0) {
          deltaDisplay = `<span class="delta-badge positive" style="font-size: 11px; padding: 2px 8px;">+${delta}</span>`;
        } else if (delta < 0) {
          deltaDisplay = `<span class="delta-badge negative" style="font-size: 11px; padding: 2px 8px;">${delta}</span>`;
        } else {
          deltaDisplay = `<span class="delta-badge" style="font-size: 11px; padding: 2px 8px; background: rgba(255,255,255,0.03); color: var(--text-secondary); border: 1px solid rgba(255,255,255,0.05);">0</span>`;
        }
      }

      const card = document.createElement('div');
      card.className = `glass-panel category-card ${activeCategory === cat ? 'active' : ''}`;
      card.innerHTML = `
        <div class="category-header">
          <div>
            <h3 class="category-title" style="font-size: 13px;">${cat}</h3>
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
              ${questionsInCat.length} Questions ${regressions > 0 ? `• <span style="color: var(--danger); font-weight: 700;">${regressions} Regr</span>` : ''}
            </span>
          </div>
          <div class="category-icon">${stats.icon}</div>
        </div>
        <div class="category-scores">
          <div class="category-numbers">
            <span class="cat-score-current">${scoreDisplay}</span>
            ${prevScoreDisplay !== null && prevScoreDisplay !== '' ? `<span class="cat-score-prev">${prevScoreDisplay}</span>` : ''}
          </div>
          ${deltaDisplay}
        </div>
      `;

      card.addEventListener('click', () => {
        if (activeCategory === cat) {
          activeCategory = null;
        } else {
          activeCategory = cat;
        }
        renderCategoryCards();
        renderQuestions();
      });

      container.appendChild(card);
    });
  }

  function getFilteredQuestions() {
    return currentData.filter(q => {
      if (activeCategory && q.category !== activeCategory) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const numMatch = q.q2026_number && q.q2026_number.includes(query) || q.q2025_number && q.q2025_number.includes(query);
        const textMatch = q.text_2026 && q.text_2026.toLowerCase().includes(query) || q.text_2025 && q.text_2025.toLowerCase().includes(query);
        const commentMatch = q.comments_2026 && q.comments_2026.toLowerCase().includes(query) || q.comments_2025 && q.comments_2025.toLowerCase().includes(query);
        const responseMatch = q.free_response_2026 && q.free_response_2026.toLowerCase().includes(query) || q.free_response_2025 && q.free_response_2025.toLowerCase().includes(query);
        const optionMatch = q.options_diff && q.options_diff.some(o => o.text.toLowerCase().includes(query));
        
        if (!numMatch && !textMatch && !commentMatch && !responseMatch && !optionMatch) {
          return false;
        }
      }

      if (currentFilter === 'new') {
        return q.isNew;
      }
      if (currentFilter === 'changed') {
        const hasScoreChanged = q.score_delta && q.score_delta !== 0;
        const hasOptionsChanged = q.options_diff && q.options_diff.some(o => o.status !== 'unchanged');
        const hasCommentsChanged = q.comments_2025 !== q.comments_2026;
        const hasResponseChanged = q.free_response_2025 !== q.free_response_2026;
        return q.isNew || q.isDeleted || hasScoreChanged || hasOptionsChanged || hasCommentsChanged || hasResponseChanged;
      }
      if (currentFilter === 'regressions') {
        const hasScoreDrop = q.score_delta && q.score_delta < 0;
        const hasOptionsRemoved = q.options_diff && q.options_diff.some(o => o.status === 'removed');
        return hasScoreDrop || hasOptionsRemoved;
      }

      return true;
    });
  }

  function renderQuestions() {
    const container = document.getElementById('questions-tree');
    if (!container) return;
    container.innerHTML = '';

    const filtered = getFilteredQuestions();
    
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="glass-panel" style="padding: 40px; text-align: center; color: var(--text-muted); font-style: italic;">
          No questions matched the selected filters.
        </div>
      `;
      return;
    }

    filtered.forEach(q => {
      const isNew = q.isNew;
      const isDeleted = q.isDeleted;
      const qNum = isDeleted ? q.q2025_number : q.q2026_number;
      const qText = isDeleted ? q.text_2025 : q.text_2026;
      
      let statusClass = '';
      let deltaBadge = '';

      if (isNew) {
        statusClass = 'improvement';
        deltaBadge = `<span class="q-badge new">New</span>`;
      } else if (isDeleted) {
        statusClass = 'regression';
        deltaBadge = `<span class="q-badge" style="background: var(--danger-bg); color: var(--danger);">Removed</span>`;
      } else {
        const hasOptionsRemoved = q.options_diff && q.options_diff.some(o => o.status === 'removed');
        const scoreDrop = q.score_delta && q.score_delta < 0;
        
        if (scoreDrop || hasOptionsRemoved) {
          statusClass = 'regression';
        } else if (q.score_delta && q.score_delta > 0) {
          statusClass = 'improvement';
        }

        if (q.score_delta !== undefined && q.score_delta !== null) {
          if (q.score_delta < 0) {
            deltaBadge = `<span class="q-score-delta-val neg">${q.score_delta}</span>`;
          } else if (q.score_delta > 0) {
            deltaBadge = `<span class="q-score-delta-val pos">+${q.score_delta}</span>`;
          }
        }
      }

      const node = document.createElement('div');
      node.className = `glass-panel question-node ${statusClass}`;
      
      node.innerHTML = `
        <div class="question-header-bar">
          <div class="question-num-title">
            <div class="question-number-badge">${qNum}</div>
            <div class="question-title-text">${qText}</div>
          </div>
          <div class="question-meta-badges">
            <span class="q-badge category">${q.category}</span>
            ${deltaBadge}
            <span class="chevron-icon">▼</span>
          </div>
        </div>
        <div class="question-details">
          <div class="side-by-side-grid">
            
            <div>
              <div class="col-header">
                <span>${yearA} Version</span>
                ${q.score_2025 ? `<span class="col-score">Score: ${q.score_2025}</span>` : ''}
              </div>
              <div class="checklist-container">
                ${renderColumnChecklist(q.options_diff, 'left')}
                ${renderColumnEvidence(q.evidence_diff, 'left')}
              </div>
            </div>

            <div>
              <div class="col-header">
                <span>${yearB} Version</span>
                ${q.score_2026 ? `<span class="col-score">Score: ${q.score_2026}</span>` : ''}
              </div>
              <div class="checklist-container">
                ${renderColumnChecklist(q.options_diff, 'right')}
                ${renderColumnEvidence(q.evidence_diff, 'right')}
              </div>
            </div>
            
          </div>

          <div class="metadata-blocks">
            <div class="meta-grid">
              
              <div class="meta-block-card">
                <div class="meta-block-title">${yearA} Responses, Comments & Attachments</div>
                <div class="meta-block-content ${!q.free_response_2025 ? 'empty' : ''}"><strong>Written response:</strong><br>${q.free_response_2025 || 'No free-form response provided.'}</div>
                <div class="meta-block-content ${!q.comments_2025 ? 'empty' : ''}"><strong>Comments:</strong><br>${q.comments_2025 || 'No respondent comments provided.'}</div>
                ${renderAttachments(q.attachments_2025, yearA, q.q2025_number)}
              </div>

              <div class="meta-block-card">
                <div class="meta-block-title">${yearB} Responses, Comments & Attachments</div>
                <div class="meta-block-content ${!q.free_response_2026 ? 'empty' : ''}"><strong>Written response:</strong><br>${q.free_response_2026 || 'No free-form response provided.'}</div>
                <div class="meta-block-content ${!q.comments_2026 ? 'empty' : ''}"><strong>Comments:</strong><br>${q.comments_2026 || 'No respondent comments provided.'}</div>
                ${renderAttachments(q.attachments_2026, yearB, q.q2026_number)}
              </div>

            </div>
          </div>
        </div>
      `;

      const header = node.querySelector('.question-header-bar');
      header.addEventListener('click', () => {
        node.classList.toggle('expanded');
      });

      container.appendChild(node);
    });
  }

  function renderColumnChecklist(options, side) {
    if (!options || options.length === 0) {
      return `<p style="font-size: 13px; color: var(--text-muted); font-style: italic;">No standard checkbox options.</p>`;
    }

    return options.map(opt => {
      const isChecked = side === 'left' ? opt.checked_2025 : opt.checked_2026;
      if (isChecked === undefined) return '';

      let diffTag = '';
      if (side === 'right' && opt.status === 'added') {
        diffTag = `<span class="diff-tag added">Added</span>`;
      } else if (side === 'right' && opt.status === 'removed') {
        diffTag = `<span class="diff-tag removed">Removed</span>`;
      }

      return `
        <div class="check-item status-${opt.status}">
          <span class="check-symbol">${isChecked ? '☑' : '☐'}</span>
          <span>${opt.text}</span>
          ${diffTag}
        </div>
      `;
    }).join('');
  }

  function renderColumnEvidence(evidence, side) {
    if (!evidence || evidence.length === 0) return '';

    return `
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-top: 14px; margin-bottom: 6px; letter-spacing: 0.5px;">Required Evidence</div>
      ${evidence.map(ev => {
        const isChecked = side === 'left' ? ev.checked_2025 : ev.checked_2026;
        if (isChecked === undefined) return '';

        return `
          <div class="check-item status-${ev.status}" style="padding: 6px 12px; font-size: 12px; opacity: 0.85;">
            <span class="check-symbol">${isChecked ? '✓' : '✗'}</span>
            <span>${ev.text}</span>
          </div>
        `;
      }).join('')}
    `;
  }

  function renderAttachments(attachments, year, questionNumber) {
    if (!attachments || attachments.length === 0) return '';
    return `
      <div class="attachment-list">
        ${attachments.map(att => `
          <a href="/api/attachments?portco=${encodeURIComponent(activePortco)}&year=${encodeURIComponent(year)}&question=${encodeURIComponent(questionNumber)}&file=${encodeURIComponent(att)}" class="attachment-chip" title="Download evidence file">
            📎 ${escapeHTML(att)}
          </a>
        `).join('')}
      </div>
    `;
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setupEventListeners() {
    const searchBox = document.getElementById('search-box');
    if (searchBox) {
      searchBox.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderQuestions();
      });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderQuestions();
      });
    });
  }
});
