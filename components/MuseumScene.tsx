'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Environment, Float, MeshReflectorMaterial, ContactShadows, Image, useTexture } from '@react-three/drei';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import * as THREE from 'three';

const client = createClient({
  projectId: projectId || 'placeholder',
  dataset: dataset || 'production',
  apiVersion,
  useCdn: false,
});

type Exhibit = {
  _id: string;
  name: string;
  control?: {
    lifecycle: 'ACTIVE' | 'COOLING' | 'ARCHIVED' | 'REVIVED';
    vitality: number;
    x: number;
    y: number;
    z: number;
  };
  category?: string;
  description?: string;
  era?: string;
  creator?: string;
  imageUrl?: string;
};

// A rock-solid component to catch any image load failures gracefully
class ImageBoundary extends React.Component<{url: string, width: number, height: number, children: React.ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <mesh><planeGeometry args={[this.props.width, this.props.height]} /><meshStandardMaterial color="#8b6508" /></mesh>;
    return this.props.children;
  }
}

// Uses drei's Image for perfect aspect ratio, wrapped in safety
const SafeMaterial = ({ url, width, height, isArchived = false, opacity = 1 }: { url: string, width: number, height: number, isArchived?: boolean, opacity?: number }) => {
  return (
    <Suspense fallback={<mesh><planeGeometry args={[width, height]} /><meshStandardMaterial color={isArchived ? "#222" : "#8b6508"} transparent opacity={opacity} wireframe={isArchived} /></mesh>}>
      <ImageBoundary url={url} width={width} height={height}>
        <Image url={url} scale={[width, height]} transparent={opacity < 1} opacity={opacity} grayscale={isArchived ? 1 : 0} />
      </ImageBoundary>
    </Suspense>
  );
};

