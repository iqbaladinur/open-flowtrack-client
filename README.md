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
  </p>
</div>

---

FlowTrack is a clean and modern personal finance application designed to help you track your income and expenses with ease. It provides a beautiful and intuitive interface to manage your wallets, budgets, and categories, giving you a clear overview of your financial health through insightful reports.

## ✨ Key Features

- **Dashboard:** A comprehensive overview of your recent transactions, wallet balances, and budget progress.
- **Wallet Management:** Add and manage multiple accounts (e.g., cash, bank accounts, credit cards).
- **Transaction Tracking:** Easily record your income and expenses with detailed categorization.
- **Bulk Expense with OCR:** Quickly add multiple expenses by scanning receipts or invoices using OCR technology.
- **AI integration:** make some small enhancement for ai features.  
  - [x] Gemini
  - [ ] OpenAI  
  - [ ] Anthropic
- **Budgeting:** Set monthly budgets for different categories to control your spending.
- **Categorization:** Organize your transactions with customizable categories, icons, and colors.
- **Financial Reports:** Visualize your spending habits with dynamic charts and reports (time-series and category-based).
- **User Authentication:** Secure account management with login and registration.
- **Backup & Restore:** Keep your data safe with backup and restore functionality.
- **Onboarding:** A simple setup process for new users to get started quickly.
- **Dark Mode:** A beautiful, themeable interface that supports both light and dark modes.

## 🛠️ Tech Stack

- **Frontend:** [Vue 3](https://vuejs.org/) (with Composition API and `<script setup>`)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **Charting:** [Chart.js](https://www.chartjs.org/) with [vue-chartjs](https://vue-chartjs.org/)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)

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