import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useTexture, 
  Environment, 
  PerspectiveCamera, 
  useGLTF, 
  Bounds, 
  ContactShadows, 
  SpotLight,
  useHelper,
  AccumulativeShadows,
  RandomizedLight,
  BakeShadows,
  Stage,
  View
} from '@react-three/drei';
import * as THREE from 'three';

interface MarbleVisualizer3DProps {
  marbleTexture?: string;
  compareTexture?: string;
  roomType: 'kitchen' | 'livingroom' | 'bathroom' | 'stairs';
  surfaceType: 'counter' | 'floor' | 'wall' | 'cabinet';
  viewAngle?: 'front' | 'side' | 'top';
  splitView?: boolean;
  splitPosition?: number;
}

// Loading component
const LoadingFallback = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

const useDefaultTexture = () => {
  const texture = new THREE.TextureLoader().load('/images/marble2.jpg');
  texture.flipY = false;
  texture.premultiplyAlpha = false;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
};

// Enhanced material properties for more realistic rendering
const createMarbleMaterial = (marbleMap: THREE.Texture, surfaceType: string = 'counter') => {
  const properties = {
    counter: { 
      roughness: 0.2, 
      metalness: 0.1, 
      envMapIntensity: 1.8,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      normalScale: new THREE.Vector2(0.5, 0.5),
      aoMapIntensity: 1.0,
      displacementScale: 0.05
    },
    floor: { 
      roughness: 0.4, 
      metalness: 0.05, 
      envMapIntensity: 1.2,
      clearcoat: 0.1,
      clearcoatRoughness: 0.3
    },
    wall: { 
      roughness: 0.5, 
      metalness: 0.0, 
      envMapIntensity: 1.0
    },
    cabinet: { 
      roughness: 0.3, 
      metalness: 0.2, 
      envMapIntensity: 1.5,
      clearcoat: 0.2,
      clearcoatRoughness: 0.1
    }
  };

  const props = properties[surfaceType as keyof typeof properties] || properties.counter;

  return new THREE.MeshPhysicalMaterial({
    map: marbleMap,
    ...props,
    side: THREE.DoubleSide
  });
};

// Split view implementation
const SplitViewPlane: React.FC<{ position: number }> = ({ position }) => {
  return (
    <mesh position={[position, 0, 0]}>
      <planeGeometry args={[0.02, 10, 10]} />
      <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
    </mesh>
  );
};

// Camera presets for different view angles
const getCameraPosition = (viewAngle: string, roomType: string) => {
  const positions = {
    front: {
      kitchen: [0, 1.5, 4],
      livingroom: [0, 1.5, 5],
      bathroom: [0, 1.5, 4],
      stairs: [0, 2, 4]
    },
    side: {
      kitchen: [4, 1.5, 0],
      livingroom: [5, 1.5, 0],
      bathroom: [4, 1.5, 0],
      stairs: [4, 2, 0]
    },
    top: {
      kitchen: [0, 4, 0],
      livingroom: [0, 5, 0],
      bathroom: [0, 4, 0],
      stairs: [0, 5, 0]
    }
  };

  return positions[viewAngle as keyof typeof positions][roomType as keyof typeof positions.front] || [3, 2, 3];
};

