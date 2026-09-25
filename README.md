# Lumina — Modern Responsive Blog Platform

A responsive, high-performance editorial blog web application built with vanilla HTML5, CSS3 (custom token design system), and modular ES6+ JavaScript.

---

## ✨ Key Features

### 1. Attractive Editorial Homepage
- **Hero Featured Showcase**: High-impact editorial hero card with category badge, reading time, publish date, author info, and quick bookmarking.
- **Trending Stories Grid**: Curated secondary highlights with thumbnail zoom and concise metadata.
- **Dynamic View Switcher**: Instant toggle between responsive multi-column Card Grid and horizontal List layout.

### 2. Comprehensive Filtering & Search
- **Category Filter Pills**: Real-time filtering across Design, Technology, Web Dev, and Productivity with live post counter badges.
- **Interactive Tag Cloud**: Filter articles by specific hashtags (`#CSS`, `#UI/UX`, `#AI & ML`, `#JavaScript`, `#Performance`).
- **Instant Search**:
  - In-page search bar with debounce and clear button.
  - Global `Ctrl + K` / `Cmd + K` search modal with matching keyword highlights.
- **Sorting Control**: Sort stories by Latest, Most Popular (views & likes), or Shortest Read Time.

### 3. Responsive Blog Cards
- Fluid image aspect ratios with smooth CSS zoom on hover.
- Category pills with subtle backdrop blur.
- Excerpts with multi-line clamping.
- Author avatars and full metadata (publish date, estimated read time, view count, comments count).
- One-click bookmark button with instant toast feedback.

### 4. Long-Form Article Detail Pages (`#/post/:id`)
- Deep-linkable hash URLs with browser back/forward history support.
- **Sticky Top Reading Progress Bar**: Real-time scroll indicator (0% to 100%).
- **Interactive Table of Contents (TOC)**: Dynamically generated from article headings with active section highlighting on scroll.
- **Rich Editorial Typography**: Styled blockquotes, callout advisory boxes (`tip`, `info`, `warning`), code blocks with one-click **Copy Code** button.
- **Floating Social Share Bar**: One-click sharing to Twitter / X, LinkedIn, WhatsApp, and Copy Link with toast confirmation.
- **Author Bio Card**: Complete with profile picture, title, and bio.
- **Related Articles**: Contextually recommends 3 related stories based on matching category and tags.

### 5. Interactive Comment System
- Realistic comments persistence in `localStorage`.
- Comment submission form with author name, email, and comment message.
- Upvote / like comments with real-time counter increment.

### 6. Bookmarking & Reading List (`#/bookmarks`)
- Bookmark any post from cards or article headers.
- Persistent in `localStorage`.
- Dedicated saved reading list view with quick removal and "Clear All" option.
- Live badge counter in the top navigation bar.

### 7. Modern UI / UX Polish
- **Dark & Light Mode**: Smooth theme transition with persistence in `localStorage` and system preference detection.
- **Responsive Mobile Drawer**: Slide-in navigation for tablet and mobile viewports.
- **Floating Back-to-Top Button**: Smooth scroll back to the top when scrolled down.
- **Toast Notifications**: Spring-animated feedback for actions (theme changes, bookmarks, comment posting, link copying).

---

## 🚀 Running the Project

You can run this project with any local HTTP server:

### Option 1: Python
```bash
python -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000).

### Option 2: Node.js (npx)
```bash
npx -y serve .
```

### Option 3: Direct File Opening
Or simply open `index.html` in any modern web browser that supports ES modules.
