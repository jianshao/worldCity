import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';

export const saveToken = async (token: string) => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      const isAvailable = await SecureStore.isAvailableAsync();
      if (isAvailable) {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      } else {
        await AsyncStorage.setItem(TOKEN_KEY, token);
      }
    }
  } catch (e) {
    console.error('Failed to save token', e);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } else {
      const isAvailable = await SecureStore.isAvailableAsync();
      if (isAvailable) {
        return await SecureStore.getItemAsync(TOKEN_KEY);
      } else {
        return await AsyncStorage.getItem(TOKEN_KEY);
      }
    }
  } catch (e) {
    console.error('Failed to load token', e);
    return null;
  }
};

export const deleteToken = async () => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } else {
      const isAvailable = await SecureStore.isAvailableAsync();
      if (isAvailable) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } else {
        await AsyncStorage.removeItem(TOKEN_KEY);
      }
    }
  } catch (e) {
    console.error('Failed to delete token', e);
  }
};
