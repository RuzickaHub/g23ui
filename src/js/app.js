/**
 * Command Center Dashboard
 * Hlavní JavaScript soubor
 */

// Konfigurace aplikace
const CONFIG = {
    dataUrl: '../src/data/dashboard-data.json',
    version: '1.0.0',
    defaultView: 'categories',
    cacheTime: 5 * 60 * 1000, // 5 minut cache
    notificationDuration: 3000 // 3 sekundy
};

// State management
let state = {
    currentView: CONFIG.defaultView,
    currentCategory: null,
    filteredItems: [],
    currentSearchTerm: '',
    dashboardData: null,
    isLoading: true,
    lastUpdate: null
};

// DOM elements cache
const elements = {};

// Initialize app
document.addEventListener('DOMContentLoaded', initApp);

/**
 * Inicializace aplikace
 */
async function initApp() {
    try {
        // Initialize DOM elements
        initializeDOMElements();
        
        // Setup event listeners
        setupEventListeners();
        
        // Load data
        await loadDashboardData();
        
        // Show initial view
        showCategories();
        
        // Update status
        updateStatusBar();
        
        // Set loading to false
        state.isLoading = false;
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Nepodařilo se načíst data aplikace.');
    }
}

/**
 * Inicializace DOM elementů
 */
function initializeDOMElements() {
    elements.dashboardGrid = document.getElementById('dashboardGrid');
    elements.searchInput = document.getElementById('searchInput');
    elements.backButton = document.getElementById('backButton');
    elements.breadcrumb = document.getElementById('breadcrumb');
    elements.itemCount = document.getElementById('itemCount');
    elements.modalOverlay = document.getElementById('modalOverlay');
    elements.modalClose = document.getElementById('modalClose');
    elements.modalOpenBtn = document.getElementById('modalOpenBtn');
    elements.modalCopyBtn = document.getElementById('modalCopyBtn');
    elements.modalTitle = document.getElementById('modalTitle');
    elements.modalAppName = document.getElementById('modalAppName');
    elements.modalAppUrl = document.getElementById('modalAppUrl');
    elements.modalAppIcon = document.getElementById('modalAppIcon');
    elements.modalCategory = document.getElementById('modalCategory');
    elements.modalDescription = document.getElementById('modalDescription');
}

/**
 * Nastavení event listenerů
 */
function setupEventListeners() {
    // Search input
    elements.searchInput.addEventListener('input', handleSearch);
    
    // Back button
    elements.backButton.addEventListener('click', showCategories);
    
    // Modal close button
    elements.modalClose.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) {
            closeModal();
        }
    });
    
    // Modal action buttons
    elements.modalOpenBtn.addEventListener('click', openCurrentApp);
    elements.modalCopyBtn.addEventListener('click', copyAppUrl);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Breadcrumb navigation
    elements.breadcrumb.addEventListener('click', handleBreadcrumbClick);
}

/**
 * Načtení dat z JSON souboru
 */
