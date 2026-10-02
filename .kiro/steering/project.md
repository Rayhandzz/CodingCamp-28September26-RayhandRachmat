# Expense & Budget Visualizer — Project Steering

## Project Overview

A mobile-friendly web app for tracking daily spending with visual breakdowns. All data is stored client-side via the browser's Local Storage API. No backend or build tooling is required.

---

## Technical Constraints

### TC-1: Technology Stack
- **HTML** for structure
- **CSS** for styling
- **Vanilla JavaScript** — no frameworks (React, Vue, etc.)
- No backend server required
- No test setup required

### TC-2: Data Storage
- Use the browser **Local Storage API**
- All data stored client-side only

### TC-3: Browser Compatibility
- Must work in modern browsers: Chrome, Firefox, Edge, Safari
- Can be used as a standalone web app or browser extension

---

## File & Folder Rules
- Exactly **1 CSS file** inside `css/` → `css/style.css`
- Exactly **1 JavaScript file** inside `js/` → `js/script.js`
- Main entry point: `index.html`
- Do **not** create additional CSS or JS files; do **not** rewrite existing files from scratch

---

## Required Features

1. **Input form** — fields: Item Name, Amount, Category (Food, Transport, Fun). Submitting adds a transaction; all fields must be validated as non-empty before adding.
2. **Transaction list** — scrollable list showing each item's name, amount, and category, with a delete button per item.
3. **Total balance** — displayed prominently at the top; updates automatically on every add or delete.
4. **Pie chart** — powered by **Chart.js**, showing spending broken down by category; updates automatically on every add or delete.

---

## Optional Challenges (all chosen)

- **Custom categories** — users can define their own categories beyond the defaults.
- **Dark / Light mode toggle** — UI theme switch persisted to Local Storage.
- **Transaction highlight** — transactions above a user-set spending limit are visually highlighted.

---

## Non-Functional Requirements

### NFR-1: Simplicity
- Clean, minimal interface
- Easy to understand and use without any setup

### NFR-2: Performance
- Fast load time
- Responsive UI interactions with no noticeable lag

### NFR-3: Visual Design
- User-friendly aesthetic
- Clear visual hierarchy
- Readable typography
- Mobile-first layout