const ROOM_DATA = [
  // Room 1: Inventions
  { name: "The Wheel", creator: "Unknown Ancient Humans", era: "c. 3500 BC", desc: "One of the most important technologies in the history of human civilization, revolutionizing transport and machinery." },
  { name: "Printing Press", creator: "Johannes Gutenberg", era: "1440 AD", desc: "A device that allowed for the mass production of books, drastically changing the spread of knowledge." },
  { name: "Magnetic Compass", creator: "Han Dynasty, China", era: "c. 200 BC", desc: "A navigational instrument that revolutionized maritime trade and global exploration." },
  { name: "Steam Engine", creator: "James Watt (improvement)", era: "1776 AD", desc: "The driving force behind the Industrial Revolution, powering trains, factories, and ships." },
  { name: "Telephone", creator: "Alexander Graham Bell", era: "1876 AD", desc: "An apparatus for transmitting and receiving vocal sounds, connecting the world through instant communication." },
  { name: "Light Bulb", creator: "Thomas Edison", era: "1879 AD", desc: "The first commercially practical incandescent light, conquering darkness and transforming cities." },
  { name: "Radio", creator: "Guglielmo Marconi", era: "1895 AD", desc: "The transmission of signals by modulation of electromagnetic waves, birthing mass media." },
  { name: "Television", creator: "Philo Farnsworth", era: "1927 AD", desc: "An electronic system of transmitting moving images and sound, changing entertainment forever." },
  { name: "Personal Computer", creator: "Various (IBM/Apple)", era: "1970s AD", desc: "A multi-purpose computer whose size and capabilities made it accessible to individual users." },
  { name: "The Internet", creator: "ARPANET / Tim Berners-Lee", era: "1980s AD", desc: "The global system of interconnected computer networks that forms the foundation of modern society." },

  // Room 2: Art
  { name: "Ancient Cave Paintings", creator: "Early Humans", era: "c. 40,000 BC", desc: "The earliest known forms of human art, capturing wildlife and daily life on cave walls." },
  { name: "Classical Sculptures", creator: "Various Artists", era: "c. 500 BC", desc: "Masterpieces of marble and bronze representing idealized human forms and mythological figures." },
  { name: "Traditional Indian Art", creator: "Indian Artisans", era: "Various", desc: "Intricate paintings, murals, and religious iconography reflecting India's rich cultural heritage." },
  { name: "Folk Art", creator: "Local Communities", era: "Various", desc: "Art originating from indigenous culture, reflecting the traditions, beliefs, and values of the people." },
  { name: "Contemporary Art", creator: "Modern Artists", era: "20th Century", desc: "Art produced in the present period, constantly pushing the boundaries of medium and expression." },
  { name: "Pottery & Ceramics", creator: "Master Potters", era: "Ancient to Modern", desc: "The craft of making functional and decorative objects out of clay." },
  { name: "Textiles & Weaving", creator: "Master Weavers", era: "Ancient to Modern", desc: "The delicate and mathematical art of interlacing threads to create intricate fabrics and patterns." },
  { name: "Photography", creator: "Niépce / Daguerre", era: "1826 AD", desc: "The art and science of capturing light to produce enduring images of the world." },
  { name: "Digital Art", creator: "Digital Artists", era: "21st Century", desc: "Art created or modified using computer technology, representing the newest frontier of expression." },
  { name: "Famous Masters", creator: "Da Vinci, Van Gogh, etc.", era: "Various", desc: "A tribute to the visionary artists whose masterpieces have shaped global art history." },

  // Room 3: History
  { name: "Prehistoric Period", creator: "Early Hominids", era: "Before 3300 BC", desc: "The era before recorded history, marked by the use of stone tools and early human migration." },
  { name: "Indus Valley Civilization", creator: "Harappan People", era: "3300 - 1300 BC", desc: "A Bronze Age civilization known for its advanced urban planning and mysterious undeciphered script." },
  { name: "Ancient India", creator: "Vedic Civilization", era: "1500 - 500 BC", desc: "The period when the Vedas were composed and the foundations of Indian philosophy were laid." },
  { name: "Mauryan & Gupta Empire", creator: "Chandragupta / Ashoka", era: "322 BC - 543 AD", desc: "The Golden Age of India, marked by massive political unification and profound cultural achievements." },
  { name: "Medieval India", creator: "Various Dynasties", era: "6th - 16th Century", desc: "An era of rich temple architecture, shifting empires, and the synthesis of diverse cultures." },
  { name: "Mughal Period", creator: "Mughal Emperors", era: "1526 - 1857 AD", desc: "An empire noted for its administrative organization and magnificent architectural legacy, like the Taj Mahal." },
  { name: "British Period", creator: "British East India Co.", era: "1757 - 1947 AD", desc: "The era of colonial rule, bringing railways, English education, and massive economic shifts." },
  { name: "Independence Movement", creator: "Freedom Fighters", era: "1857 - 1947 AD", desc: "The historic struggle characterized by non-violent resistance leading to India's freedom." },
  { name: "Post-Independence India", creator: "Republic of India", era: "1947 - Present", desc: "The journey of a newly independent nation growing into a modern global democratic powerhouse." },
  { name: "Historical Artifacts", creator: "Ancient Forgers", era: "Various", desc: "Weapons, coins, and maps that serve as physical evidence of humanity's turbulent past." },

  // Room 4: Future
  { name: "Artificial Intelligence", creator: "Computer Scientists", era: "Future", desc: "Sentient and highly advanced neural networks capable of learning, reasoning, and creating." },
  { name: "Advanced Robotics", creator: "Engineers", era: "Future", desc: "Humanoid and specialized robots seamlessly integrating into daily human life and industry." },
  { name: "Future Transportation", creator: "Innovators", era: "Future", desc: "Hyperloops, flying cars, and teleportation concepts redefining the way humans travel." },
  { name: "Smart Cities", creator: "Urban Planners", era: "Future", desc: "Highly connected urban environments governed by data to optimize resources and sustainability." },
  { name: "Space Exploration", creator: "Aerospace Agencies", era: "Future", desc: "Humanity reaching beyond the solar system, discovering new exoplanets and alien civilizations." },
  { name: "Mars Colonization", creator: "Astronauts", era: "Future", desc: "The establishment of permanent, self-sustaining human outposts on the Red Planet." },
  { name: "Future Architecture", creator: "Architects", era: "Future", desc: "Breathtaking structures using advanced materials, integrating seamlessly with nature." },
  { name: "Renewable Energy", creator: "Environmentalists", era: "Future", desc: "A world powered entirely by clean, unlimited energy from the sun, wind, and fusion." },
  { name: "Autonomous Vehicles", creator: "AI Systems", era: "Future", desc: "Self-driving electric cars that have eliminated traffic accidents and transformed mobility." },
  { name: "Virtual & Augmented Reality", creator: "Tech Pioneers", era: "Future", desc: "Immersive digital worlds and overlays that blend seamlessly with physical reality." }
];

