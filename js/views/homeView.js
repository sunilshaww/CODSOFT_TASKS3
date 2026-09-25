import { store } from '../store.js';

let currentViewMode = 'grid'; // 'grid' | 'list'

export function renderHome(container) {
  const allArticles = store.articles;
  const filteredArticles = store.getFilteredArticles();
  const featuredArticles = store.getFeaturedArticles();
  const heroArticle = featuredArticles[0] || allArticles[0];
  const trendingArticles = featuredArticles.slice(1, 3);
  const allTags = store.getAllTags();

  // Pagination calculation
  const totalFiltered = filteredArticles.length;
  const postsToShow = store.pagination.currentPage * store.pagination.postsPerPage;
  const paginatedArticles = filteredArticles.slice(0, postsToShow);
  const hasMore = postsToShow < totalFiltered;

  // Active filters check
  const isFiltered = store.filters.category !== 'All' || 
                     !!store.filters.tag || 
                     !!store.filters.searchQuery;

  // Calculate post count per category
  const categoryCounts = {
    all: allArticles.length
  };
  store.categories.forEach(cat => {
    if (cat.slug !== 'all') {
      categoryCounts[cat.slug] = allArticles.filter(
        a => a.category.toLowerCase() === cat.name.toLowerCase()
      ).length;
    }
  });

  const html = `
    <div class="home-page">
      ${!isFiltered ? `
        <!-- Hero Featured Section -->
        <section class="featured-section">
          <div class="section-header">
            <div>
              <h2 class="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Featured Stories
              </h2>
              <p class="section-subtitle">Hand-picked insights, deep architectural perspectives, and design essays</p>
            </div>
          </div>

          <div class="hero-featured-card">
            <div class="hero-media-wrapper">
              <img src="${heroArticle.coverImage}" alt="${heroArticle.title}" class="hero-image" loading="lazy" />
              <span class="hero-badge-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Editor's Pick
              </span>
            </div>
            <div class="hero-content">
              <div class="post-meta-inline">
                <span class="category-tag">${heroArticle.category}</span>
                <span>•</span>
                <span>${heroArticle.readTime}</span>
                <span>•</span>
                <span>${formatDate(heroArticle.publishedAt)}</span>
              </div>
              <h3 class="hero-title">
                <a href="#/post/${heroArticle.id}">${heroArticle.title}</a>
              </h3>
              <p class="hero-excerpt">${heroArticle.excerpt}</p>
              <div class="hero-footer">
                <div class="author-snippet">
                  <img src="${heroArticle.author.avatar}" alt="${heroArticle.author.name}" class="author-avatar" />
                  <div class="author-info-text">
                    <span class="author-name">${heroArticle.author.name}</span>
                    <span class="author-role">${heroArticle.author.role}</span>
                  </div>
                </div>
                <button class="btn-icon btn-bookmark-hero ${store.isBookmarked(heroArticle.id) ? 'bookmarked' : ''}" data-id="${heroArticle.id}" title="Save to bookmarks">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="${store.isBookmarked(heroArticle.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
              </div>
            </div>
          </div>

          ${trendingArticles.length > 0 ? `
            <div class="trending-grid">
              ${trendingArticles.map(article => `
                <div class="trending-card">
                  <div class="trending-thumb-wrapper">
                    <img src="${article.coverImage}" alt="${article.title}" class="trending-thumb" loading="lazy" />
                  </div>
                  <div class="trending-content">
                    <div class="post-meta-inline" style="margin-bottom: 0.2rem;">
                      <span class="category-tag" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">${article.category}</span>
                      <span>•</span>
                      <span style="font-size: 0.75rem;">${article.readTime}</span>
                    </div>
                    <h4 class="trending-title">
                      <a href="#/post/${article.id}">${article.title}</a>
                    </h4>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">${formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </section>
      ` : ''}

      <!-- Explore & Articles Section -->
      <section class="articles-main-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              All Articles
            </h2>
            <p class="section-subtitle">Filter by category, search keywords, or explore trending topics</p>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="toolbar-container">
          <div class="toolbar-top-row">
            <!-- Category Pills -->
            <div class="category-pills-list">
              ${store.categories.map(cat => {
                const isActive = (store.filters.category.toLowerCase() === cat.name.toLowerCase()) ||
                                 (cat.slug === 'all' && store.filters.category === 'All');
                const count = categoryCounts[cat.slug] || 0;
                return `
                  <button class="pill-btn ${isActive ? 'active' : ''}" data-category="${cat.name}">
                    ${cat.name}
                    <span class="pill-badge">${count}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Search & Controls -->
            <div class="toolbar-controls">
              <div class="search-input-wrapper">
                <svg class="search-icon-inside" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" class="search-input-field" id="inline-search" placeholder="Filter articles..." value="${escapeHtml(store.filters.searchQuery)}" />
                <button class="search-clear-btn ${store.filters.searchQuery ? 'visible' : ''}" id="clear-search-btn" title="Clear search">✕</button>
              </div>

              <select class="select-dropdown" id="sort-select">
                <option value="latest" ${store.filters.sortBy === 'latest' ? 'selected' : ''}>Latest First</option>
                <option value="popular" ${store.filters.sortBy === 'popular' ? 'selected' : ''}>Most Popular</option>
                <option value="readtime" ${store.filters.sortBy === 'readtime' ? 'selected' : ''}>Shortest Read</option>
              </select>

              <div class="view-toggle-group">
                <button class="view-btn ${currentViewMode === 'grid' ? 'active' : ''}" id="view-grid-btn" title="Grid View">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </button>
                <button class="view-btn ${currentViewMode === 'list' ? 'active' : ''}" id="view-list-btn" title="List View">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Tag Cloud Filter -->
          <div class="tag-cloud-row">
            <span class="tag-label">Tags:</span>
            ${allTags.map(tag => {
              const isActive = store.filters.tag && store.filters.tag.toLowerCase() === tag.toLowerCase();
              return `
                <button class="tag-pill ${isActive ? 'active' : ''}" data-tag="${tag}">
                  #${tag}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Active Filter Notification Bar -->
        <div class="active-filters-bar ${isFiltered ? 'visible' : ''}">
          <div>
            Showing filtered results for: 
            <strong>${store.filters.category !== 'All' ? `Category: ${store.filters.category}` : ''}</strong>
            <strong>${store.filters.tag ? ` #${store.filters.tag}` : ''}</strong>
            <strong>${store.filters.searchQuery ? ` "${store.filters.searchQuery}"` : ''}</strong>
            (${totalFiltered} match${totalFiltered === 1 ? '' : 'es'})
          </div>
          <button class="btn-clear-filters" id="btn-reset-filters">Reset Filters</button>
        </div>

        <!-- Articles Grid / List -->
        ${paginatedArticles.length > 0 ? `
          <div class="blog-cards-grid ${currentViewMode === 'list' ? 'list-view' : ''}">
            ${paginatedArticles.map(article => renderArticleCard(article)).join('')}
          </div>

          <!-- Pagination / Load More -->
          ${hasMore ? `
            <div class="pagination-wrapper">
              <button class="btn-load-more" id="btn-load-more">
                <span>Load More Articles</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div class="pagination-counter">
                Showing ${paginatedArticles.length} of ${totalFiltered} articles
              </div>
            </div>
          ` : `
            <div class="pagination-wrapper">
              <div class="pagination-counter">
                All ${totalFiltered} articles loaded.
              </div>
            </div>
          `}
        ` : `
          <!-- Empty State -->
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </div>
            <h3>No articles found</h3>
            <p>We couldn't find any articles matching your search criteria. Try clearing some filters or searching for different keywords.</p>
            <button class="btn-primary" id="btn-empty-reset">Clear All Filters</button>
          </div>
        `}
      </section>
    </div>
  `;

  container.innerHTML = html;
  attachHomeEventListeners(container);
}

function renderArticleCard(article) {
  const isBookmarked = store.isBookmarked(article.id);
  return `
    <article class="blog-card" data-id="${article.id}">
      <div class="card-media-wrapper">
        <img src="${article.coverImage}" alt="${article.title}" class="card-image" loading="lazy" />
        <span class="card-category-badge">${article.category}</span>
        <button class="card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-id="${article.id}" title="${isBookmarked ? 'Remove bookmark' : 'Save bookmark'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>

      <div class="card-body">
        <div class="card-meta-row">
          <span>${formatDate(article.publishedAt)}</span>
          <span class="card-meta-bullet">●</span>
          <span>${article.readTime}</span>
        </div>

        <h3 class="card-title">
          <a href="#/post/${article.id}">${article.title}</a>
        </h3>

        <p class="card-excerpt">${article.excerpt}</p>

        <div class="card-tags">
          ${article.tags.map(t => `<span class="card-tag-item">#${t}</span>`).join('')}
        </div>

        <div class="card-footer">
          <div class="card-author">
            <img src="${article.author.avatar}" alt="${article.author.name}" class="card-author-img" loading="lazy" />
            <span class="card-author-name">${article.author.name}</span>
          </div>
          <div class="card-stats">
            <span class="card-stat-item" title="Views">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              ${article.views}
            </span>
            <span class="card-stat-item" title="Comments">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              ${(store.getComments(article.id) || []).length}
            </span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function attachHomeEventListeners(container) {
  // Category Pill clicks
  container.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      store.setCategory(category);
    });
  });

  // Tag clicks
  container.querySelectorAll('.tag-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-tag');
      const nextTag = store.filters.tag === tag ? null : tag;
      store.setTag(nextTag);
    });
  });

  // Inline Search
  const searchInput = container.querySelector('#inline-search');
  const clearBtn = container.querySelector('#clear-search-btn');
  if (searchInput) {
    let timeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        store.setSearchQuery(e.target.value);
      }, 250);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      store.setSearchQuery('');
    });
  }

  // Sort dropdown
  const sortSelect = container.querySelector('#sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      store.setSortBy(e.target.value);
    });
  }

  // View mode toggles
  const viewGridBtn = container.querySelector('#view-grid-btn');
  const viewListBtn = container.querySelector('#view-list-btn');
  if (viewGridBtn && viewListBtn) {
    viewGridBtn.addEventListener('click', () => {
      currentViewMode = 'grid';
      const grid = container.querySelector('.blog-cards-grid');
      if (grid) grid.classList.remove('list-view');
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
    });

    viewListBtn.addEventListener('click', () => {
      currentViewMode = 'list';
      const grid = container.querySelector('.blog-cards-grid');
      if (grid) grid.classList.add('list-view');
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
    });
  }

  // Reset filters
  const resetBtn = container.querySelector('#btn-reset-filters');
  const emptyResetBtn = container.querySelector('#btn-empty-reset');
  [resetBtn, emptyResetBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        store.resetFilters();
      });
    }
  });

  // Load More Button
  const loadMoreBtn = container.querySelector('#btn-load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
        <span>Loading...</span>
      `;
      setTimeout(() => {
        store.loadMore();
      }, 200);
    });
  }

  // Bookmark buttons on cards
  container.querySelectorAll('.card-bookmark-btn, .btn-bookmark-hero').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const bookmarked = store.toggleBookmark(id);
      window.dispatchEvent(new CustomEvent('toast', {
        detail: {
          message: bookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks',
          type: 'info'
        }
      }));
    });
  });
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
}
