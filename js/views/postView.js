import { store } from '../store.js';

let scrollHandler = null;

export function renderPost(container, articleId) {
  const article = store.getArticleById(articleId);

  if (!article) {
    container.innerHTML = `
      <div class="empty-state" style="margin-top: 3rem;">
        <h3>Article Not Found</h3>
        <p>The story you are looking for does not exist or may have been moved.</p>
        <a href="#/" class="btn-primary">Return to Homepage</a>
      </div>
    `;
    return;
  }

  // Related articles
  const relatedArticles = store.getRelatedArticles(article, 3);
  const comments = store.getComments(article.id);
  const isBookmarked = store.isBookmarked(article.id);
  const hasLiked = store.hasLiked(article.id);

  // Generate Table of Contents items by scanning headings from content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = article.content;
  const headings = Array.from(tempDiv.querySelectorAll('h2, h3'));
  
  // Assign ids to headings if not present
  headings.forEach((h, i) => {
    if (!h.id) {
      h.id = 'section-' + (i + 1);
    }
  });
  const processedContent = tempDiv.innerHTML;

  const currentUrl = window.location.href;
  const shareText = encodeURIComponent(`${article.title} via Lumina Blog`);

  const html = `
    <div class="article-page">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="#/">Home</a>
        <span class="separator">/</span>
        <a href="#/category/${encodeURIComponent(article.category)}">${article.category}</a>
        <span class="separator">/</span>
        <span class="current">${article.title}</span>
      </nav>

      <!-- Article Header -->
      <header class="article-header">
        <div class="article-header-meta">
          <a href="#/category/${encodeURIComponent(article.category)}" class="category-tag">${article.category}</a>
          <span style="color: var(--text-muted);">•</span>
          <span style="color: var(--text-muted); font-size: 0.88rem;">${formatDate(article.publishedAt)}</span>
          <span style="color: var(--text-muted);">•</span>
          <span style="color: var(--text-muted); font-size: 0.88rem;">${article.readTime}</span>
        </div>

        <h1 class="article-headline">${article.title}</h1>

        <div class="article-submeta">
          <div class="article-author-pill">
            <img src="${article.author.avatar}" alt="${article.author.name}" />
            <div>
              <div style="font-weight: 600; font-size: 0.9rem;">${article.author.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${article.author.role}</div>
            </div>
          </div>

          <div class="article-submeta-item" title="Views">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>${article.views} views</span>
          </div>

          <button class="btn-icon btn-like-article ${hasLiked ? 'liked' : ''}" id="btn-like-post" title="Like this article" style="${hasLiked ? 'color: var(--accent-pink); border-color: var(--accent-pink);' : ''}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${hasLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span id="like-count" style="margin-left: 4px; font-weight: 600; font-size: 0.85rem;">${article.likes + (hasLiked ? 1 : 0)}</span>
          </button>

          <button class="btn-icon ${isBookmarked ? 'bookmarked' : ''}" id="btn-bookmark-post" title="Bookmark article" style="${isBookmarked ? 'color: var(--primary); border-color: var(--primary);' : ''}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </header>

      <!-- Cover Media -->
      <div class="article-cover-wrapper">
        <img src="${article.coverImage}" alt="${article.title}" class="article-cover-img" />
        ${article.coverCaption ? `<div class="article-cover-caption">${article.coverCaption}</div>` : ''}
      </div>

      <!-- Main Layout: Content + TOC Sidebar -->
      <div class="article-layout">
        <!-- Content Area with Social Share Bar -->
        <div style="display: flex; gap: 2rem;">
          <!-- Left Floating Share Bar -->
          <div class="share-bar-sticky">
            <button class="share-btn" id="share-copy-btn" title="Copy Article Link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </button>
            <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(currentUrl)}" target="_blank" rel="noopener noreferrer" class="share-btn" title="Share on X (Twitter)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}" target="_blank" rel="noopener noreferrer" class="share-btn" title="Share on LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.54a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6z"/></svg>
            </a>
            <a href="https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(currentUrl)}" target="_blank" rel="noopener noreferrer" class="share-btn" title="Share on WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84-1.56 1.56-3.64 2.42-5.84 2.42-1.45 0-2.88-.38-4.14-1.11l-.3-.18-3.08.81.82-3-.2-.31a8.16 8.16 0 0 1-1.25-4.47c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.41 1.02 2.57.12.17 1.76 2.68 4.26 3.76.59.26 1.06.41 1.42.53.6.19 1.14.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z"/></svg>
            </a>
          </div>

          <!-- Editorial Body -->
          <div class="article-body">
            ${processedContent}

            <!-- Tags Section -->
            <div style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
              <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Tagged with:</span>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem;">
                ${article.tags.map(tag => `
                  <a href="#/tag/${encodeURIComponent(tag)}" class="tag-pill" style="font-size: 0.85rem; padding: 0.35rem 0.85rem;">#${tag}</a>
                `).join('')}
              </div>
            </div>

            <!-- Author Card Box -->
            <div class="author-card-box">
              <img src="${article.author.avatar}" alt="${article.author.name}" class="author-box-avatar" />
              <div class="author-box-content">
                <h4>Written by ${article.author.name}</h4>
                <div class="author-box-role">${article.author.role}</div>
                <p class="author-box-bio">${article.author.bio}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Sidebar with Table of Contents -->
        <aside class="article-sidebar">
          ${headings.length > 0 ? `
            <div class="sidebar-widget">
              <h3 class="widget-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                Table of Contents
              </h3>
              <ul class="toc-list" id="toc-list">
                ${headings.map(h => `
                  <li>
                    <a href="#${h.id}" class="toc-link" data-target="${h.id}">${h.textContent}</a>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="sidebar-widget">
            <h3 class="widget-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Weekly Digest
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
              Join 18,000+ engineers receiving our weekly architectural breakdowns.
            </p>
            <form class="newsletter-form" onsubmit="event.preventDefault(); window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Subscribed successfully!' } }));">
              <input type="email" class="input-text" placeholder="Your email address" required style="font-size: 0.85rem;" />
              <button type="submit" class="btn-primary" style="width: 100%; font-size: 0.85rem;">Subscribe</button>
            </form>
          </div>
        </aside>
      </div>

      <!-- Related Articles Section -->
      ${relatedArticles.length > 0 ? `
        <section class="related-posts-section">
          <div class="section-header">
            <div>
              <h2 class="section-title">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Related Articles
              </h2>
              <p class="section-subtitle">More stories you might enjoy reading</p>
            </div>
          </div>

          <div class="blog-cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
            ${relatedArticles.map(rel => `
              <article class="blog-card">
                <div class="card-media-wrapper" style="aspect-ratio: 16/9;">
                  <img src="${rel.coverImage}" alt="${rel.title}" class="card-image" loading="lazy" />
                  <span class="card-category-badge">${rel.category}</span>
                </div>
                <div class="card-body">
                  <div class="card-meta-row">
                    <span>${formatDate(rel.publishedAt)}</span>
                    <span class="card-meta-bullet">●</span>
                    <span>${rel.readTime}</span>
                  </div>
                  <h3 class="card-title" style="font-size: 1.15rem;">
                    <a href="#/post/${rel.id}">${rel.title}</a>
                  </h3>
                  <p class="card-excerpt" style="font-size: 0.88rem; margin-bottom: 1rem;">${rel.excerpt}</p>
                  <div class="card-footer" style="padding-top: 0.75rem;">
                    <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-primary);">${rel.author.name}</span>
                    <span style="font-size: 0.8rem; color: var(--primary); font-weight: 600;">Read →</span>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Interactive Comments Section -->
      <section class="comments-section" id="comments-section">
        <div class="comments-header">
          <h2 class="comments-title">
            Discussion (<span id="comments-count">${comments.length}</span>)
          </h2>
        </div>

        <!-- Add Comment Form -->
        <form class="comment-form" id="comment-form">
          <div class="form-row">
            <div>
              <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.35rem;">Your Name *</label>
              <input type="text" class="input-text" id="comment-author-input" placeholder="e.g. Alex Mercer" required style="width: 100%;" />
            </div>
            <div>
              <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.35rem;">Email (Optional)</label>
              <input type="email" class="input-text" id="comment-email-input" placeholder="alex@example.com" style="width: 100%;" />
            </div>
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.35rem;">Your Comment *</label>
            <textarea class="comment-textarea" id="comment-text-input" placeholder="Share your thoughts, feedback, or ask a question..." required></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              <span>Post Comment</span>
            </button>
          </div>
        </form>

        <!-- Comments List -->
        <div class="comments-list" id="comments-list">
          ${comments.length > 0 ? comments.map(c => renderCommentCard(c, article.id)).join('') : `
            <p style="color: var(--text-muted); text-align: center; padding: 2rem 0;">No comments yet. Be the first to share your thoughts!</p>
          `}
        </div>
      </section>
    </div>
  `;

  container.innerHTML = html;
  attachPostEventListeners(container, article);
  setupScrollProgressAndTOC(container);
}

function renderCommentCard(comment, articleId) {
  return `
    <div class="comment-card" id="comment-${comment.id}">
      <img src="${comment.authorAvatar}" alt="${comment.authorName}" class="comment-avatar" loading="lazy" />
      <div class="comment-main">
        <div class="comment-meta">
          <span class="comment-author-name">${comment.authorName}</span>
          <span style="color: var(--text-muted); font-size: 0.75rem;">•</span>
          <span class="comment-date">${comment.date}</span>
        </div>
        <p class="comment-text">${escapeHtml(comment.text)}</p>
        <div class="comment-actions">
          <button class="btn-comment-like" data-comment-id="${comment.id}" data-article-id="${articleId}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            <span class="like-counter">${comment.likes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function attachPostEventListeners(container, article) {
  // Like button
  const likeBtn = container.querySelector('#btn-like-post');
  const likeCountSpan = container.querySelector('#like-count');
  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      const liked = store.toggleLike(article.id);
      const newCount = article.likes + (liked ? 1 : 0);
      likeCountSpan.textContent = newCount;
      if (liked) {
        likeBtn.classList.add('liked');
        likeBtn.style.color = 'var(--accent-pink)';
        likeBtn.style.borderColor = 'var(--accent-pink)';
        likeBtn.querySelector('svg').setAttribute('fill', 'currentColor');
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Liked article!' } }));
      } else {
        likeBtn.classList.remove('liked');
        likeBtn.style.color = '';
        likeBtn.style.borderColor = '';
        likeBtn.querySelector('svg').setAttribute('fill', 'none');
      }
    });
  }

  // Bookmark button
  const bookmarkBtn = container.querySelector('#btn-bookmark-post');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      const bookmarked = store.toggleBookmark(article.id);
      if (bookmarked) {
        bookmarkBtn.classList.add('bookmarked');
        bookmarkBtn.style.color = 'var(--primary)';
        bookmarkBtn.style.borderColor = 'var(--primary)';
        bookmarkBtn.querySelector('svg').setAttribute('fill', 'currentColor');
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Saved to bookmarks' } }));
      } else {
        bookmarkBtn.classList.remove('bookmarked');
        bookmarkBtn.style.color = '';
        bookmarkBtn.style.borderColor = '';
        bookmarkBtn.querySelector('svg').setAttribute('fill', 'none');
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Removed from bookmarks' } }));
      }
    });
  }

  // Copy article link
  const copyBtn = container.querySelector('#share-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Article link copied to clipboard!' } }));
      }).catch(() => {
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Failed to copy link.' } }));
      });
    });
  }

  // Code Block Copy Buttons
  container.querySelectorAll('pre').forEach((preBlock) => {
    const code = preBlock.querySelector('code');
    if (!code) return;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.textContent = 'Copy';
    preBlock.appendChild(copyBtn);

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(code.innerText).then(() => {
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = 'var(--accent-emerald)';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.style.background = '';
        }, 2000);
      });
    });
  });

  // Comment submission form
  const commentForm = container.querySelector('#comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorInput = container.querySelector('#comment-author-input');
      const textInput = container.querySelector('#comment-text-input');

      const name = authorInput.value.trim();
      const text = textInput.value.trim();
      if (!name || !text) return;

      const newComment = store.addComment(article.id, {
        authorName: name,
        text: text
      });

      // Clear input
      textInput.value = '';
      
      // Update comments list
      const list = container.querySelector('#comments-list');
      const countEl = container.querySelector('#comments-count');
      const updatedComments = store.getComments(article.id);
      countEl.textContent = updatedComments.length;

      list.innerHTML = updatedComments.map(c => renderCommentCard(c, article.id)).join('');
      attachCommentLikeHandlers(container);

      window.dispatchEvent(new CustomEvent('toast', {
        detail: { message: 'Comment posted successfully!' }
      }));
    });
  }

  attachCommentLikeHandlers(container);
}

function attachCommentLikeHandlers(container) {
  container.querySelectorAll('.btn-comment-like').forEach(btn => {
    btn.addEventListener('click', () => {
      const commentId = btn.getAttribute('data-comment-id');
      const articleId = btn.getAttribute('data-article-id');
      const newLikes = store.likeComment(articleId, commentId);
      const span = btn.querySelector('.like-counter');
      if (span) span.textContent = newLikes;
      btn.style.color = 'var(--accent-pink)';
    });
  });
}

function setupScrollProgressAndTOC(container) {
  const progressBar = document.getElementById('reading-progress');
  const headings = container.querySelectorAll('.article-body h2, .article-body h3');
  const tocLinks = container.querySelectorAll('.toc-link');

  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
  }

  scrollHandler = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    // Highlight active TOC item
    let activeId = null;
    headings.forEach(heading => {
      const top = heading.getBoundingClientRect().top;
      if (top <= 140) {
        activeId = heading.id;
      }
    });

    tocLinks.forEach(link => {
      if (link.getAttribute('data-target') === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', scrollHandler, { passive: true });
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
