// api/test.js - A diagnostic endpoint to test the Budibase connection
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
    
    // Use schools endpoint for testing
    const options = {
      hostname: 'budibase.skoop.digital',
      path: '/api/public/v1/queries/query_datasource_plus_56025c99333e46b8a073e70585159c4c_4a3b9f6c024c4381afcf9f4e83f85f7d',
      method: 'POST',
      headers: {
        'x-budibase-app-id': 'app_3ea495f0892c4311badfd934783afd94',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'x-budibase-api-key': '69b1bc10c2d32ee607e44e4a30f7f5ea-b9dd09ff6c773a4628f737a0ab45f9e0304e6a8c85181a90f8ff74cc29c946528f373cc83f24ae20'
      }
    };

    // Make the request directly
    const budibaseReq = https.request(options, (budibaseRes) => {
      let responseData = '';

      budibaseRes.on('data', (chunk) => {
        responseData += chunk;
      });

      budibaseRes.on('end', () => {
        // Return diagnostic information
        res.status(200).json({
          status: {
            code: budibaseRes.statusCode,
            message: budibaseRes.statusMessage
          },
          headers: budibaseRes.headers,
          rawResponse: responseData,
          parsedResponse: (() => {
            try {
              return JSON.parse(responseData);
            } catch (e) {
              return { parseError: e.message };
            }
          })()
        });
      });
    });

    budibaseReq.on('error', (error) => {
      res.status(500).json({ 
        error: `Request error: ${error.message}`,
        details: error.stack
      });
    });

    budibaseReq.write(postData);
    budibaseReq.end();
    
  } catch (error) {
    res.status(500).json({ 
      error: `Unexpected error: ${error.message}`,
      details: error.stack
    });
  }
};