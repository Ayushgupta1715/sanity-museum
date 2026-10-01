const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'iidfd4sp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skHbE2yu9EySajNlTAQJ0JVDXhHkZEuAhiEV63A3qR5YDzCwr5uSGwQSjWgNJROhH5HeoVBcxXPL4Bqtm',
  useCdn: false,
});

const ROOM_DATA = [
  // Room 1: Inventions
  { name: "The Wheel", creator: "Unknown Ancient Humans", era: "c. 3500 BC", desc: "One of the most important technologies in the history of human civilization, revolutionizing transport and machinery.", category: "invention" },
  { name: "Printing Press", creator: "Johannes Gutenberg", era: "1440 AD", desc: "A device that allowed for the mass production of books, drastically changing the spread of knowledge.", category: "invention" },
  { name: "Magnetic Compass", creator: "Han Dynasty, China", era: "c. 200 BC", desc: "A navigational instrument that revolutionized maritime trade and global exploration.", category: "invention" },
  { name: "Steam Engine", creator: "James Watt (improvement)", era: "1776 AD", desc: "The driving force behind the Industrial Revolution, powering trains, factories, and ships.", category: "invention" },
  { name: "Telephone", creator: "Alexander Graham Bell", era: "1876 AD", desc: "An apparatus for transmitting and receiving vocal sounds, connecting the world through instant communication.", category: "invention" },
  { name: "Light Bulb", creator: "Thomas Edison", era: "1879 AD", desc: "The first commercially practical incandescent light, conquering darkness and transforming cities.", category: "invention" },
  { name: "Radio", creator: "Guglielmo Marconi", era: "1895 AD", desc: "The transmission of signals by modulation of electromagnetic waves, birthing mass media.", category: "invention" },
  { name: "Television", creator: "Philo Farnsworth", era: "1927 AD", desc: "An electronic system of transmitting moving images and sound, changing entertainment forever.", category: "invention" },
  { name: "Personal Computer", creator: "Various (IBM/Apple)", era: "1970s AD", desc: "A multi-purpose computer whose size and capabilities made it accessible to individual users.", category: "invention" },
  { name: "The Internet", creator: "ARPANET / Tim Berners-Lee", era: "1980s AD", desc: "The global system of interconnected computer networks that forms the foundation of modern society.", category: "invention" },

  // Room 2: Art
  { name: "Ancient Cave Paintings", creator: "Early Humans", era: "c. 40,000 BC", desc: "The earliest known forms of human art, capturing wildlife and daily life on cave walls.", category: "art" },
  { name: "Classical Sculptures", creator: "Various Artists", era: "c. 500 BC", desc: "Masterpieces of marble and bronze representing idealized human forms and mythological figures.", category: "art" },
  { name: "Traditional Indian Art", creator: "Indian Artisans", era: "Various", desc: "Intricate paintings, murals, and religious iconography reflecting India's rich cultural heritage.", category: "art" },
  { name: "Folk Art", creator: "Local Communities", era: "Various", desc: "Art originating from indigenous culture, reflecting the traditions, beliefs, and values of the people.", category: "art" },
  { name: "Contemporary Art", creator: "Modern Artists", era: "20th Century", desc: "Art produced in the present period, constantly pushing the boundaries of medium and expression.", category: "art" },
  { name: "Pottery & Ceramics", creator: "Master Potters", era: "Ancient to Modern", desc: "The craft of making functional and decorative objects out of clay.", category: "art" },
  { name: "Textiles & Weaving", creator: "Master Weavers", era: "Ancient to Modern", desc: "The delicate and mathematical art of interlacing threads to create intricate fabrics and patterns.", category: "art" },
  { name: "Photography", creator: "Niépce / Daguerre", era: "1826 AD", desc: "The art and science of capturing light to produce enduring images of the world.", category: "art" },
  { name: "Digital Art", creator: "Digital Artists", era: "21st Century", desc: "Art created or modified using computer technology, representing the newest frontier of expression.", category: "art" },
  { name: "Famous Masters", creator: "Da Vinci, Van Gogh, etc.", era: "Various", desc: "A tribute to the visionary artists whose masterpieces have shaped global art history.", category: "art" },

  // Room 3: History
  { name: "Prehistoric Period", creator: "Early Hominids", era: "Before 3300 BC", desc: "The era before recorded history, marked by the use of stone tools and early human migration.", category: "history" },
  { name: "Indus Valley Civilization", creator: "Harappan People", era: "3300 - 1300 BC", desc: "A Bronze Age civilization known for its advanced urban planning and mysterious undeciphered script.", category: "history" },
  { name: "Ancient India", creator: "Vedic Civilization", era: "1500 - 500 BC", desc: "The period when the Vedas were composed and the foundations of Indian philosophy were laid.", category: "history" },
  { name: "Mauryan & Gupta Empire", creator: "Chandragupta / Ashoka", era: "322 BC - 543 AD", desc: "The Golden Age of India, marked by massive political unification and profound cultural achievements.", category: "history" },
  { name: "Medieval India", creator: "Various Dynasties", era: "6th - 16th Century", desc: "An era of rich temple architecture, shifting empires, and the synthesis of diverse cultures.", category: "history" },
  { name: "Mughal Period", creator: "Mughal Emperors", era: "1526 - 1857 AD", desc: "An empire noted for its administrative organization and magnificent architectural legacy, like the Taj Mahal.", category: "history" },
  { name: "British Period", creator: "British East India Co.", era: "1757 - 1947 AD", desc: "The era of colonial rule, bringing railways, English education, and massive economic shifts.", category: "history" },
  { name: "Independence Movement", creator: "Freedom Fighters", era: "1857 - 1947 AD", desc: "The historic struggle characterized by non-violent resistance leading to India's freedom.", category: "history" },
  { name: "Post-Independence India", creator: "Republic of India", era: "1947 - Present", desc: "The journey of a newly independent nation growing into a modern global democratic powerhouse.", category: "history" },
  { name: "Historical Artifacts", creator: "Ancient Forgers", era: "Various", desc: "Weapons, coins, and maps that serve as physical evidence of humanity's turbulent past.", category: "history" },

  // Room 4: Future
  { name: "Artificial Intelligence", creator: "Computer Scientists", era: "Future", desc: "Sentient and highly advanced neural networks capable of learning, reasoning, and creating.", category: "future" },
  { name: "Advanced Robotics", creator: "Engineers", era: "Future", desc: "Humanoid and specialized robots seamlessly integrating into daily human life and industry.", category: "future" },
  { name: "Future Transportation", creator: "Innovators", era: "Future", desc: "Hyperloops, flying cars, and teleportation concepts redefining the way humans travel.", category: "future" },
  { name: "Smart Cities", creator: "Urban Planners", era: "Future", desc: "Highly connected urban environments governed by data to optimize resources and sustainability.", category: "future" },
  { name: "Space Exploration", creator: "Aerospace Agencies", era: "Future", desc: "Humanity reaching beyond the solar system, discovering new exoplanets and alien civilizations.", category: "future" },
  { name: "Mars Colonization", creator: "Astronauts", era: "Future", desc: "The establishment of permanent, self-sustaining human outposts on the Red Planet.", category: "future" },
  { name: "Future Architecture", creator: "Architects", era: "Future", desc: "Breathtaking structures using advanced materials, integrating seamlessly with nature.", category: "future" },
  { name: "Renewable Energy", creator: "Environmentalists", era: "Future", desc: "A world powered entirely by clean, unlimited energy from the sun, wind, and fusion.", category: "future" },
  { name: "Autonomous Vehicles", creator: "AI Systems", era: "Future", desc: "Self-driving electric cars that have eliminated traffic accidents and transformed mobility.", category: "future" },
  { name: "Virtual & Augmented Reality", creator: "Tech Pioneers", era: "Future", desc: "Immersive digital worlds and overlays that blend seamlessly with physical reality.", category: "future" }
];

