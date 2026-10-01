const https = require('https');
const fs = require('fs');

const KEYWORDS = [
  "wheel", "press", "compass", "steam", "telephone", "lightbulb", "radio", "television", "computer", "internet",
  "painting", "sculpture", "mandala", "folk", "abstract", "pottery", "textile", "camera", "glitch", "canvas",
  "dinosaur", "ruins", "temple", "coins", "fort", "tajmahal", "colonial", "flag", "india", "swords",
  "ai", "robot", "flyingcar", "city", "galaxy", "mars", "architecture", "turbine", "ev", "vr"
];

function downloadImage(keyword, index) {
  return new Promise((resolve, reject) => {
    // LoremFlickr redirects to a real Flickr CDN URL
    const url = `https://loremflickr.com/800/600/${keyword}`;
    const dest = `public/exhibits/room_${index}.jpg`;
    
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, (redirectRes) => {
            const file = fs.createWriteStream(dest);
            redirectRes.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      } else {
        reject(new Error(`Failed with status code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function run() {
  for (let i = 0; i < KEYWORDS.length; i++) {
    console.log(`Downloading image ${i + 1}/40: ${KEYWORDS[i]}`);
    try {
      await downloadImage(KEYWORDS[i], i);
      console.log(`Success! Waiting 1s...`);
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`Failed on image ${i}:`, e.message);
    }
  }
  console.log("Done!");
}

run();
