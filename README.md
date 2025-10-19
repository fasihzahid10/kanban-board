# Next.js Kanban (Full-Stack in one app)

🚀 A complete **Kanban board** built with **Next.js (App Router) + API Routes**, **Prisma (SQLite)**, **TailwindCSS**, and **dnd-kit** for drag & drop.

## ✨ Features
- Boards list (create/delete)
- Board view with **columns/lists** and **cards**
- **Drag & drop** reorder for columns and cards
- Card **edit** (title, description, due date)
- Card **comments** (API endpoints)
- **SQLite** persistence via Prisma; no external DB needed

## ▶️ Quickstart
```bash
npm install
npx prisma migrate dev --name init
npm run dev
# open http://localhost:3000
```
Then create a board and start adding columns and cards.

## 🗂️ Project Structure
```
app/
  api/                  # REST endpoints
  board/[id]/           # Board page + UI
  globals.css
  layout.tsx
  page.tsx              # Boards list
components/
  ui.tsx
lib/
  prisma.ts
prisma/
  schema.prisma         # SQLite schema
```

## 🤝 Connect with me
- [LinkedIn](https://www.linkedin.com/in/muhammad-fasih-zahid-343093211)
