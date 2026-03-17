<div align="center">
  <img src="public/favicon.svg" alt="FlowTrack Logo" width="120" />
  <h1>FlowTrack</h1>
  <p>A modern, self-hostable personal finance application.</p>
  <p>
    <a href="#">
      <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg"/>
    </a>
    <a href="#">
      <img alt="Vue.js" src="https://img.shields.io/badge/vue.js-3.x-brightgreen.svg"/>
    </a>
    <a href="#">
      <img alt="TypeScript" src="https://img.shields.io/badge/typescript-5.x-blue.svg"/>
    </a>
    <a href="#">
      <img alt="Vite" src="https://img.shields.io/badge/vite-5.x-purple.svg"/>
    </a>
    <a href="#">
      <img alt="PWA" src="https://img.shields.io/badge/PWA-ready-orange.svg"/>
    </a>
  </p>
</div>

---

FlowTrack is a clean and modern personal finance application designed to help you track your income and expenses with ease. It provides a beautiful and intuitive interface to manage your wallets, budgets, categories, and financial goals — giving you a clear overview of your financial health through insightful reports.

## ✨ Key Features

- **Dashboard:** A comprehensive overview of your recent transactions, wallet balances, and active budget progress.
- **Wallet Management:** Add and manage multiple accounts (e.g., cash, bank accounts, e-wallets) with support for popular Indonesian banks and payment platforms.
- **Transaction Tracking:** Easily record income and expenses with detailed categorization, filtering, and search.
- **Bulk Expense with OCR:** Quickly add multiple expenses by scanning receipts or invoices using Tesseract.js OCR technology with image cropping support.
- **Budgeting:** Set monthly budgets for different categories to control your spending and monitor performance.
- **Categorization:** Organize your transactions with fully customizable categories, icons, and colors.
- **Financial Milestones:** Set and track financial goals with flexible conditions (wallet balance, budget control, transaction amounts, net worth, category spending limits, and more).
- **Financial Reports:** Visualize your spending habits with dynamic charts — time-series, category pie charts, budget performance, wallet flow Sankey diagrams, and more.
- **Wrapped:** An annual financial summary presentation (Spotify Wrapped-style) showcasing your year in numbers.
- **AI Integration:** Smart expense categorization and assistance powered by AI.
  - [x] Gemini
  - [ ] OpenAI
  - [x] Anthropic (via MCP)
- **Internationalization:** Full support for multiple languages.
  - [x] English
  - [x] Indonesian (Bahasa Indonesia)
- **Multi-Currency:** Configure your preferred currency (IDR, USD, EUR, JPY, GBP, and more).
- **User Authentication:** Secure account management with email/password login, registration, and Google OAuth.
- **Privacy Mode:** Toggle amount visibility to hide your balances when needed.
- **Backup & Restore:** Keep your data safe with full backup and restore functionality.
- **Onboarding:** A simple setup wizard for new users to configure currency, language, and initial categories.
- **Dark Mode:** A beautiful, themeable interface that supports both light and dark modes.
- **PWA Support:** Install as a standalone app with offline capability and auto-updating service worker.

## 🛠️ Tech Stack

- **Frontend:** [Vue 3](https://vuejs.org/) (with Composition API and `<script setup>`)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **Charting:** [Apache ECharts](https://echarts.apache.org/) with [vue-echarts](https://github.com/ecomfe/vue-echarts)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **OCR:** [Tesseract.js](https://tesseract.projectnaptha.com/)
- **Utilities:** [@vueuse/core](https://vueuse.org/), [date-fns](https://date-fns.org/), [headlessui](https://headlessui.com/), [html2canvas](https://html2canvas.hertzen.com/)
- **i18n:** [vue-i18n](https://vue-i18n.intlify.dev/)
- **PWA:** [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/) or your preferred package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/flowtrack-client.git
    cd flowtrack-client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the necessary environment variables.
    ```env
    # Base URL for the backend API
    VITE_API_BASE_URL=http://localhost:8000/
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use).

## 📦 Available Scripts

- `npm run dev`: Starts the development server with hot-reloading.
- `npm run build`: Compiles and minifies the application for production.
- `npm run preview`: Serves the production build locally to preview it.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
