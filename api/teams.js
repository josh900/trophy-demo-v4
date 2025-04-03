// api/teams.js
const https = require('https');

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

    // Assemble request options for Budibase
    const postData = JSON.stringify({});
    
    const options = {
      hostname: 'budibase.skoop.digital',
      path: '/api/public/v1/queries/query_datasource_plus_56025c99333e46b8a073e70585159c4c_a47c1c9912c34d15b67e49ec62908fa0',
      method: 'POST',
      headers: {
        'x-budibase-app-id': 'app_3ea495f0892c4311badfd934783afd94',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'x-budibase-api-key': '69b1bc10c2d32ee607e44e4a30f7f5ea-b9dd09ff6c773a4628f737a0ab45f9e0304e6a8c85181a90f8ff74cc29c946528f373cc83f24ae20'
      }
    };

    // Create promise for HTTP request
    const getTeamsData = () => {
      return new Promise((resolve, reject) => {
        const budibaseReq = https.request(options, (budibaseRes) => {
          let responseData = '';

          budibaseRes.on('data', (chunk) => {
            responseData += chunk;
          });

          budibaseRes.on('end', () => {
            // Check if the status code indicates an error
            if (budibaseRes.statusCode >= 400) {
              reject(new Error(`Budibase server responded with status code: ${budibaseRes.statusCode}`));
              return;
            }

            try {
              // Check for empty response
              if (!responseData || responseData.trim() === '') {
                reject(new Error('Empty response received from Budibase'));
                return;
              }

              const parsedData = JSON.parse(responseData);
              
              // Check for expected data structure
              if (!Array.isArray(parsedData) || parsedData.length === 0) {
                reject(new Error('Invalid data structure received from Budibase'));
                return;
              }

              resolve(parsedData[0]);
            } catch (error) {
              reject(new Error(`Failed to parse Budibase response: ${error.message}`));
            }
          });
        });

        budibaseReq.on('error', (error) => {
          reject(new Error(`Request to Budibase failed: ${error.message}`));
        });

        // Write data to request body and end the request
        budibaseReq.write(postData);
        budibaseReq.end();
      });
    };

    // Execute the promise
    try {
      const teamsData = await getTeamsData();
      
      // Ensure the data field exists, even if empty
      if (!teamsData.data) {
        teamsData.data = [];
      }
      
      res.status(200).json(teamsData);
    } catch (error) {
      console.error('API Error:', error.message);
      res.status(500).json({ 
        error: `Failed to fetch teams data: ${error.message}`,
        data: [] // Ensure data field exists even in error response
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ 
      error: `An unexpected error occurred: ${error.message}`,
      data: [] // Ensure data field exists even in error response
    });
  }
};