async function loadDashboardData() {
    try {
        showLoading();
        
        // Check cache first
        const cachedData = getCachedData();
        if (cachedData && !isCacheExpired(cachedData.timestamp)) {
            state.dashboardData = cachedData.data;
            state.lastUpdate = cachedData.timestamp;
            return;
        }
        
        // Fetch fresh data
        const response = await fetch(CONFIG.dataUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        state.dashboardData = await response.json();
        state.lastUpdate = Date.now();
        
        // Cache the data
        cacheData(state.dashboardData);
        
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

/**
 * Cache management
 */
function cacheData(data) {
    try {
        const cache = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem('dashboardCache', JSON.stringify(cache));
    } catch (error) {
        console.warn('Could not cache data:', error);
    }
}

function getCachedData() {
    try {
        const cached = localStorage.getItem('dashboardCache');
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.warn('Could not retrieve cached data:', error);
        return null;
    }
}

function isCacheExpired(timestamp) {
    return Date.now() - timestamp > CONFIG.cacheTime;
}

/**
 * Zobrazení kategorií
 */
function showCategories() {
    state.currentView = 'categories';
    state.currentCategory = null;
    elements.backButton.classList.add('hidden');
    
    updateBreadcrumb();
    
    // Filter categories based on search
    if (state.currentSearchTerm) {
        state.filteredItems = state.dashboardData.categories.filter(category => 
            category.name.toLowerCase().includes(state.currentSearchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(state.currentSearchTerm.toLowerCase())
        );
    } else {
        state.filteredItems = state.dashboardData.categories;
    }
    
    renderCategories(state.filteredItems);
    updateItemCount();
    updateSearchPlaceholder('Hledat kategorie...');
}

/**
 * Zobrazení aplikací v kategorii
 */
function showApps(categoryId) {
    state.currentView = 'apps';
    state.currentCategory = categoryId;
    elements.backButton.classList.remove('hidden');
    
    const category = state.dashboardData.categories.find(cat => cat.id === categoryId);
    updateBreadcrumb(category ? category.name : 'Aplikace');
    
    // Filter apps based on search
    let apps = state.dashboardData.apps.filter(app => app.category === categoryId);
    
    if (state.currentSearchTerm) {
        apps = apps.filter(app => 
            app.name.toLowerCase().includes(state.currentSearchTerm.toLowerCase()) ||
            app.description.toLowerCase().includes(state.currentSearchTerm.toLowerCase())
        );
    }
    
    state.filteredItems = apps;
    renderApps(apps);
    updateItemCount();
    updateSearchPlaceholder(`Hledat v ${category ? category.name.toLowerCase() : 'kategorii'}...`);
}

/**
 * Renderování kategorií
 */
function renderCategories(categories) {
    if (!categories || categories.length === 0) {
        showNoResults();
        return;
    }
    
    clearDashboardGrid();
    
    categories.forEach(category => {
        const card = createCardElement(category, true);
        card.addEventListener('click', () => showApps(category.id));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showApps(category.id);
            }
        });
        
        elements.dashboardGrid.appendChild(card);
    });
}

/**
 * Renderování aplikací
 */
function renderApps(apps) {
    if (!apps || apps.length === 0) {
        showNoResults();
        return;
    }
    
    clearDashboardGrid();
    
    apps.forEach(app => {
        const card = createCardElement(app, false);
        card.addEventListener('click', () => openAppModal(app));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openAppModal(app);
            }
        });
        
        elements.dashboardGrid.appendChild(card);
    });
}

/**
 * Vytvoření karty
 */
function createCardElement(item, isCategory) {
    const card = document.createElement('div');
    card.className = 'card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${isCategory ? 'Kategorie' : 'Aplikace'} ${item.name}`);
    
    // Extract domain from URL for apps
    let urlDisplay = '';
    if (!isCategory && item.url) {
        try {
            const url = new URL(item.url);
            urlDisplay = `<div class="card-url" aria-label="URL: ${url.hostname}">${url.hostname}</div>`;
        } catch (e) {
            urlDisplay = `<div class="card-url">${item.url}</div>`;
        }
    }
    
    card.innerHTML = `
        <div class="card-icon" aria-hidden="true">
            <img src="${item.icon}" alt="${item.name}" loading="lazy">
        </div>
        <span class="card-title">${item.name}</span>
        ${urlDisplay}
    `;
    
    return card;
}

/**
 * Otevření modálního okna s detailem aplikace
 */
