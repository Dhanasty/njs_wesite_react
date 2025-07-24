'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function WeavingMachineModel() {
  const meshRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/weaving_machine.glb')
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      <primitive object={scene} scale={[1, 1, 1]} position={[0, -1, 0]} />
    </group>
  )
}

function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )
}

export default function WeavingMachine() {
  return (
    <div className="w-full h-96 relative">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 60 }}
        gl={{ antialias: true }}
        shadows
      >
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <WeavingMachineModel />
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      <Suspense fallback={<Loader />}>
        <div className="sr-only">3D Weaving Machine Model</div>
      </Suspense>
    </div>
  )
}