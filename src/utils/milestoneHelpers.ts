import type {
  ConditionType,
  ConditionTemplate,
  Operator,
  Period,
  MilestoneStatus,
  ConditionWithProgress,
} from '@/types/milestone';

// ============================================================================
// Condition Templates
// ============================================================================

export const conditionTemplates: ConditionTemplate[] = [
  {
    value: 'wallet_balance' as ConditionType,
    label: 'Saldo Wallet Mencapai Target',
    icon: 'wallet',
    description: 'Milestone tercapai ketika saldo wallet mencapai nominal tertentu',
  },
  {
    value: 'budget_control' as ConditionType,
    label: 'Budget Tidak Overspend',
    icon: 'shield-check',
    description: 'Milestone tercapai ketika budget tidak overspend selama X bulan',
  },
  {
    value: 'transaction_amount' as ConditionType,
    label: 'Dapat Income/Expense Tertentu',
    icon: 'banknote',
    description: 'Milestone tercapai ketika ada 1 transaksi dengan nominal tertentu',
  },
  {
    value: 'period_total' as ConditionType,
    label: 'Total Income/Expense Periode',
    icon: 'calendar',
    description: 'Milestone tercapai ketika total transaksi dalam periode mencapai target',
  },
  {
    value: 'net_worth' as ConditionType,
    label: 'Net Worth Target',
    icon: 'trending-up',
    description: 'Milestone tercapai ketika total kekayaan mencapai target',
  },
  {
    value: 'category_spending' as ConditionType,
    label: 'Limit Spending Kategori',
    icon: 'tag',
    description: 'Milestone tercapai ketika spending kategori dalam batas yang ditentukan',
  },
];

// ============================================================================
// Operator Options
// ============================================================================

export const operatorOptions = [
  { value: '>=' as Operator, label: 'Lebih besar sama dengan (≥)' },
  { value: '>' as Operator, label: 'Lebih besar (>)' },
  { value: '<=' as Operator, label: 'Lebih kecil sama dengan (≤)' },
  { value: '<' as Operator, label: 'Lebih kecil (<)' },
  { value: '=' as Operator, label: 'Sama dengan (=)' },
];

// ============================================================================
// Period Options
// ============================================================================

export const periodOptions = [
  { value: 'month' as Period, label: 'Bulan Ini' },
  { value: 'quarter' as Period, label: 'Kuartal Ini' },
  { value: 'year' as Period, label: 'Tahun Ini' },
  { value: 'custom' as Period, label: 'Periode Custom' },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get condition template by type
 */
export const getConditionTemplate = (type: ConditionType): ConditionTemplate | undefined => {
  return conditionTemplates.find((t) => t.value === type);
};

/**
 * Get condition label/name
 */
export const getConditionLabel = (type: ConditionType): string => {
  const labels: Record<ConditionType, string> = {
    wallet_balance: 'Wallet Balance',
    budget_control: 'Budget Control',
    transaction_amount: 'Transaction Amount',
    period_total: 'Period Total',
    net_worth: 'Net Worth',
    category_spending: 'Category Spending',
  };
  return labels[type] || type;
};

/**
 * Format currency value
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format value based on condition type
 */
export const formatConditionValue = (
  value: number | boolean,
  type: ConditionType
): string => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';

  // For currency values
  const currencyTypes: ConditionType[] = [
    'wallet_balance',
    'transaction_amount',
    'period_total',
    'net_worth',
    'category_spending',
  ];

  if (currencyTypes.includes(type)) {
    return formatCurrency(value);
  }

  // For months (budget_control)
  if (type === 'budget_control') {
    return `${value} bulan`;
  }

  return String(value);
};

/**
 * Get status color
 */
export const getStatusColor = (status: MilestoneStatus): string => {
  const colors: Record<MilestoneStatus, string> = {
    pending: '#95a5a6',
    in_progress: '#3498db',
    achieved: '#2ecc71',
    failed: '#e74c3c',
    cancelled: '#7f8c8d',
  };
  return colors[status] || '#95a5a6';
};

/**
 * Get status label
 */
export const getStatusLabel = (status: MilestoneStatus): string => {
  const labels: Record<MilestoneStatus, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    achieved: 'Achieved',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

/**
 * Get status badge class
 */
export const getStatusBadgeClass = (status: MilestoneStatus): string => {
  const classes: Record<MilestoneStatus, string> = {
    pending: 'bg-gray-100 text-gray-800 border-gray-300',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
    achieved: 'bg-green-100 text-green-800 border-green-300',
    failed: 'bg-red-100 text-red-800 border-red-300',
    cancelled: 'bg-gray-100 text-gray-600 border-gray-300',
  };
  return classes[status] || classes.pending;
};

/**
 * Get progress color based on percentage
 */
export const getProgressColor = (progress: number): string => {
  if (progress >= 100) return '#2ecc71'; // Green
  if (progress >= 75) return '#3498db'; // Blue
  if (progress >= 50) return '#f39c12'; // Orange
  if (progress >= 25) return '#e67e22'; // Dark orange
  return '#e74c3c'; // Red
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Format date to short format
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Calculate days until target date
 */
export const daysUntilTarget = (targetDate: string): number => {
  const target = new Date(targetDate);
  const today = new Date();
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Get time remaining text
 */
export const getTimeRemaining = (targetDate: string): string => {
  const days = daysUntilTarget(targetDate);

  if (days < 0) {
    return `${Math.abs(days)} hari yang lalu`;
  }

  if (days === 0) {
    return 'Hari ini';
  }

  if (days === 1) {
    return 'Besok';
  }

  if (days <= 30) {
    return `${days} hari lagi`;
  }

  const months = Math.floor(days / 30);
  if (months === 1) {
    return '1 bulan lagi';
  }

  if (months < 12) {
    return `${months} bulan lagi`;
  }

  const years = Math.floor(months / 12);
  return `${years} tahun lagi`;
};

/**
 * Check if milestone is overdue
 */
export const isMilestoneOverdue = (targetDate: string, status: MilestoneStatus): boolean => {
  if (status === 'achieved') return false;
  return daysUntilTarget(targetDate) < 0;
};

/**
 * Get operator symbol
 */
export const getOperatorSymbol = (operator: Operator): string => {
  const symbols: Record<Operator, string> = {
    '>=': '≥',
    '>': '>',
    '<=': '≤',
    '<': '<',
    '=': '=',
  };
  return symbols[operator] || operator;
};

/**
 * Validate hex color
 */
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

/**
 * Get default milestone colors
 */
export const defaultMilestoneColors = [
  '#26de81', // Green
  '#3498db', // Blue
  '#ff6b6b', // Red
  '#ffa502', // Orange
  '#45aaf2', // Light Blue
  '#2ed573', // Light Green
  '#a55eea', // Purple
  '#fd79a8', // Pink
  '#fdcb6e', // Yellow
  '#6c5ce7', // Indigo
];

/**
 * Sort conditions by is_met status (met conditions first)
 */
export const sortConditionsByStatus = (
  conditions: ConditionWithProgress[]
): ConditionWithProgress[] => {
  return [...conditions].sort((a, b) => {
    if (a.is_met === b.is_met) return 0;
    return a.is_met ? -1 : 1;
  });
};

/**
 * Calculate overall completion percentage for multiple milestones
 */
export const calculateOverallCompletion = (milestones: { overall_progress: number }[]): number => {
  if (milestones.length === 0) return 0;
  const total = milestones.reduce((sum, m) => sum + m.overall_progress, 0);
  return total / milestones.length;
};
