// Script to create the Google Sheets database
const { google } = require('googleapis');

const API_KEY = 'AIzaSyBDEtZUCRa7J5YfWl-uGyVpAPTTD--7FLQ';

// Initialize Google Sheets API
const sheets = google.sheets({
  version: 'v4',
  auth: API_KEY,
});

// Create the spreadsheet structure
async function createSidequestDatabase() {
  try {
    console.log('Creating Sidequest Database...');
    
    // Note: Creating sheets requires OAuth2, not just API key
    // For now, we'll provide manual instructions
    
    const spreadsheetStructure = {
      properties: {
        title: 'Sidequest Database'
      },
      sheets: [
        {
          properties: {
            title: 'Quest Blocks',
            gridProperties: {
              rowCount: 1000,
              columnCount: 17
            }
          }
        },
        {
          properties: {
            title: 'Location Seeds',
            gridProperties: {
              rowCount: 1000,
              columnCount: 6
            }
          }
        },
        {
          properties: {
            title: 'User Submissions',
            gridProperties: {
              rowCount: 1000,
              columnCount: 7
            }
          }
        }
      ]
    };

    console.log('Database structure defined:');
    console.log(JSON.stringify(spreadsheetStructure, null, 2));
    
    // Manual creation instructions
    console.log('\n=== MANUAL SETUP REQUIRED ===');
    console.log('1. Go to https://sheets.google.com');
    console.log('2. Create a new spreadsheet');
    console.log('3. Rename it to "Sidequest Database"');
    console.log('4. Set up the following sheets with headers:');
    
    console.log('\nSheet 1: Quest Blocks');
    console.log('Headers (A1:Q1):');
    const questBlockHeaders = [
      'Block_ID', 'Block_Type', 'Idea', 'Time_Required', 'Difficulty_Tag',
      'Location_Dependent', 'Transportation_Required', 'Weather_Modifier',
      'Theme_Tags', 'Cost_Estimate', 'Indoor_Outdoor', 'Social_Level',
      'Equipment_Needed', 'Time_of_Day', 'Physical_Intensity',
      'Combination_Priority', 'Special_Notes'
    ];
    console.log(questBlockHeaders.join('\t'));
    
    console.log('\nSheet 2: Location Seeds');
    console.log('Headers (A1:F1):');
    const locationHeaders = [
      'Location_ID', 'Location_Type', 'Specific_Examples',
      'Weather_Sensitivity', 'Public_Access', 'Theme_Compatibility'
    ];
    console.log(locationHeaders.join('\t'));
    
    console.log('\nSheet 3: User Submissions');
    console.log('Headers (A1:G1):');
    const submissionHeaders = [
      'Submission_Date', 'User_Email', 'Block_Type',
      'Action_Idea', 'Why_Meaningful', 'Status', 'Admin_Notes'
    ];
    console.log(submissionHeaders.join('\t'));
    
    console.log('\n5. Share the sheet with public read access or specific permissions');
    console.log('6. Copy the spreadsheet ID from the URL and update .env.local');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
createSidequestDatabase();