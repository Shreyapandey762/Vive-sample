import axios from 'axios';
import {User} from '../context/UserContext';

const BASE_URL = 'https://staging.gotvive.com/api/v1';

export const fetchAllTransactions = async (user: User) => {
  const headers = {
    Authorization: `Bearer ${user.auth_token}`,
    Accept: 'application/json',
  };
  try {
    const response = await axios.get(
      `${BASE_URL}/transactions?per_page=50&page=1&transaction_type=Buyer`,
      {headers},
    );
    return response.data.transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const fetchTransactionDetails = async (
  user: User,
  id: string | null,
) => {
  const headers = {
    Authorization: `Bearer ${user.auth_token}`,
    Accept: 'application/json',
  };
  try {
    const response = await axios.get(
      `${BASE_URL}/transactions?per_page=50&page=1&transaction_type=Buyer`,
      {headers},
    );
    return response.data.transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const createTransactions = async (user: User) => {
  const headers = {
    Authorization: `Bearer ${user.auth_token}`,
    Accept: 'application/json',
  };
  try {
    const response = await axios.get(`${BASE_URL}/transactions`, {headers});
    return response.data.transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const updateTransactions = async (
  user: User,
  user_role_id: string | null,
) => {
  const headers = {
    Authorization: `Bearer ${user.auth_token}`,
    Accept: 'application/json',
  };
  try {
    const response = await axios.get(`${BASE_URL}/transactions`, {headers});
    return response.data.transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
