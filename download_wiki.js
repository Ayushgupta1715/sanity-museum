const https = require('https');
const fs = require('fs');

const WIKI_TITLES = [
  // Room 1
  "Wheel", "Printing_press", "Compass", "Steam_engine", "Telephone", 
  "Incandescent_light_bulb", "Radio", "Television", "Personal_computer", "Internet",
  // Room 2
  "Cave_painting", "Classical_sculpture", "Indian_art", "Folk_art", "Contemporary_art", 
  "Pottery", "Textile", "Photography", "Digital_art", "Mona_Lisa",
  // Room 3
  "Prehistory", "Indus_Valley_Civilisation", "Vedic_period", "Gupta_Empire", "Medieval_India", 
  "Taj_Mahal", "Company_rule_in_India", "Indian_independence_movement", "History_of_the_Republic_of_India", "Talwar",
  // Room 4
  "Artificial_intelligence", "Humanoid_robot", "Flying_car", "Smart_city", "Space_exploration", 
  "Mars_rover", "Futuristic_architecture", "Renewable_energy", "Electric_car", "Virtual_reality"
];

const USER_AGENT = 'AntigravityMuseumBot/1.0 (https://example.org/)';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      } else {
        reject(new Error(`Download failed: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

function getWikiImageUrl(title) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=800`;
    https.get(apiUrl, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const pages = parsed.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId === '-1' || !pages[pageId].thumbnail) {
            resolve(null);
          } else {
            resolve(pages[pageId].thumbnail.source);
          }
        } catch(e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  for (let i = 0; i < WIKI_TITLES.length; i++) {
    const title = WIKI_TITLES[i];
    console.log(`[${i+1}/40] Processing ${title}...`);
    try {
      const imgUrl = await getWikiImageUrl(title);
      if (imgUrl) {
        console.log(`Found image: ${imgUrl}`);
        await downloadFile(imgUrl, `public/exhibits/room_${i}.jpg`);
        console.log(`Downloaded to room_${i}.jpg`);
      } else {
        console.log(`No image found for ${title}. Copying fallback.`);
        // Copy 1.jpg to room_i.jpg as fallback so it doesn't crash
        fs.copyFileSync(`public/exhibits/1.jpg`, `public/exhibits/room_${i}.jpg`);
      }
    } catch(e) {
      console.error(`Error on ${title}:`, e.message);
      fs.copyFileSync(`public/exhibits/1.jpg`, `public/exhibits/room_${i}.jpg`);
    }
  }
  console.log("ALL DONE!");
}

run();
