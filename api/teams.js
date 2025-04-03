// api/teams.js
export default async function handler(req, res) {
    // Set CORS headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    // Configuration for the Budibase API request
    const apiUrl = 'https://budibase.skoop.digital/api/public/v1/queries/query_datasource_plus_56025c99333e46b8a073e70585159c4c_a47c1c9912c34d15b67e49ec62908fa0';
    const headers = {
      'x-budibase-app-id': 'app_3ea495f0892c4311badfd934783afd94',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-budibase-api-key': '69b1bc10c2d32ee607e44e4a30f7f5ea-b9dd09ff6c773a4628f737a0ab45f9e0304e6a8c85181a90f8ff74cc29c946528f373cc83f24ae20'
    };
  
    try {
      // Make the request to the Budibase API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({}),
      });
  
      // Get the response data
      const data = await response.json();
  
      // Return the data
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching teams data:', error);
      res.status(500).json({ error: 'Failed to fetch teams data' });
    }
  }