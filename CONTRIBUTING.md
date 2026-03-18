# Contributing to Resume2Apply 🤝

First off, thanks for taking the time to contribute! This tool aims to help developers and job-seekers effortlessly organize the most stressful part of their professional careers. 

We embrace PRs of all shapes and sizes—from massive API reworks down to resolving a single typo in the documentation.

## How Can I Contribute?

### Reporting Bugs
If you spot an issue (hydration errors, PDF rendering overlaps, Kanban sync dropouts), head over to our Issues tab. 
Please include:
- What you were attempting to do (e.g., "Navigated directly to `/dashboard/job-apply`").
- A screenshot of the Developer Tools Console (`F12`) if you have red text.
- Your Node.js and Browser version.

### Suggesting Enhancements
Is there a CV feature (like injecting a brand new customized skill tree) that you'd love? Submit an Enhancement Issue detailing the flow. Be specific about whether it requires a Backend schema structural upgrade or if it's purely frontend.

### Pull Requests
Ready to actually write some code? 
1. **Fork the repo** and create your branch from `main`.
2. Ensure you have properly run `npm install`.
3. If you add a new route, maintain the App Router structure (`app/(pages)/...`).
4. If you write a new feature requiring an Environment hook, *make sure* you add the dummy key to `.env.example`.
5. **Linting matters**: Run `npm run lint` before committing!
6. Title your Pull Request cleanly (e.g. `feat(PDF): Added Custom Line Spacing to Executive Summary`).

## Environment Setup for Contributors
Make sure your `.env.local` accurately mimics the `.env.example`. If you are testing the email service (`Resend`), note that Resend's free tier only allows you to dispatch simulated emails to your *own* verified email address unless you own a domain.

## Code Architecture TLDR
- **`/app/api`**: All Next.js standard JSON route handlers resolving MongoDB transactions.
- **`/app/(pages)`**: The authenticated dashboard flow.
- **`/app/components/`**: The un-routed heavily nested React islands.
- **`useJobBoardStore.ts`**: The globally orchestrated Zustand state which bridges the heavy CV configurations to the Applicator board, secured against React 18 strict mode and routing cache unmounts.

Happy hacking!
