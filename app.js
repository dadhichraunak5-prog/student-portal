// ============================================================
// app.js — Main Application Logic
// ScholarPath India Student Portal
// ============================================================

// ── DOM READY ──
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBackToTop();
  renderScholarships(SCHOLARSHIPS);
  renderLoans();
  renderSubsidies();
  renderHelplines();
  initScholarshipFilters();
  initScholarshipModal();
  initEligibilityForm();
  initTabSwitcher();
  initQRImage();
});

// ══════════════════════════════════════════════
// NAVBAR — Mobile Hamburger
// ══════════════════════════════════════════════
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ══════════════════════════════════════════════
// BACK TO TOP
// ══════════════════════════════════════════════
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
}

// ══════════════════════════════════════════════
// SCHOLARSHIP RENDERING
// ══════════════════════════════════════════════
function renderScholarships(list) {
  const grid = document.getElementById('scholarshipGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = '<div style="color:var(--text3);text-align:center;grid-column:1/-1;padding:40px">No scholarships match the selected filter.</div>';
    return;
  }

  list.forEach(s => {
    const card = document.createElement('div');
    card.className = 'scholarship-card';
    card.dataset.id = s.id;

    const statusBadge = s.status === 'open'
      ? '<span class="badge badge-open">🟢 Open</span>'
      : s.status === 'closed'
      ? '<span class="badge badge-closed">🔴 Closed</span>'
      : '<span class="badge badge-verify">🟡 Verify</span>';

    const typeBadges = s.type.map(t => {
      if (t === 'central') return '<span class="badge badge-central">🏛️ Central</span>';
      if (t === 'rajasthan') return '<span class="badge badge-rajasthan">🏜️ Rajasthan</span>';
      if (t === 'private') return '<span class="badge badge-private">🏢 Private</span>';
      if (t === 'girl') return '<span class="badge badge-girl">👩 Girls</span>';
      if (t === 'pwd') return '<span class="badge badge-pwd">♿ PwD</span>';
      if (t === 'merit') return '<span class="badge badge-merit">🌟 Merit</span>';
      if (t === 'minority') return '<span class="badge badge-central">🕌 Minority</span>';
      return '';
    }).join('');

    card.innerHTML = `
      <div class="sc-badges">
        ${typeBadges}
        ${statusBadge}
      </div>
      <div class="sc-title">${s.name}</div>
      <div class="sc-provider">🏢 ${s.provider}</div>
      <div class="sc-amount">${s.amountShort}</div>
      <div class="sc-mini-details">
        <div class="sc-mini-row"><span class="sc-mini-label">Income Limit:</span><span class="sc-mini-val">${s.income}</span></div>
        <div class="sc-mini-row"><span class="sc-mini-label">Deadline:</span><span class="sc-mini-val">${s.deadline}</span></div>
        <div class="sc-mini-row"><span class="sc-mini-label">Who:</span><span class="sc-mini-val">${s.category}</span></div>
      </div>
      <span class="sc-view-btn">View Full Details →</span>
    `;

    card.addEventListener('click', () => openScholarshipModal(s));
    grid.appendChild(card);
  });
}

// ══════════════════════════════════════════════
// SCHOLARSHIP FILTERS
// ══════════════════════════════════════════════
function initScholarshipFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      if (filter === 'all') {
        renderScholarships(SCHOLARSHIPS);
      } else if (filter === 'overseas') {
        renderScholarships(SCHOLARSHIPS.filter(s => s.type.includes('overseas') || (s.tags && s.tags.includes('overseas'))));
      } else {
        renderScholarships(SCHOLARSHIPS.filter(s => s.type.includes(filter)));
      }
    });
  });
}