function openAppModal(app) {
    const category = state.dashboardData.categories.find(cat => cat.id === app.category);
    
    // Update modal content
    elements.modalAppName.textContent = app.name;
    elements.modalTitle.textContent = app.name;
    elements.modalAppIcon.innerHTML = `<img src="${app.icon}" alt="${app.name}" loading="lazy">`;
    elements.modalDescription.textContent = app.description;
    elements.modalCategory.textContent = category ? category.name : app.category;
    
    // Set URL
    try {
        const url = new URL(app.url);
        elements.modalAppUrl.textContent = url.hostname;
        elements.modalAppUrl.setAttribute('title', app.url);
    } catch (e) {
        elements.modalAppUrl.textContent = app.url;
    }
    
    // Store current app for actions
    elements.modalOpenBtn.dataset.url = app.url;
    
    // Show modal
    elements.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    setTimeout(() => {
        elements.modalClose.focus();
    }, 100);
}

/**
 * Otevření aktuální aplikace v novém tabu
 */
function openCurrentApp() {
    const url = elements.modalOpenBtn.dataset.url;
    if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
        closeModal();
    }
}

/**
 * Kopírování URL aplikace
 */
async function copyAppUrl() {
    const url = elements.modalOpenBtn.dataset.url;
    if (url) {
        try {
            await navigator.clipboard.writeText(url);
            showNotification('URL zkopírována', 'Adresa byla zkopírována do schránky.', 'success');
        } catch (error) {
            console.error('Failed to copy:', error);
            showNotification('Chyba', 'Nepodařilo se zkopírovat URL.', 'error');
        }
    }
}

/**
 * Zavření modálního okna
 */
function closeModal() {
    elements.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Return focus to the element that opened the modal
    const focusedCard = document.querySelector('.card:focus');
    if (focusedCard) {
        focusedCard.focus();
    }
}

/**
 * Zpracování vyhledávání
 */
function handleSearch(e) {
    state.currentSearchTerm = e.target.value.trim();
    
    if (state.currentView === 'categories') {
        showCategories();
    } else if (state.currentView === 'apps' && state.currentCategory) {
        showApps(state.currentCategory);
    }
}

/**
 * Aktualizace breadcrumb navigace
 */
function updateBreadcrumb(categoryName = null) {
    elements.breadcrumb.innerHTML = '';
    
    // Categories link
    const categoriesItem = document.createElement('div');
    categoriesItem.className = `breadcrumb-item ${state.currentView === 'categories' ? 'active' : ''}`;
    categoriesItem.textContent = 'Kategorie';
    categoriesItem.dataset.view = 'categories';
    categoriesItem.setAttribute('role', 'button');
    elements.breadcrumb.appendChild(categoriesItem);
    
    // Category name if in apps view
    if (state.currentView === 'apps' && categoryName) {
        const separator = document.createElement('div');
        separator.className = 'breadcrumb-separator';
        separator.innerHTML = '<i class="fas fa-chevron-right" aria-hidden="true"></i>';
        separator.setAttribute('aria-hidden', 'true');
        elements.breadcrumb.appendChild(separator);
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'breadcrumb-item active';
        categoryItem.textContent = categoryName;
        categoryItem.dataset.view = 'apps';
        elements.breadcrumb.appendChild(categoryItem);
    }
}

/**
 * Zpracování kliknutí na breadcrumb
 */
function handleBreadcrumbClick(e) {
    if (e.target.classList.contains('breadcrumb-item')) {
        const view = e.target.dataset.view;
        if (view === 'categories') {
            showCategories();
        } else if (view === 'apps' && state.currentCategory) {
            const category = state.dashboardData.categories.find(cat => cat.id === state.currentCategory);
            showApps(state.currentCategory);
        }
    }
}

/**
 * Aktualizace počtu položek
 */
function updateItemCount() {
    const count = state.filteredItems.length;
    const viewText = state.currentView === 'categories' ? 'kategorií' : 'aplikací';
    elements.itemCount.textContent = `${count} ${viewText}`;
    elements.itemCount.setAttribute('aria-live', 'polite');
}

/**
 * Aktualizace status baru
 */
function updateStatusBar() {
    const lastUpdate = state.lastUpdate ? 
        new Date(state.lastUpdate).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }) : 
        'Nedostupné';
    
    // You can add more status information here
}