// Generates exactly 40 exhibits (10 per room)
const FALLBACK_EXHIBITS: Exhibit[] = Array.from({ length: 40 }).map((_, i) => {
  const data = ROOM_DATA[i];
  
  const col = i % 2; // 0, 1 (Left, Right)
  const xPos = col === 0 ? -8 : 8;
  
  // Calculate which room (0 to 3) and which row in that room (0 to 4)
  const roomIndex = Math.floor(i / 10);
  const rowInRoom = Math.floor((i % 10) / 2);

  // Every room is perfectly 30 meters long to eliminate empty gaps!
  // Room 1: 20 to -10
  // Room 2: -10 to -40
  // Room 3: -40 to -70
  // Room 4: -70 to -100
  let roomStartZ = 20;
  if (roomIndex === 1) roomStartZ = -10;
  if (roomIndex === 2) roomStartZ = -40;
  if (roomIndex === 3) roomStartZ = -70;
  
  // Exact 5m spacing (Starts 5m from wall, 5m between rows, ends 5m before door)
  const zPos = roomStartZ - 5 - (rowInRoom * 5);

  let categoryName = 'INVENTION';
  if (roomIndex === 1) categoryName = 'ART';
  if (roomIndex === 2) categoryName = 'HISTORY';
  if (roomIndex === 3) categoryName = 'FUTURE';

  return {
    _id: `exhibit-${i}`,
    name: data.name,
    category: categoryName,
    description: data.desc,
    era: data.era,
    creator: data.creator,
    imageUrl: `/exhibits/room_${i}.jpg`,
    control: { 
      lifecycle: 'ACTIVE', 
      vitality: 50,
      x: xPos, 
      y: 0, 
      z: zPos
    }
  };
});

