import { initialArticles, categories } from './data.js';

class Store {
  constructor() {
    this.articles = this._loadArticles();
    this.categories = categories;
    this.theme = this._initTheme();
    this.bookmarks = this._loadBookmarks();
    this.commentsMap = this._loadCommentsMap();
    this.likesMap = this._loadLikesMap();

    // Filters and pagination state
    this.filters = {
      searchQuery: '',
      category: 'All',
      tag: null,
      sortBy: 'latest' // 'latest' | 'popular' | 'readtime'
    };

    this.pagination = {
      currentPage: 1,
      postsPerPage: 6
    };

    this.subscribers = [];
  }

  // --- Subscriptions ---
  subscribe(fn) {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== fn);
    };
  }

  notify(event, payload) {
    this.subscribers.forEach(fn => fn(event, payload));
  }

  // --- Theme Management ---
  _initTheme() {
    const saved = localStorage.getItem('blog_theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('blog_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.notify('THEME_CHANGED', theme);
  }

  toggleTheme() {
    const next = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  }

  // --- Persistence helpers ---
  _loadArticles() {
    return initialArticles;
  }

  _loadBookmarks() {
    try {
      const data = localStorage.getItem('blog_bookmarks');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  _saveBookmarks() {
    try {
      localStorage.setItem('blog_bookmarks', JSON.stringify(this.bookmarks));
    } catch (e) {}
  }

  isBookmarked(articleId) {
    return this.bookmarks.includes(articleId);
  }

  toggleBookmark(articleId) {
    if (this.bookmarks.includes(articleId)) {
      this.bookmarks = this.bookmarks.filter(id => id !== articleId);
      this._saveBookmarks();
      this.notify('BOOKMARK_TOGGLED', { articleId, bookmarked: false });
      return false;
    } else {
      this.bookmarks.push(articleId);
      this._saveBookmarks();
      this.notify('BOOKMARK_TOGGLED', { articleId, bookmarked: true });
      return true;
    }
  }

  getBookmarkedArticles() {
    return this.articles.filter(a => this.bookmarks.includes(a.id));
  }

  // --- Likes on articles ---
  _loadLikesMap() {
    try {
      const data = localStorage.getItem('blog_likes');
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  hasLiked(articleId) {
    return !!this.likesMap[articleId];
  }

  toggleLike(articleId) {
    const liked = !!this.likesMap[articleId];
    if (liked) {
      delete this.likesMap[articleId];
    } else {
      this.likesMap[articleId] = true;
    }
    try {
      localStorage.setItem('blog_likes', JSON.stringify(this.likesMap));
    } catch (e) {}
    this.notify('LIKE_TOGGLED', { articleId, liked: !liked });
    return !liked;
  }

  // --- Comments management ---
  _loadCommentsMap() {
    try {
      const saved = localStorage.getItem('blog_comments');
      const customComments = saved ? JSON.parse(saved) : {};
      
      const map = {};
      this.articles.forEach(art => {
        map[art.id] = [...(art.comments || []), ...(customComments[art.id] || [])];
      });
      return map;
    } catch (e) {
      const map = {};
      this.articles.forEach(art => {
        map[art.id] = [...(art.comments || [])];
      });
      return map;
    }
  }

  _saveCustomComment(articleId, comment) {
    try {
      const saved = localStorage.getItem('blog_comments');
      const customComments = saved ? JSON.parse(saved) : {};
      if (!customComments[articleId]) customComments[articleId] = [];
      customComments[articleId].unshift(comment);
      localStorage.setItem('blog_comments', JSON.stringify(customComments));
    } catch (e) {}
  }

  getComments(articleId) {
    return this.commentsMap[articleId] || [];
  }

  addComment(articleId, { authorName, text, authorAvatar }) {
    const newComment = {
      id: 'c_' + Date.now(),
      authorName: authorName.trim(),
      authorAvatar: authorAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(authorName)}`,
      date: 'Just now',
      likes: 0,
      text: text.trim()
    };

    if (!this.commentsMap[articleId]) {
      this.commentsMap[articleId] = [];
    }
    this.commentsMap[articleId].unshift(newComment);
    this._saveCustomComment(articleId, newComment);
    this.notify('COMMENT_ADDED', { articleId, comment: newComment });
    return newComment;
  }

  likeComment(articleId, commentId) {
    const comments = this.commentsMap[articleId] || [];
    const target = comments.find(c => c.id === commentId);
    if (target) {
      target.likes = (target.likes || 0) + 1;
      this.notify('COMMENT_LIKED', { articleId, commentId, likes: target.likes });
      return target.likes;
    }
    return 0;
  }

  // --- Article Queries & Filtering ---
  getArticleById(id) {
    return this.articles.find(a => a.id === id || a.slug === id);
  }

  getFeaturedArticles() {
    return this.articles.filter(a => a.featured);
  }

  getAllTags() {
    const tagSet = new Set();
    this.articles.forEach(a => {
      a.tags.forEach(t => tagSet.add(t));
    });
    return Array.from(tagSet);
  }

  getFilteredArticles() {
    let result = [...this.articles];

    // Category filter
    if (this.filters.category && this.filters.category.toLowerCase() !== 'all') {
      result = result.filter(a => 
        a.category.toLowerCase() === this.filters.category.toLowerCase()
      );
    }

    // Tag filter
    if (this.filters.tag) {
      result = result.filter(a => 
        a.tags.map(t => t.toLowerCase()).includes(this.filters.tag.toLowerCase())
      );
    }

    // Search query filter (title, excerpt, content, tags)
    if (this.filters.searchQuery && this.filters.searchQuery.trim() !== '') {
      const q = this.filters.searchQuery.trim().toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (this.filters.sortBy === 'latest') {
      result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (this.filters.sortBy === 'popular') {
      result.sort((a, b) => (b.views + b.likes * 5) - (a.views + a.likes * 5));
    } else if (this.filters.sortBy === 'readtime') {
      const getMin = str => parseInt(str) || 5;
      result.sort((a, b) => getMin(a.readTime) - getMin(b.readTime));
    }

    return result;
  }

  getRelatedArticles(currentArticle, limit = 3) {
    return this.articles
      .filter(a => a.id !== currentArticle.id)
      .map(a => {
        let score = 0;
        if (a.category === currentArticle.category) score += 3;
        const sharedTags = a.tags.filter(t => currentArticle.tags.includes(t));
        score += sharedTags.length * 2;
        return { article: a, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.article);
  }

  // --- Filter Actions ---
  setSearchQuery(query) {
    this.filters.searchQuery = query;
    this.pagination.currentPage = 1;
    this.notify('FILTERS_CHANGED', this.filters);
  }

  setCategory(category) {
    this.filters.category = category;
    this.pagination.currentPage = 1;
    this.notify('FILTERS_CHANGED', this.filters);
  }

  setTag(tag) {
    this.filters.tag = tag;
    this.pagination.currentPage = 1;
    this.notify('FILTERS_CHANGED', this.filters);
  }

  setSortBy(sortBy) {
    this.filters.sortBy = sortBy;
    this.notify('FILTERS_CHANGED', this.filters);
  }

  resetFilters() {
    this.filters.searchQuery = '';
    this.filters.category = 'All';
    this.filters.tag = null;
    this.filters.sortBy = 'latest';
    this.pagination.currentPage = 1;
    this.notify('FILTERS_CHANGED', this.filters);
  }

  // --- Pagination / Load More ---
  loadMore() {
    this.pagination.currentPage += 1;
    this.notify('PAGINATION_CHANGED', this.pagination);
  }
}

export const store = new Store();
