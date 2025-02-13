import axios from 'axios';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../context/UserContext';
import {Dispatch} from 'redux';

const BASE_URL = 'https://staging.gotvive.com/api/v1';

export type Transaction = {
  id?: number;
  title: string;
  subtitle?: string | null;
  image?: string | null;
};

interface TransactionsState {
  transactions: Transaction[];
}

const initialState: TransactionsState = {
  transactions: [],
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
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = transactionsSlice.actions;
export default transactionsSlice.reducer;