export default function MuseumScene({ onSelectExhibit, targetZ, targetX = 0, isNightMode = false }: { onSelectExhibit: (e: Exhibit | null) => void, targetZ: number, targetX?: number, isNightMode?: boolean }) {
  const [exhibits, setExhibits] = useState<Exhibit[]>(FALLBACK_EXHIBITS);

  useEffect(() => {
    // If a real Sanity Project ID is configured, fetch live data from the CMS!
    if (projectId && projectId !== 'placeholder') {
      console.log('Fetching live museum data from Sanity CMS...');
      client.fetch(`*[_type == "exhibit" && workflowState == "LIVE"]{
        _id, 
        name, 
        category, 
        description, 
        era, 
        creator, 
        popularity,
        "imageUrl": image.asset->url, 
        control
      }`).then(data => {
        if (data && data.length > 0) {
          setExhibits(data);
        } else {
          console.warn('No LIVE exhibits found in Sanity. Using fallback museum.');
          setExhibits(FALLBACK_EXHIBITS);
        }
      }).catch(err => {
        console.error('Failed to fetch from Sanity:', err);
        setExhibits(FALLBACK_EXHIBITS);
      });
    } else {
      setExhibits(FALLBACK_EXHIBITS); // Use dummy data until connected
    }
  }, []);

  return (
    <Canvas shadows camera={{ position: [0, 1.6, 18], fov: 60 }}>
      <color attach="background" args={['#050505']} />
      {/* Classic Museum Lighting - Day vs Night */}
      <ambientLight intensity={isNightMode ? 0.2 : 0.5} color={isNightMode ? "#8aa2c4" : "#ffffff"} />
      
      {/* Sunlight coming through the skylight */}
      <directionalLight 
        position={[0, 40, 10]} 
        intensity={isNightMode ? 0.2 : 3.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
        color={isNightMode ? "#88bbee" : "#fff9f0"} 
      />
      
      {/* Soft point light (lantern) following the user */}
      <pointLight position={[0, 4, targetZ]} distance={30} decay={1.5} intensity={isNightMode ? 3.0 : 0.0} color="#ffffff" castShadow />
      
      {/* Elegant Polished Hardwood Floor (Maximum Compatibility) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -40]} receiveShadow>
        <planeGeometry args={[100, 140]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.4} metalness={0.1} />
      </mesh>

      <MuseumArchitecture onSelect={onSelectExhibit} isNightMode={isNightMode} />
      
      <Suspense fallback={null}>
        {exhibits.map((exhibit) => (
          <ExhibitNode key={exhibit._id} exhibit={exhibit} onSelect={onSelectExhibit} />
        ))}
      </Suspense>

      <CameraRig targetZ={targetZ} targetX={targetX} />
    </Canvas>
  );
}

// Track keyboard state
export const keyboardState = { w: false, a: false, s: false, d: false, arrowup: false, arrowdown: false, arrowleft: false, arrowright: false };
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (keyboardState.hasOwnProperty(e.key.toLowerCase())) keyboardState[e.key.toLowerCase() as keyof typeof keyboardState] = true;
  });
  window.addEventListener('keyup', (e) => {
    if (keyboardState.hasOwnProperty(e.key.toLowerCase())) keyboardState[e.key.toLowerCase() as keyof typeof keyboardState] = false;
  });
}

function CameraRig({ targetZ, targetX }: { targetZ: number, targetX: number }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Initialize camera and target when jumping to rooms
  useEffect(() => {
    // Camera is exactly at targetZ, looking slightly forward (-0.1) for FPS feel
    camera.position.set(targetX, 1.6, targetZ);
    if (controlsRef.current) {
      controlsRef.current.target.set(targetX, 1.6, targetZ - 0.1);
      controlsRef.current.update();
    }
  }, [targetZ, targetX]);

  useFrame((state, delta) => {
    const speed = 15 * delta;
    
    // Get forward and right vectors based on camera's current viewing angle
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();
    
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    // Calculate how much we want to move this frame
    const moveVec = new THREE.Vector3(0, 0, 0);

    if (keyboardState.w || keyboardState.arrowup) moveVec.addScaledVector(forward, speed);
    if (keyboardState.s || keyboardState.arrowdown) moveVec.addScaledVector(forward, -speed);

    if (controlsRef.current) {
      if (moveVec.lengthSq() > 0) {
        controlsRef.current.target.add(moveVec);
        
        // Clamp target to prevent walking out of the museum
        controlsRef.current.target.x = THREE.MathUtils.clamp(controlsRef.current.target.x, -5, 5);
        controlsRef.current.target.z = THREE.MathUtils.clamp(controlsRef.current.target.z, -100, 20);
      }

      // Handle Turning (Left/Right rotates the camera view instead of strafing!)
      if (keyboardState.a || keyboardState.arrowleft || keyboardState.d || keyboardState.arrowright) {
        const lookDir = new THREE.Vector3().subVectors(controlsRef.current.target, camera.position);
        const turnSpeed = speed * 0.15;
        
        if (keyboardState.a || keyboardState.arrowleft) {
          lookDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), turnSpeed);
        }
        if (keyboardState.d || keyboardState.arrowright) {
          lookDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), -turnSpeed);
        }
        
        controlsRef.current.target.copy(camera.position).add(lookDir);
      }
      
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef} 
      makeDefault 
      minDistance={0.1} 
      maxDistance={0.1} 
      enablePan={false}
      enableZoom={false}
      enableDamping={true} // Makes looking around buttery smooth
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2 + 0.2} 
      keys={{ LEFT: '', RIGHT: '', UP: '', BOTTOM: '' }} // Disable default orbit keys
    />
  );
}

function MuseumArchitecture({ onSelect, isNightMode = false }: { onSelect: (e: Exhibit) => void, isNightMode?: boolean }) {
  const wallMaterial = <meshStandardMaterial color="#f2efe9" roughness={0.9} />;

  return (
    <group>
      {/* Outer Corridor Walls (Extra Large) */}
      <mesh position={[-20, 4, -40]} receiveShadow castShadow><boxGeometry args={[1, 8, 120]} />{wallMaterial}</mesh>
      <mesh position={[20, 4, -40]} receiveShadow castShadow><boxGeometry args={[1, 8, 120]} />{wallMaterial}</mesh>
      {/* End Walls */}
      <mesh position={[0, 4, 20]} receiveShadow castShadow><boxGeometry args={[40, 8, 1]} />{wallMaterial}</mesh>
      <mesh position={[0, 4, -100]} receiveShadow castShadow><boxGeometry args={[40, 8, 1]} />{wallMaterial}</mesh>

      {/* Decorative Baseboards (Wainscoting strip) */}
      <mesh position={[-19.4, 0.4, -40]} receiveShadow><boxGeometry args={[0.2, 0.8, 120]} /><meshStandardMaterial color="#e0dcd3" /></mesh>
      <mesh position={[19.4, 0.4, -40]} receiveShadow><boxGeometry args={[0.2, 0.8, 120]} /><meshStandardMaterial color="#e0dcd3" /></mesh>

      {/* Magnificent Glass Skylight Roof */}
      <Skylight isNightMode={isNightMode} />

      {/* Dividers with Doors (Creating sequential rooms) */}
      <DividerWall z={-10} label="ROOM 2 : ART" />
      <DividerWall z={-40} label="ROOM 3 : HISTORY" />
      <DividerWall z={-70} label="ROOM 4 : FUTURE" />

      {/* Initial Room Label */}
      <RoomLabel position={[0, 5, 19.4]} rotation={[0, Math.PI, 0]} text="ROOM 1 : INVENTIONS" />
    </group>
  );
}

function Skylight({ isNightMode = false }: { isNightMode?: boolean }) {
  const roofMaterial = <meshStandardMaterial color="#fdfbf7" roughness={0.9} />;
  const trimMaterial = <meshStandardMaterial color="#e8e5df" roughness={0.8} />;
  const mullionMaterial = <meshStandardMaterial color="#cccccc" roughness={0.6} metalness={0.2} />;
  
  // Center Z points for each of the 4 rooms
  const roomCenters = [5, -25, -55, -85];

  return (
    <group>
      {roomCenters.map((centerZ, index) => (
        <group key={index} position={[0, 8, centerZ]}>
          {/* Main Flat Ceiling (Y=0 relative to group) */}
          {/* Left/Right outer ceilings */}
          <mesh position={[-14, 0, 0]} receiveShadow><boxGeometry args={[12, 0.5, 30]} />{roofMaterial}</mesh>
          <mesh position={[14, 0, 0]} receiveShadow><boxGeometry args={[12, 0.5, 30]} />{roofMaterial}</mesh>
          {/* Front/Back outer ceilings */}
          <mesh position={[0, 0, 12.5]} receiveShadow><boxGeometry args={[16, 0.5, 5]} />{roofMaterial}</mesh>
          <mesh position={[0, 0, -12.5]} receiveShadow><boxGeometry args={[16, 0.5, 5]} />{roofMaterial}</mesh>

          {/* Recess Walls (Going UP into the ceiling) */}
          <mesh position={[-8, 0.75, 0]} receiveShadow><boxGeometry args={[0.5, 1.5, 20]} />{trimMaterial}</mesh>
          <mesh position={[8, 0.75, 0]} receiveShadow><boxGeometry args={[0.5, 1.5, 20]} />{trimMaterial}</mesh>
          <mesh position={[0, 0.75, 10]} receiveShadow><boxGeometry args={[16.5, 1.5, 0.5]} />{trimMaterial}</mesh>
          <mesh position={[0, 0.75, -10]} receiveShadow><boxGeometry args={[16.5, 1.5, 0.5]} />{trimMaterial}</mesh>

          {/* Decorative Crown Molding (Inner base of the recess) */}
          <mesh position={[-7.8, 0.2, 0]} receiveShadow><boxGeometry args={[0.2, 0.4, 19.6]} />{trimMaterial}</mesh>
          <mesh position={[7.8, 0.2, 0]} receiveShadow><boxGeometry args={[0.2, 0.4, 19.6]} />{trimMaterial}</mesh>
          <mesh position={[0, 0.2, 9.8]} receiveShadow><boxGeometry args={[15.6, 0.4, 0.2]} />{trimMaterial}</mesh>
          <mesh position={[0, 0.2, -9.8]} receiveShadow><boxGeometry args={[15.6, 0.4, 0.2]} />{trimMaterial}</mesh>

          {/* Glowing Frosted Glass Pane (At the top of the recess) */}
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[16, 0.1, 20]} />
            <meshStandardMaterial 
              color={isNightMode ? "#0a1525" : "#ffffff"} 
              emissive={isNightMode ? "#0f2040" : "#e8f4ff"} 
              emissiveIntensity={isNightMode ? 0.3 : 0.6} 
              roughness={0.2} 
              transparent 
              opacity={0.8} 
            />
          </mesh>
          
          {/* Dense Grid of Skylight Beams */}
          <group position={[0, 1.45, 0]}>
            {/* Horizontal Beams (Z-axis steps) */}
            {Array.from({ length: 11 }).map((_, i) => (
              <mesh key={`h-${i}`} position={[0, 0, 10 - i * 2]} castShadow>
                <boxGeometry args={[16, 0.15, 0.15]} />
                {mullionMaterial}
              </mesh>
            ))}
            {/* Vertical Beams (X-axis steps) */}
            {Array.from({ length: 9 }).map((_, i) => (
              <mesh key={`v-${i}`} position={[8 - i * 2, 0, 0]} castShadow>
                <boxGeometry args={[0.15, 0.15, 20]} />
                {mullionMaterial}
              </mesh>
            ))}
          </group>
        </group>
      ))}
    </group>
  );
}

