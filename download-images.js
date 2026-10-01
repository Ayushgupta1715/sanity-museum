const fs = require('fs');
const https = require('https');
const path = require('path');

const images = {
  '1.jpg': 'https://picsum.photos/seed/bulb/800/800',
  '2.jpg': 'https://picsum.photos/seed/telephone/800/800',
  '3.jpg': 'https://picsum.photos/seed/antikythera/800/800',
  '4.jpg': 'https://picsum.photos/seed/monalisa/800/800',
  '5.jpg': 'https://picsum.photos/seed/starry/800/800',
  '6.jpg': 'https://picsum.photos/seed/thinker/800/800',
  '7.jpg': 'https://picsum.photos/seed/steam/800/800',
  '8.jpg': 'https://picsum.photos/seed/rosetta/800/800',
  '9.jpg': 'https://picsum.photos/seed/press/800/800',
  '10.jpg': 'https://picsum.photos/seed/ai/800/800',
  '11.jpg': 'https://picsum.photos/seed/dyson/800/800'
};

function download(url, dest) {
  https.get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      download(res.headers.location, dest);
    } else if (res.statusCode === 200) {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close());
    }
  });
}

Object.entries(images).forEach(([filename, url]) => {
  const dest = path.join(__dirname, 'public', 'exhibits', filename);
  download(url, dest);
});
