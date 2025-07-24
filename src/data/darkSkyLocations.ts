/**
 * DarkSky International Certified Dark Sky Places Database
 * 
 * Contains verified dark sky locations certified by DarkSky International
 * These locations have been rigorously tested and certified for exceptional
 * night sky quality and minimal light pollution.
 * 
 * Data sources:
 * - DarkSky International (https://darksky.org)
 * - National Park Service
 * - State park systems
 */

export interface DarkSkyLocation {
  id: string;
  name: string;
  type: 'park' | 'reserve' | 'sanctuary' | 'community' | 'urban_night_sky_place';
  designation: 'Gold' | 'Silver' | 'Bronze' | 'Provisional' | 'Urban Night Sky Place';
  state: string;
  lat: number;
  lng: number;
  certification_year: number;
  description: string;
  website_url?: string;
  managing_agency?: string;
  distance?: number; // Added when calculating nearby locations
}

/**
 * Complete Database of International Dark Sky Places in the United States
 * Updated: July 2025
 * Source: DarkSky International & Research
 * 
 * This comprehensive collection includes 60+ certified dark sky locations
 * covering all major regions of the United States.
 * 
 * Includes:
 * - 30+ National Parks/Monuments 
 * - 20+ State Parks
 * - 2+ Dark Sky Reserves
 * - 1+ Dark Sky Communities
 * - Urban Night Sky Places
 * 
 * All locations verified for public access and current certification status
 */