function WallArt({ position, rotation = [0, Math.PI / 2, 0], exhibit, onSelect }: { position: [number, number, number], rotation?: [number, number, number], exhibit: Exhibit, onSelect: (e: Exhibit) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group 
      position={position} 
      rotation={rotation}
      scale={hovered ? 1.02 : 1}
      onClick={(e) => { e.stopPropagation(); onSelect(exhibit); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Ornate Gold Frame */}
      <mesh position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[7.4, 4.4, 0.1]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Inner Frame Shadow/Matte */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[7.2, 4.2, 0.1]} />
        <meshStandardMaterial color="#eaddcf" />
      </mesh>
      {/* Canvas */}
      <group position={[0, 0, 0.04]}>
        <SafeMaterial url={exhibit.imageUrl!} width={7} height={4} />
      </group>
    </group>
  );
}

function WallDescription({ position, rotation, title, desc }: { position: [number, number, number], rotation: [number, number, number], title: string, desc: string }) {
  return (
    <group position={position} rotation={rotation}>
      <Text position={[0, 0.8, 0]} fontSize={0.8} color="#111" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf" anchorX="center" anchorY="middle" letterSpacing={0.1}>
        {title}
      </Text>
      <Text position={[0, 0, 0]} fontSize={0.25} color="#444" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf" anchorX="center" anchorY="middle" maxWidth={10} textAlign="center">
        {desc}
      </Text>
      {/* Abstract decorative line */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[3, 0.05, 0.1]} />
        <meshStandardMaterial color="#888" />
      </mesh>
    </group>
  );
}

