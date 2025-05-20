'use client'

export const setTableNumber = (tableNumber: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tableNumber', tableNumber);
  }
};

export const getTableNumber = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('tableNumber');
  }
  return null;
};

export const clearTableNumber = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tableNumber');
  }
}; 