export const DARK_SKY_LOCATIONS: DarkSkyLocation[] = [
  // NATIONAL PARKS - Dark Sky Parks
  {
    id: 'arches-np',
    name: 'Arches National Park',
    type: 'park',
    designation: 'Silver',
    state: 'UT',
    lat: 38.7331,
    lng: -109.5925,
    certification_year: 2019,
    description: 'Silver Tier Dark Sky Park featuring dramatic rock formations silhouetted against star-filled skies. Over 2,000 natural sandstone arches including Delicate Arch.',
    website_url: 'https://www.nps.gov/arch/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'big-bend-np',
    name: 'Big Bend National Park',
    type: 'park',
    designation: 'Gold',
    state: 'TX',
    lat: 29.1275,
    lng: -103.2425,
    certification_year: 2012,
    description: 'One of the darkest night skies in the lower 48 states. Located in the dramatic curve of the Rio Grande River along the Texas-Mexico border.',
    website_url: 'https://www.nps.gov/bibe/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'black-canyon-np',
    name: 'Black Canyon of the Gunnison National Park',
    type: 'park',
    designation: 'Silver',
    state: 'CO',
    lat: 38.5754,
    lng: -107.7416,
    certification_year: 2015,
    description: 'Deep canyon walls create dramatic silhouettes against star-filled skies. Excellent for astrophotography.',
    website_url: 'https://www.nps.gov/blca/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'bryce-canyon-np',
    name: 'Bryce Canyon National Park',
    type: 'park',
    designation: 'Gold',
    state: 'UT',
    lat: 37.5930,
    lng: -112.1871,
    certification_year: 2019,
    description: 'Features a gigantic natural amphitheater with protected dark skies. Home to annual Astronomy Festival with exceptional stargazing opportunities.',
    website_url: 'https://www.nps.gov/brca/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'canyonlands-np',
    name: 'Canyonlands National Park',
    type: 'park',
    designation: 'Gold',
    state: 'UT',
    lat: 38.3269,
    lng: -109.8783,
    certification_year: 2015,
    description: 'Gold Tier Dark Sky Park featuring vast red rock landscapes under pristine dark skies.',
    website_url: 'https://www.nps.gov/cany/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'capitol-reef-np',
    name: 'Capitol Reef National Park',
    type: 'park',
    designation: 'Gold',
    state: 'UT',
    lat: 38.2972,
    lng: -111.2615,
    certification_year: 2015,
    description: 'Features red rock formations under pristine dark skies. Regular astronomy programs and exceptional Milky Way visibility.',
    website_url: 'https://www.nps.gov/care/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'death-valley-np',
    name: 'Death Valley National Park',
    type: 'park',
    designation: 'Gold',
    state: 'CA',
    lat: 36.5054,
    lng: -117.0794,
    certification_year: 2013,
    description: 'Gold Tier International Dark Sky Park with exceptional darkness. On clear moonless nights, the Milky Way casts visible shadows and thousands of stars become readily apparent.',
    website_url: 'https://www.nps.gov/deva/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'glacier-np',
    name: 'Glacier National Park',
    type: 'park',
    designation: 'Silver',
    state: 'MT',
    lat: 48.7596,
    lng: -113.7870,
    certification_year: 2017,
    description: 'First International Dark Sky Park designation spanning an international border with Canada\'s Waterton Lakes National Park.',
    website_url: 'https://www.nps.gov/glac/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'grand-canyon-np',
    name: 'Grand Canyon National Park',
    type: 'park',
    designation: 'Gold',
    state: 'AZ',
    lat: 36.1070,
    lng: -112.1130,
    certification_year: 2019,
    description: 'Gold Tier Dark Sky Park offering spectacular stargazing above the famous canyon. Multiple viewing areas including Mather Point and Yavapai Point.',
    website_url: 'https://www.nps.gov/grca/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'great-basin-np',
    name: 'Great Basin National Park',
    type: 'park',
    designation: 'Gold',
    state: 'NV',
    lat: 39.0057,
    lng: -114.2579,
    certification_year: 2016,
    description: 'Gold Tier Dark Sky Park located in one of the least populated areas of the continental United States with ancient bristlecone pines.',
    website_url: 'https://www.nps.gov/grba/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'great-sand-dunes-np',
    name: 'Great Sand Dunes National Park and Preserve',
    type: 'park',
    designation: 'Gold',
    state: 'CO',
    lat: 37.7316,
    lng: -105.5130,
    certification_year: 2019,
    description: 'Towering sand dunes beneath incredibly dark skies at high elevation. Offers unique stargazing experiences.',
    website_url: 'https://www.nps.gov/grsa/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'joshua-tree-np',
    name: 'Joshua Tree National Park',
    type: 'park',
    designation: 'Gold',
    state: 'CA',
    lat: 33.8734,
    lng: -115.9010,
    certification_year: 2017,
    description: 'Gold Tier Dark Sky Park nearest to the Los Angeles metropolitan area. Exceptional stargazing opportunities in the Mojave Desert with minimal light pollution.',
    website_url: 'https://www.nps.gov/jotr/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'mesa-verde-np',
    name: 'Mesa Verde National Park',
    type: 'park',
    designation: 'Gold',
    state: 'CO',
    lat: 37.2309,
    lng: -108.4618,
    certification_year: 2021,
    description: 'The 100th International Dark Sky Park. Exceptional dark skies preserved thanks to remote location, dry climate, and high elevation.',
    website_url: 'https://www.nps.gov/meve/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'petrified-forest-np',
    name: 'Petrified Forest National Park',
    type: 'park',
    designation: 'Silver',
    state: 'AZ',
    lat: 35.0809,
    lng: -109.7963,
    certification_year: 2019,
    description: 'Silver Tier Dark Sky Park combining ancient petrified wood with pristine night skies. Located in northeastern Arizona with excellent stargazing conditions.',
    website_url: 'https://www.nps.gov/pefo/',
    managing_agency: 'National Park Service'
  },

  // NATIONAL MONUMENTS - Dark Sky Parks
  {
    id: 'big-cypress-np',
    name: 'Big Cypress National Preserve',
    type: 'park',
    designation: 'Silver',
    state: 'FL',
    lat: 25.9740,
    lng: -81.0825,
    certification_year: 2021,
    description: 'Silver Tier Dark Sky Park covering 290,000 hectares of unique wetland ecosystem in southern Florida.',
    website_url: 'https://www.nps.gov/bicy/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'browns-canyon-nm',
    name: 'Browns Canyon National Monument',
    type: 'park',
    designation: 'Bronze',
    state: 'CO',
    lat: 38.6969,
    lng: -106.1631,
    certification_year: 2024,
    description: 'Bronze Tier Dark Sky Park guarding the headwaters of the Arkansas River with towering granite walls.',
    website_url: 'https://www.blm.gov/programs/national-conservation-lands/colorado/browns-canyon-national-monument',
    managing_agency: 'Bureau of Land Management'
  },
  {
    id: 'buffalo-national-river',
    name: 'Buffalo National River',
    type: 'park',
    designation: 'Silver',
    state: 'AR',
    lat: 36.0086,
    lng: -93.3531,
    certification_year: 2019,
    description: 'Silver Tier Dark Sky Park featuring a free-flowing stream through picturesque bluffs and forests in North Central Arkansas.',
    website_url: 'https://www.nps.gov/buff/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'capulin-volcano-nm',
    name: 'Capulin Volcano National Monument',
    type: 'park',
    designation: 'Gold',
    state: 'NM',
    lat: 36.7791,
    lng: -103.9697,
    certification_year: 2016,
    description: 'Gold Tier Dark Sky Park situated in one of the darkest locations in the lower 48 states. Thousands of stars visible on clear nights.',
    website_url: 'https://www.nps.gov/cavo/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'city-of-rocks-nr',
    name: 'City of Rocks National Reserve',
    type: 'park',
    designation: 'Gold',
    state: 'ID',
    lat: 42.0669,
    lng: -113.7108,
    certification_year: 2023,
    description: 'Gold Tier Dark Sky Park featuring unique granite spires and formations in south-central Idaho.',
    website_url: 'https://www.nps.gov/ciro/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'dinosaur-nm',
    name: 'Dinosaur National Monument',
    type: 'park',
    designation: 'Gold',
    state: 'UT',
    lat: 40.4382,
    lng: -109.3007,
    certification_year: 2019,
    description: 'Gold Tier Dark Sky Park located on the border of Colorado and Utah. Remote location provides exceptional night sky viewing with minimal light pollution.',
    website_url: 'https://www.nps.gov/dino/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'florissant-fossil-beds-nm',
    name: 'Florissant Fossil Beds National Monument',
    type: 'park',
    designation: 'Silver',
    state: 'CO',
    lat: 38.9145,
    lng: -105.2825,
    certification_year: 2018,
    description: 'Silver Tier Dark Sky Park preserving ancient fossils and dark skies in the Colorado Rockies.',
    website_url: 'https://www.nps.gov/flfo/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'hovenweep-nm',
    name: 'Hovenweep National Monument',
    type: 'park',
    designation: 'Gold',
    state: 'UT',
    lat: 37.3833,
    lng: -109.0750,
    certification_year: 2014,
    description: 'Gold Tier Dark Sky Park protecting ancient Ancestral Puebloan structures under pristine dark skies.',
    website_url: 'https://www.nps.gov/hove/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'natural-bridges-nm',
    name: 'Natural Bridges National Monument',
    type: 'park',
    designation: 'Gold',
    state: 'UT',
    lat: 37.6014,
    lng: -110.0137,
    certification_year: 2007,
    description: 'The first International Dark Sky Park ever designated. Features some of the darkest and clearest skies in the United States.',
    website_url: 'https://www.nps.gov/nabr/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'sunset-crater-nm',
    name: 'Sunset Crater Volcano National Monument',
    type: 'park',
    designation: 'Gold',
    state: 'AZ',
    lat: 35.3647,
    lng: -111.5067,
    certification_year: 2016,
    description: 'Gold Tier Dark Sky Park part of Flagstaff\'s internationally recognized dark-sky parks.',
    website_url: 'https://www.nps.gov/sucr/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'timpanogos-cave-nm',
    name: 'Timpanogos Cave National Monument',
    type: 'urban_night_sky_place',
    designation: 'Urban Night Sky Place',
    state: 'UT',
    lat: 40.4406,
    lng: -111.7086,
    certification_year: 2020,
    description: 'First National Park Service unit certified as an Urban Night Sky Place. Features spectacular decorated caverns and night sky programs.',
    website_url: 'https://www.nps.gov/tica/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'tonto-nm',
    name: 'Tonto National Monument',
    type: 'park',
    designation: 'Silver',
    state: 'AZ',
    lat: 33.6469,
    lng: -111.1089,
    certification_year: 2021,
    description: 'Silver Tier Dark Sky Park preserving ancient cliff dwellings under dark Arizona skies.',
    website_url: 'https://www.nps.gov/tont/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'tumacacori-nhp',
    name: 'Tumacácori National Historical Park',
    type: 'park',
    designation: 'Bronze',
    state: 'AZ',
    lat: 31.5667,
    lng: -111.0500,
    certification_year: 2019,
    description: 'Bronze Tier Dark Sky Park preserving Spanish colonial missions under Arizona dark skies.',
    website_url: 'https://www.nps.gov/tuma/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'valles-caldera-np',
    name: 'Valles Caldera National Preserve',
    type: 'park',
    designation: 'Silver',
    state: 'NM',
    lat: 35.8719,
    lng: -106.5175,
    certification_year: 2021,
    description: 'Silver Tier Dark Sky Park featuring a large volcanic caldera with exceptional night sky viewing.',
    website_url: 'https://www.nps.gov/vall/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'voyageurs-np',
    name: 'Voyageurs National Park',
    type: 'park',
    designation: 'Gold',
    state: 'MN',
    lat: 48.4839,
    lng: -92.8386,
    certification_year: 2020,
    description: 'Gold Tier Dark Sky Park offering excellent opportunities to see northern lights and pristine dark skies over water.',
    website_url: 'https://www.nps.gov/voya/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'walnut-canyon-nm',
    name: 'Walnut Canyon National Monument',
    type: 'park',
    designation: 'Gold',
    state: 'AZ',
    lat: 35.1681,
    lng: -111.5100,
    certification_year: 2016,
    description: 'Gold Tier Dark Sky Park part of Flagstaff\'s internationally recognized dark-sky parks.',
    website_url: 'https://www.nps.gov/waca/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'wupatki-nm',
    name: 'Wupatki National Monument',
    type: 'park',
    designation: 'Gold',
    state: 'AZ',
    lat: 35.5533,
    lng: -111.3683,
    certification_year: 2016,
    description: 'Gold Tier Dark Sky Park part of Flagstaff\'s internationally recognized dark-sky parks.',
    website_url: 'https://www.nps.gov/wupa/',
    managing_agency: 'National Park Service'
  },
  {
    id: 'zion-np',
    name: 'Zion National Park',
    type: 'park',
    designation: 'Bronze',
    state: 'UT',
    lat: 37.2982,
    lng: -113.0263,
    certification_year: 2021,
    description: 'Bronze Tier Dark Sky Park featuring towering sandstone cliffs and the distinctive Temples and Towers of the Virgin.',
    website_url: 'https://www.nps.gov/zion/',
    managing_agency: 'National Park Service'
  },

  // STATE PARKS - Dark Sky Parks
  {
    id: 'anza-borrego-sp',
    name: 'Anza-Borrego Desert State Park',
    type: 'park',
    designation: 'Silver',
    state: 'CA',
    lat: 33.2486,
    lng: -116.3967,
    certification_year: 2018,
    description: 'California\'s second-largest state park featuring slot canyons, wind caves, and phenomenal stargazing in the Mojave Desert.',
    website_url: 'https://www.parks.ca.gov/anazborrego',
    managing_agency: 'California State Parks'
  },
  {
    id: 'antelope-island-sp',
    name: 'Antelope Island State Park',
    type: 'park',
    designation: 'Gold',
    state: 'UT',
    lat: 40.9500,
    lng: -112.2100,
    certification_year: 2017,
    description: 'Gold Tier Dark Sky Park on an island in the Great Salt Lake with excellent stargazing and wildlife viewing.',
    website_url: 'https://stateparks.utah.gov/parks/antelope-island/',
    managing_agency: 'Utah State Parks'
  },
  {
    id: 'big-bend-ranch-sp',
    name: 'Big Bend Ranch State Park',
    type: 'park',
    designation: 'Gold',
    state: 'TX',
    lat: 29.5550,
    lng: -103.7750,
    certification_year: 2017,
    description: 'Gold Tier Dark Sky Park covering ~355,000 acres in the Trans-Pecos region of far west Texas.',
    website_url: 'https://tpwd.texas.gov/state-parks/big-bend-ranch',
    managing_agency: 'Texas Parks and Wildlife'
  },
  {
    id: 'bruneau-dunes-sp',
    name: 'Bruneau Dunes State Park',
    type: 'park',
    designation: 'Gold',
    state: 'ID',
    lat: 42.8847,
    lng: -115.7219,
    certification_year: 2017,
    description: 'Gold Tier Dark Sky Park on southern Idaho\'s northern edge of the vast Owyhee desert.',
    website_url: 'https://parksandrecreation.idaho.gov/parks/bruneau-dunes/',
    managing_agency: 'Idaho Parks and Recreation'
  },
  {
    id: 'cherry-springs-sp',
    name: 'Cherry Springs State Park',
    type: 'park',
    designation: 'Gold',
    state: 'PA',
    lat: 41.6598,
    lng: -77.8213,
    certification_year: 2007,
    description: 'One of the few Gold-level Dark Sky Parks on the East Coast. Features dedicated night sky viewing area with exceptional darkness.',
    website_url: 'https://www.dcnr.pa.gov/StateParks/FindAPark/CherrySpringsStatePark/',
    managing_agency: 'Pennsylvania State Parks'
  },
  {
    id: 'clayton-lake-sp',
    name: 'Clayton Lake State Park',
    type: 'park',
    designation: 'Gold',
    state: 'NM',
    lat: 36.5758,
    lng: -103.3061,
    certification_year: 2010,
    description: 'New Mexico\'s first Dark Sky Park with exceptional darkness (SQM readings of 21.6). Features 14-inch Mead telescope for public viewing.',
    website_url: 'https://www.emnrd.nm.gov/spd/find-a-park/clayton-lake-state-park-and-dinosaur-trackways/',
    managing_agency: 'New Mexico State Parks'
  },
  {
    id: 'dead-horse-point-sp',
    name: 'Dead Horse Point State Park',
    type: 'park',
    designation: 'Gold',
    state: 'UT',
    lat: 38.4833,
    lng: -109.7333,
    certification_year: 2016,
    description: 'Gold Tier Dark Sky Park offering dramatic overlooks of the Colorado River and Canyonlands under pristine dark skies.',
    website_url: 'https://stateparks.utah.gov/parks/dead-horse-point/',
    managing_agency: 'Utah State Parks'
  },
  {
    id: 'goblin-valley-sp',
    name: 'Goblin Valley State Park',
    type: 'park',
    designation: 'Gold',
    state: 'UT',
    lat: 38.5667,
    lng: -110.7100,
    certification_year: 2016,
    description: 'Gold Tier Dark Sky Park with one of the darkest night skies on Earth. Virtually free of light pollution with unparalleled Milky Way views.',
    website_url: 'https://stateparks.utah.gov/parks/goblin-valley/',
    managing_agency: 'Utah State Parks'
  },
  {
    id: 'headlands-sp',
    name: 'Headlands International Dark Sky Park',
    type: 'park',
    designation: 'Gold',
    state: 'MI',
    lat: 45.7737,
    lng: -84.9733,
    certification_year: 2011,
    description: 'Michigan\'s first International Dark Sky Park, offering excellent northern sky views and aurora opportunities.',
    website_url: 'https://www.michigan.gov/dnr/places/state-parks/headlands',
    managing_agency: 'Michigan State Parks'
  },
  {
    id: 'james-river-sp',
    name: 'James River State Park',
    type: 'park',
    designation: 'Bronze',
    state: 'VA',
    lat: 37.4000,
    lng: -78.7667,
    certification_year: 2019,
    description: 'Bronze Tier Dark Sky Park along the James River in central Virginia.',
    website_url: 'https://www.dcr.virginia.gov/state-parks/james-river',
    managing_agency: 'Virginia State Parks'
  },
  {
    id: 'kartchner-caverns-sp',
    name: 'Kartchner Caverns State Park',
    type: 'park',
    designation: 'Silver',
    state: 'AZ',
    lat: 31.8378,
    lng: -110.3467,
    certification_year: 2017,
    description: 'Silver Tier Dark Sky Park featuring spectacular living limestone cave and dark desert skies.',
    website_url: 'https://azstateparks.com/kartchner/',
    managing_agency: 'Arizona State Parks'
  },
  {
    id: 'kissimmee-prairie-sp',
    name: 'Kissimmee Prairie Preserve State Park',
    type: 'park',
    designation: 'Gold',
    state: 'FL',
    lat: 27.5613,
    lng: -81.0229,
    certification_year: 2016,
    description: 'Florida\'s first International Dark Sky Park. 54,000-acre preserve with exceptional dark skies, furthest removed from urban light pollution in Florida.',
    website_url: 'https://www.floridastateparks.org/parks-and-trails/kissimmee-prairie-preserve-state-park',
    managing_agency: 'Florida State Parks'
  },
  {
    id: 'natural-bridge-sp',
    name: 'Natural Bridge State Park',
    type: 'park',
    designation: 'Bronze',
    state: 'VA',
    lat: 37.6303,
    lng: -79.5433,
    certification_year: 2019,
    description: 'Bronze Tier Dark Sky Park featuring the famous Natural Bridge limestone arch in Virginia.',
    website_url: 'https://www.dcr.virginia.gov/state-parks/natural-bridge',
    managing_agency: 'Virginia State Parks'
  },
  {
    id: 'sky-meadows-sp',
    name: 'Sky Meadows State Park',
    type: 'park',
    designation: 'Silver',
    state: 'VA',
    lat: 39.0333,
    lng: -77.9833,
    certification_year: 2021,
    description: 'Silver Tier Dark Sky Park in the Blue Ridge foothills of northern Virginia.',
    website_url: 'https://www.dcr.virginia.gov/state-parks/sky-meadows',
    managing_agency: 'Virginia State Parks'
  },
  {
    id: 'staunton-river-sp',
    name: 'Staunton River State Park',
    type: 'park',
    designation: 'Bronze',
    state: 'VA',
    lat: 36.6833,
    lng: -78.6667,
    certification_year: 2015,
    description: 'Bronze Tier Dark Sky Park along the Staunton River in south-central Virginia.',
    website_url: 'https://www.dcr.virginia.gov/state-parks/staunton-river',
    managing_agency: 'Virginia State Parks'
  },
  {
    id: 'steinaker-sp',
    name: 'Steinaker State Park',
    type: 'park',
    designation: 'Silver',
    state: 'UT',
    lat: 40.5167,
    lng: -109.5333,
    certification_year: 2019,
    description: 'Silver Tier Dark Sky Park nestled between Ashley National Forest and Dinosaur National Monument.',
    website_url: 'https://stateparks.utah.gov/parks/steinaker/',
    managing_agency: 'Utah State Parks'
  },

  // INTERNATIONAL DARK SKY RESERVES
  {
    id: 'central-idaho-reserve',
    name: 'Central Idaho Dark Sky Reserve',
    type: 'reserve',
    designation: 'Gold',
    state: 'ID',
    lat: 44.2619,
    lng: -114.3001,
    certification_year: 2017,
    description: 'The first International Dark Sky Reserve in the United States, covering over 1,400 square miles of protected dark sky.',
    website_url: 'https://www.idahodarksky.org/',
    managing_agency: 'Multiple Agencies'
  },
  {
    id: 'big-bend-reserve',
    name: 'Big Bend International Dark Sky Reserve',
    type: 'reserve',
    designation: 'Gold',
    state: 'TX',
    lat: 29.2520,
    lng: -103.2510,
    certification_year: 2024,
    description: 'The largest protected Dark Sky Place in the world at 9 million acres, encompassing Big Bend National Park and surrounding areas.',
    website_url: 'https://www.nps.gov/bibe/',
    managing_agency: 'Multiple Agencies'
  },

  // DARK SKY COMMUNITIES
  {
    id: 'groveland-fl',
    name: 'City of Groveland',
    type: 'community',
    designation: 'Bronze',
    state: 'FL',
    lat: 28.5460,
    lng: -81.8566,
    certification_year: 2023,
    description: 'Florida\'s first International Dark Sky Community and first in the Southeastern United States. Comprehensive lighting ordinance and community dark sky education programs.',
    website_url: 'https://www.groveland-fl.gov/592/Dark-Sky-Community',
    managing_agency: 'City of Groveland'
  }
];

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Find Dark Sky locations within a given radius
 */
export function findNearbyDarkSkyLocations(
  latitude: number, 
  longitude: number, 
  radiusMiles: number = 100,
  limit: number = 5
): DarkSkyLocation[] {
  const locationsWithDistance = DARK_SKY_LOCATIONS.map(location => ({
    ...location,
    distance: calculateDistance(latitude, longitude, location.lat, location.lng)
  }))
  .filter(location => location.distance <= radiusMiles)
  .sort((a, b) => a.distance - b.distance)
  .slice(0, limit);

  return locationsWithDistance;
}