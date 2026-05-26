# BasketballShop

BasketballShop is a basketball-focused e-commerce website built as a personal project with my high school friends. We originally created it for a MindX developer competition, where the project reached the Top 24 finals in 2023.

The reason this project exists is simple: we wanted to build something that felt close to a real online basketball store, while learning how frontend pages, server routes, product data, user login, cart behavior, and admin tools work together in one complete website.

## About The Website

BasketballShop presents basketball shoes, gear, NBA content, and upcoming releases in one place. It is not a real commercial shop, but it was designed to feel like one: users can browse products, view product pages, add items to a cart, sign in, subscribe to news, and explore basketball trends.

The project has grown from a competition demo into a more complete full-stack learning project. It now includes an admin panel, Firebase authentication, environment-based configuration, product management, upcoming release management, and API-powered basketball content.

## Highlights

- Product store with product cards, categories, product detail pages, and cart support
- Firebase Auth login, signup, Google sign-in, email verification, and password reset
- Admin dashboard for managing products and upcoming shoe releases
- NBA news and trend pages powered by server-side API routes
- Upcoming releases section for new basketball shoes
- Newsletter subscription flow
- Express server with session-based admin authentication
- LowDB JSON storage for project data
- Environment variable configuration for secrets and API keys

## Project Background

This website started as a high school team project. My friends and I built it for a MindX developer competition because we wanted to challenge ourselves with a project that looked and behaved like a real product, not just a static page.

Reaching the Top 24 finals in 2023 was a big milestone for us. More importantly, the project became a place to practice real development skills: debugging login issues, improving security, cleaning up old code, building admin workflows, and learning how to make a website easier to maintain over time.

## Tech Stack

- Node.js
- Express
- LowDB
- Firebase Auth
- Firebase Realtime Database client, optional for user metadata
- HTML, CSS, JavaScript
- Tailwind CDN styles on static pages
- SweetAlert2
- Nodemailer

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file with the required environment variables:

```env
PORT=8080
SESSION_SECRET=your-session-secret

MAILUSER=your-mail-user
MAILPASSWORD=your-mail-password
NEWS_API_KEY=your-news-api-key

FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
FIREBASE_DATABASE_URL=your-firebase-database-url
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
FIREBASE_APP_ID=your-firebase-app-id
```

Run the app:

```bash
npm start
```

Then open:

```text
http://localhost:8080
```

## Notes

This is a personal and educational project, not a production store. Some parts still use simple local JSON storage and browser-side cart state because the goal was to learn by building a complete working prototype.

The project continues to improve over time as I revisit old competition code, fix issues, and turn it into a cleaner full-stack portfolio project.
