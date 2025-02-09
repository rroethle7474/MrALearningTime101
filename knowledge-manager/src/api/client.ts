import { config } from '../config/config'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

type RequestOptions = {
  method?: string
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, string>
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }))
    throw new ApiError(response.status, error.message)
  }
  
  // Return undefined for 204 No Content responses
  if (response.status === 204) {
    return undefined
  }
  
  return response.json()
}

async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const { method = 'GET', headers = {}, body, params } = options
  
  // Ensure endpoint doesn't start with a slash and add api prefix
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  const apiPath = `/api/${normalizedEndpoint}`
  
  const url = new URL(`${config.apiUrl}${apiPath}`)
  console.log("URL", url)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url.toString(), requestOptions)
    return handleResponse(response)
  } catch (error) {
    // Handle network errors
    if (error instanceof Error) {
      throw new ApiError(0, `Network error: ${error.message}`)
    }
    throw new ApiError(0, 'Unknown network error occurred')
  }
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>): Promise<T> => {
    return apiRequest(endpoint, { params })
  },
  
  post: <T>(endpoint: string, data?: unknown): Promise<T> => {
    return apiRequest(endpoint, { method: 'POST', body: data })
  },

  put: <T>(endpoint: string, data: unknown): Promise<T> => {
    return apiRequest(endpoint, { method: 'PUT', body: data })
  },

  delete: <T = void>(endpoint: string): Promise<T> => {
    return apiRequest(endpoint, { method: 'DELETE' })
  },
}

// Keep fetchData for backward compatibility
export const fetchData = <T>(endpoint: string): Promise<T> => api.get(endpoint)