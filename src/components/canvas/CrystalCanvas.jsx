import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, Float } from "@react-three/drei";

import CanvasLoader from "../Loader";
import LazyCanvas from "./LazyCanvas";

const Crystal = () => {
    return (
        <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
            <mesh scale={2.5}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#915EFF" flatShading />
                <meshBasicMaterial color="#ffffff" wireframe />
            </mesh>
        </Float>
    );
};

const CrystalCanvas = () => {
    return (
        <div className="absolute inset-0 z-[-1] pointer-events-none">
            <LazyCanvas>
                <Canvas
                    shadows
                    frameloop="always"
                    dpr={[1, 2]}
                    gl={{ preserveDrawingBuffer: true, alpha: true }}
                    camera={{ position: [0, 0, 7], fov: 45 }}
                >
                    <Suspense fallback={<CanvasLoader />}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <Crystal />
                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            autoRotate
                            autoRotateSpeed={1.5}
                        />
                    </Suspense>
                    <Preload all />
                </Canvas>
            </LazyCanvas>
        </div>
    );
};

export default CrystalCanvas;