// ══════════════════════════════════════════════
// SCHOLARSHIP MODAL
// ══════════════════════════════════════════════
function initScholarshipModal() {
  const modal = document.getElementById('scholarshipModal');
  const closeBtn = document.getElementById('modalClose');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openScholarshipModal(s) {
  const modal = document.getElementById('scholarshipModal');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  const statusClass = s.status === 'open' ? 'badge-open' : s.status === 'closed' ? 'badge-closed' : 'badge-verify';
  const statusText = s.status === 'open' ? '🟢 Applications Open' : s.status === 'closed' ? '🔴 Applications Closed' : '🟡 Verify Status';

  const docsList = s.documents.map(d => `<li>${d}</li>`).join('');

  content.innerHTML = `
    <div class="sc-badges" style="margin-bottom:10px">
      ${s.type.map(t => {
        if (t === 'central') return '<span class="badge badge-central">🏛️ Central Govt</span>';
        if (t === 'rajasthan') return '<span class="badge badge-rajasthan">🏜️ Rajasthan State</span>';
        if (t === 'private') return '<span class="badge badge-private">🏢 Private / CSR</span>';
        if (t === 'girl') return '<span class="badge badge-girl">👩 For Girls</span>';
        if (t === 'pwd') return '<span class="badge badge-pwd">♿ For PwD</span>';
        if (t === 'merit') return '<span class="badge badge-merit">🌟 Merit Based</span>';
        if (t === 'minority') return '<span class="badge badge-central">🕌 Minority</span>';
        return '';
      }).join('')}
      <span class="badge ${statusClass}">${statusText}</span>
    </div>
    <div class="modal-title">${s.name}</div>
    <div class="modal-provider">📋 ${s.provider} · Portal: ${s.portal}</div>

    <div class="modal-section-title">💰 Benefit & Eligibility</div>
    <div class="modal-detail-grid">
      <div class="modal-detail">
        <div class="modal-detail-label">Award Amount</div>
        <div class="modal-detail-val">${s.amount}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Application Deadline</div>
        <div class="modal-detail-val">${s.deadline}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Income Limit</div>
        <div class="modal-detail-val">${s.income}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Minimum Marks</div>
        <div class="modal-detail-val">${s.marks}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Eligible Courses</div>
        <div class="modal-detail-val">${s.course}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Category</div>
        <div class="modal-detail-val">${s.category}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Gender</div>
        <div class="modal-detail-val">${s.gender}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Domicile</div>
        <div class="modal-detail-val">${s.domicile}</div>
      </div>
    </div>

    <div class="modal-section-title">📄 Required Documents</div>
    <ul class="modal-docs-list">${docsList}</ul>

    <div class="modal-section-title">📞 Contact</div>
    <div class="modal-detail-grid">
      <div class="modal-detail">
        <div class="modal-detail-label">Helpline</div>
        <div class="modal-detail-val">${s.helpPhone}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Email</div>
        <div class="modal-detail-val">${s.helpEmail}</div>
      </div>
    </div>

    ${s.notes ? `
    <div style="margin-top:16px;padding:14px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;font-size:0.85rem;color:#FFB347;">
      ℹ️ <strong>Important Note:</strong> ${s.notes}
    </div>` : ''}

    <a href="${s.officialURL}" target="_blank" rel="noopener" class="modal-official-link">
      🔗 Visit Official Portal / Apply Now
    </a>

    <div class="modal-disclaimer">
      ⚠️ <strong>Disclaimer:</strong> This information is for guidance only. Data verified ${s.lastVerified}. Always confirm eligibility, deadline and amount on the official portal before applying. This portal does not guarantee selection, approval or payment.
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('scholarshipModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ══════════════════════════════════════════════
// LOANS RENDERING
// ══════════════════════════════════════════════
function renderLoans() {
  const grid = document.getElementById('loansGrid');
  if (!grid) return;

  LOANS.forEach(loan => {
    const card = document.createElement('div');
    card.className = 'loan-card';
    card.innerHTML = `
      <div class="loan-bank">🏦 ${loan.lender}</div>
      <div class="loan-name">${loan.productName}</div>
      <div class="loan-rate">${loan.rateDisplay} <span>per year</span></div>
      <div class="loan-rate-note">📅 ${loan.rateNote}</div>
      <div class="loan-details-grid">
        <div class="loan-detail">
          <div class="loan-detail-label">Max Loan</div>
          <div class="loan-detail-val">${loan.maxAmount.split('·')[0].trim()}</div>
        </div>
        <div class="loan-detail">
          <div class="loan-detail-label">Collateral</div>
          <div class="loan-detail-val">${loan.collateral.split('.')[0]}</div>
        </div>
        <div class="loan-detail">
          <div class="loan-detail-label">Margin</div>
          <div class="loan-detail-val">${loan.margin}</div>
        </div>
        <div class="loan-detail">
          <div class="loan-detail-label">Moratorium</div>
          <div class="loan-detail-val">${loan.moratorium}</div>
        </div>
        <div class="loan-detail">
          <div class="loan-detail-label">Repayment</div>
          <div class="loan-detail-val">${loan.repayment}</div>
        </div>
        <div class="loan-detail">
          <div class="loan-detail-label">Processing Fee</div>
          <div class="loan-detail-val">${loan.processingFee.split('·')[0].trim()}</div>
        </div>
      </div>
      <div style="font-size:0.8rem;color:var(--text3);margin-bottom:8px">
        <strong style="color:var(--text2)">Expenses Covered:</strong> ${loan.expenses.substring(0,100)}...
      </div>
      ${loan.girlConcession ? `<div style="font-size:0.8rem;color:var(--secondary);margin-bottom:8px">👩 ${loan.girlConcession}</div>` : ''}
      ${loan.subsidy ? `<div style="font-size:0.8rem;color:var(--accent);margin-bottom:8px">🏛️ ${loan.subsidy}</div>` : ''}
      <a href="${loan.officialURL}" target="_blank" rel="noopener" class="loan-link">🔗 Official Product Page →</a>
    `;
    grid.appendChild(card);
  });
}

// ══════════════════════════════════════════════
// SUBSIDY RENDERING
// ══════════════════════════════════════════════
function renderSubsidies() {
  const grid = document.getElementById('subsidyGrid');
  if (!grid) return;

  SUBSIDIES.forEach(sub => {
    const card = document.createElement('div');
    card.className = 'subsidy-card';
    card.innerHTML = `
      <div class="subsidy-name">${sub.name}</div>
      <div class="subsidy-desc">${sub.summary}</div>
      <div style="font-size:0.78rem;color:var(--text2);margin-bottom:6px">
        <strong>Income:</strong> ${sub.income} &nbsp;|&nbsp; <strong>Loan Cap:</strong> ${sub.loanCap}
      </div>
      ${sub.important ? `<div style="font-size:0.78rem;padding:8px;background:rgba(245,158,11,0.1);border-radius:6px;color:#FFB347;margin-bottom:10px">${sub.important}</div>` : ''}
      <div style="font-size:0.78rem;color:var(--text3)">
        📞 ${sub.phone} &nbsp;|&nbsp; ✉️ ${sub.email}
      </div>
      <a href="${sub.portal}" target="_blank" rel="noopener" style="font-size:0.8rem;color:var(--accent);display:inline-block;margin-top:8px">🔗 Official Portal →</a>
    `;
    grid.appendChild(card);
  });
}

// ══════════════════════════════════════════════
// HELPLINES RENDERING
// ══════════════════════════════════════════════
function renderHelplines() {
  const grid = document.getElementById('helplinesGrid');
  if (!grid) return;

  HELPLINES.forEach(h => {
    const card = document.createElement('div');
    card.className = 'helpline-card';
    card.innerHTML = `
      <div class="helpline-name">🏢 ${h.name}</div>
      <div class="helpline-contact">
        <div class="contact-row">
          <div class="contact-icon contact-phone">📞</div>
          <div class="contact-info">
            <span class="contact-label">Phone</span>
            <span class="contact-val">${h.phone}</span>
          </div>
        </div>
        <div class="contact-row">
          <div class="contact-icon contact-hours">🕐</div>
          <div class="contact-info">
            <span class="contact-label">Hours</span>
            <span class="contact-val">${h.hours}</span>
          </div>
        </div>
        <div class="contact-row">
          <div class="contact-icon contact-email">✉️</div>
          <div class="contact-info">
            <span class="contact-label">Email</span>
            <span class="contact-val"><a href="mailto:${h.email}">${h.email}</a></span>
          </div>
        </div>
        <div class="contact-row">
          <div class="contact-icon contact-web">🌐</div>
          <div class="contact-info">
            <span class="contact-label">Website</span>
            <span class="contact-val"><a href="${h.website}" target="_blank" rel="noopener">${h.website.replace('https://','').replace('http://','').split('/')[0]}</a></span>
          </div>
        </div>
      </div>
      ${h.note ? `<div style="margin-top:12px;font-size:0.78rem;color:var(--text3);padding:8px;background:var(--bg);border-radius:6px">${h.note}</div>` : ''}
    `;
    grid.appendChild(card);
  });
}

// ══════════════════════════════════════════════
// ELIGIBILITY CHECKER
// ══════════════════════════════════════════════
function initEligibilityForm() {
  const form = document.getElementById('eligibilityForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    runEligibilityCheck();
  });
}

function runEligibilityCheck() {
  const studyLevel = document.getElementById('studyLevel').value;
  const domicile = document.getElementById('domicile').value;
  const income = document.getElementById('income').value;
  const category = document.getElementById('category').value;
  const gender = document.getElementById('gender').value;
  const marks = document.getElementById('marks').value;
  const special = document.getElementById('special').value;
  const stream = document.getElementById('stream').value;

  const resultsEl = document.getElementById('eligibilityResults');
  resultsEl.classList.remove('hidden');
  resultsEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">🔍 Analysing your profile...</div>';

  // Small delay for UX effect
  setTimeout(() => {
    const results = [];

    SCHOLARSHIPS.forEach(s => {
      const match = checkScholarshipMatch(s, { studyLevel, domicile, income, category, gender, marks, special, stream });
      if (match.score > 0) {
        results.push({ scholarship: s, ...match });
      }
    });

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // Also check loan eligibility
    const loanEligible = income !== 'above1500000'; // Basic check

    let html = '';

    if (results.length === 0) {
      html = `
        <div style="text-align:center;padding:30px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          <div style="font-size:2rem;margin-bottom:12px">🤔</div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--white);margin-bottom:8px">No Direct Matches Found</div>
          <div style="color:var(--text2);font-size:0.9rem">Based on your inputs, we couldn't find a strong match. Try the <a href="https://scholarships.gov.in/scholarshipEligibility/" target="_blank" style="color:var(--accent)">NSP Eligibility Finder</a> or <a href="https://www.myscheme.gov.in/" target="_blank" style="color:var(--accent)">MyScheme.gov.in</a> for a comprehensive check.</div>
        </div>
      `;
    } else {
      const matchLabel = `Found ${results.length} potential match${results.length > 1 ? 'es' : ''} for your profile`;
      html = `
        <div style="margin-bottom:20px;padding:12px 16px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:10px;color:var(--success);font-weight:600">
          ✅ ${matchLabel}
        </div>
      `;
      results.slice(0, 10).forEach(r => {
        const { scholarship: s, matchType, reason } = r;
        html += `
          <div class="result-match ${matchType}">
            <span class="result-label ${matchType}">${matchType === 'match' ? '✅ Likely Match' : matchType === 'possible' ? '⚠️ Possible Match' : '❌ Not a Match'}</span>
            <div class="result-name">${s.name}</div>
            <div class="result-reason">${reason}</div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:6px">
              <span style="font-size:0.8rem;color:var(--accent);font-weight:700">${s.amountShort}</span>
              <span style="font-size:0.75rem;color:var(--text3)">Deadline: ${s.deadline}</span>
              <a href="${s.officialURL}" target="_blank" rel="noopener" class="result-link">🔗 Official Portal</a>
            </div>
            <div class="result-verified">Last verified: ${s.lastVerified}</div>
          </div>
        `;
      });
    }

    // Loan block
    html += `
      <div style="margin-top:24px;padding:20px;background:var(--bg2);border:1px solid rgba(0,212,170,0.2);border-radius:var(--radius)">
        <div style="font-size:1rem;font-weight:700;color:var(--white);margin-bottom:8px">🏦 Education Loan Eligibility</div>
        <div style="font-size:0.875rem;color:var(--text2)">
          ${loanEligible
            ? '✅ You may be eligible for SBI Education Loans and PM-Vidyalaxmi scheme. See the <a href="#loans" style="color:var(--accent)">Loans section</a> for full details, interest rates, and collateral requirements.'
            : '⚠️ Your income level may affect subsidy eligibility, but you can still apply for a standard education loan. Visit an SBI branch or <a href="https://sbi.bank.in/web/personal-banking/loans/education-loans" target="_blank" style="color:var(--accent)">SBI Education Loans</a> for assessment.'}
        </div>
      </div>
      <div style="margin-top:12px;font-size:0.75rem;color:var(--text3);padding:10px;background:var(--bg);border-radius:8px">
        ⚠️ <strong>Disclaimer:</strong> These results are indicative only — based on the information you entered. Labels like "Likely Match" do NOT mean you are approved or guaranteed the scholarship. Always verify eligibility on the official portal. Eligibility rules change each academic year.
      </div>
    `;

    resultsEl.innerHTML = html;
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 500);
}

function checkScholarshipMatch(s, profile) {
  const { studyLevel, domicile, income, category, gender, marks, special, stream } = profile;
  let score = 0;
  const reasons = [];

  // ── Domicile check ──
  if (s.type.includes('rajasthan')) {
    if (domicile !== 'rajasthan') {
      return { score: 0, matchType: 'nomatch', reason: 'Requires Rajasthan domicile.' };
    }
    score += 2;
    reasons.push('Rajasthan domicile ✅');
  } else if (s.name.includes('North East') || s.name.includes('Ishan Uday') || s.name.includes('NEC Merit') || s.tags.includes('northeast')) {
    if (domicile !== 'ne-region') {
      return { score: 0, matchType: 'nomatch', reason: 'Requires North East Region domicile.' };
    }
    score += 2;
  } else if (s.name.includes('J&K') || s.tags.includes('jk')) {
    if (domicile !== 'jk-ladakh') {
      return { score: 0, matchType: 'nomatch', reason: 'Requires J&K/Ladakh domicile.' };
    }
    score += 2;
  } else {
    score += 1; // General India
  }

  // ── Gender check ──
  if (s.type.includes('girl') || s.gender === 'Female only') {
    if (gender !== 'female') {
      return { score: 0, matchType: 'nomatch', reason: 'This scholarship is for female students only.' };
    }
    score += 2;
    reasons.push('Gender requirement met ✅');
  }

  // ── PwD check ──
  if (s.type.includes('pwd')) {
    if (special !== 'pwd') {
      return { score: 0, matchType: 'nomatch', reason: 'Requires PwD status (minimum 40% disability).' };
    }
    score += 3;
    reasons.push('PwD requirement met ✅');
  }

  // ── Special category checks ──
  if (s.tags.includes('capf') || s.name.includes('CAPF')) {
    if (special !== 'capf') {
      return { score: 0, matchType: 'nomatch', reason: 'Requires CAPF/Armed Forces ward status.' };
    }
    score += 3;
  }
  if (s.tags.includes('railway') || s.name.includes('Railways')) {
    if (special !== 'railway') {
      return { score: 0, matchType: 'nomatch', reason: 'Requires railway employee ward status.' };
    }
    score += 3;
  }
  if (s.tags.includes('police') && s.name.includes('Police')) {
    if (special !== 'capf') {
      return { score: 0, matchType: 'nomatch', reason: 'Requires police martyr ward status.' };
    }
    score += 2;
  }
  if (s.tags.includes('labour') || s.name.includes('Beedi')) {
    if (special !== 'beedi') {
      return { score: 0, matchType: 'nomatch', reason: 'Requires ward of Beedi/Cine/IOMC/LSDM worker.' };
    }
    score += 3;
  }
  if (s.name.includes('Swanath') || s.tags.includes('orphan')) {
    if (!['orphan', 'capf', 'covid-orphan'].includes(special)) {
      return { score: 0, matchType: 'nomatch', reason: 'Requires orphan / COVID-orphan / CAPF martyr ward status.' };
    }
    score += 3;
  }

  // ── Study level check ──
  const levelMap = {
    'class9-10': ['school', 'class8', 'pre-matric'],
    'class11-12': ['school', 'class11-12', 'pre-matric', 'all-levels'],
    'iti-diploma': ['diploma', 'skill', 'all-levels'],
    'ug-general': ['ug', 'post-matric', 'higher-education', 'all-levels'],
    'ug-professional': ['ug', 'professional', 'engineering', 'medical', 'post-matric', 'higher-education', 'all-levels'],
    'pg': ['pg', 'post-matric', 'higher-education', 'all-levels'],
    'phd': ['phd', 'higher-education', 'all-levels'],
    'overseas': ['overseas', 'masters', 'all-levels']
  };

  const matchTags = levelMap[studyLevel] || [];
  const hasLevelMatch = s.tags.some(t => matchTags.includes(t));

  // NMMS is school-only
  if (s.name.includes('NMMS') && studyLevel !== 'class9-10') {
    return { score: 0, matchType: 'nomatch', reason: 'NMMS is for Class 8 students only.' };
  }

  // NOS is overseas only
  if (s.name.includes('National Overseas Scholarship') && studyLevel !== 'overseas') {
    return { score: 0, matchType: 'nomatch', reason: 'National Overseas Scholarship is for Master\'s/PhD overseas study.' };
  }

  if (hasLevelMatch) {
    score += 2;
    reasons.push('Study level matches ✅');
  } else if (s.tags.includes('all-levels')) {
    score += 1;
  }

  // ── Category (caste) check ──
  const catMap = {
    sc: ['sc', 'post-matric', 'higher-education'],
    st: ['st', 'post-matric', 'higher-education'],
    obc: ['obc', 'ebc', 'post-matric'],
    dnt: ['dnt'],
    minority: ['minority'],
    general: []
  };
  if (category && catMap[category]) {
    const catTags = catMap[category];
    const catMatch = catTags.length === 0 ? true : s.tags.some(t => catTags.includes(t));
    if (catMatch) {
      score += 1;
      reasons.push(`Category (${category}) relevant ✅`);
    }
  }

  // ── Income check ──
  const incomeVal = parseIncomeRange(income);
  const schemeIncomeLimit = parseSchemeIncome(s.income);
  if (schemeIncomeLimit > 0 && incomeVal > schemeIncomeLimit) {
    score -= 2;
    reasons.push(`⚠️ Your income may exceed this scheme's limit (${s.income})`);
  } else if (schemeIncomeLimit > 0 && incomeVal <= schemeIncomeLimit) {
    score += 1;
    reasons.push('Income within range ✅');
  }

  // ── Marks check ──
  if (marks && s.marks) {
    const marksNum = parseMarksRange(marks);
    if (s.marks.includes('80th percentile') || s.marks.includes('≥80%')) {
      if (marksNum >= 80) { score += 1; reasons.push('Marks requirement likely met ✅'); }
      else { score -= 1; reasons.push('⚠️ This scheme needs 80th percentile / 80%+ marks'); }
    } else if (s.marks.includes('≥75%') || s.marks.includes('75%')) {
      if (marksNum >= 75) { score += 1; }
    } else if (s.marks.includes('≥60%') || s.marks.includes('60%')) {
      if (marksNum >= 60) { score += 1; }
    } else if (s.marks.includes('≥55%')) {
      if (marksNum >= 55) { score += 1; }
    }
  }

  if (score <= 0) {
    return { score: 0, matchType: 'nomatch', reason: 'Profile does not appear to match this scholarship\'s criteria.' };
  }

  const reasonStr = reasons.length > 0
    ? reasons.join(' · ')
    : 'General eligibility — verify all conditions on official portal.';

  if (score >= 5) {
    return { score, matchType: 'match', reason: `Strong match based on your profile: ${reasonStr}` };
  } else if (score >= 3) {
    return { score, matchType: 'possible', reason: `Possible match — verify all conditions: ${reasonStr}` };
  } else {
    return { score, matchType: 'possible', reason: `Partial match — check official portal carefully: ${reasonStr}` };
  }
}

