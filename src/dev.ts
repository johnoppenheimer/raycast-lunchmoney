import { ReccuringTransactionType, Transaction, TransactionStatus } from "./lunchmoney";

/// List of hardcoded transactions for demo or screenshots purposes
const sampleTransactions: Transaction[] = [
  {
    id: 1001,
    created_at: "2024-11-01T08:30:00Z",
    updated_at: "2024-11-01T08:30:00Z",
    date: "2024-11-01",
    payee: "Whole Foods Market",
    amount: "-89.47",
    currency: "USD",
    to_base: 89.47,
    notes: "Weekly grocery shopping",
    category_id: 101,
    category_name: "Groceries",
    asset_id: 1,
    asset_name: "Chase Checking",
    plaid_account_id: 12345,
    plaid_account_name: "Chase (...4321)",
    status: TransactionStatus.CLEARED,
    is_group: false,
    tags: [
      { id: 1100, name: "food" },
      { id: 1101, name: "essential" },
    ],
    is_pending: false,
    is_income: false,
    display_name: "Whole Foods",
    display_note: "Grocery run",
    recurring_payee: null,
    recurring_cadence: null,
    recurring_currency: null,
    recurring_id: null,
    recurring_type: null,
    recurring_amount: null,
    recurring_description: null,
  },
  {
    id: 1002,
    created_at: "2024-11-01T09:15:00Z",
    updated_at: "2024-11-01T09:15:00Z",
    date: "2024-11-01",
    payee: "Netflix",
    amount: "-15.99",
    currency: "USD",
    to_base: 15.99,
    notes: "Monthly subscription",
    category_id: 102,
    category_name: "Entertainment",
    asset_id: 1,
    asset_name: "Chase Checking",
    plaid_account_id: 12345,
    plaid_account_name: "Chase (...4321)",
    status: TransactionStatus.CLEARED,
    is_group: false,
    is_pending: false,
    is_income: false,
    display_note: null,
    recurring_id: 2,
    recurring_payee: "Netflix",
    recurring_type: ReccuringTransactionType.CLEARED,
    recurring_description: "Monthly streaming service",
    recurring_cadence: "monthly",
    recurring_amount: 15.99,
    recurring_currency: "USD",
  },
  {
    id: 1003,
    created_at: "2024-11-01T10:00:00Z",
    updated_at: "2024-11-01T10:00:00Z",
    date: "2024-11-01",
    payee: "TechCorp Inc",
    amount: "3500.00",
    currency: "USD",
    to_base: 3500.0,
    notes: "Salary deposit",
    category_id: 103,
    category_name: "Income",
    asset_id: 1,
    asset_name: "Chase Checking",
    plaid_account_id: 12345,
    plaid_account_name: "Chase (...4321)",
    status: TransactionStatus.CLEARED,
    is_group: false,
    is_pending: false,
    is_income: true,
    display_note: "Monthly salary",
    recurring_id: 3,
    recurring_payee: "TechCorp Inc",
    recurring_type: ReccuringTransactionType.CLEARED,
    recurring_description: "Monthly salary",
    recurring_cadence: "monthly",
    recurring_amount: 3500.0,
    recurring_currency: "USD",
  },
  {
    id: 1004,
    created_at: "2024-11-02T11:30:00Z",
    updated_at: "2024-11-02T11:30:00Z",
    date: "2024-11-02",
    payee: "Uber",
    amount: "-24.50",
    currency: "USD",
    to_base: 24.5,
    notes: "Ride to downtown",
    category_id: 104,
    category_name: "Transportation",
    asset_id: 2,
    asset_name: "Amex Blue",
    plaid_account_id: 12346,
    plaid_account_name: "Amex (...9876)",
    status: TransactionStatus.CLEARED,
    is_group: false,
    is_pending: false,
    is_income: false,
    display_note: "Downtown ride",
    recurring_id: null,
    recurring_payee: null,
    recurring_type: null,
    recurring_description: null,
    recurring_cadence: null,
    recurring_amount: null,
    recurring_currency: null,
  },
  {
    id: 1005,
    created_at: "2024-11-02T12:45:00Z",
    updated_at: "2024-11-02T12:45:00Z",
    date: "2024-11-02",
    payee: "Starbucks",
    amount: "-5.75",
    currency: "USD",
    to_base: 5.75,
    notes: "Coffee",
    category_id: 105,
    category_name: "Dining",
    asset_id: 2,
    asset_name: "Amex Blue",
    plaid_account_id: 12346,
    plaid_account_name: "Amex (...9876)",
    status: TransactionStatus.CLEARED,
    is_group: false,
    tags: [
      { id: 1102, name: "coffee" },
      { id: 1103, name: "dining" },
    ],
    is_pending: false,
    is_income: false,
    display_note: "Morning coffee",
    recurring_id: null,
    recurring_payee: null,
    recurring_type: null,
    recurring_description: null,
    recurring_cadence: null,
    recurring_amount: null,
    recurring_currency: null,
  },
  {
    id: 1006,
    created_at: "2024-11-02T14:20:00Z",
    updated_at: "2024-11-02T14:20:00Z",
    date: "2024-11-02",
    payee: "Amazon.com",
    amount: "-142.67",
    currency: "USD",
    to_base: 142.67,
    notes: "Various household items",
    category_id: 106,
    category_name: "Shopping",
    asset_id: 2,
    asset_name: "Amex Blue",
    plaid_account_id: 12346,
    plaid_account_name: "Amex (...9876)",
    status: TransactionStatus.PENDING,
    is_group: false,
    is_pending: true,
    is_income: false,
    display_note: "Household supplies",
    recurring_id: null,
    recurring_payee: null,
    recurring_type: null,
    recurring_description: null,
    recurring_cadence: null,
    recurring_amount: null,
    recurring_currency: null,
  },
  {
    id: 1007,
    created_at: "2024-11-03T09:00:00Z",
    updated_at: "2024-11-03T09:00:00Z",
    date: "2024-11-03",
    payee: "Gym Membership",
    amount: "-50.00",
    currency: "USD",
    to_base: 50.0,
    notes: "Monthly membership fee",
    category_id: 107,
    category_name: "Health & Fitness",
    asset_id: 1,
    asset_name: "Chase Checking",
    plaid_account_id: 12345,
    plaid_account_name: "Chase (...4321)",
    status: TransactionStatus.CLEARED,
    is_group: false,
    is_pending: false,
    is_income: false,
    display_note: "Monthly gym",
    recurring_id: 4,
    recurring_payee: "Gym Membership",
    recurring_type: ReccuringTransactionType.CLEARED,
    recurring_description: "Monthly gym membership",
    recurring_cadence: "monthly",
    recurring_amount: 50.0,
    recurring_currency: "USD",
  },
  {
    id: 1008,
    created_at: "2024-11-03T10:30:00Z",
    updated_at: "2024-11-03T10:30:00Z",
    date: "2024-11-03",
    payee: "Freelance Project",
    amount: "800.00",
    currency: "USD",
    to_base: 800.0,
    notes: "Website development",
    category_id: 103,
    category_name: "Income",
    asset_id: 1,
    asset_name: "Chase Checking",
    plaid_account_id: 12345,
    plaid_account_name: "Chase (...4321)",
    status: TransactionStatus.UNCLEARED,
    is_group: false,
    tags: [
      { id: 1105, name: "freelance" },
      { id: 1106, name: "development" },
    ],
    is_pending: false,
    is_income: true,
    display_note: "Freelance payment",
    recurring_id: null,
    recurring_payee: null,
    recurring_type: null,
    recurring_description: null,
    recurring_cadence: null,
    recurring_amount: null,
    recurring_currency: null,
  },
  {
    id: 1009,
    created_at: "2024-11-03T15:45:00Z",
    updated_at: "2024-11-03T15:45:00Z",
    date: "2024-11-03",
    payee: "AT&T",
    amount: "-85.00",
    currency: "USD",
    to_base: 85.0,
    notes: "Monthly phone bill",
    category_id: 108,
    category_name: "Utilities",
    asset_id: 1,
    asset_name: "Chase Checking",
    plaid_account_id: 12345,
    plaid_account_name: "Chase (...4321)",
    status: TransactionStatus.CLEARED,
    is_group: false,
    is_pending: false,
    is_income: false,
    display_note: "Phone bill",
    recurring_id: 5,
    recurring_payee: "AT&T",
    recurring_type: ReccuringTransactionType.CLEARED,
    recurring_description: "Monthly phone service",
    recurring_cadence: "monthly",
    recurring_amount: 85.0,
    recurring_currency: "USD",
  },
  {
    id: 1010,
    created_at: "2024-11-03T16:20:00Z",
    updated_at: "2024-11-03T16:20:00Z",
    date: "2024-11-03",
    payee: "Target",
    amount: "-65.32",
    currency: "USD",
    to_base: 65.32,
    notes: "Home supplies",
    category_id: 106,
    category_name: "Shopping",
    asset_id: 2,
    asset_name: "Amex Blue",
    plaid_account_id: 12346,
    plaid_account_name: "Amex (...9876)",
    status: TransactionStatus.CLEARED,
    is_group: false,
    is_pending: false,
    is_income: false,
    display_note: "Household items",
    recurring_id: null,
    recurring_payee: null,
    recurring_type: null,
    recurring_description: null,
    recurring_cadence: null,
    recurring_amount: null,
    recurring_currency: null,
  },
  {
    id: 1011,
    created_at: "2024-11-03T17:00:00Z",
    updated_at: "2024-11-03T17:00:00Z",
    date: "2024-11-03",
    payee: "Spotify",
    amount: "-9.99",
    currency: "USD",
    to_base: 9.99,
    notes: "Monthly subscription",
    category_id: 102,
    category_name: "Entertainment",
    asset_id: 1,
    asset_name: "Chase Checking",
    plaid_account_id: 12345,
    plaid_account_name: "Chase (...4321)",
    status: TransactionStatus.CLEARED,
    is_group: false,
    is_pending: false,
    is_income: false,
    display_note: "Music streaming",
    recurring_id: 6,
    recurring_payee: "Spotify",
    recurring_description: "Monthly music streaming",
    recurring_cadence: "monthly",
    recurring_amount: 9.99,
    recurring_currency: "USD",
    recurring_type: ReccuringTransactionType.CLEARED,
  },
  {
    id: 1012,
    created_at: "2024-11-03T18:30:00Z",
    updated_at: "2024-11-03T18:30:00Z",
    date: "2024-11-03",
    payee: "Local Restaurant",
    amount: "-45.80",
    currency: "USD",
    to_base: 45.8,
    notes: "Dinner with friends",
    category_id: 105,
    category_name: "Dining",
    asset_id: 2,
    asset_name: "Amex Blue",
    plaid_account_id: 12346,
    plaid_account_name: "Amex (...9876)",
    status: TransactionStatus.CLEARED,
    is_group: false,
    tags: [
      { id: 1103, name: "dining" },
      { id: 1104, name: "social" },
    ],
    is_pending: false,
    is_income: false,
    display_note: "Dinner out",
    recurring_id: null,
    recurring_payee: null,
    recurring_type: null,
    recurring_description: null,
    recurring_cadence: null,
    recurring_amount: null,
    recurring_currency: null,
  },
];

export default sampleTransactions;