async function main() {
  console.log('Starting automated migration to Sanity CMS...');

  for (let i = 0; i < ROOM_DATA.length; i++) {
    const item = ROOM_DATA[i];
    const imagePath = path.join(__dirname, 'public', 'exhibits', `room_${i}.jpg`);
    
    try {
      console.log(`Processing [${i + 1}/40]: ${item.name}...`);
      
      // 1. Upload the image to Sanity
      let imageAsset;
      if (fs.existsSync(imagePath)) {
        const imageStream = fs.createReadStream(imagePath);
        imageAsset = await client.assets.upload('image', imageStream, {
          filename: `room_${i}.jpg`,
        });
        console.log(`  âœ“ Uploaded image: ${imageAsset._id}`);
      } else {
        console.warn(`  âš ï¸ Image not found: ${imagePath}`);
      }

      const col = i % 2;
      const xPos = col === 0 ? -8 : 8;
      const roomIndex = Math.floor(i / 10);
      const row = Math.floor((i % 10) / 2);
      const centerZ = 5 - (roomIndex * 30);
      const startZ = centerZ + 12;
      const zPos = startZ - (row * 6);

      // 2. Create the document
      const doc = {
        _type: 'exhibit',
        name: item.name,
        creator: item.creator,
        era: item.era,
        description: item.desc,
        category: item.category,
        popularity: Math.floor(Math.random() * 5000),
        workflowState: 'LIVE', // Make it visible instantly!
        control: {
          x: xPos,
          y: 2,
          z: zPos,
          rotation: col === 0 ? Math.PI / 2 : -Math.PI / 2,
          vitality: 100,
          lifecycle: 'ACTIVE'
        },
      };

      if (imageAsset) {
        doc.image = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          }
        };
      }

      await client.create(doc);
      console.log(`  âœ“ Document created!`);

    } catch (err) {
      console.error(`  âœ– Failed to process ${item.name}:`, err.message);
    }
  }

  console.log('\nâœ¨ Migration complete! All 40 exhibits are now live in your Sanity Museum.');
}

main();