function parseIncomeRange(val) {
  if (!val) return 999999999;
  if (val === 'above1500000') return 2000000;
  const parts = val.split('-');
  return parseInt(parts[1] || parts[0], 10);
}

function parseSchemeIncome(text) {
  if (!text) return 0;
  if (text.includes('₹2.5') || text.includes('2.5 Lakh') || text.includes('2,50,000')) return 250000;
  if (text.includes('₹4.5') || text.includes('4.5 Lakh')) return 450000;
  if (text.includes('₹6') || text.includes('6 Lakh')) return 600000;
  if (text.includes('₹8') || text.includes('8 Lakh')) return 800000;
  if (text.includes('₹12') || text.includes('12 Lakh')) return 1200000;
  if (text.includes('₹15') || text.includes('15 Lakh')) return 1500000;
  return 0;
}

function parseMarksRange(val) {
  if (!val) return 0;
  if (val === '90+') return 92;
  if (val === '80-90') return 85;
  if (val === '75-80') return 77;
  if (val === '60-75') return 67;
  if (val === '55-60') return 57;
  if (val === 'below55') return 50;
  return 0;
}

function clearResults() {
  const r = document.getElementById('eligibilityResults');
  if (r) { r.classList.add('hidden'); r.innerHTML = ''; }
}

