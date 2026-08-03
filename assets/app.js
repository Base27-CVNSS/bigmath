(() => {
  'use strict';

  const data = window.BIGMATH_DATA;
  if (!data) {
    document.body.insertAdjacentHTML('afterbegin', '<p class="data-error">Không thể nạp dữ liệu dashboard.</p>');
    return;
  }

  const documentsById = new Map(data.documents.map((doc) => [doc.id, doc]));
  const pageSize = 12;
  let currentPage = 1;
  let filtered = [...data.problems];

  const $ = (selector) => document.querySelector(selector);
  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
  const normalize = (value) => String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
  const dateVi = (date) => new Intl.DateTimeFormat('vi-VN').format(new Date(`${date}T00:00:00`));

  function updateStats() {
    const total = data.problems.length;
    const priority = data.priorities.length;
    const docs = data.documents.length;
    const local = data.problems.filter((item) => item.source !== 'bo-khcn').length;
    const national = total - local;

    ['#heroTotal', '#statProblems'].forEach((id) => { $(id).textContent = total; });
    ['#heroPriority', '#statPriorities'].forEach((id) => { $(id).textContent = priority; });
    ['#heroDocs', '#statDocuments'].forEach((id) => { $(id).textContent = docs; });
    $('#statAuthorities').textContent = docs;
    $('#nationalCount').textContent = national;
    $('#localCount').textContent = local;
    $('#levelDonut').style.background = `conic-gradient(var(--blue) 0 ${(national / total) * 100}%, var(--cyan) ${(national / total) * 100}% 100%)`;
  }

  function renderBars() {
    const counts = new Map();
    data.problems.forEach((item) => counts.set(item.authority, (counts.get(item.authority) || 0) + 1));
    const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const max = Math.max(...entries.map((entry) => entry[1]));
    $('#barChart').innerHTML = entries.map(([label, value]) => `
      <div class="bar-row" title="${escapeHtml(label)}: ${value}">
        <span class="bar-label">${escapeHtml(label)}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${(value / max) * 100}%"></span></span>
        <strong class="bar-value">${value}</strong>
      </div>`).join('');
  }

  function renderTopFields() {
    const counts = new Map();
    data.problems.forEach((item) => counts.set(item.field, (counts.get(item.field) || 0) + 1));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
    $('#fieldChips').innerHTML = top.map(([field, count]) => `<span class="field-chip">${escapeHtml(field)} · ${count}</span>`).join('');
  }

  function renderDocuments() {
    $('#documentGrid').innerHTML = data.documents.map((doc) => `
      <article class="document-card">
        <div class="document-top"><span class="doc-type">${escapeHtml(doc.level)}</span><time datetime="${doc.date}">${dateVi(doc.date)}</time></div>
        <h3>${escapeHtml(doc.number)}</h3>
        <p>${escapeHtml(doc.authority)}</p>
        <div class="doc-metrics">
          <div><strong>${doc.primaryCount}</strong><span>Bài toán chính</span></div>
          <div><strong>${doc.pages}</strong><span>Trang PDF</span></div>
          ${doc.priorityCount ? `<div><strong>${doc.priorityCount}</strong><span>Ưu tiên</span></div>` : ''}
        </div>
        <a href="${encodeURI(doc.path)}" target="_blank" rel="noopener">Mở ${escapeHtml(doc.type)} PDF ↗</a>
      </article>`).join('');
  }

  function renderPriorities() {
    $('#priorityList').innerHTML = data.priorities.map((item) => `
      <li><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.field)}</span></li>`).join('');
  }

  function populateFilters() {
    const sourceFilter = $('#sourceFilter');
    data.documents.forEach((doc) => sourceFilter.add(new Option(doc.place === 'Toàn quốc' ? 'Bộ KH&CN' : doc.place, doc.id)));

    [...new Set(data.problems.map((item) => item.year))].sort().forEach((year) => $('#yearFilter').add(new Option(year, year)));
    [...new Set(data.problems.map((item) => item.field))].sort((a, b) => a.localeCompare(b, 'vi')).forEach((field) => $('#fieldFilter').add(new Option(field, field)));
  }

  function renderTable() {
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(currentPage, pages);
    const start = (currentPage - 1) * pageSize;
    const rows = filtered.slice(start, start + pageSize);
    const table = $('#problemTable');
    const empty = $('#emptyState');

    table.innerHTML = rows.map((item) => {
      const doc = documentsById.get(item.source);
      return `<tr>
        <td>${escapeHtml(item.id.toUpperCase())}</td>
        <td>${escapeHtml(item.title)}</td>
        <td><span class="source-badge">${escapeHtml(item.authority)}</span></td>
        <td><span class="table-tag">${escapeHtml(item.field)}</span></td>
        <td>${escapeHtml(item.unit)}</td>
        <td><a href="${encodeURI(doc.path)}" target="_blank" rel="noopener">${escapeHtml(doc.number)} ↗</a></td>
      </tr>`;
    }).join('');

    empty.hidden = filtered.length !== 0;
    $('.table-scroll').hidden = filtered.length === 0;
    $('#resultCount').textContent = filtered.length;
    $('#pageInfo').textContent = `Trang ${currentPage} / ${pages}`;
    $('#prevPage').disabled = currentPage <= 1;
    $('#nextPage').disabled = currentPage >= pages;
  }

  function applyFilters() {
    const query = normalize($('#searchInput').value.trim());
    const source = $('#sourceFilter').value;
    const year = $('#yearFilter').value;
    const field = $('#fieldFilter').value;

    filtered = data.problems.filter((item) => {
      const haystack = normalize(`${item.title} ${item.unit} ${item.field} ${item.authority}`);
      return (!query || haystack.includes(query))
        && (source === 'all' || item.source === source)
        && (year === 'all' || String(item.year) === year)
        && (field === 'all' || item.field === field);
    });

    const active = [source !== 'all', year !== 'all', field !== 'all', Boolean(query)].filter(Boolean).length;
    $('#activeFilterText').textContent = active ? `· ${active} bộ lọc đang áp dụng` : '';
    currentPage = 1;
    renderTable();
  }

  function resetFilters() {
    $('#searchInput').value = '';
    $('#sourceFilter').value = 'all';
    $('#yearFilter').value = 'all';
    $('#fieldFilter').value = 'all';
    applyFilters();
  }

  function exportCsv() {
    const headers = ['Mã', 'Năm', 'Nguồn', 'Lĩnh vực', 'Đơn vị chủ trì/đề xuất', 'Tên bài toán', 'Văn bản'];
    const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const rows = filtered.map((item) => {
      const doc = documentsById.get(item.source);
      return [item.id.toUpperCase(), item.year, item.authority, item.field, item.unit, item.title, doc.number].map(quote).join(',');
    });
    const blob = new Blob([`\ufeff${headers.map(quote).join(',')}\n${rows.join('\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bigmath-bai-toan-lon-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function bindEvents() {
    $('#searchInput').addEventListener('input', applyFilters);
    ['#sourceFilter', '#yearFilter', '#fieldFilter'].forEach((id) => $(id).addEventListener('change', applyFilters));
    $('#resetFilters').addEventListener('click', resetFilters);
    $('#exportCsv').addEventListener('click', exportCsv);
    $('#prevPage').addEventListener('click', () => { currentPage -= 1; renderTable(); document.querySelector('#danh-muc').scrollIntoView(); });
    $('#nextPage').addEventListener('click', () => { currentPage += 1; renderTable(); document.querySelector('#danh-muc').scrollIntoView(); });
  }

  updateStats();
  renderBars();
  renderTopFields();
  renderDocuments();
  renderPriorities();
  populateFilters();
  renderTable();
  bindEvents();
})();