// Model Components wrapped with memo to prevent unnecessary rerenders
const KitchenModel = React.memo<{ marbleTexture?: string; surfaceType: string }>(({ marbleTexture, surfaceType }) => {
  const defaultTexture = useDefaultTexture();
  const marbleMap = marbleTexture ? useTexture(marbleTexture) : defaultTexture;

  return (
    <group position={[0, 0, 0]}>
      {/* Counter Top */}
      {surfaceType === 'counter' && (
        <mesh receiveShadow castShadow position={[0, 0.9, 0]}>
          <boxGeometry args={[3, 0.05, 0.8]} />
          <primitive object={createMarbleMaterial(marbleMap, 'counter')} attach="material" />
        </mesh>
      )}

      {/* Floor */}
      {surfaceType === 'floor' && (
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[6, 6, 32, 32]} />
          <primitive object={createMarbleMaterial(marbleMap, 'floor')} attach="material" />
        </mesh>
      )}

      {/* Wall */}
      {surfaceType === 'wall' && (
        <mesh receiveShadow position={[0, 1.4, -0.4]}>
          <planeGeometry args={[3, 2]} />
          <primitive object={createMarbleMaterial(marbleMap, 'wall')} attach="material" />
        </mesh>
      )}

      {/* Cabinets */}
      {surfaceType === 'cabinet' && (
        <>
          <mesh receiveShadow castShadow position={[0, 0.45, 0]}>
            <boxGeometry args={[3, 0.9, 0.8]} />
            <primitive object={createMarbleMaterial(marbleMap, 'cabinet')} attach="material" />
          </mesh>
          {[-1.6, 1.6].map((x) => (
            <group key={x} position={[x, 0.3, -0.35]}>
              <mesh receiveShadow castShadow>
                <boxGeometry args={[0.2, 0.6, 0.3]} />
                <primitive object={createMarbleMaterial(marbleMap, 'cabinet')} attach="material" />
              </mesh>
              <mesh position={[0, 0, 0.15]} castShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
                <meshStandardMaterial color="#95a5a6" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </>
      )}

      {/* Default furniture elements */}
      <group>
        {surfaceType !== 'cabinet' && (
          <mesh receiveShadow castShadow position={[0, 0.45, 0]}>
            <boxGeometry args={[3, 0.9, 0.8]} />
            <meshStandardMaterial color="#2c3e50" roughness={0.7} metalness={0.1} />
          </mesh>
        )}
        {surfaceType !== 'wall' && (
          <mesh receiveShadow position={[0, 1.4, -0.4]}>
            <planeGeometry args={[3, 2]} />
            <meshStandardMaterial color="#f5f6fa" roughness={0.9} />
          </mesh>
        )}
        {surfaceType !== 'floor' && (
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[6, 6]} />
            <meshStandardMaterial color="#e4e4e4" roughness={0.4} />
          </mesh>
        )}
      </group>
    </group>
  );
});

const LivingRoomModel = React.memo<{ marbleTexture?: string; surfaceType: string }>(({ marbleTexture, surfaceType }) => {
  const defaultTexture = useDefaultTexture();
  const marbleMap = marbleTexture ? useTexture(marbleTexture) : defaultTexture;

  return (
    <group position={[0, 0, 0]}>
      {/* Floor */}
      {surfaceType === 'floor' && (
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[6, 6, 32, 32]} />
          <primitive object={createMarbleMaterial(marbleMap, 'floor')} attach="material" />
        </mesh>
      )}

      {/* Walls */}
      {surfaceType === 'wall' && (
        <group>
          <mesh receiveShadow position={[0, 1.5, -3]}>
            <planeGeometry args={[6, 3, 16, 16]} />
            <primitive object={createMarbleMaterial(marbleMap, 'wall')} attach="material" />
          </mesh>
          <mesh receiveShadow position={[-3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[6, 3, 16, 16]} />
            <primitive object={createMarbleMaterial(marbleMap, 'wall')} attach="material" />
          </mesh>
        </group>
      )}

      {/* Default Elements */}
      <group>
        {surfaceType !== 'floor' && (
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[6, 6]} />
            <meshStandardMaterial color="#e4e4e4" roughness={0.4} />
          </mesh>
        )}
        {surfaceType !== 'wall' && (
          <group>
            <mesh receiveShadow position={[0, 1.5, -3]}>
              <planeGeometry args={[6, 3]} />
              <meshStandardMaterial color="#f5f6fa" roughness={0.9} />
            </mesh>
            <mesh receiveShadow position={[-3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[6, 3]} />
              <meshStandardMaterial color="#f5f6fa" roughness={0.9} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
});

const BathroomModel = React.memo<{ marbleTexture?: string; surfaceType: string }>(({ marbleTexture, surfaceType }) => {
  const defaultTexture = useDefaultTexture();
  const marbleMap = marbleTexture ? useTexture(marbleTexture) : defaultTexture;

  return (
    <group position={[0, 0, 0]}>
      {/* Floor */}
      {surfaceType === 'floor' && (
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 4, 32, 32]} />
          <primitive object={createMarbleMaterial(marbleMap, 'floor')} attach="material" />
        </mesh>
      )}

      {/* Walls */}
      {surfaceType === 'wall' && (
        <group>
          <mesh receiveShadow position={[0, 2, -2]}>
            <planeGeometry args={[4, 4, 16, 16]} />
            <primitive object={createMarbleMaterial(marbleMap, 'wall')} attach="material" />
          </mesh>
          <mesh receiveShadow position={[-2, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[4, 4, 16, 16]} />
            <primitive object={createMarbleMaterial(marbleMap, 'wall')} attach="material" />
          </mesh>
        </group>
      )}

      {/* Counter */}
      {surfaceType === 'counter' && (
        <group position={[0, 0.8, -1.8]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 0.1, 0.6]} />
            <primitive object={createMarbleMaterial(marbleMap, 'counter')} attach="material" />
          </mesh>
        </group>
      )}

      {/* Default Elements */}
      <group>
        {surfaceType !== 'floor' && (
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 4]} />
            <meshStandardMaterial color="#e4e4e4" roughness={0.4} />
          </mesh>
        )}
        {surfaceType !== 'wall' && (
          <group>
            <mesh receiveShadow position={[0, 2, -2]}>
              <planeGeometry args={[4, 4]} />
              <meshStandardMaterial color="#f5f6fa" roughness={0.9} />
            </mesh>
            <mesh receiveShadow position={[-2, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[4, 4]} />
              <meshStandardMaterial color="#f5f6fa" roughness={0.9} />
            </mesh>
          </group>
        )}
        {surfaceType !== 'counter' && (
          <group position={[0, 0.8, -1.8]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2, 0.1, 0.6]} />
              <meshStandardMaterial color="#34495e" roughness={0.7} metalness={0.1} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
});

const StairsModel = React.memo<{ marbleTexture?: string; surfaceType: string }>(({ marbleTexture, surfaceType }) => {
  const defaultTexture = useDefaultTexture();
  const marbleMap = marbleTexture ? useTexture(marbleTexture) : defaultTexture;

  return (
    <group position={[-1, 0, 1]}>
      {/* Marble Stairs */}
      {(surfaceType === 'floor' || surfaceType === 'counter') && (
        <>
          {[...Array(10)].map((_, index) => (
            <group key={index} position={[index * 0.3, index * 0.2, -index * 0.4]}>
              {/* Step */}
              <mesh receiveShadow castShadow>
                <boxGeometry args={[1.5, 0.1, 0.4]} />
                <primitive object={createMarbleMaterial(marbleMap, surfaceType)} attach="material" />
              </mesh>
              {/* Riser */}
              <mesh receiveShadow castShadow position={[0, -0.1, 0.2]}>
                <boxGeometry args={[1.5, 0.2, 0.02]} />
                <primitive object={createMarbleMaterial(marbleMap, surfaceType)} attach="material" />
              </mesh>
            </group>
          ))}
        </>
      )}

      {/* Wall */}
      {surfaceType === 'wall' && (
        <mesh receiveShadow position={[-0.5, 2, -2]}>
          <planeGeometry args={[4, 4, 16, 16]} />
          <primitive object={createMarbleMaterial(marbleMap, 'wall')} attach="material" />
        </mesh>
      )}

      {/* Default Elements */}
      <group>
        {surfaceType !== 'wall' && (
          <mesh receiveShadow position={[-0.5, 2, -2]}>
            <planeGeometry args={[4, 4]} />
            <meshStandardMaterial color="#f5f6fa" roughness={0.9} />
          </mesh>
        )}
        {surfaceType !== 'floor' && surfaceType !== 'counter' && (
          <>
            {[...Array(10)].map((_, index) => (
              <group key={index} position={[index * 0.3, index * 0.2, -index * 0.4]}>
                <mesh receiveShadow castShadow>
                  <boxGeometry args={[1.5, 0.1, 0.4]} />
                  <meshStandardMaterial color="#e4e4e4" roughness={0.4} />
                </mesh>
                <mesh receiveShadow castShadow position={[0, -0.1, 0.2]}>
                  <boxGeometry args={[1.5, 0.2, 0.02]} />
                  <meshStandardMaterial color="#e4e4e4" roughness={0.4} />
                </mesh>
              </group>
            ))}
          </>
        )}
      </group>

      {/* Handrail */}
      <group position={[0.8, 0, 0]}>
        {[...Array(10)].map((_, index) => (
          <group key={`rail-${index}`}>
            <mesh position={[0, index * 0.2 + 0.5, -index * 0.4]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.4]} />
              <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, index * 0.2 + 0.7, -index * 0.4]} castShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 0.3]} />
              <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
});

const SceneLighting = React.memo(() => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <SpotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <SpotLight
        position={[-10, 10, -10]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <AccumulativeShadows temporal frames={100} scale={10}>
        <RandomizedLight
          amount={8}
          radius={4}
          position={[5, 5, -10]}
          bias={0.001}
        />
      </AccumulativeShadows>
      <BakeShadows />
    </>
  );
});

const Scene: React.FC<{ 
  roomType: string; 
  marbleTexture?: string; 
  compareTexture?: string;
  surfaceType: string;
  splitView?: boolean;
  splitPosition?: number;
}> = ({ 
  roomType, 
  marbleTexture, 
  compareTexture,
  surfaceType,
  splitView,
  splitPosition = 0 
}) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Stage
        intensity={0.5}
        shadows="accumulative"
        adjustCamera={false}
        environment="apartment"
      >
        <Bounds fit clip observe damping={6} margin={1.2}>
          {/* Left side / Main view */}
          <group position={splitView ? [-splitPosition, 0, 0] : [0, 0, 0]}>
            {roomType === 'kitchen' && <KitchenModel marbleTexture={marbleTexture} surfaceType={surfaceType} />}
            {roomType === 'livingroom' && <LivingRoomModel marbleTexture={marbleTexture} surfaceType={surfaceType} />}
            {roomType === 'bathroom' && <BathroomModel marbleTexture={marbleTexture} surfaceType={surfaceType} />}
            {roomType === 'stairs' && <StairsModel marbleTexture={marbleTexture} surfaceType={surfaceType} />}
          </group>

          {/* Right side comparison view */}
          {splitView && compareTexture && (
            <group position={[splitPosition, 0, 0]}>
              {roomType === 'kitchen' && <KitchenModel marbleTexture={compareTexture} surfaceType={surfaceType} />}
              {roomType === 'livingroom' && <LivingRoomModel marbleTexture={compareTexture} surfaceType={surfaceType} />}
              {roomType === 'bathroom' && <BathroomModel marbleTexture={compareTexture} surfaceType={surfaceType} />}
              {roomType === 'stairs' && <StairsModel marbleTexture={compareTexture} surfaceType={surfaceType} />}
            </group>
          )}

          {splitView && <SplitViewPlane position={0} />}
        </Bounds>
      </Stage>
      <SceneLighting />
    </Suspense>
  );
};

const MarbleVisualizer3D: React.FC<MarbleVisualizer3DProps> = ({ 
  marbleTexture, 
  compareTexture,
  roomType, 
  surfaceType,
  viewAngle = 'front',
  splitView = false,
  splitPosition = 0
}) => {
  const cameraPosition = getCameraPosition(viewAngle, roomType);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden">
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 45 }}
        gl={{ 
          antialias: true,
          preserveDrawingBuffer: true,
          outputEncoding: THREE.sRGBEncoding,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >
        <color attach="background" args={['#f8f9fa']} />
        <Scene 
          roomType={roomType} 
          marbleTexture={marbleTexture} 
          compareTexture={compareTexture}
          surfaceType={surfaceType}
          splitView={splitView}
          splitPosition={splitPosition}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={2}
          maxDistance={10}
          target={[0, 0.5, 0]}
        />
      </Canvas>
    </div>
  );
};

export default MarbleVisualizer3D; 