// ══════════════════════════════════════════════
// EMI CALCULATOR
// ══════════════════════════════════════════════
function calculateEMI() {
  const amount = parseFloat(document.getElementById('calcAmount').value);
  const rate = parseFloat(document.getElementById('calcRate').value);
  const tenure = parseFloat(document.getElementById('calcTenure').value);
  const moratoriumMonths = parseFloat(document.getElementById('calcMoratorium').value) || 0;

  const resultEl = document.getElementById('calcResult');

  if (!amount || !rate || !tenure) {
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = '<div style="color:var(--danger)">Please fill in Loan Amount, Interest Rate and Tenure.</div>';
    return;
  }

  const monthlyRate = rate / 100 / 12;
  const tenureMonths = tenure * 12;

  // Interest during moratorium (simple accumulation for estimation)
  const moratoriumInterest = amount * monthlyRate * moratoriumMonths;
  const principalAfterMoratorium = amount + moratoriumInterest;

  // EMI calculation
  let emi = 0;
  if (monthlyRate === 0) {
    emi = principalAfterMoratorium / tenureMonths;
  } else {
    emi = principalAfterMoratorium * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - principalAfterMoratorium + moratoriumInterest;

  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `
    <div class="calc-row"><span>Loan Amount</span><span>${fmt(amount)}</span></div>
    <div class="calc-row"><span>Interest Rate</span><span>${rate}% per year (floating)</span></div>
    <div class="calc-row"><span>Moratorium Period</span><span>${moratoriumMonths} months</span></div>
    <div class="calc-row"><span>Est. Interest During Moratorium</span><span>${fmt(moratoriumInterest)}</span></div>
    <div class="calc-row"><span>Principal After Moratorium</span><span>${fmt(principalAfterMoratorium)}</span></div>
    <div class="calc-row"><span>Repayment Tenure</span><span>${tenure} years (${tenureMonths} EMIs)</span></div>
    <div class="calc-row"><span>Total Interest Payable</span><span>${fmt(totalInterest)}</span></div>
    <div class="calc-row"><span>Total Amount Payable</span><span>${fmt(totalPayable + moratoriumInterest)}</span></div>
    <div class="calc-row"><span>📌 Estimated Monthly EMI</span><span>${fmt(emi)}</span></div>
    <div style="font-size:0.75rem;color:var(--text3);margin-top:10px">⚠️ This is an estimate only — not a lender quote. Floating rates may change. Consult your bank for the actual repayment schedule.</div>
  `;
}

// ══════════════════════════════════════════════
// EMAIL COMPOSER
// ══════════════════════════════════════════════
function draftEmail() {
  const dept = document.getElementById('emailDept').value;
  const queryType = document.getElementById('emailQueryType').value;
  const name = document.getElementById('emailName').value || '[Your Name & Application Number]';
  const draftEl = document.getElementById('emailDraft');

  if (!dept) {
    draftEl.classList.remove('hidden');
    draftEl.textContent = '⚠️ Please select a department first.';
    return;
  }

  const contact = EMAIL_CONTACTS[dept];
  if (!contact) return;

  const queryDescriptions = {
    status: 'check the current status of my application',
    payment: 'enquire about a pending scholarship payment',
    eligibility: 'clarify my eligibility for a scheme',
    document: 'confirm the documents required and submission process',
    renewal: 'understand the renewal process for my scholarship',
    other: 'get assistance with a query'
  };

  const draft = `To: ${contact.email}
Subject: ${contact.subject} — ${name}

Respected Team,

I am writing to ${queryDescriptions[queryType] || 'get assistance'}.

Name & Application/Reference: ${name}
Query Type: ${queryDescriptions[queryType] || queryType}

[Please add your specific details here — scheme name, application number, academic year, the issue you are facing, and any reference numbers you have received.]

I would appreciate a response at the earliest. Please let me know if any additional information or documents are required.

Thank you for your time.

Yours sincerely,
${name.split(',')[0] || '[Your Name]'}
[Your Mobile Number]
[Your Email Address]
[Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}]

---
Contact found on: ScholarPath India Portal | Official contact source: ${contact.name}`;

  draftEl.classList.remove('hidden');
  draftEl.innerHTML = `
    <div style="margin-bottom:10px;font-size:0.8rem;color:var(--warning)">⚠️ Review this draft carefully before sending. This is a template — fill in your specific details.</div>
    <pre style="white-space:pre-wrap;font-family:monospace;font-size:0.82rem;line-height:1.7">${draft}</pre>
    <button class="copy-btn" onclick="copyEmailDraft(this, \`${draft.replace(/`/g, '\\`')}\`)">📋 Copy to Clipboard</button>
    <div style="margin-top:12px;font-size:0.8rem;color:var(--text3)">
      📧 Send to: <strong>${contact.email}</strong>
    </div>
  `;
}

