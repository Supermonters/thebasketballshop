# BasketballShop (React + Vite + Node)

This project is rewritten into:
- `client/`: React + Vite + TypeScript
- `server/`: Node.js + Express + TypeScript

## Run in development

```bash
npm install
npm --prefix client install
npm --prefix server install
npm run dev
```

- React app runs on Vite (usually `http://localhost:5173`)
- API runs on `http://localhost:8080`

## Build and run production

```bash
npm run build
npm start
```

## Config

Use `config.json` / `config.local.json` (or env vars):
- `PORT`
- `ORIGIN`
- `SMTP_HOST`
- `SMTP_PORT`
- `MAILUSER`
- `MAILPASSWORD`
- `NEWSDATA_API_KEY`
- `FIREBASE_WEB_API_KEY`
- `GOOGLE_TRANSLATE_API_KEY`

`config.local.json` should stay out of git.

### Translation
- The backend uses Google Translate API for runtime translation.
- Product and news endpoints support English output by default.
- You can also call `POST /api/translate` with `{ "text": "...", "target": "en" }`.
