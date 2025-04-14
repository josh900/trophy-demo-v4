const axios = require('axios');

/**
 * AWS Lambda function that routes API requests to the appropriate handlers
 */
exports.handler = async (event) => {
  try {
    // Set standard CORS headers for all responses
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Requested-With',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'CORS preflight response' }),
      };
    }
    
    // Add a healthcheck endpoint
    if (event.path.includes('/api/healthcheck')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          status: 'ok',
          timestamp: new Date().toISOString(),
          message: 'API is working correctly',
          event: event
        }),
      };
    }

    // Parse the path to determine which endpoint to call
    const path = event.path;
    let endpoint = 'schools'; // default endpoint

    if (path.includes('/api/teams')) {
      endpoint = 'teams';
    } else if (path.includes('/api/individuals')) {
      endpoint = 'individuals';
    } else if (path.includes('/api/axios')) {
      // For the axios endpoint, use the query parameter
      const queryParams = event.queryStringParameters || {};
      endpoint = queryParams.type || 'schools';
      return await handleAxiosRequest(endpoint, headers);
    }

    // Handle the request based on endpoint
    switch (endpoint) {
      case 'teams':
        return await handleTeamsRequest(headers);
      case 'individuals':
        return await handleIndividualsRequest(headers);
      default: // schools
        return await handleSchoolsRequest(headers);
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: `An unexpected error occurred: ${error.message}`,
        data: [] // Ensure data field exists even in error response
      }),
    };
  }
};

/**
 * Handle request to the schools endpoint
 */
async function handleSchoolsRequest(headers) {
  try {
    // Budibase API options
    const options = {
      method: 'post',
      url: 'https://budibase.skoop.digital/api/public/v1/queries/query_datasource_plus_56025c99333e46b8a073e70585159c4c_4a3b9f6c024c4381afcf9f4e83f85f7d',
      headers: {
        'x-budibase-app-id': 'app_3ea495f0892c4311badfd934783afd94',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-budibase-api-key': '69b1bc10c2d32ee607e44e4a30f7f5ea-b9dd09ff6c773a4628f737a0ab45f9e0304e6a8c85181a90f8ff74cc29c946528f373cc83f24ae20'
      },
      data: {}
    };

    const response = await axios(options);
    const formattedData = formatResponseData(response.data);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(formattedData),
    };
  } catch (error) {
    console.error('Error in schools request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: `Failed to fetch schools data: ${error.message}`,
        data: [] // Ensure data field exists even in error response
      }),
    };
  }
}

/**
 * Handle request to the teams endpoint
 */
async function handleTeamsRequest(headers) {
  try {
    // Budibase API options
    const options = {
      method: 'post',
      url: 'https://budibase.skoop.digital/api/public/v1/queries/query_datasource_plus_56025c99333e46b8a073e70585159c4c_a47c1c9912c34d15b67e49ec62908fa0',
      headers: {
        'x-budibase-app-id': 'app_3ea495f0892c4311badfd934783afd94',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-budibase-api-key': '69b1bc10c2d32ee607e44e4a30f7f5ea-b9dd09ff6c773a4628f737a0ab45f9e0304e6a8c85181a90f8ff74cc29c946528f373cc83f24ae20'
      },
      data: {}
    };

    const response = await axios(options);
    const formattedData = formatResponseData(response.data);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(formattedData),
    };
  } catch (error) {
    console.error('Error in teams request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: `Failed to fetch teams data: ${error.message}`,
        data: [] // Ensure data field exists even in error response
      }),
    };
  }
}

/**
 * Handle request to the individuals endpoint
 */
async function handleIndividualsRequest(headers) {
  try {
    // Budibase API options
    const options = {
      method: 'post',
      url: 'https://budibase.skoop.digital/api/public/v1/queries/query_datasource_plus_56025c99333e46b8a073e70585159c4c_f62962e3b6ff47e690977d49cd6d6165',
      headers: {
        'x-budibase-app-id': 'app_3ea495f0892c4311badfd934783afd94',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-budibase-api-key': '69b1bc10c2d32ee607e44e4a30f7f5ea-b9dd09ff6c773a4628f737a0ab45f9e0304e6a8c85181a90f8ff74cc29c946528f373cc83f24ae20'
      },
      data: {}
    };

    const response = await axios(options);
    const formattedData = formatResponseData(response.data);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(formattedData),
    };
  } catch (error) {
    console.error('Error in individuals request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: `Failed to fetch individuals data: ${error.message}`,
        data: [] // Ensure data field exists even in error response
      }),
    };
  }
}

/**
 * Handle request to the axios combined endpoint
 */
async function handleAxiosRequest(endpoint, headers) {
  try {
    let path;
    
    switch(endpoint) {
      case 'teams':
        path = '/api/public/v1/queries/query_datasource_plus_56025c99333e46b8a073e70585159c4c_a47c1c9912c34d15b67e49ec62908fa0';
        break;
      case 'individuals':
        path = '/api/public/v1/queries/query_datasource_plus_56025c99333e46b8a073e70585159c4c_f62962e3b6ff47e690977d49cd6d6165';
        break;
      default: // schools
        path = '/api/public/v1/queries/query_datasource_plus_56025c99333e46b8a073e70585159c4c_4a3b9f6c024c4381afcf9f4e83f85f7d';
    }

    // Make the request with axios
    const response = await axios({
      method: 'post',
      url: `https://budibase.skoop.digital${path}`,
      headers: {
        'x-budibase-app-id': 'app_3ea495f0892c4311badfd934783afd94',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-budibase-api-key': '69b1bc10c2d32ee607e44e4a30f7f5ea-b9dd09ff6c773a4628f737a0ab45f9e0304e6a8c85181a90f8ff74cc29c946528f373cc83f24ae20'
      },
      data: {}
    });
    
    // Process the response data
    const formattedData = formatResponseData(response.data);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        endpoint,
        data: formattedData.data,
        rawResponse: response.data // Include raw response for debugging
      }),
    };
  } catch (error) {
    console.error(`Axios error for ${endpoint}:`, error.message);
    
    // Try to get response details if available
    let responseDetails = {};
    if (error.response) {
      responseDetails = {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: `Axios request failed: ${error.message}`,
        endpoint,
        details: responseDetails
      }),
    };
  }
}

/**
 * Format the response data into a consistent structure
 */
function formatResponseData(responseData) {
  // More flexible structure handling
  let formattedData = {
    data: []
  };
  
  // Try to extract data based on different possible structures
  if (Array.isArray(responseData)) {
    // Case 1: Array of objects at top level
    if (responseData.length > 0) {
      if (responseData[0].data) {
        // Case 1.1: First element has data property
        formattedData.data = responseData[0].data;
      } else {
        // Case 1.2: Array itself is the data
        formattedData.data = responseData;
      }
    }
  } else if (responseData && typeof responseData === 'object') {
    // Case 2: Object at top level
    if (responseData.data) {
      // Case 2.1: Has data property
      formattedData.data = responseData.data;
    } else {
      // Case 2.2: Object itself contains the data
      formattedData.data = [responseData];
    }
  }
  
  return formattedData;
} 