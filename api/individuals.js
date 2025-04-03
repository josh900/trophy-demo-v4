// api/individuals.js
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
      path: '/api/public/v1/queries/query_datasource_plus_56025c99333e46b8a073e70585159c4c_f62962e3b6ff47e690977d49cd6d6165',
      method: 'POST',
      headers: {
        'x-budibase-app-id': 'app_3ea495f0892c4311badfd934783afd94',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'x-budibase-api-key': '69b1bc10c2d32ee607e44e4a30f7f5ea-b9dd09ff6c773a4628f737a0ab45f9e0304e6a8c85181a90f8ff74cc29c946528f373cc83f24ae20'
      }
    };

    // Function to handle HTTP request
    const getIndividualsData = () => {
      return new Promise((resolve, reject) => {
        const budibaseReq = https.request(options, (budibaseRes) => {
          let responseData = '';

          budibaseRes.on('data', (chunk) => {
            responseData += chunk;
          });

          budibaseRes.on('end', () => {
            // Log the raw response for debugging
            console.log('Raw Budibase Response:', responseData);
            
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

              // Parse the JSON response
              const parsedData = JSON.parse(responseData);
              console.log('Parsed Budibase Response:', JSON.stringify(parsedData));
              
              // More flexible structure handling
              let formattedData = {
                data: []
              };
              
              // Try to extract data based on different possible structures
              if (Array.isArray(parsedData)) {
                // Case 1: Array of objects at top level
                if (parsedData.length > 0) {
                  if (parsedData[0].data) {
                    // Case 1.1: First element has data property
                    formattedData.data = parsedData[0].data;
                  } else {
                    // Case 1.2: Array itself is the data
                    formattedData.data = parsedData;
                  }
                }
              } else if (parsedData && typeof parsedData === 'object') {
                // Case 2: Object at top level
                if (parsedData.data) {
                  // Case 2.1: Has data property
                  formattedData.data = parsedData.data;
                } else {
                  // Case 2.2: Object itself contains the data
                  formattedData.data = [parsedData];
                }
              }
              
              resolve(formattedData);
            } catch (error) {
              console.error('Parse error:', error);
              reject(new Error(`Failed to parse Budibase response: ${error.message}`));
            }
          });
        });

        budibaseReq.on('error', (error) => {
          console.error('Request error:', error);
          reject(new Error(`Request to Budibase failed: ${error.message}`));
        });

        // Write data to request body and end the request
        budibaseReq.write(postData);
        budibaseReq.end();
      });
    };

    // Execute the promise
    try {
      const individualsData = await getIndividualsData();
      
      // Log the final data structure we're sending back
      console.log('Final individuals data structure:', JSON.stringify(individualsData));
      
      res.status(200).json(individualsData);
    } catch (error) {
      console.error('API Error:', error.message);
      res.status(500).json({ 
        error: `Failed to fetch individuals data: ${error.message}`,
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