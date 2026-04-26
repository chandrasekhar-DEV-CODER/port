import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, Float } from "@react-three/drei";

import CanvasLoader from "../Loader";
import LazyCanvas from "./LazyCanvas";

const Donut = () => {
    return (
        <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
            <mesh scale={0.7}>
                <torusGeometry args={[3, 1, 16, 100]} />
                <meshStandardMaterial color="#f87171" wireframe transparent opacity={0.3} />
            </mesh>
            <mesh scale={0.65}>
                <torusGeometry args={[3, 1, 16, 100]} />
                <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.15} />
            </mesh>
        </Float>
    );
};

const DonutCanvas = () => {
    return (
        <div className="absolute inset-0 z-[-1] pointer-events-none">
            <LazyCanvas>
                <Canvas
                    shadows
                    frameloop="always"
                    dpr={[1, 2]}
                    gl={{ preserveDrawingBuffer: true, alpha: true }}
                    camera={{ position: [0, 0, 10], fov: 45 }}
                >
                    <Suspense fallback={<CanvasLoader />}>
                        <ambientLight intensity={0.3} />
                        <directionalLight position={[-5, 5, 5]} intensity={0.8} />
                        <Donut />
                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            autoRotate
                            autoRotateSpeed={0.8}
                            maxPolarAngle={Math.PI / 2}
                            minPolarAngle={Math.PI / 2}
                        />
                    </Suspense>
                    <Preload all />
                </Canvas>
            </LazyCanvas>
        </div>
    );
};

export default DonutCanvas;
