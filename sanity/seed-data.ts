import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const exhibits = [
  {
    _id: 'exhibit-light-bulb',
    _type: 'exhibit',
    name: 'Incandescent Light Bulb',
    description: 'The first practical electric incandescent lamp.',
    era: '1879',
    creator: 'Thomas Edison',
    category: 'invention',
    popularity: 1240,
    control: {
      x: -4,
      y: 0,
      z: 2,
      rotation: 0,
      vitality: 92,
      lifecycle: 'ACTIVE',
    },
    workflowState: 'LIVE',
  },
  {
    _id: 'exhibit-mona-lisa',
    _type: 'exhibit',
    name: 'Mona Lisa',
    description: 'Portrait painting by Italian polymath Leonardo da Vinci.',
    era: '1503',
    creator: 'Leonardo da Vinci',
    category: 'art',
    popularity: 9999,
    control: {
      x: 0,
      y: 0,
      z: -5,
      rotation: 0,
      vitality: 78,
      lifecycle: 'COOLING',
    },
    workflowState: 'LIVE',
  },
  {
    _id: 'exhibit-steam-engine',
    _type: 'exhibit',
    name: 'Steam Engine',
    description: 'A heat engine that performs mechanical work using steam as its working fluid.',
    era: '1712',
    creator: 'Thomas Newcomen',
    category: 'history',
    popularity: 450,
    control: {
      x: 5,
      y: 0,
      z: -2,
      rotation: 0,
      vitality: 100,
      lifecycle: 'REVIVED',
    },
    workflowState: 'LIVE',
  },
  {
    _id: 'exhibit-old-camera',
    _type: 'exhibit',
    name: 'Daguerreotype Camera',
    description: 'The first publicly available photographic process.',
    era: '1839',
    creator: 'Louis Daguerre',
    category: 'invention',
    popularity: 80,
    control: {
      x: -3,
      y: 0,
      z: -4,
      rotation: 0,
      vitality: 15,
      lifecycle: 'ARCHIVED',
    },
    workflowState: 'LIVE',
  },
  {
    _id: 'exhibit-ai-robot',
    _type: 'exhibit',
    name: 'Quantum AI Core',
    description: 'The central intelligence nucleus of the future museum.',
    era: '2026',
    creator: 'Oniria',
    category: 'future',
    popularity: 5000,
    control: {
      x: 4,
      y: 0,
      z: 4,
      rotation: 0,
      vitality: 100,
      lifecycle: 'ACTIVE',
    },
    workflowState: 'NEW',
  }
];

async function seed() {
  console.log('Seeding Living Museum Exhibits...\n');

  if (!process.env.SANITY_API_TOKEN) {
    console.error('Error: SANITY_API_TOKEN is missing in environment variables.');
    return;
  }

  for (const exhibit of exhibits) {
    try {
      // Create document in sanity. Ensure flat fields for the schema matching.
      // Wait, our schema uses 'location', 'vitality', 'lifecycle' at root but grouped in a custom component? 
      // Let's re-verify `exhibit.ts` schema.
      // Ah, I made `control` an object containing x,y,z, rotation, vitality, lifecycle.
      await client.createOrReplace(exhibit);
      console.log(`✅ ${exhibit.name}`);
    } catch (err) {
      console.error(`❌ Failed to create exhibit: ${exhibit.name}`, err);
    }
  }

  console.log('\n✨ Seeding complete!');
}

seed().catch(console.error);