function copyEmailDraft(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = '📋 Copy to Clipboard', 2000);
  }).catch(() => {
    btn.textContent = '❌ Copy failed — select manually';
  });
}

// ══════════════════════════════════════════════
// TAB SWITCHER (Document Checklist)
// ══════════════════════════════════════════════
function initTabSwitcher() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentCard = btn.closest('.resource-card');
      if (!parentCard) return;
      parentCard.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parentCard.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const tabId = 'tab-' + btn.dataset.tab;
      const tabContent = document.getElementById(tabId);
      if (tabContent) tabContent.classList.add('active');
    });
  });
}

// ══════════════════════════════════════════════
// QR IMAGE (Try to load owner's QR)
// ══════════════════════════════════════════════
function initQRImage() {
  const qrImg = document.getElementById('qrImage');
  const qrPlaceholder = document.getElementById('qrPlaceholder');
  if (!qrImg || !qrPlaceholder) return;
  qrImg.onload = () => {
    qrImg.classList.remove('hidden');
    qrPlaceholder.classList.add('hidden');
  };
  qrImg.onerror = () => {
    qrImg.classList.add('hidden');
    qrPlaceholder.classList.remove('hidden');
  };
  // Trigger load check
  if (qrImg.complete && qrImg.naturalWidth > 0) {
    qrImg.onload();
  }
}