function ExhibitCanvas({ imageUrl, vitalityScale, opacity, isArchived }: { imageUrl: string, vitalityScale: number, opacity: number, isArchived: boolean }) {
  return (
    <group position={[0, 0, 0.06]}>
      <SafeMaterial url={imageUrl} width={2.8 * vitalityScale} height={2.8 * vitalityScale} opacity={opacity} isArchived={isArchived} />
    </group>
  );
}

function DividerWall({ z, label }: { z: number, label: string }) {
  const wallMaterial = <meshStandardMaterial color="#f2efe9" roughness={0.9} />;
  const moldingMaterial = <meshStandardMaterial color="#e0dcd3" roughness={0.9} />;
  return (
    <group position={[0, 0, z]}>
      {/* Left Wall Part */}
      <mesh position={[-14, 4, 0]} receiveShadow castShadow><boxGeometry args={[12, 8, 2]} />{wallMaterial}</mesh>
      {/* Right Wall Part */}
      <mesh position={[14, 4, 0]} receiveShadow castShadow><boxGeometry args={[12, 8, 2]} />{wallMaterial}</mesh>
      {/* Top Header over Door */}
      <mesh position={[0, 7, 0]} receiveShadow castShadow><boxGeometry args={[16, 2, 2]} />{wallMaterial}</mesh>
      
      {/* Classical Arch/Molding framing the doorway */}
      <mesh position={[-8.1, 3.5, 1.05]} receiveShadow><boxGeometry args={[0.2, 7, 0.1]} />{moldingMaterial}</mesh>
      <mesh position={[8.1, 3.5, 1.05]} receiveShadow><boxGeometry args={[0.2, 7, 0.1]} />{moldingMaterial}</mesh>
      <mesh position={[0, 6.1, 1.05]} receiveShadow><boxGeometry args={[16.4, 0.2, 0.1]} />{moldingMaterial}</mesh>

      <mesh position={[-8.1, 3.5, -1.05]} receiveShadow><boxGeometry args={[0.2, 7, 0.1]} />{moldingMaterial}</mesh>
      <mesh position={[8.1, 3.5, -1.05]} receiveShadow><boxGeometry args={[0.2, 7, 0.1]} />{moldingMaterial}</mesh>
      <mesh position={[0, 6.1, -1.05]} receiveShadow><boxGeometry args={[16.4, 0.2, 0.1]} />{moldingMaterial}</mesh>

      {/* Label above door */}
      <RoomLabel position={[0, 6.5, 1.05]} rotation={[0, 0, 0]} text={label} />
      <RoomLabel position={[0, 6.5, -1.05]} rotation={[0, Math.PI, 0]} text={label} />
    </group>
  );
}

