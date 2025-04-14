const axios = require('axios');

// Budibase API configuration
const budibaseApiUrl = 'https://budibase.skoop.digital';
const budibaseApiKey = '69b1bc10c2d32ee607e44e4a30f7f5ea-b9dd09ff6c773a4628f737a0ab45f9e0304e6a8c85181a90f8ff74cc29c946528f373cc83f24ae20';
const budibaseAppId = 'app_3ea495f0892c4311badfd934783afd94';

/**
 * AWS Lambda function that routes API requests to the appropriate handlers
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  
  try {
    // Safely check if path exists in the event
    const path = event?.path || '';
    
    if (path.includes('/api/healthcheck')) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: 'ok' }),
      };
    }

    if (path.includes('/api/schools')) {
      return await handleAxiosRequest(
        `${budibaseApiUrl}/api/public/v1/tables/ta_44d3fc5be5e84c9b8e87d4ea7d79bad2/rows`
      );
    }

    if (path.includes('/api/teams')) {
      return await handleAxiosRequest(
        `${budibaseApiUrl}/api/public/v1/tables/ta_5c0c9dfe0a8640408db9c5e0e0b2c3c4/rows`
      );
    }

    if (path.includes('/api/individuals')) {
      return await handleAxiosRequest(
        `${budibaseApiUrl}/api/public/v1/tables/ta_b09aa2ee7d844a85a93c9b3df795af2e/rows`
      );
    }

    // Return 404 for unknown paths
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: 'Not Found', message: `Path ${path} not found` }),
    };
  } catch (error) {
    console.error('Error in API handler:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        error: 'Internal Server Error', 
        message: error.message || 'An unknown error occurred' 
      }),
    };
  }
};

/**
 * Helper function to handle Axios requests to Budibase API
 * @param {string} url - The Budibase API URL
 * @returns {Promise<Object>} - The API Gateway response object
 */
async function handleAxiosRequest(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'x-budibase-api-key': budibaseApiKey,
        'x-budibase-app-id': budibaseAppId,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error('Error in Axios request:', error);
    
    // Return appropriate error response
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data || error.message || 'Unknown error';
    
    return {
      statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        error: statusCode === 404 ? 'Not Found' : 'Internal Server Error',
        message: errorMessage
      }),
    };
  }
}

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