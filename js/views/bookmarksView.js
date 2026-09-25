import { store } from '../store.js';

export function renderBookmarks(container) {
  const bookmarkedArticles = store.getBookmarkedArticles();

  const html = `
    <div class="bookmarks-page">
      <div class="section-header">
        <div>
          <h2 class="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            Saved Reading List
          </h2>
          <p class="section-subtitle">Articles you have saved to read later (${bookmarkedArticles.length} item${bookmarkedArticles.length === 1 ? '' : 's'})</p>
        </div>
        ${bookmarkedArticles.length > 0 ? `
          <button class="btn-clear-filters" id="btn-clear-all-bookmarks" style="font-size: 0.9rem;">Clear All Saved</button>
        ` : ''}
      </div>

      ${bookmarkedArticles.length > 0 ? `
        <div class="blog-cards-grid">
          ${bookmarkedArticles.map(article => `
            <article class="blog-card" data-id="${article.id}">
              <div class="card-media-wrapper">
                <img src="${article.coverImage}" alt="${article.title}" class="card-image" loading="lazy" />
                <span class="card-category-badge">${article.category}</span>
                <button class="card-bookmark-btn bookmarked" data-id="${article.id}" title="Remove bookmark">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
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

                <div class="card-footer">
                  <div class="card-author">
                    <img src="${article.author.avatar}" alt="${article.author.name}" class="card-author-img" loading="lazy" />
                    <span class="card-author-name">${article.author.name}</span>
                  </div>
                  <a href="#/post/${article.id}" style="color: var(--primary); text-decoration: none; font-size: 0.88rem; font-weight: 600;">Read Now →</a>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3>No saved articles</h3>
          <p>You haven't bookmarked any articles yet. Browse our stories and click the bookmark icon to save them here for later reading.</p>
          <a href="#/" class="btn-primary">Explore Stories</a>
        </div>
      `}
    </div>
  `;

  container.innerHTML = html;

  // Event handlers
  container.querySelectorAll('.card-bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      store.toggleBookmark(id);
      renderBookmarks(container);
      window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Removed from bookmarks' } }));
    });
  });

  const clearAllBtn = container.querySelector('#btn-clear-all-bookmarks');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your saved reading list?')) {
        bookmarkedArticles.forEach(a => store.toggleBookmark(a.id));
        renderBookmarks(container);
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Cleared all bookmarks' } }));
      }
    });
  }
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}
