import { store } from './store.js';
import { initRouter, router } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme immediately
  document.documentElement.setAttribute('data-theme', store.theme);
  updateThemeIcon(store.theme);

  // Initialize Router
  const viewport = document.getElementById('app-viewport');
  initRouter(viewport);

  // Update Bookmark counter in header
  updateBookmarksBadge();

  // Listen for store notifications
  store.subscribe((event, payload) => {
    if (event === 'THEME_CHANGED') {
      updateThemeIcon(payload);
    } else if (event === 'BOOKMARK_TOGGLED') {
      updateBookmarksBadge();
      // If we are currently in bookmarks view or home view, refresh
      if (router && (router.currentRoute === 'bookmarks' || router.currentRoute === 'home')) {
        router.refreshCurrentView();
      }
    } else if (event === 'FILTERS_CHANGED' || event === 'PAGINATION_CHANGED') {
      if (router && router.currentRoute === 'home') {
        router.refreshCurrentView();
      }
    }
  });

  // Setup Global Event Handlers
  setupThemeToggle();
  setupSearchModal();
  setupMobileDrawer();
  setupBackToTop();
  setupToastListener();
  setupNewsletter();
  setupHeaderScrollEffect();
});

// --- Theme Toggle ---
function setupThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextTheme = store.toggleTheme();
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { message: `Switched to ${nextTheme} mode` }
      }));
    });
  });
}

function updateThemeIcon(theme) {
  const sunIcons = document.querySelectorAll('.theme-icon-sun');
  const moonIcons = document.querySelectorAll('.theme-icon-moon');
  if (theme === 'dark') {
    sunIcons.forEach(el => el.style.display = 'block');
    moonIcons.forEach(el => el.style.display = 'none');
  } else {
    sunIcons.forEach(el => el.style.display = 'none');
    moonIcons.forEach(el => el.style.display = 'block');
  }
}

// --- Bookmarks Badge ---
function updateBookmarksBadge() {
  const badge = document.getElementById('bookmarks-badge');
  if (!badge) return;
  const count = store.bookmarks.length;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

// --- Search Modal (Ctrl + K) ---
function setupSearchModal() {
  const modal = document.getElementById('search-modal');
  const openTriggers = document.querySelectorAll('.search-trigger, #mobile-search-btn');
  const closeBtn = document.getElementById('close-search-modal');
  const searchInput = document.getElementById('modal-search-input');
  const resultsContainer = document.getElementById('search-modal-results');

  const openModal = () => {
    modal.classList.add('open');
    searchInput.value = '';
    renderSearchResults('');
    setTimeout(() => searchInput.focus(), 50);
  };

  const closeModal = () => {
    modal.classList.remove('open');
  };

  openTriggers.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard shortcut Ctrl+K / Cmd+K and Esc
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('open')) {
        closeModal();
      } else {
        openModal();
      }
    } else if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Modal input filtering
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim());
    });
  }

  function renderSearchResults(query) {
    if (!query) {
      resultsContainer.innerHTML = `
        <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          Type to search articles by title, topic, author, or keywords...
        </div>
      `;
      return;
    }

    const q = query.toLowerCase();
    const matches = store.articles.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 6);

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          No articles found for "<strong>${escapeHtml(query)}</strong>"
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map(art => `
      <a href="#/post/${art.id}" class="search-result-item" onclick="document.getElementById('search-modal').classList.remove('open');">
        <img src="${art.coverImage}" alt="${art.title}" style="width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover;" />
        <div class="search-result-info">
          <div class="search-result-title">${highlightMatch(art.title, query)}</div>
          <div class="search-result-meta">
            <span style="color: var(--primary); font-weight: 600;">${art.category}</span>
            <span>•</span>
            <span>${art.readTime}</span>
            <span>•</span>
            <span>${art.author.name}</span>
          </div>
        </div>
      </a>
    `).join('');
  }
}

function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escapeHtml(text).replace(regex, '<mark style="background: rgba(99, 102, 241, 0.25); color: inherit; padding: 0 2px; border-radius: 2px;">$1</mark>');
}

// --- Mobile Drawer ---
function setupMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// --- Back to Top ---
function setupBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Toast System ---
function setupToastListener() {
  const container = document.getElementById('toast-container');
  window.addEventListener('toast', (e) => {
    const message = e.detail?.message || 'Action completed';
    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 3000);
  });
}

// --- Newsletter Subscription ---
function setupNewsletter() {
  const form = document.getElementById('footer-newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        window.dispatchEvent(new CustomEvent('toast', {
          detail: { message: `Thanks for subscribing with ${input.value}!` }
        }));
        input.value = '';
      }
    });
  }
}

// --- Header Scroll Effect ---
function setupHeaderScrollEffect() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
}