function RoomLabel({ position, rotation, text }: { position: [number, number, number], rotation: [number, number, number], text: string }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Elegant Bronze/Gold Plaque instead of plain black */}
      <mesh position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[8, 1.2, 0.05]} />
        <meshStandardMaterial color="#8b6508" roughness={0.3} metalness={0.8} />
      </mesh>
      <Text position={[0, 0, 0.01]} fontSize={0.5} color="#ffffff" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf" anchorX="center" anchorY="middle" letterSpacing={0.2}>
        {text}
      </Text>
    </group>
  );
}

function ExhibitNode({ exhibit, onSelect }: { exhibit: Exhibit, onSelect: (e: Exhibit) => void }) {
  const meshRef = useRef<THREE.Group>(null!);
  const loc = exhibit.control || { x: 0, y: 0, z: 0 };
  
  const isArchived = exhibit.control?.lifecycle === 'ARCHIVED';
  const isCooling = exhibit.control?.lifecycle === 'COOLING';
  const isRevived = exhibit.control?.lifecycle === 'REVIVED';

  const color = isArchived ? '#555555' : isCooling ? '#eab308' : isRevived ? '#3b82f6' : '#22c55e';
  const opacity = isArchived ? 0.3 : 1;
  const floatSpeed = isArchived ? 0 : (isRevived ? 3 : 1.5);
  const vitalityScale = Math.max((exhibit.control?.vitality || 50) / 100, 0.5); // Minimum size 0.5

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  // Face the center of the corridor
  const rotationY = loc.x < 0 ? Math.PI / 2 : -Math.PI / 2;

  return (
    <group position={[loc.x, 0, loc.z]} rotation={[0, rotationY, 0]}>
      {/* Classic Marble Museum Pedestal */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#fdfbf7" roughness={0.2} metalness={0.1} />
      </mesh>
      
      <ContactShadows position={[0, 1.01, 0]} opacity={0.4} scale={2} blur={2} far={2} />

      <Float speed={floatSpeed} rotationIntensity={isArchived ? 0 : 0.1} floatIntensity={isArchived ? 0 : 0.5}>
        <group 
          ref={meshRef}
          position={[0, 1.0 + (1.4 * vitalityScale), 0]} // Perfect calculation: Top of pedestal (1.0) + half canvas height
          scale={hovered ? 1.05 : 1}
          onClick={(e) => { e.stopPropagation(); onSelect(exhibit); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
        >
          {/* Framed Image */}
          {exhibit.imageUrl ? (
            <group>
              {/* Frame Background */}
              <mesh position={[0, 0, -0.05]} castShadow>
                <boxGeometry args={[3 * vitalityScale, 3 * vitalityScale, 0.1]} />
                <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Actual Image */}
              <ExhibitCanvas imageUrl={exhibit.imageUrl} vitalityScale={vitalityScale} opacity={opacity} isArchived={isArchived} />
            </group>
          ) : (
            <mesh castShadow>
              <boxGeometry args={[2, 2, 0.2]} />
              <meshStandardMaterial color={color} transparent opacity={opacity} wireframe={isArchived} />
            </mesh>
          )}
        </group>
      </Float>

      {/* Info Plaque on Pedestal */}
      <mesh position={[0, 0.5, 0.76]} rotation={[-Math.PI / 6, 0, 0]}>
        <planeGeometry args={[1.2, 0.5]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      
      <Text position={[0, 0.6, 0.82]} rotation={[-Math.PI / 6, 0, 0]} fontSize={0.08} color="#fff" anchorX="center" anchorY="middle">
        {exhibit.name}
      </Text>
      <Text position={[0, 0.45, 0.90]} rotation={[-Math.PI / 6, 0, 0]} fontSize={0.05} color={color} anchorX="center" anchorY="middle">
        {`${exhibit.control?.lifecycle || 'ACTIVE'} • ${exhibit.control?.vitality || 0}%`}
      </Text>
    </group>
  );
}
