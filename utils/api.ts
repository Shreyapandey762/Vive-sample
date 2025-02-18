import axios from 'axios';
import {User} from '../context/UserContext';
import {Transaction} from '../store/transactionsSlice';

const BASE_URL = 'https://staging.gotvive.com/api/v1';

export const fetchAllTransactions = async (user: User) => {
  const headers = {
    Authorization: `Bearer ${user.auth_token}`,
    Accept: 'application/json',
  };
  try {
    const response = await axios.get(
      `${BASE_URL}/transactions?per_page=50&page=1&transaction_type=Seller`,
      {headers},
    );
    return response.data.transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const createTransaction = async (user: User, name: string) => {
  const headers = {
    Authorization: `Bearer ${user.auth_token}`,
    Accept: 'application/json',
  };
  try {
    const response = await axios.post(
      `${BASE_URL}/transactions`,
      {transaction: {name: name, transaction_type: 'Seller'}},
      {headers},
    );
    return response.data.transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const updateTransaction = async (
  user: User,
  transaction_id: string | null,
  transaction: Transaction,
) => {
  try {
    const formData = new FormData();
    formData.append('transaction[name]', transaction.name);
    formData.append('transaction[image]', {
      uri: transaction.image_url,
      name: 'image.png',
      type: 'image/png',
    });

    await axios.put(`${BASE_URL}/transactions/${transaction_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `Bearer ${user.auth_token}`,
      },
    });
  } catch (e) {
    console.error(e);
  }
};

export const deleteTransaction = async (
  user: User,
  transaction_id: string | null,
) => {
  try {
    const headers = {
      Authorization: `Bearer ${user.auth_token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    console.log(headers);
    const res = await fetch(
      `${BASE_URL}/transactions/${transaction_id}/remove_transaction`,
      {
        method: 'POST',
        headers: headers,
      },
    );
    console.log(res);
  } catch (e) {
    console.error(e);
  }
};

export const sampleFunction = async (
  user: User,
  transaction_id: string | null,
) => {
  try {
    const headers = {
      Authorization: `Bearer ${user.auth_token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const res = await fetch(
      `https://staging.gotvive.com/api/v2/homeprep_tasks?transaction_id=${transaction_id}`,
      {
        method: 'GET',
        headers: headers,
      },
    );
    const jsonData = await res.json();
    return jsonData;
  } catch (e) {
    console.log(e);
  }
};
