import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
  try {
    // Define the path to the JSON storage file
    const storagePath = path.resolve('./clicks.json');
    
    // Initialize with default value if file doesn't exist
    if (!fs.existsSync(storagePath)) {
      fs.writeFileSync(storagePath, JSON.stringify({ clicks: 0 }));
    }
    
    // Read the current click count
    const data = fs.readFileSync(storagePath, 'utf8');
    const clickData = JSON.parse(data);
    
    // Increment the click count
    clickData.clicks += 1;
    
    // Save the updated count
    fs.writeFileSync(storagePath, JSON.stringify(clickData));
    
    // Return the updated count
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
    console.error('Error updating click data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update click count', details: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}