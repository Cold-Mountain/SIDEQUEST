# Google Sheets Data Formatting Guide

## Current Quest Blocks - Improved Formatting

Replace your current Quest Blocks data with this properly formatted version:

### Row 2 (Chimichanga Quest)
```
BLK_001 | physical | eat a chimichanga | 45 | easy | YES | car_optional | all_weather | general | $ | indoor | solo | none | business_hours | low | medium | Find authentic Mexican restaurant
```

### Row 3 (Sand Burial Quest)  
```
BLK_002 | physical | bury yourself in sand | 60 | medium | YES | car_required | daylight_only | general,journey | 0 | outdoor | optional_social | none | daylight | moderate | high | Requires beach or sandbox location
```

### Row 4 (Stargazing Quest)
```
BLK_003 | physical | stargaze for 30 minutes | 120 | hard | YES | car_optional | clear_skies | romantic,journey | 0 | outdoor | optional_social | none | night_only | low | high | Need clear weather and dark location
```

### Row 5 (Card Shuffling Quest)
```
BLK_004 | physical | shuffle a deck of cards 100 times perfectly | 15 | easy | NO | no_car_needed | all_weather | general | $ | both | solo | deck_of_cards | anytime | low | low | Must maintain perfect shuffle technique
```

## Additional Quest Block Examples

### Row 6 (Creative Quest)
```
BLK_005 | create | write a haiku about the first stranger you see | 20 | medium | YES | no_car_needed | all_weather | general,virtuous | 0 | both | solo | smartphone | daylight | low | medium | Practice mindful observation
```

### Row 7 (Obtain Quest)
```
BLK_006 | obtain | find the weirdest item at a thrift store under $5 | 90 | medium | YES | car_optional | all_weather | general,journey | $ | indoor | solo | smartphone | business_hours | low | high | Document with photo
```

### Row 8 (Learn Quest)
```
BLK_007 | learn | teach yourself to tie a new knot using online videos | 30 | easy | NO | no_car_needed | all_weather | general | 0 | both | solo | smartphone,rope | anytime | low | medium | Master at least 3 attempts
```

### Row 9 (Perform Quest)
```
BLK_008 | perform | sing happy birthday to a stranger | 5 | hard | YES | no_car_needed | all_weather | virtuous,social | 0 | both | requires_others | none | anytime | low | high | Spread unexpected joy
```

### Row 10 (Location Quest)
```
BLK_009 | location | find the highest publicly accessible point in your city | 180 | medium | YES | car_optional | daylight_only | journey,adventure | 0 | outdoor | solo | smartphone | daylight | moderate | high | Research beforehand for safety
```

### Row 11 (Costume Quest)
```
BLK_010 | costume | wear formal attire to a casual place | 120 | medium | YES | car_optional | all_weather | playbook,social | 0 | both | solo | formal_wear | anytime | low | medium | Confidence building exercise
```

## Location Seeds Examples

Add these to your "Location Seeds" sheet:

### Row 2
```
LOC_001 | rooftop | parking garage tops, building observation decks, rooftop bars | high | varies | romantic,journey
```

### Row 3  
```
LOC_002 | park | city parks, botanical gardens, nature preserves, playgrounds | medium | always_open | general,virtuous
```

### Row 4
```
LOC_003 | museum | art museums, science centers, historical sites, galleries | low | business_hours | learning,journey
```

### Row 5
```
LOC_004 | beach | ocean beaches, lake shores, riverside areas, sand dunes | high | always_open | romantic,adventure
```

### Row 6
```
LOC_005 | market | farmers markets, flea markets, food halls, bazaars | medium | business_hours | general,virtuous
```

## Copy-Paste Instructions

1. **Quest Blocks Sheet**: Select rows 2-11, paste the formatted data above
2. **Location Seeds Sheet**: Select rows 2-6, paste the location data above  
3. **Verify Headers**: Make sure column headers match exactly
4. **Save**: The app will auto-refresh within 5 minutes

## Field Explanations

- **Block_ID**: Unique identifier (BLK_001, BLK_002, etc.)
- **Time_Required**: Realistic minutes needed
- **Location_Dependent**: YES if requires specific location, NO if can do anywhere
- **Transportation_Required**: car_required/car_optional/no_car_needed
- **Theme_Tags**: Comma-separated themes that match quest generation
- **Cost_Estimate**: 0 (free), $ (under $10), $$ ($10-50), $$$ (over $50)
- **Equipment_Needed**: Specific items required, "none" if nothing needed
- **Special_Notes**: Important safety info or additional context

This will give you a much richer database for quest generation!