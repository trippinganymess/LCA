// Utility function to generate a unique 8-letter uppercase group key
export const generateGroupKey = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Check if key already exists in localStorage
  const existingGroups = JSON.parse(localStorage.getItem('lca_groups') || '[]');
  const keyExists = existingGroups.some((group: any) => group.key === result);
  
  // If key exists, generate a new one recursively
  if (keyExists) {
    return generateGroupKey();
  }
  
  return result;
};

// Validate group key format (8 uppercase letters)
export const isValidGroupKey = (key: string): boolean => {
  return /^[A-Z]{8}$/.test(key);
};

// Get all groups from localStorage
export const getAllGroups = () => {
  return JSON.parse(localStorage.getItem('lca_groups') || '[]');
};

// Save groups to localStorage
export const saveGroups = (groups: any[]) => {
  localStorage.setItem('lca_groups', JSON.stringify(groups));
};