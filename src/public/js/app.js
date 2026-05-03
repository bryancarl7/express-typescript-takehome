const API = '/api/searches';
let currentUsername = '';
let activeSortField = null;
let currentMode = null; // 'search' | 'history'

const ACTION_BUTTONS = ['searchBtn', 'clearBtn', 'listPreviousBtn'];

function setButtonsDisabled(disabled) {
    ACTION_BUTTONS.forEach(id => {
        document.getElementById(id).disabled = disabled;
    });
    document.querySelectorAll('.sort-bar button').forEach(btn => {
        btn.disabled = disabled;
    });
}

function showLoader() {
    document.getElementById('loader').classList.remove('d-none');
    document.getElementById('results').classList.add('d-none');
    setButtonsDisabled(true);
}

function hideLoader() {
    document.getElementById('loader').classList.add('d-none');
    setButtonsDisabled(false);
}

async function search() {
    const username = document.getElementById('username').value.trim();
    const searchTerm = document.getElementById('searchTerm').value.trim();

    if (!username || !searchTerm) {
        showError('Please fill in both Username and Search Term.');
        return;
    }

    hideError();
    currentUsername = username;
    activeSortField = null;
    updateSortButtons(null);
    showLoader();

    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, searchTerm })
        });

        if (!res.ok) throw new Error();
        const data = await res.json();
        hideLoader();
        currentMode = 'search';
        setSortButtonVisibility('search');
        renderSearchResults(data.titles, data.resultCount, false);
    } catch {
        hideLoader();
        showError('Search failed. Please try again.');
    }
}

async function listPrevious() {
    const username = document.getElementById('username').value.trim();

    if (!username) {
        showError('Please enter a Username to list previous searches.');
        return;
    }

    hideError();
    currentUsername = username;
    activeSortField = null;
    currentMode = 'history';
    setSortButtonVisibility('history');
    showLoader();
    await fetchHistory();
}

async function fetchHistory(sort) {
    let url = `${API}?username=${encodeURIComponent(currentUsername)}`;
    if (sort) url += `&sort=${sort}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        hideLoader();
        renderHistory(data);
        updateSortButtons(sort);
    } catch {
        hideLoader();
        showError('Failed to load history. Please try again.');
    }
}

function sortHistory(field) {
    activeSortField = field;
    showLoader();
    if (currentMode === 'search') {
        fetchSortedTitles();
    } else {
        fetchHistory(field);
    }
}

async function fetchSortedTitles() {
    try {
        const res = await fetch(`${API}/sort-titles?username=${encodeURIComponent(currentUsername)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.error) { hideLoader(); showError(data.error); return; }
        hideLoader();
        renderSearchResults(data.titles, null, true);
        updateSortButtons('username');
    } catch {
        hideLoader();
        showError('Failed to sort results. Please try again.');
    }
}

function updateSortButtons(activeField) {
    document.querySelectorAll('.sort-bar button').forEach(btn => btn.classList.remove('active'));
    if (!activeField) return;
    const map = { username: 'sortByName', searchTerm: 'sortBySearchTerm', resultCount: 'sortByCount' };
    const id = map[activeField];
    if (id) document.getElementById(id).classList.add('active');
}

function setSortButtonVisibility(mode) {
    const historyOnly = ['sortBySearchTerm', 'sortByCount'];
    historyOnly.forEach(id => {
        document.getElementById(id).style.display = mode === 'history' ? '' : 'none';
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderSearchResults(titles, resultCount, isSorted) {
    if (!titles || titles.length === 0) {
        document.getElementById('resultsContent').innerHTML =
            '<p style="color:rgba(255,255,255,0.4); text-align:center; padding: 2rem 0;">No results found. Try a different search term.</p>';
        document.getElementById('results').classList.remove('d-none');
        return;
    }

    const items = titles.map((t, i) => `
        <div class="book-item">
            <div class="book-index">${i + 1}</div>
            <span>${escapeHtml(t)}</span>
        </div>
    `).join('');

    const meta = isSorted
        ? `Showing ${titles.length} titles &mdash; sorted A&ndash;Z`
        : `Found <strong>${resultCount.toLocaleString()}</strong> results &mdash; showing first 10 titles`;

    document.getElementById('resultsContent').innerHTML = `
        <p class="results-meta">${meta}</p>
        ${items}
    `;
    document.getElementById('results').classList.remove('d-none');
}

function renderHistory(data) {
    const header = `<p class="results-meta" style="margin-bottom:1rem;">History for <strong>${escapeHtml(currentUsername)}</strong></p>`;

    if (data.length === 0) {
        document.getElementById('resultsContent').innerHTML =
            header + '<p style="color:rgba(255,255,255,0.4); text-align:center; padding: 2rem 0;">No previous searches found.</p>';
    } else {
        const rows = data.map(item => `
            <div class="history-row">
                <span>${escapeHtml(item.username)}</span>
                <span>${escapeHtml(item.searchTerm)}</span>
                <span class="badge-count">${item.resultCount.toLocaleString()}</span>
                <span class="date-label">${new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
        `).join('');

        document.getElementById('resultsContent').innerHTML = `
            ${header}
            <div class="history-header">
                <span>Username</span>
                <span>Search Term</span>
                <span>Results</span>
                <span>Date</span>
            </div>
            ${rows}
        `;
    }
    document.getElementById('results').classList.remove('d-none');
}

function clear() {
    document.getElementById('username').value = '';
    document.getElementById('searchTerm').value = '';
    document.getElementById('resultsContent').innerHTML = '';
    document.getElementById('results').classList.add('d-none');
    document.getElementById('loader').classList.add('d-none');
    hideError();
    currentUsername = '';
    activeSortField = null;
    currentMode = null;
    updateSortButtons(null);
    setSortButtonVisibility('history');
    setButtonsDisabled(false);
}

function showError(msg) {
    const el = document.getElementById('error');
    el.textContent = msg;
    el.classList.remove('d-none');
}

function hideError() {
    document.getElementById('error').classList.add('d-none');
}

document.getElementById('searchBtn').addEventListener('click', search);
document.getElementById('clearBtn').addEventListener('click', clear);
document.getElementById('listPreviousBtn').addEventListener('click', listPrevious);
document.getElementById('searchTerm').addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
document.getElementById('username').addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
