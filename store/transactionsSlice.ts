import axios from 'axios';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../context/UserContext';
import {Dispatch} from 'redux';

const BASE_URL = 'https://staging.gotvive.com/api/v1';

export type Transaction = {
  id?: any;
  name: string;
  full_address?: string | null;
  image_url?: string | null;
  image_thumb_url?: string | null;
  created_at?: string;
  updated_at?: string;
  transaction_type?: string;
  local_image_url?: string;
  image_modified_by?: string;
  is_demo?: boolean;
  users?: User[];
  task_groups?: any[];
  creator_id?: string;
  gtm_tasks_count?: number | null;
  pre_offer_tasks_count?: number;
  contract_tasks_count?: number;
  financing_tasks_count?: number;
  closing_tasks_count?: number;
  purchase_offer_completed?: boolean;
  task_completion_percentage?: {
    gtm?: {percentage: number; total_count: number};
    pre_offer?: {percentage: number; total_count: number};
    contract?: {percentage: number; total_count: number};
    financing?: {percentage: number; total_count: number};
    closing?: {percentage: number; total_count: number};
  };
  home_showing_count?: number;
  upcoming_home_count?: number;
  top_3_home_count?: number;
  discard_home_count?: number;
  home_showings_image?: string;
  homeprep_task_images?: string[];
};

interface TransactionsState {
  transactions: Transaction[];
  transactionDetails: Transaction | null;
}

const initialState: TransactionsState = {
  transactions: [],
  transactionDetails: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },

    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions = state.transactions.map(e =>
        e.id === action.payload.id ? action.payload : e,
      );
    },
    deleteTransaction: (state, action: PayloadAction<number>) => {
      state.transactions = state.transactions.filter(
        e => e.id !== action.payload,
      );
    },
    setTransactionDetails: (state, action: PayloadAction<Transaction>) => {
      state.transactionDetails = action.payload;
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = transactionsSlice.actions;
export default transactionsSlice.reducer;
