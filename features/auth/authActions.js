// src/features/auth/authActions.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setUser, logoutUser } from './authSlice';

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    // Simulación de autenticación, reemplaza con tu API
    const response = await fetch('https://reqres.in/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('token', data.token);
      thunkAPI.dispatch(setUser({ token: data.token, email }));
    } else {
      throw new Error(data.error || 'Login failed');
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const logout = () => async (dispatch) => {
  await AsyncStorage.removeItem('token');
  dispatch(logoutUser());
};