// ══════════════════════════════════════════════
// 3D INTRO SCREEN
// ══════════════════════════════════════════════
let introTypeTimer = null;
let introAutoTimer = null;

(function initIntro() {
  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  // Create floating particles (responsive count: 30 on mobile, 55 on desktop for best performance)
  const particleContainer = document.getElementById('introParticles');
  if (particleContainer) {
    const particleCount = window.innerWidth < 600 ? 30 : 55;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'intro-particle';
      p.style.cssText = [
        'left:' + Math.random() * 100 + '%',
        'width:' + (Math.random() * 3 + 1) + 'px',
        'height:' + (Math.random() * 3 + 1) + 'px',
        'animation-duration:' + (Math.random() * 8 + 8) + 's',
        'animation-delay:' + (Math.random() * 8) + 's',
        '--drift:' + ((Math.random() - 0.5) * 120) + 'px',
        'opacity:' + (Math.random() * 0.5 + 0.3),
        'background:' + (Math.random() > 0.5 ? 'rgba(0,212,170,0.8)' : Math.random() > 0.5 ? 'rgba(124,58,237,0.8)' : 'rgba(251,191,36,0.8)')
      ].join(';');
      particleContainer.appendChild(p);
    }
  }

  // Typewriter effect
  const fullText = "Scroll and explore all the avenues of financial assistance to make your academic journey smooth and perfect.";
  const typeEl = document.getElementById('introTypewriter');
  const cursorEl = document.getElementById('introCursor');
  const enterBtn = document.getElementById('introEnterBtn');
  let charIndex = 0;

  function typeChar() {
    if (!typeEl || !overlay || overlay.classList.contains('exit')) return;
    if (charIndex < fullText.length) {
      typeEl.textContent += fullText[charIndex];
      charIndex++;
      const ch = fullText[charIndex - 1];
      const delay = ch === '.' ? 400 : ch === ',' ? 200 : ch === ' ' ? 60 : Math.random() * 35 + 25;
      introTypeTimer = setTimeout(typeChar, delay);
    } else {
      // Typing done — show button
      if (cursorEl) cursorEl.style.animation = 'none';
      if (enterBtn) {
        enterBtn.classList.remove('hidden');
        enterBtn.style.animation = 'btnPulse 2s ease-in-out infinite';
      }
      // Auto-dismiss after 6 seconds of inactivity
      introAutoTimer = setTimeout(dismissIntro, 6000);
    }
  }

  // Start typing after short delay
  introTypeTimer = setTimeout(typeChar, 700);

  // Auto-dismiss after 14 seconds total
  setTimeout(dismissIntro, 14000);
})();

