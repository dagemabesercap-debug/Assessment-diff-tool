// Portfolio Hub Homepage Logic for Cybersecurity Assessment Diff Tool

document.addEventListener('DOMContentLoaded', () => {
  let portcos = [];
  let activePortco = null;
  let chartInstance = null;

  // Cache DOM Elements
  const portcoList = document.getElementById('portco-list');
  const welcomeState = document.getElementById('welcome-state');
  const detailState = document.getElementById('detail-state');
  const activeName = document.getElementById('active-portco-name');
  const activeYearsDesc = document.getElementById('active-portco-years-desc');
  const activeSummaryBadge = document.getElementById('active-portco-summary-badge');
  const selectYearA = document.getElementById('select-year-a');
  const selectYearB = document.getElementById('select-year-b');
  const btnCompare = document.getElementById('btn-compare');
  const btnDownloadReport = document.getElementById('btn-download-report');

  // Modal DOM Elements
  const btnOpenUpload = document.getElementById('btn-open-upload');
  const btnCloseUpload = document.getElementById('btn-close-upload');
  const btnCancelUpload = document.getElementById('btn-cancel-upload');
  const uploadModal = document.getElementById('upload-modal');
  const uploadForm = document.getElementById('upload-form');
  const uploadRowsContainer = document.getElementById('upload-rows-container');
  const btnAddRow = document.getElementById('btn-add-row');
  const modalSpinner = document.getElementById('modal-spinner');
  const spinnerStatus = document.getElementById('spinner-status');

  // Load Portfolio Companies
  loadPortfolio();

  function loadPortfolio(selectCompanyName = null) {
    fetch('/api/portcos')
      .then(res => res.json())
      .then(data => {
        portcos = data;
        renderPortcoList();
        
        const selected = selectCompanyName
          ? portcos.find(p => p.name === selectCompanyName)
          : portcos[0];

        if (selected) {
          selectPortco(selected);
        } else {
          clearSelectedPortco();
        }
      })
      .catch(err => {
        console.error("Failed to load portfolio database from server.", err);
        portcos = [];
        clearSelectedPortco();
      });
  }

  function clearSelectedPortco() {
    activePortco = null;
    renderPortcoList();
    welcomeState.style.display = 'block';
    detailState.style.display = 'none';

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }

  // Render Portco List in Sidebar
  function renderPortcoList() {
    portcoList.innerHTML = '';
    portcos.forEach(p => {
      const isSelected = activePortco && activePortco.name === p.name;
      const latestYear = p.years[p.years.length - 1];
      const latestScore = p.scores[latestYear];
      
      const item = document.createElement('div');
      item.className = `portco-item ${isSelected ? 'active' : ''}`;
      item.innerHTML = `
        <div>
          <h3>${p.name}</h3>
          <p>${p.years.length} Reports (${p.years.join(', ')})</p>
        </div>
        <div style="text-align: right;">
          <strong style="font-size: 18px; color: ${latestScore >= 80 ? 'var(--success)' : (latestScore >= 50 ? 'var(--warning)' : 'var(--danger)')};">
            ${latestScore}
          </strong>
          <span style="font-size: 9px; display: block; color: var(--text-muted); text-transform: uppercase;">Score</span>
        </div>
      `;
      
      item.addEventListener('click', () => selectPortco(p));
      portcoList.appendChild(item);
    });
  }

  // Select Portfolio Company and load details
  function selectPortco(p) {
    activePortco = p;
    renderPortcoList(); // refresh active state

    welcomeState.style.display = 'none';
    detailState.style.display = 'flex';

    activeName.textContent = p.name;
    activeYearsDesc.innerHTML = `Assessment history: <strong>${p.years.join(', ')}</strong>`;

    // Calculate score delta from first to last year
    if (p.years.length >= 2) {
      const yrFirst = p.years[0];
      const yrLast = p.years[p.years.length - 1];
      const scoreFirst = p.scores[yrFirst];
      const scoreLast = p.scores[yrLast];
      const diff = scoreLast - scoreFirst;
      const arrow = diff > 0 ? '↑' : '↓';
      
      activeSummaryBadge.style.display = 'inline-flex';
      activeSummaryBadge.className = `delta-badge ${diff >= 0 ? 'positive' : 'negative'}`;
      activeSummaryBadge.innerHTML = `${arrow} ${diff === 0 ? '' : (diff > 0 ? '+' : '')}${diff}pt change (${yrFirst} → ${yrLast})`;
    } else {
      activeSummaryBadge.style.display = 'none';
    }

    // Populate Year Select dropdowns
    selectYearA.innerHTML = '';
    selectYearB.innerHTML = '';
    p.years.forEach((yr, idx) => {
      const optA = document.createElement('option');
      optA.value = yr;
      optA.textContent = yr;
      // Default Year A to first or second to last
      if (idx === Math.max(0, p.years.length - 2)) optA.selected = true;
      selectYearA.appendChild(optA);

      const optB = document.createElement('option');
      optB.value = yr;
      optB.textContent = yr;
      // Default Year B to last year
      if (idx === p.years.length - 1) optB.selected = true;
      selectYearB.appendChild(optB);
    });

    // Render Trend Graph
    renderTrendChart(p);
  }

  // Render Chart.js line graph
  function renderTrendChart(p) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    if (chartInstance) {
      chartInstance.destroy();
    }

    const labels = p.years;
    const scores = labels.map(yr => p.scores[yr]);

    // Create Gradient for line fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.3)');
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Overall Security Score',
          data: scores,
          borderColor: '#7c3aed',
          borderWidth: 3,
          pointBackgroundColor: '#c084fc',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
          backgroundColor: gradient,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(17, 22, 34, 0.9)',
            titleFont: { family: 'Plus Jakarta Sans', weight: '700' },
            bodyFont: { family: 'Plus Jakarta Sans' },
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            displayColors: false,
            padding: 12,
            callbacks: {
              label: (context) => `Security Score: ${context.raw} / 100`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.03)' },
            ticks: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans', weight: '600' } }
          },
          y: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans' } }
          }
        }
      }
    });
  }

  // Compare Diff Click handler
  btnCompare.addEventListener('click', () => {
    if (!activePortco) return;
    const yrA = selectYearA.value;
    const yrB = selectYearB.value;
    
    if (yrA === yrB) {
      alert("Please select two different years to compare.");
      return;
    }

    // Redirect to comparison dashboard
    window.location.href = `diff.html?portco=${encodeURIComponent(activePortco.name)}&yearA=${yrA}&yearB=${yrB}`;
  });

  btnDownloadReport.addEventListener('click', () => {
    if (!activePortco || !activePortco.years || activePortco.years.length === 0) return;
    const latestYear = activePortco.years[activePortco.years.length - 1];
    const query = `portco=${encodeURIComponent(activePortco.name)}&year=${encodeURIComponent(latestYear)}`;
    triggerDownload(`/api/reports?${query}`);
    setTimeout(() => triggerDownload(`/api/evidence?${query}`), 250);
  });

  function triggerDownload(url) {
    const link = document.createElement('a');
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  document.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('#btn-delete-portco');
    if (!deleteButton) return;

    event.preventDefault();
    event.stopPropagation();
    deleteActivePortco(deleteButton);
  });

  async function deleteActivePortco(deleteButton) {
    if (!activePortco) return;

    const companyName = activePortco.name;
    const confirmed = confirm(`Delete ${companyName}? This removes its uploaded assessment files and cannot be undone.`);
    if (!confirmed) return;

    deleteButton.disabled = true;
    deleteButton.textContent = 'Deleting...';

    try {
      const response = await fetch(`/api/portcos?name=${encodeURIComponent(companyName)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || 'Delete failed');
      }

      const currentIndex = portcos.findIndex(p => p.name === companyName);
      const nextCompany = portcos[currentIndex + 1] || portcos[currentIndex - 1] || null;
      loadPortfolio(nextCompany ? nextCompany.name : null);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      deleteButton.disabled = false;
      deleteButton.textContent = 'Delete';
    }
  }

  // Modal Toggle Event Handlers
  btnOpenUpload.addEventListener('click', () => {
    uploadModal.style.display = 'flex';
  });

  const closeModal = () => {
    uploadModal.style.display = 'none';
    modalSpinner.style.display = 'none';
    uploadForm.reset();
    // Keep only one row
    const rows = uploadRowsContainer.querySelectorAll('.upload-row');
    for (let i = 1; i < rows.length; i++) {
      rows[i].remove();
    }
  };

  btnCloseUpload.addEventListener('click', closeModal);
  btnCancelUpload.addEventListener('click', closeModal);

  // Add Another Year's Report row
  btnAddRow.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'upload-row';
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'center';
    row.style.marginTop = '8px';
    
    row.innerHTML = `
      <input type="text" class="search-input assessment-code" style="flex: 1; padding: 10px 12px;" placeholder="Assessment code" autocomplete="off" required>
      <input type="number" class="search-input assessment-year" style="width: 120px; padding: 10px 12px;" placeholder="Year" min="2000" max="2100" required>
      <button type="button" class="btn-remove-row" style="background: none; border: none; color: var(--danger); font-size: 18px; cursor: pointer; padding: 0 4px;">&times;</button>
    `;

    row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
    uploadRowsContainer.appendChild(row);
  });

  // Handle browser document grabber import.
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const companyName = document.getElementById('input-company-name').value.trim();
    const rows = uploadRowsContainer.querySelectorAll('.upload-row');

    if (!companyName) {
      alert("Please enter a company name.");
      return;
    }

    // Validate duplicate years in form
    const selectedYears = [];
    const assessments = [];
    let valid = true;
    rows.forEach(row => {
      const code = row.querySelector('.assessment-code').value.trim();
      const year = row.querySelector('.assessment-year').value.trim();
      if (!code || !year) valid = false;
      if (selectedYears.includes(year)) {
        alert(`Duplicate year assigned: ${year}. Each report must have a unique year.`);
        valid = false;
      }
      selectedYears.push(year);
      assessments.push({ code, year });
    });

    if (!valid) {
      alert("Please provide an assessment code and a unique year for every row.");
      return;
    }

    // Show processing status
    modalSpinner.style.display = 'flex';

    try {
      spinnerStatus.textContent = "Waiting for browser sign-in and importing assessments...";
      const response = await fetch('/api/portcos/grab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName, assessments })
      });
      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || 'Document grabber import failed');
      }
      const result = await response.json();

      spinnerStatus.textContent = "Updating portfolio database...";
      
      // Reload Portfolio List, selecting the new company
      loadPortfolio(companyName);

      if (result.warnings && result.warnings.length > 0) {
        alert(`Import completed with a browser selector warning:\n\n${result.warnings.join('\n')}`);
      }
      
      // Close modal
      setTimeout(closeModal, 800);

    } catch (err) {
      alert("Error: " + err.message);
      modalSpinner.style.display = 'none';
    }
  });
});
