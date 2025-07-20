// Test script to verify database connection
const fetch = require('node-fetch');

async function testDatabaseConnection() {
  const baseUrl = 'http://localhost:3000/api/database';
  
  console.log('Testing Sidequest Database Connection...\n');
  
  try {
    // Test quest blocks endpoint
    console.log('1. Testing Quest Blocks endpoint...');
    const questBlocksResponse = await fetch(`${baseUrl}/quest-blocks`);
    const questBlocksResult = await questBlocksResponse.json();
    
    console.log('Quest Blocks Response:', questBlocksResult);
    console.log(`✅ Quest Blocks: ${questBlocksResult.success ? 'SUCCESS' : 'FAILED'}`);
    
    // Test location seeds endpoint
    console.log('\n2. Testing Location Seeds endpoint...');
    const locationSeedsResponse = await fetch(`${baseUrl}/location-seeds`);
    const locationSeedsResult = await locationSeedsResponse.json();
    
    console.log('Location Seeds Response:', locationSeedsResult);
    console.log(`✅ Location Seeds: ${locationSeedsResult.success ? 'SUCCESS' : 'FAILED'}`);
    
    // Test cache refresh endpoint
    console.log('\n3. Testing Cache Refresh endpoint...');
    const refreshResponse = await fetch(`${baseUrl}/refresh`, { method: 'POST' });
    const refreshResult = await refreshResponse.json();
    
    console.log('Refresh Response:', refreshResult);
    console.log(`✅ Cache Refresh: ${refreshResult.success ? 'SUCCESS' : 'FAILED'}`);
    
    console.log('\n=== Database Connection Test Complete ===');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure the development server is running (npm run dev)');
    console.log('2. Verify NEXT_PUBLIC_SPREADSHEET_ID is set in .env.local');
    console.log('3. Check that the Google Sheet is publicly accessible');
    console.log('4. Ensure the sheet has the correct structure and headers');
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testDatabaseConnection();
}

module.exports = { testDatabaseConnection };