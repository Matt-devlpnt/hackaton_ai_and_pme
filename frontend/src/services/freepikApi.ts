const API_BASE_URL = 'https://api.freepik.com/v1';

/*
 * ===============================================
 * FREEPIK API CONFIGURATION
 * ===============================================
 * 1. Get your API key from: https://freepik.com/developers
 * 2. Create a .env file in your project root if it doesn't exist
 * 3. Add this line to your .env file:
 *    VITE_FREEPIK_API_KEY=your_api_key_here
 * 4. Replace 'your_api_key_here' with your actual API key
 * 5. Restart your development server
 */
const API_KEY = import.meta.env.VITE_FREEPIK_API_KEY || localStorage.getItem('freepikApiKey') || '';

if (!API_KEY) {
  console.warn(
    'Freepik API key is not set. Please set it in the .env file or in the app settings.'
  );
}

interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  order?: 'latest' | 'views' | 'downloads' | 'random';
  filters?: {
    type?: 'photo' | 'vector' | 'psd' | 'icon' | 'all';
    orientation?: 'horizontal' | 'vertical' | 'all';
    colors?: string[];
  };
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }
  return response.json();
};

export const searchImages = async (params: SearchParams) => {
  try {
    const { query, page = 1, limit = 20, order = 'latest', filters = {} } = params;
    
    // Build query parameters
    const queryParams = new URLSearchParams({
      query,
      page: page.toString(),
      limit: limit.toString(),
      order,
      ...(filters.type && filters.type !== 'all' && { type: filters.type }),
      ...(filters.orientation && filters.orientation !== 'all' && { orientation: filters.orientation }),
      ...(filters.colors && filters.colors.length > 0 && { colors: filters.colors.join(',') }),
    });

    const response = await fetch(`${API_BASE_URL}/resources?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Freepik-API-Key': API_KEY,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error searching Freepik:', error);
    throw error;
  }
};

// Add more API functions as needed (e.g., getImageDetails, getCategories, etc.)

export default {
  searchImages,
};
