'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function Globe() {
    const groupRef = useRef<THREE.Group>(null);

    // Create random points on sphere surface for nodes
    const particlesPosition = useMemo(() => {
        const count = 500;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = 2.05; // Slightly larger than the sphere radius

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.05;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[0, -0.5, 0]}>
            {/* Dark inner sphere representing earth/network */}
            <Sphere args={[2, 64, 64]}>
                <meshStandardMaterial
                    color="#050508"
                    roughness={0.7}
                    metalness={0.3}
                    wireframe={true}
                    transparent
                    opacity={0.15}
                />
            </Sphere>
            <Sphere args={[1.98, 64, 64]}>
                <meshStandardMaterial
                    color="#020205"
                    roughness={0.9}
                />
            </Sphere>

            {/* Glowing nodes (Patients and Donors) */}
            <Points positions={particlesPosition}>
                <PointMaterial
                    transparent
                    color="#FF2E63"
                    size={0.03}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            {/* Secondary Nodes */}
            <Points positions={particlesPosition} rotation={[0, Math.PI / 4, 0]}>
                <PointMaterial
                    transparent
                    color="#08D9D6"
                    size={0.015}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}
