// api/axios.js - Using axios instead of node's https
const axios = require('axios');

module.exports = async (req, res) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Determine which endpoint to call based on query param
    const endpoint = req.query.type || 'schools';
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

    try {
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
      
      // Log the response for debugging
      console.log(`Axios ${endpoint} response:`, response.status, response.statusText);
      
      // Process the response data
      let formattedData = { data: [] };
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          if (response.data.length > 0 && response.data[0].data) {
            formattedData.data = response.data[0].data;
          } else {
            formattedData.data = response.data;
          }
        } else if (typeof response.data === 'object') {
          if (response.data.data) {
            formattedData.data = response.data.data;
          } else {
            formattedData.data = [response.data];
          }
        }
      }
      
      res.status(200).json({
        success: true,
        endpoint,
        data: formattedData.data,
        rawResponse: response.data // Include raw response for debugging
      });
      
    } catch (axiosError) {
      console.error(`Axios error for ${endpoint}:`, axiosError.message);
      
      // Try to get response details if available
      let responseDetails = {};
      if (axiosError.response) {
        responseDetails = {
          status: axiosError.response.status,
          statusText: axiosError.response.statusText,
          headers: axiosError.response.headers,
          data: axiosError.response.data
        };
      }
      
      res.status(500).json({
        error: `Axios request failed: ${axiosError.message}`,
        endpoint,
        details: responseDetails
      });
    }
  } catch (error) {
    console.error('Unexpected error in axios API:', error);
    res.status(500).json({ 
      error: `An unexpected error occurred: ${error.message}`
    });
  }
};