/**
 * Aktualizace placeholderu vyhledávání
 */
function updateSearchPlaceholder(text) {
    elements.searchInput.placeholder = text;
}

/**
 * Zobrazení načítání
 */
function showLoading() {
    clearDashboardGrid();
    elements.dashboardGrid.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner" aria-hidden="true"></div>
            <p>Načítám data...</p>
        </div>
    `;
}

/**
 * Zobrazení chyby
 */
function showError(message) {
    clearDashboardGrid();
    elements.dashboardGrid.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon" aria-hidden="true">⚠️</div>
            <h3>Chyba načtení</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 1rem;">
                <i class="fas fa-redo"></i>
                <span>Zkusit znovu</span>
            </button>
        </div>
    `;
}

/**
 * Zobrazení žádných výsledků
 */
function showNoResults() {
    clearDashboardGrid();
    elements.dashboardGrid.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon" aria-hidden="true">🔍</div>
            <h3>Žádné položky nenalezeny</h3>
            <p>Zkuste změnit hledaný výraz nebo zobrazit jinou kategorii</p>
        </div>
    `;
}

/**
 * Vyčištění gridu
 */
function clearDashboardGrid() {
    elements.dashboardGrid.innerHTML = '';
}

/**
 * Zobrazení notifikace
 */
function showNotification(title, message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ️';
    
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" aria-label="Zavřít notifikaci">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Auto-remove notification
    const removeTimeout = setTimeout(() => {
        closeNotification(notification);
    }, CONFIG.notificationDuration);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(removeTimeout);
        closeNotification(notification);
    });
}

/**
 * Zavření notifikace
 */
function closeNotification(notification) {
    notification.classList.remove('active');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

/**
 * Zpracování klávesových zkratek
 */
function handleKeyboardShortcuts(e) {
    // Escape closes modal
    if (e.key === 'Escape' && elements.modalOverlay.classList.contains('active')) {
        closeModal();
        e.preventDefault();
        return;
    }
    
    // Ctrl/Cmd + F focuses search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        elements.searchInput.focus();
        return;
    }
    
    // Ctrl/Cmd + K focuses search (common shortcut)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elements.searchInput.focus();
        return;
    }
    
    // Tab navigation for cards
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const cards = document.querySelectorAll('.card');
        if (cards.length === 0) return;
        
        const currentIndex = Array.from(cards).findIndex(card => card === document.activeElement);
        let nextIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowRight':
                nextIndex = (currentIndex + 1) % cards.length;
                break;
            case 'ArrowLeft':
                nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
                break;
            case 'ArrowDown':
                const columns = getComputedStyle(elements.dashboardGrid).gridTemplateColumns.split(' ').length;
                nextIndex = (currentIndex + columns) % cards.length;
                break;
            case 'ArrowUp':
                const columnsUp = getComputedStyle(elements.dashboardGrid).gridTemplateColumns.split(' ').length;
                nextIndex = currentIndex - columnsUp;
                if (nextIndex < 0) nextIndex = cards.length + nextIndex;
                break;
        }
        
        if (nextIndex >= 0 && nextIndex < cards.length) {
            cards[nextIndex].focus();
            e.preventDefault();
        }
    }
}

/**
 * Formátování data
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('cs-CZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Public API pro vývoj (pokud je potřeba)
window.DashboardApp = {
    refreshData: async () => {
        state.isLoading = true;
        await loadDashboardData();
        state.isLoading = false;
        if (state.currentView === 'categories') {
            showCategories();
        } else if (state.currentCategory) {
            showApps(state.currentCategory);
        }
        showNotification('Data obnovena', 'Data byla úspěšně načtena znovu.', 'success');
    },
    
    getState: () => ({ ...state }),
    
    getStats: () => {
        if (!state.dashboardData) return null;
        return {
            categories: state.dashboardData.categories.length,
            apps: state.dashboardData.apps.length,
            lastUpdate: state.lastUpdate
        };
    }
};