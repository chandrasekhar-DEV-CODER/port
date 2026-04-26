import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, Float } from "@react-three/drei";

import CanvasLoader from "../Loader";
import LazyCanvas from "./LazyCanvas";

const Rings = () => {
    return (
        <Float speed={2} rotationIntensity={3} floatIntensity={1.5}>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
                <ringGeometry args={[2, 2.2, 64]} />
                <meshBasicMaterial color="#00f6ff" side={2} transparent opacity={0.8} />
            </mesh>
            <mesh rotation={[0, Math.PI / 4, 0]}>
                <ringGeometry args={[3, 3.2, 64]} />
                <meshBasicMaterial color="#915eff" side={2} transparent opacity={0.5} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 4]}>
                <ringGeometry args={[4, 4.2, 64]} />
                <meshBasicMaterial color="#10b981" side={2} transparent opacity={0.3} />
            </mesh>
        </Float>
    );
};

const RingsCanvas = () => {
    return (
        <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
            <LazyCanvas>
                <Canvas
                    shadows
                    frameloop="always"
                    dpr={[1, 2]}
                    gl={{ preserveDrawingBuffer: true, alpha: true }}
                    camera={{ position: [0, 0, 8], fov: 45 }}
                >
                    <Suspense fallback={<CanvasLoader />}>
                        <ambientLight intensity={0.5} />
                        <Rings />
                        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2.5} />
                    </Suspense>
                    <Preload all />
                </Canvas>
            </LazyCanvas>
        </div>
    );
};

export default RingsCanvas;
