const axios = require('axios');

// Budibase API configuration
const budibaseApiUrl = 'https://budibase.skoop.digital';
const budibaseApiKey = '69b1bc10c2d32ee607e44e4a30f7f5ea-b9dd09ff6c773a4628f737a0ab45f9e0304e6a8c85181a90f8ff74cc29c946528f373cc83f24ae20';
const budibaseAppId = 'app_3ea495f0892c4311badfd934783afd94';

/**
 * AWS Lambda function that routes API requests to the appropriate handlers
 */
exports.handler = async (event) => {
  // Log the event for debugging
  console.log(`EVENT: ${JSON.stringify(event)}`);
  
  // Define CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,x-requested-with',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json'
  };
  
  try {
    // Handle OPTIONS requests (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'CORS preflight successful' })
      };
    }
    
    // Safely check if path exists in the event
    // Get path from different possible locations in the event object
    let path = '';
    if (event.path) {
      path = event.path;
    } else if (event.resource) {
      path = event.resource;
    } else if (event.requestContext && event.requestContext.path) {
      path = event.requestContext.path;
    } else if (typeof event === 'object' && event !== null) {
      // If no obvious path property, try to extract from raw event
      const eventString = JSON.stringify(event);
      const pathMatch = eventString.match(/"path":"([^"]+)"/);
      if (pathMatch && pathMatch[1]) {
        path = pathMatch[1];
      }
    }
    
    console.log(`Resolved path: ${path}`);
    
    // Handle healthcheck endpoint
    if (path.includes('/api/healthcheck') || path.includes('/healthcheck')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
      };
    }

    // API endpoint for schools
    if (path.includes('/api/schools') || path.includes('/schools')) {
      return await handleBudibaseRequest(
        `${budibaseApiUrl}/api/public/v1/tables/ta_44d3fc5be5e84c9b8e87d4ea7d79bad2/rows`,
        headers
      );
    }

    // API endpoint for teams
    if (path.includes('/api/teams') || path.includes('/teams')) {
      return await handleBudibaseRequest(
        `${budibaseApiUrl}/api/public/v1/tables/ta_5c0c9dfe0a8640408db9c5e0e0b2c3c4/rows`,
        headers
      );
    }

    // API endpoint for individuals
    if (path.includes('/api/individuals') || path.includes('/individuals')) {
      return await handleBudibaseRequest(
        `${budibaseApiUrl}/api/public/v1/tables/ta_b09aa2ee7d844a85a93c9b3df795af2e/rows`,
        headers
      );
    }
    
    // Support for combined axios endpoint
    if (path.includes('/api/axios') || path.includes('/axios')) {
      // Check if there's a type query parameter
      const queryParams = event.queryStringParameters || {};
      const type = queryParams.type || 'schools';
      
      let budibaseEndpoint = '';
      switch (type) {
        case 'teams':
          budibaseEndpoint = `${budibaseApiUrl}/api/public/v1/tables/ta_5c0c9dfe0a8640408db9c5e0e0b2c3c4/rows`;
          break;
        case 'individuals':
          budibaseEndpoint = `${budibaseApiUrl}/api/public/v1/tables/ta_b09aa2ee7d844a85a93c9b3df795af2e/rows`;
          break;
        default: // schools
          budibaseEndpoint = `${budibaseApiUrl}/api/public/v1/tables/ta_44d3fc5be5e84c9b8e87d4ea7d79bad2/rows`;
      }
      
      return await handleBudibaseRequest(budibaseEndpoint, headers);
    }

    // Return 404 for unknown paths
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ 
        error: 'Not Found', 
        message: `Path ${path} not found`,
        timestamp: new Date().toISOString()
      }),
    };
  } catch (error) {
    console.error('Error in API handler:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal Server Error', 
        message: error.message || 'An unknown error occurred',
        timestamp: new Date().toISOString()
      }),
    };
  }
};

/**
 * Helper function to handle requests to Budibase API
 * @param {string} url - The Budibase API URL
 * @param {object} headers - Response headers to include
 * @returns {Promise<Object>} - The API Gateway response object
 */
async function handleBudibaseRequest(url, headers) {
  try {
    console.log(`Making request to Budibase API: ${url}`);
    
    // Set up the request with proper headers
    const response = await axios.get(url, {
      headers: {
        'x-budibase-api-key': budibaseApiKey,
        'x-budibase-app-id': budibaseAppId,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log(`Budibase API response status: ${response.status}`);
    
    // Format the response data
    let responseData = { data: [] };
    
    if (response.data) {
      if (Array.isArray(response.data)) {
        responseData.data = response.data;
      } else if (response.data.data) {
        responseData.data = response.data.data;
      } else {
        responseData.data = [response.data];
      }
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error('Error in Budibase request:', error);
    
    // Return appropriate error response
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data || error.message || 'Unknown error';
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        error: statusCode === 404 ? 'Not Found' : 'Internal Server Error',
        message: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
        data: [] // Ensure data field exists even in error response
      }),
    };
  }
} 