function dismissIntro() {
  if (introTypeTimer) clearTimeout(introTypeTimer);
  if (introAutoTimer) clearTimeout(introAutoTimer);
  const overlay = document.getElementById('introOverlay');
  if (!overlay || overlay.classList.contains('exit')) return;
  overlay.classList.add('exit');
  setTimeout(function() {
    overlay.classList.add('gone');
    document.body.style.overflow = '';
  }, 850);
}

// Prevent scroll during intro
document.body.style.overflow = 'hidden';

// ══════════════════════════════════════════════
// CONTACT & FEEDBACK (ScholarPathIndia@proton.me)
// ══════════════════════════════════════════════
function copyContactEmail(btn) {
  const email = 'ScholarPathIndia@proton.me';
  const originalHTML = btn.innerHTML;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email).then(() => {
      btn.innerHTML = '<span class="copy-text">✅ Copied!</span>';
      setTimeout(() => { btn.innerHTML = originalHTML; }, 2500);
    }).catch(() => fallbackCopy(email, btn, originalHTML));
  } else {
    fallbackCopy(email, btn, originalHTML);
  }
}

function fallbackCopy(text, btn, originalHTML) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    btn.innerHTML = '<span class="copy-text">✅ Copied!</span>';
    setTimeout(() => { btn.innerHTML = originalHTML; }, 2500);
  } catch (err) {
    btn.innerHTML = '<span class="copy-text">❌ Copy failed</span>';
    setTimeout(() => { btn.innerHTML = originalHTML; }, 2500);
  }
  document.body.removeChild(tempInput);
}

