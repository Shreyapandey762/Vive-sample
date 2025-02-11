import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type Transaction = {
  id?: Number;
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
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
  },
});

export const {addTransaction} = transactionsSlice.actions;
export default transactionsSlice.reducer;
