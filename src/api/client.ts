delete: async <T>(url: string): Promise<T | void> => {
  const response = await fetch(`${BASE_URL}/${url}`, {
    method: 'DELETE',
    headers: {
      // ... your headers
    }
  });

  // For 204 No Content, return void
  if (response.status === 204) {
    return;
  }

  // For other successful responses, try to parse JSON
  if (response.ok) {
    return response.json();
  }

  // Handle errors
  throw new Error(`HTTP error! status: ${response.status}`);
} 