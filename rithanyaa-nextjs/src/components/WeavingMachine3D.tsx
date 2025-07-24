'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { Suspense } from 'react'

function WeavingMachineModel() {
  const obj = useLoader(OBJLoader, '/models/weaving_color.obj')
  
  return (
    <primitive 
      object={obj} 
      scale={[2.5, 2.5, 2.5]} 
      position={[0, -1, 0]} 
    />
  )
}

function Loader() {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="text-gray-600">Loading 3D Model...</div>
    </div>
  )
}

export default function WeavingMachine3D() {
  return (
    <div className="w-full h-[50vh] mb-8">
      <Canvas
        camera={{ position: [4, 4, 4], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <WeavingMachineModel />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

