export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  
  // Add other configuration values here
  // You can also add computed values based on env variables
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
}

// Freeze the config object to prevent modifications
Object.freeze(config) 