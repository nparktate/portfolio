import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Define the path to the JSON storage file
    const storagePath = path.resolve('./clicks.json');
    
    // Check if the file exists
    if (!fs.existsSync(storagePath)) {
      // If file doesn't exist, create it with initial count
      fs.writeFileSync(storagePath, JSON.stringify({ clicks: 0 }));
      return new Response(
        JSON.stringify({ clicks: 0 }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Read the current click count from file
    const data = fs.readFileSync(storagePath, 'utf8');
    const clickData = JSON.parse(data);
    
    return new Response(
      JSON.stringify({ clicks: clickData.clicks }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  } catch (error) {
    console.error('Error reading click data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve click count', details: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}