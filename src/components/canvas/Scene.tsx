'use client';

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';

export default function Scene({ children }: { children?: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <directionalLight position={[-10, -10, -5]} intensity={1} color="#08D9D6" />
                <directionalLight position={[0, 10, 0]} intensity={0.5} color="#FF2E63" />
                {children}
                <Preload all />
            </Canvas>
        </div>
    );
}
