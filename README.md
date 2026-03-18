# Resume2Apply 📄🚀

<div align="center">
  <h3>An Open-Source Next.js Career Application Manager</h3>
  <p>Seamlessly generate rich PDF CVs, track Kanban applications, and manage Cover Letters effortlessly.</p>
</div>

---

## What is it?
**Resume2Apply** is a completely free, self-hostable Software-as-a-Service (SaaS) application modeled directly after premium job tracking portals. 
Instead of losing track of multiple CV versions scattered across folders, Resume2Apply provides:
- **Rich CV Designer**: Drag-and-drop customization, multi-templating, and live 3D PDF generation.
- **Kanban Board**: Visually track your applications from *Applying* to *Interviews* to *Offers*.
- **Integrated Snapshotting**: When you build a Custom CV for a specific role, the entire PDF data generates a "Snapshot". This blueprint automatically travels with your Kanban card, so you never forget *exactly* what your resume looked like for a specific recruiter!
- **Email/Cover Letter Templating**: Inject dynamic fields automatically based on Kanban targets.
- **Analytics Dashboard**: Live insights into your application funnels.

## Technology Stack 🛠️

- **Framework**: `Next.js 14` (App Router)
- **Database**: `MongoDB` / `Mongoose`
- **Styling**: `Tailwind CSS 4`, Framer Motion
- **PDF Generation**: `@react-pdf/renderer`
- **Email Service**: `Resend`
- **Global State**: `Zustand` (with specialized persistence hooks)

---

## 💻 Getting Started (Self-Hosting)

### Prerequisites
Before you start, you'll need:
- [Node.js](https://nodejs.org/) (v18+)
- A [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) URI.
- A free [Resend](https://resend.com/) API Key for email functions.
- (Optional) LinkedIn Developer App credentials for OAuth.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/resume2apply.git
cd resume2apply
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a file exactly named `.env.local` inside the root folder, and fill it using these keys:
```env
MONGODB_URI=mongodb+srv://<USER>:<PASS>@<CLUSTER>.mongodb.net/resume2apply?retryWrites=true&w=majority
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=onboarding@resend.dev # Or your custom verified domain
LINKEDIN_CLIENT_ID=your_linkedin_client
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
```

### 4. Boot the Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:3000` to interact with your local instance!

### 5. Production Build
```bash
npm run build
npm start
```
Any standard Next.js hosting provider (such as Vercel) is 100% compatible. Simply load your `.env` secrets into their dashboard and deploy!

---

## 🤝 Contributing

We'd love your help fixing bugs and building awesome new CV templates! To get involved, check out our [Contributing Guidelines](CONTRIBUTING.md).

### Future Roadmap
- Expanding the AI Resume Analyzer integrations
- Real-time job scraping
- Custom styling layers for the CV PDF Engine.

## License
MIT License. Feel free to clone, mutate, and dominate your job hunt.
