// Google Sheets Setup Instructions and Template
// This file contains the exact structure needed for the Google Sheets database

export const SHEET_STRUCTURE = {
  'Quest Blocks': {
    headers: [
      'Block_ID',           // A - Unique identifier (e.g., BLK_001)
      'Block_Type',         // B - [physical], [obtain], [create], [location], [learn], [perform], [costume]
      'Idea',               // C - The idea for the seed/block
      'Time_Required',      // D - Minutes needed to complete
      'Difficulty_Tag',     // E - easy, medium, hard
      'Location_Dependent', // F - YES/NO
      'Transportation_Required', // G - car_required, car_optional, no_car_needed
      'Weather_Modifier',   // H - all_weather, no_rain, daylight_only, clear_skies
      'Theme_Tags',         // I - romantic, life_changing, journey, virtuous, general
      'Cost_Estimate',      // J - 0, $, $$, $$$
      'Indoor_Outdoor',     // K - indoor, outdoor, both
      'Social_Level',       // L - solo, optional_social, requires_others
      'Equipment_Needed',   // M - none, smartphone, formal_wear, etc.
      'Time_of_Day',        // N - anytime, business_hours, daylight, night_only
      'Physical_Intensity', // O - low, moderate, high
      'Combination_Priority', // P - high, medium, low
      'Special_Notes'       // Q - Additional constraints
    ],
    sampleData: [
      [
        'BLK_001',
        'physical',
        'Do a cartwheel in a public space',
        '15',
        'easy',
        'NO',
        'no_car_needed',
        'daylight_only',
        'general',
        '0',
        'outdoor',
        'solo',
        'none',
        'daylight',
        'moderate',
        'medium',
        'Find safe, flat surface'
      ],
      [
        'BLK_002',
        'obtain',
        'Buy the strangest ice cream flavor available',
        '30',
        'easy',
        'YES',
        'car_optional',
        'all_weather',
        'general',
        '$',
        'indoor',
        'solo',
        'smartphone',
        'business_hours',
        'low',
        'high',
        'Must be an unusual or exotic flavor'
      ]
    ]
  },
  
  'Location Seeds': {
    headers: [
      'Location_ID',        // A - Unique identifier
      'Location_Type',      // B - parking_garage, park, museum, rooftop
      'Specific_Examples',  // C - Real places to pull from APIs
      'Weather_Sensitivity', // D - high, medium, low
      'Public_Access',      // E - always_open, business_hours, varies
      'Theme_Compatibility' // F - romantic, journey, life_changing, general
    ],
    sampleData: [
      [
        'LOC_001',
        'rooftop',
        'Parking garage tops, building rooftops, observation decks',
        'high',
        'varies',
        'romantic,journey'
      ],
      [
        'LOC_002',
        'park',
        'City parks, botanical gardens, nature preserves',
        'medium',
        'always_open',
        'general,virtuous'
      ]
    ]
  },

  'User Submissions': {
    headers: [
      'Submission_Date',    // A - When submitted
      'User_Email',         // B - Contact (optional)
      'Block_Type',         // C - Suggested category
      'Action_Idea',        // D - Their suggestion
      'Why_Meaningful',     // E - Their reasoning
      'Status',             // F - pending, approved, rejected
      'Admin_Notes'         // G - Review comments
    ],
    sampleData: [
      [
        '2024-07-18T20:00:00Z',
        'user@example.com',
        'creative',
        'Write a haiku about the first stranger you see',
        'Encourages mindful observation and creative expression',
        'pending',
        ''
      ]
    ]
  }
};

// Instructions for manual setup
export const SETUP_INSTRUCTIONS = `
To set up the Google Sheets database:

1. Create a new Google Sheet
2. Rename the default sheet to "Quest Blocks"
3. Add the headers in row 1 (A1:Q1)
4. Add sample data starting from row 2
5. Create additional sheets: "Location Seeds", "User Submissions"
6. Set up proper column headers for each sheet
7. Make the sheet publicly readable or share with the service account

Sheet sharing settings:
- Share with: Anyone with the link
- Access: Viewer
- Or create a service account and share specifically

The spreadsheet ID will be extracted from the URL:
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
`;

// Environment variable setup
export const ENV_SETUP = `
Add to your .env.local file:
NEXT_PUBLIC_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_API_KEY=AIzaSyBDEtZUCRa7J5YfWl-uGyVpAPTTD--7FLQ
`;