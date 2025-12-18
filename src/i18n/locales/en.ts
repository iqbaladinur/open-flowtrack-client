export default {
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    close: "Close",
    confirm: "Confirm",
    loading: "Loading...",
    saving: "Saving...",
    success: "Success",
    error: "Error",
    back: "Back",
    continue: "Continue",
    finish: "Finish",
    update: "Update",
    create: "Create",
    all: "All",
    or: "Or",
    uploadFile: "Upload a file",
    dragAndDrop: "or drag and drop",
    selectAll: "Select All",
    clearSelection: "Clear Selection",
    apply: "Apply",
    download: "Download",
    share: "Share",
    export: "Export",
    filter: "Filter",
    resetFilters: "Reset Filters",
    noDataAvailable: "No data available",
    preparing: "Preparing...",
    creating: "Creating...",
    restoring: "Restoring...",
    chooseFile: "Choose File",
    user: "User",
    view: "View",
    details: "Details",
    income: "income",
    expense: "expense",
  },

  // Navigation & Layout
  nav: {
    dashboard: "Dashboard",
    wallets: "Wallets",
    transactions: "Transactions",
    categories: "Categories",
    budgets: "Budgets",
    reports: "Reports",
    settings: "Settings",
    profile: "Profile",
    backup: "Backup & Restore",
    more: "More",
    milestones: "Milestones",
  },

  // Layout
  layout: {
    profile: "Profile",
    logout: "Logout",
    theme: "Theme",
  },

  // Dashboard
  dashboard: {
    title: "Welcome back",
    subtitle: "Here's your financial overview",
    totalBalance: "Total Balance",
    income: "Income",
    expenses: "Expenses",
    transfers: "Transfers",
    netIncome: "Net Income",
    quickActions: "Quick Actions",
    addIncome: "Add Income",
    addExpense: "Add Expense",
    addTransfer: "Add Transfer",
    manageWallets: "Manage Wallets",
    aiSuggestions: "What happened this period?",
    noSuggestionsAvailable: "No suggestions available at the moment.",
    addApiKeyForAi: "Add gemini apikey on settings to enable this feature.",
    activeBudget: "Active Budget",
    noBudgetActive: "No Budget Active this Period",
    overallActiveBudget: "Overall Active Budget",
    combinedUsage: "Combined usage across all budgets",
    spent: "Spent",
    left: "Left",
    over: "Over",
    limit: "Limit",
    used: "used",
    recentTransactions: "Recent Transactions",
    noTransactionsYet: "No transactions yet",
    addFirstTransaction: "Add your first transaction",
  },

  // Wallets
  wallets: {
    title: "Wallets",
    subtitle: "Here's your wallets data",
    noWalletsYet: "No wallets yet",
    createFirstWallet:
      "Create your first wallet to start tracking your finances",
    addWallet: "Add Wallet",
    noWalletsToExport: "No wallets to export.",
    noWalletsToShare: "No wallets to share.",
    shareWalletData: "Here is my wallet state:",
    sharingNotSupported: "Sharing not supported on this device.",
    failedToShare: "Failed to share:",
    hidden: "Hidden",
    visible: "Visible",
    distribution: "Wallet Distribution",
    totalBalance: "Total Balance",
    noVisibleWallets: "No visible wallets with balance",
    hideHidden: "Hide hidden wallets",
    showHidden: "Show hidden wallets",
  },

  // Wallet Detail
  walletDetail: {
    back: "Back",
    walletNotFound: "Wallet not found",
    walletNotFoundDesc: "The wallet you are looking for does not exist.",
    goBackToWallets: "Go back to Wallets",
    thisPeriodRecap: "This Period Recap",
    income: "Income",
    expenses: "Expenses",
    transferOut: "Transfer Out",
    transferIn: "Transfer In",
    netIncome: "Net Income",
    netCashflow: "Net Cash flow",
    all: "All",
    type: "Type",
    allTypes: "All Types",
    quickSelect: "Quick Select",
    allTime: "All Time",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
    customPeriod: "Custom Period",
    customRange: "Custom Range",
    startDate: "Start Date",
    endDate: "End Date",
    transactionHistory: "Transaction History",
    noTransactionsFound: "No transactions found for the selected period.",
    deleteTransactionConfirm:
      "Are you sure you want to delete this transaction?",
    deleteWalletConfirm:
      "Are you sure you want to delete this wallet? This action cannot be undone.",
    until: "Until",
  },

  // Categories
  categories: {
    title: "Categories",
    subtitle: "Organize your transactions by category",
    noCategoriesFound: "No categories found",
    createFirstCategory:
      "Create your first category to start organizing your finances.",
    addCategory: "Add Category",
    deleteConfirm:
      "Are you sure you want to delete this category? This action cannot be undone.",
  },

  // Transactions
  transactions: {
    title: "Transactions",
    subtitle: "Track all your income and expenses",
    type: "Type",
    allTypes: "All Types",
    income: "Income",
    expense: "Expense",
    transfer: "Transfer",
    wallet: "Wallet",
    allWallets: "All Wallets",
    dateRange: "Date Range",
    customPeriod: "Custom Period",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
    startDate: "Start Date",
    endDate: "End Date",
    previousPeriod: "Previous Period",
    nextPeriod: "Next Period",
    resetFilters: "Reset Filters",
    noTransactionsFound: "No transactions found",
    tryAdjustingFilters: "Try adjusting your filters or add a new transaction.",
    addTransaction: "Add Transaction",
    deleteConfirm: "Are you sure you want to delete this transaction?",
    noTransactionsToExport: "No transactions to export.",
    noTransactionsToShare: "No transactions to share.",
    failedToShare: "Failed to share:",
    sharingNotSupported: "Sharing not supported on this device.",
    bulkExpense: "Bulk Expense",
    all: "All",
    uncategorized: "Uncategorized",
    unknownWallet: "Unknown Wallet",
    transferOf: "Transfer of",
    from: "from",
    to: "to",
    for: "for",
    of: "of",
    noNote: "no note",
    onWallet: "on wallet",
    shareTransactionData:
      "Here is my transactions data for the selected period",
  },

  // Budgets
  budgets: {
    title: "Budgets",
    subtitle: "Set spending limits and track your progress",
    noBudgetsFound: "No budgets found",
    createFirstBudget:
      "Create your first budget for the selected date range to start tracking your spending.",
    createBudget: "Create Budget",
    deleteConfirm: "Are you sure you want to delete this budget?",
  },

  // Reports
  reports: {
    title: "Reports",
    subtitle: "Analyze your financial trends over time",
    filters: "Filters",
    monthly: "Monthly",
    yearly: "Yearly",
    custom: "Custom",
    month: "Month",
    year: "Year",
    selectYear: "Select Year",
    startDate: "Start Date",
    endDate: "End Date",
    groupBy: "Group By",
    daily: "Daily",
    weekly: "Weekly",
    noDataAvailable: "No transaction data available for the selected period.",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    totalTransfer: "Total Transfer",
    totalNetIncome: "Total Net Income",
    expenseRatio: "Expense Ratio",
    understandingExpenseRatio: "Understanding Your Expense Ratio",
    healthyZone: "Healthy Zone:",
    healthyZoneDesc:
      "Your expense ratio is great! This suggests you have a strong handle on your finances, with income significantly higher than expenses. Keep it up!",
    cautionZone: "Caution Zone:",
    cautionZoneDesc:
      "You're spending a significant portion of your income. It's a good time to review your budget and see if there are opportunities to save more.",
    dangerZone: "Danger Zone:",
    dangerZoneDesc:
      "Your expenses are very close to your income. This is a high-risk situation. We strongly recommend creating a budget and cutting back on non-essential spending.",
    noIncomeRatio:
      "Your expense ratio couldn't be calculated because there was no income in this period. The ratio shows what percentage of your income is spent.",
    barView: "Bar View",
    lineView: "Line View",
    breakdownByCategory: "Breakdown by Category",
    spending: "Spending",
    income: "Income",
    expense: "Expense",
    noExpenseData: "No expense data",
    noIncomeData: "No income data",
    noData: "No",
    flowByWallet: "Flow by Wallet",
    walletFlowDiagram: "Wallet Flow Diagram",
    walletFlowDescription: "Visualize how money flows between your wallets",
    noWalletData: "No wallet data available",
    netFlow: "Net Flow",
    transferIn: "Transfer In",
    transferOut: "Transfer Out",
    monthlyReportFor: "Monthly Report for",
    yearlyReportFor: "Yearly Report for",
    customReport: "Custom Report",
    to: "to",
    report: "Report",
    none: "None",
    // Month names
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
  },

  // Profile
  profile: {
    title: "Profile",
    subtitle: "Manage your account settings and preferences",
    memberSince: "Member since",
    dangerZone: "Danger Zone",
    dangerZoneWarning:
      "This action is irreversible. Please be certain before proceeding.",
    logout: "Logout",
    logoutConfirm: "Are you sure you want to logout?",
  },

  // Backup & Restore
  backup: {
    title: "Backup & Restore",
    subtitle: "Manage your application data backups.",
    createBackup: "Create Backup",
    createBackupDesc:
      "Download a backup of all your data. Keep this file in a safe place.",
    download: "Download",
    share: "Share",
    restoreFromBackup: "Restore from Backup",
    restoreFromBackupDesc:
      "Restore your data from a backup file. This will overwrite all existing data.",
    restoreData: "Restore Data",
    shareText: "Here is your FlowTrack data backup.",
    fileNotSupported: "File not supported!",
    failedToShare: "Failed to share:",
    confirmRestoreTitle: "Confirm Data Restore",
    confirmRestoreMessage:
      "Are you sure you want to restore from this backup? This action will permanently overwrite all your current data and cannot be undone.",
    confirmRestoreWarning:
      "Make sure you have a recent backup before proceeding!",
    cancel: "Cancel",
    confirm: "Yes, Restore",
    restoreSuccess:
      "Data restored successfully! The page will reload to apply changes.",
    restoreError:
      "Failed to restore backup. Please check the file and try again.",
    createBackupSuccess: "Backup created successfully!",
    createBackupError: "Failed to create backup. Please try again.",
    noFileSelected: "Please select a backup file first.",
    selectBackupFile: "Select a backup file to restore your data",
    backupReady: "Backup ready! Choose download or share.",
    createNewBackup: "Create New Backup",
  },

  // Onboarding
  onboarding: {
    title: "Let's Get You Set Up",
    subtitle: "Let's configure your preferences first.",
    generalSettings: "General Settings",
    generalSettingsSubtitle: "Configure your language, currency, and date preferences.",
    selectCategories: "Select Categories",
    selectCategoriesSubtitle: "Choose the categories you'd like to start with. You can always change this later.",
    expenses: "Expenses",
    income: "Income",
    continue: "Continue",
    createWallet: "Create Your First Wallet",
    createWalletSubtitle: "Set up your primary wallet to start tracking your finances.",
    back: "Back",
    finishSetup: "Finish Setup",
    // Default categories
    food: "Food",
    transport: "Transport",
    housing: "Housing",
    bills: "Bills",
    shopping: "Shopping",
    salary: "Salary",
    freelance: "Freelance",
    investment: "Investment",
    gifts: "Gifts",
    other: "Other",
  },

  // Login
  login: {
    title: "Welcome back",
    subtitle: "Sign in to your account to continue",
    signInWithGoogle: "Sign in with Google",
    orSignInWithEmail: "Or sign in with email",
    emailAddress: "Email address",
    enterEmail: "Enter your email",
    password: "Password",
    enterPassword: "Enter your password",
    signIn: "Sign in",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    failedLogin: "Login failed. Please try again.",
    unexpectedError: "An unexpected error occurred. Please try again.",
  },

  // Register
  register: {
    title: "Create account",
    subtitle: "Start managing your finances today",
    signUpWithGoogle: "Sign up with Google",
    orSignUpWithEmail: "Or sign up with email",
    fullName: "Full name",
    enterFullName: "Enter your full name",
    emailAddress: "Email address",
    enterEmail: "Enter your email",
    password: "Password",
    enterPassword: "Enter your password",
    confirmPassword: "Confirm password",
    confirmYourPassword: "Confirm your password",
    createAccount: "Create account",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
    passwordsDoNotMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters long",
    registrationFailed: "Registration failed. Please try again.",
    unexpectedError: "An unexpected error occurred. Please try again.",
  },

  // Bulk Expense
  bulkExpense: {
    title: "Bulk Expense",
    subtitle: "Upload an image to extract transactions",
    step1: "Step 1: Upload & Crop Image",
    step1Desc: "Upload a clear image of a receipt, crop it, and then process.",
    fileTypes: "PNG, JPG, GIF up to 10MB",
    cropped: "(cropped)",
    processImage: "Process Image",
    cropImage: "Crop Image",
    cropAndUse: "Crop & Use",
    step2: "Step 2: Review and Edit Extracted Text",
    step2Desc:
      "Correct any errors in the extracted text. This text will be sent to the server for processing.",
    imagePreview: "Image Preview",
    extractedText: "Extracted Text (Editable)",
    extractedTextPlaceholder: "Extracted text will appear here...",
    previewTransactions: "Preview Transactions",
    step3: "Step 3: Review and Save Transactions",
    step3Desc:
      "Edit the details for each transaction below. Unchecked transactions will be ignored.",
    selectAllTransactions: "Select All Transactions",
    expenseNumber: "Expense",
    date: "Date",
    amount: "Amount",
    wallet: "Wallet",
    selectWallet: "Select Wallet",
    category: "Category",
    selectCategory: "Select Category",
    note: "Note",
    transactionNote: "Transaction note...",
    saveSelectedTransactions: "Save Selected Transactions",
    uploadImageError: "Please upload an image file.",
    ocrError:
      "An error occurred during OCR processing. Please check the console.",
    previewError:
      "Failed to get transaction preview. Please check the console.",
    apiError: "An API error occurred. Please check the console.",
    saveSuccess: "transactions saved successfully!",
    saveError:
      "An error occurred while saving transactions. Please check the console for details.",
  },

  // Settings
  settings: {
    title: "Settings",
    subtitle: "Manage your application settings",
    globalSettings: "Global Settings",
    defaultCurrency: "Default Currency",
    decimalFractions: "Decimal Fractions",
    geminiApiKey: "Gemini Api Key",
    geminiApiKeyPlaceholder: "Your Api Key",
    geminiApiKeyHint: "Add your gemini API Key to enable AI Features.",
    currencyUpdateSuccess: "Currency settings updated successfully!",
    dateSettings: "Date Settings",
    firstDayOfMonth: "First Day of Month",
    firstDayOfMonthHint: "Set the starting day of your financial month (1-28).",
    dateSettingsUpdateSuccess: "Date settings updated successfully!",
    calculationSettings: "Calculation Settings",
    includeHiddenWallets: "Include hidden wallets in calculation",
    includeHiddenWalletsHint:
      "Enable this to include balances from hidden wallets in total calculations across the app.",
    calculationSettingsUpdateSuccess:
      "Calculation settings updated successfully!",
    saveSettings: "Save Settings",
    saveDateSettings: "Save Date Settings",
    language: "Language",
    languageHint: "Choose your preferred language",
    languageUpdateSuccess: "Language updated successfully!",
  },

  // Modal: Budget
  budgetModal: {
    editBudget: "Edit Budget",
    createBudget: "Create Budget",
    budgetLimit: "Budget Limit",
    budgetLimitPlaceholder: "0.00",
    budgetLimitHint: "Enter the limit for this budget.",
    budgetName: "Budget Name",
    budgetNamePlaceholder: "e.g. Monthly Food Budget",
    startDate: "Start Date",
    endDate: "End Date",
    categories: "Categories",
    cancel: "Cancel",
    update: "Update",
    create: "Create",
    budget: "Budget",
    saveFailed: "Failed to save budget. Please try again.",
    unexpectedError: "An unexpected error occurred. Please try again.",
  },

  // Modal: Category
  categoryModal: {
    editCategory: "Edit Category",
    addCategory: "Add Category",
    categoryName: "Category Name",
    categoryNamePlaceholder: "e.g., Groceries, Salary",
    type: "Type",
    income: "Income",
    expense: "Expense",
    preview: "Preview",
    category: "Category",
    color: "Color",
    icon: "Icon",
    cancel: "Cancel",
    update: "Update",
    create: "Create",
    saveFailed: "Failed to save category. Please try again.",
    unexpectedError: "An unexpected error occurred. Please try again.",
  },

  // Modal: Category Filter
  categoryFilterModal: {
    title: "Filter Categories",
    description:
      "Select categories to exclude from the transaction list and calculations.",
    searchPlaceholder: "Search categories...",
    noResults: "No categories found",
    tryDifferentSearch: "Try a different search term",
    clearSelection: "Clear Selection",
    selectAll: "Select All",
    cancel: "Cancel",
    apply: "Apply",
  },

  // Modal: Transaction
  transactionModal: {
    editTransaction: "Edit Transaction",
    addIncome: "Add Income",
    addExpense: "Add Expense",
    addTransfer: "Add Transfer",
    addTransaction: "Add Transaction",
    amount: "Amount",
    amountPlaceholder: "0.00",
    transactionType: "Transaction Type",
    income: "Income",
    expense: "Expense",
    transfer: "Transfer",
    sourceWallet: "Source Wallet",
    wallet: "Wallet",
    destinationWallet: "Destination Wallet",
    category: "Category",
    date: "Date",
    noteOptional: "Note (Optional)",
    notePlaceholder: "Add a note for this transaction...",
    recurringPattern: "Recurring Pattern",
    recurringCount: "Repeat Count",
    recurringCountPlaceholder: "e.g., 12",
    recurringCountHint: "Number of times to repeat (optional if until date is set)",
    recurringUntil: "Repeat Until",
    recurringUntilHint: "End date for recurring (optional if count is set)",
    selectWallet: "Select a wallet",
    main: "(Main)",
    selectDestination: "Select destination wallet",
    selectCategory: "Select a category",
    makeRecurring: "Make this a recurring transaction",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
    cancel: "Cancel",
    update: "Update",
    add: "Add",
    transaction: "Transaction",
    saveFailed: "Failed to save transaction. Please try again.",
    unexpectedError: "An unexpected error occurred. Please try again.",
  },

  // Budget Card
  budgetCard: {
    noTransactions: "No transactions found for this budget period.",
  },

  // Expense Analysis
  expenseAnalysis: {
    title: "Expense Hotspots",
    subtitle: "Frequent categories in this period.",
    byAmount: "By Amount",
    byFrequency: "By Frequency",
    noData: "No expense data to analyze.",
    transactions: "transactions",
    totalSpent: "Total Spent",
    avg: "Avg",
    trx: "Trx",
    median: "Median",
    daily: "Daily",
    weekly: "Weekly",
    period: "Period",
  },

  // Modal: Wallet
  walletModal: {
    editWallet: "Edit Wallet",
    addWallet: "Add Wallet",
    initialBalance: "Initial Balance",
    initialBalancePlaceholder: "0.00",
    initialBalanceHint: "Enter the starting balance for this wallet.",
    walletName: "Wallet Name",
    walletNamePlaceholder: "e.g., Main Bank Account",
    hideWallet: "Hide this wallet",
    hideWalletHint: "Excluded from total calculations.",
    setAsMain: "Set as main wallet",
    setAsMainHint: "This wallet will be shown first.",
    useSetting: "Use setting",
    cancel: "Cancel",
    update: "Update",
    create: "Create",
    wallet: "Wallet",
    saveFailed: "Failed to save wallet. Please try again.",
    unexpectedError: "An unexpected error occurred. Please try again.",
  },

  // Milestones
  milestones: {
    // Page titles
    title: "Milestones",
    subtitle: "Track your financial journey timeline",

    // Navigation
    back: "Back",
    backToMilestones: "Back to Milestones",

    // Buttons
    createMilestone: "Create Milestone",
    updateMilestone: "Update Milestone",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    add: "Add",
    refreshProgress: "Refresh Progress",
    markAsAchieved: "Mark as Achieved",
    cancelMilestone: "Cancel Milestone",
    newMilestone: "New Milestone",

    // Stats
    total: "Total",
    achieved: "Achieved",
    inProgress: "In Progress",
    completion: "Completion",

    // Empty states
    noMilestonesYet: "No Milestones Yet",
    noMilestonesDescription:
      "Create your first milestone to start tracking your financial journey",
    noConditionsYet: 'No conditions yet. Click "Add" to get started.',

    // Sections
    milestoneInformation: "Milestone Information",
    conditions: "Conditions",
    progress: "Progress",
    appearance: "Appearance",

    // Form labels
    name: "Name",
    description: "Description",
    targetDate: "Target Date",
    icon: "Icon",
    color: "Color",
    type: "Type",
    target: "Target",
    conditionsMet: "{count}/{total} met",
    conditionsMetText: "conditions met",
    conditionNumber: "Condition {number}",
    selectConditionType: "Select condition type...",
    selectIcon: "Select Icon",

    // Placeholders
    namePlaceholder: "e.g., Emergency Fund - 30 Juta",
    descriptionPlaceholder: "Describe your milestone...",

    // Messages
    conditionsHelper: "Add 1-10 conditions to track your milestone progress",

    // Error states
    milestoneNotFound: "Milestone Not Found",
    milestoneNotFoundDescription:
      "The milestone you're looking for doesn't exist or has been deleted.",
    milestoneNotFoundEdit:
      "The milestone you're trying to edit doesn't exist or has been deleted.",

    // Cancelled milestone
    cancelledMilestoneTitle: "Cancelled Milestone",
    cancelledMilestoneMessage:
      "This milestone has been cancelled and cannot be edited.",
    achievedMilestoneTitle: "Achieved Milestone",
    achievedMilestoneMessage:
      "This milestone has been achieved and cannot be edited.",
    deleteThisMilestone: "Delete This Milestone",
    deleteDescription:
      "Permanently remove this cancelled milestone from your records.",

    // Confirm dialogs
    deleteMilestone: "Delete Milestone",
    deleteConfirmation:
      "Are you sure you want to delete this milestone? This action cannot be undone.",
    cancelMilestoneTitle: "Cancel Milestone",
    cancelMilestoneConfirmation:
      "Are you sure you want to cancel this milestone? This will mark it as cancelled and stop tracking progress.",

    // Error messages
    failedToCreate: "Failed to create milestone",
    failedToUpdate: "Failed to update milestone",
    failedToDelete: "Failed to delete milestone",
    failedToUpdateStatus: "Failed to update status",
    errorOccurred: "An error occurred",

    // Condition types
    conditionTypes: {
      walletBalance: "Wallet Balance Reaches Target",
      budgetControl: "Budget No Overspend",
      transactionAmount: "Get Specific Income/Expense",
      periodTotal: "Period Income/Expense Total",
      netWorth: "Net Worth Target",
      categorySpending: "Category Spending Limit",
    },
    conditionDescriptions: {
      walletBalance:
        "Milestone achieved when wallet balance reaches a certain amount",
      budgetControl:
        "Milestone achieved when budget doesn't overspend for X months",
      transactionAmount:
        "Milestone achieved when there is 1 transaction with a certain amount",
      periodTotal:
        "Milestone achieved when total transactions in period reach target",
      netWorth: "Milestone achieved when total net worth reaches target",
      categorySpending:
        "Milestone achieved when category spending is within the limit",
    },

    // Operators
    operators: {
      gte: "Greater than or equal to (≥)",
      gt: "Greater than (>)",
      lte: "Less than or equal to (≤)",
      lt: "Less than (<)",
      eq: "Equal to (=)",
    },

    // Condition Explanations
    conditionExplanations: {
      walletBalanceSpecific: 'Balance of "{wallet}" {operator} {target}',
      walletBalanceAll: "Total balance from all wallets {operator} {target}",
      budgetControl:
        "Budget must not overspend for {months} consecutive month(s)",
      budgetControlSpecific:
        '"{budget}" budget must not overspend for {months} consecutive month(s)',
      transactionAmount: "Get {type} transaction {operator} {target}",
      transactionAmountCategory:
        'Get {type} transaction {operator} {target} from "{category}"',
      periodTotal: "Total {type} in {period} {operator} {target}",
      netWorth: "Total net worth (assets - liabilities) {operator} {target}",
      categorySpending:
        'Spending in "{category}" for {period} {operator} {target}',
    },

    // Periods
    periods: {
      thisMonth: "This Month",
      thisQuarter: "This Quarter",
      thisYear: "This Year",
      custom: "Custom Period",
    },

    // Unknown
    unknownWallet: "Unknown Wallet",
    unknownCategory: "Unknown Category",

    // Time remaining
    timeRemaining: {
      daysAgo: "{count} days ago",
      today: "Today",
      tomorrow: "Tomorrow",
      daysLeft: "{count} days left",
      oneMonthLeft: "1 month left",
      monthsLeft: "{count} months left",
      yearsLeft: "{count} years left",
      overdue: "Overdue",
    },

    // Condition form fields
    conditionFields: {
      wallet: "Wallet",
      allWallets: "All Wallets",
      hidden: "(Hidden)",
      operator: "Operator",
      targetAmount: "Target Amount",
      budget: "Budget",
      selectBudget: "Select Budget...",
      condition: "Condition",
      noOverspend: "No Overspend",
      underPercentage: "Under Percentage",
      percentage: "Percentage",
      consecutiveMonths: "Consecutive Months",
      transactionType: "Transaction Type",
      income: "Income",
      expense: "Expense",
      amount: "Amount",
      category: "Category",
      categoryOptional: "Category (optional)",
      anyCategory: "Any Category",
      period: "Period",
      startDate: "Start Date",
      endDate: "End Date",
      includeHiddenWallets: "Include hidden wallets",
      selectCategory: "Select Category...",

      // Placeholders
      amountPlaceholder: "e.g., {amount}",
      percentagePlaceholder: "e.g., 80",
      monthsPlaceholder: "e.g., 3",
    },

    // Condition explanations
    explanations: {
      walletBalance: "Wallet balance {operator} target",
      walletBalanceAll: "Total balance from all wallets {operator} target",
      budgetControl:
        "Budget must not overspend for {months} consecutive month{plural}",
      transactionIncome: "Get income transaction {operator} target",
      transactionExpense: "Get expense transaction {operator} target",
      transactionIncomeCategory:
        "Get income transaction {operator} target from specific category",
      transactionExpenseCategory:
        "Get expense transaction {operator} target from specific category",
      periodTotalIncome: "Total income in {period} {operator} target",
      periodTotalExpense: "Total expense in {period} {operator} target",
      netWorth: "Total net worth (assets - liabilities) {operator} target",
      categorySpending:
        "Spending in specific category for {period} {operator} limit",
      thisMonth: "this month",
      thisQuarter: "this quarter",
      thisYear: "this year",
      customPeriod: "custom period",
      customPeriodDates: "custom period ({start} - {end})",
    },
  },
};
