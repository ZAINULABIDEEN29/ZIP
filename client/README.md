# Zimli Internship Program (ZIP) Frontend

A modern, responsive, and maintainable React.js + Tailwind CSS frontend for intern progress tracking, portfolio development, skills documentation, and mentorship feedback.

## Tech Stack
- React JS (Functional Components + Hooks)
- Tailwind CSS
- React Router
- Axios
- Lucide/Heroicons
- DaisyUI/Headless UI (optional)

## Structure (MVC)
```
src/
├── assets/            # Images, icons, etc.
├── components/        # Reusable UI components (e.g. Button, Card)
├── layouts/           # Page layouts (Dashboard, AuthLayout)
├── pages/             # Route views (ProfilePage, SkillsPage, etc.)
├── services/          # API services (axios wrappers)
├── utils/             # Helpers (formatDate, calculateProgress)
├── models/            # Data models/interfaces (optional with TypeScript)
├── context/           # React Contexts (Auth, Intern, etc.)
└── App.js             # Main app entry
```

## Setup
```bash
npm install
npm run dev
```

## Features
- Intern dashboard, profile, progress timeline, skills tracker, portfolio, mentorship feedback, social features
- Responsive, clean UI with Zimli branding
- API-ready with Axios
- Modern React patterns

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