function focusFeedbackForm() {
  const block = document.getElementById('feedbackFormBlock');
  if (block) {
    block.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const nameInput = document.getElementById('contactSenderName');
    if (nameInput) setTimeout(() => nameInput.focus(), 400);
  }
}

function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('contactSenderName').value.trim();
  const category = document.getElementById('contactCategory').value;
  const message = document.getElementById('contactMessage').value.trim();
  const resultEl = document.getElementById('contactFormResult');

  const subject = encodeURIComponent(`[ScholarPath India] ${category} from ${name}`);
  const body = encodeURIComponent(
    `Hello ScholarPath India Team,\n\n` +
    `Sender: ${name}\n` +
    `Category: ${category}\n\n` +
    `Message / Suggestion / Feedback:\n${message}\n\n` +
    `---\nSent via ScholarPath India Student Portal`
  );

  const mailtoLink = `mailto:ScholarPathIndia@proton.me?subject=${subject}&body=${body}`;

  // Open default email client
  window.location.href = mailtoLink;

  if (resultEl) {
    resultEl.classList.remove('hidden');
    resultEl.style.background = 'rgba(34, 197, 94, 0.15)';
    resultEl.style.border = '1px solid rgba(34, 197, 94, 0.35)';
    resultEl.style.color = 'var(--success)';
    resultEl.innerHTML = `
      <strong>✅ Email Client Opened!</strong><br/>
      Your message draft has been transferred to your email app ready to send to <strong>ScholarPathIndia@proton.me</strong>.<br/>
      If your email client didn't open automatically, <a href="${mailtoLink}" style="color:var(--accent);text-decoration:underline;">click here to open manually</a>.
    `;
  }
}
