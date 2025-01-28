import { config } from '../config/config'

export const fetchData = async (endpoint: string) => {
  const response = await fetch(`${config.apiUrl}/${endpoint}`)
  return response.json()
} 