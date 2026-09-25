import { store } from './store.js';
import { renderHome } from './views/homeView.js';
import { renderPost } from './views/postView.js';
import { renderBookmarks } from './views/bookmarksView.js';

class Router {
  constructor(viewportEl) {
    this.viewport = viewportEl;
    this.currentRoute = null;
    this.currentParam = null;

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash || '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset reading progress bar
    const progressBar = document.getElementById('reading-progress');
    if (progressBar) progressBar.style.width = '0%';

    // Route matching
    if (hash === '#/' || hash === '') {
      this.currentRoute = 'home';
      this.currentParam = null;
      renderHome(this.viewport);
      this.updateNavState('home');
    } else if (hash.startsWith('#/post/')) {
      const id = hash.replace('#/post/', '');
      this.currentRoute = 'post';
      this.currentParam = id;
      renderPost(this.viewport, id);
      this.updateNavState('post');
    } else if (hash.startsWith('#/category/')) {
      const cat = decodeURIComponent(hash.replace('#/category/', ''));
      this.currentRoute = 'home';
      this.currentParam = cat;
      store.filters.category = cat;
      store.filters.tag = null;
      store.pagination.currentPage = 1;
      renderHome(this.viewport);
      this.updateNavState('category');
    } else if (hash.startsWith('#/tag/')) {
      const tag = decodeURIComponent(hash.replace('#/tag/', ''));
      this.currentRoute = 'home';
      this.currentParam = tag;
      store.filters.tag = tag;
      store.filters.category = 'All';
      store.pagination.currentPage = 1;
      renderHome(this.viewport);
      this.updateNavState('tag');
    } else if (hash === '#/bookmarks') {
      this.currentRoute = 'bookmarks';
      this.currentParam = null;
      renderBookmarks(this.viewport);
      this.updateNavState('bookmarks');
    } else {
      // Fallback
      window.location.hash = '#/';
    }
  }

  updateNavState(route) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const navRoute = link.getAttribute('data-route');
      if (navRoute === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  refreshCurrentView() {
    if (this.currentRoute === 'home') {
      renderHome(this.viewport);
    } else if (this.currentRoute === 'post' && this.currentParam) {
      renderPost(this.viewport, this.currentParam);
    } else if (this.currentRoute === 'bookmarks') {
      renderBookmarks(this.viewport);
    }
  }
}

export let router = null;

export function initRouter(viewportEl) {
  router = new Router(viewportEl);
  router.init();
  return router;
}
