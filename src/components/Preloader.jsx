import React, { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";

const Preloader = () => {
    const { active, progress } = useProgress();
    const [visible, setVisible] = useState(true);
    const [opacity, setOpacity] = useState(100);

    const name = "CHANDRASEKHAR";
    // Map 0-100 progress securely to 0-13 letter string (max bounded by name.length)
    let letterCount = Math.floor((progress / 100) * name.length);
    if (progress === 100) letterCount = name.length;
    const displayedText = name.substring(0, letterCount);

    useEffect(() => {
        // When progress hits 100% and loading goes inactive, trigger the fadeout sequence
        if (!active && progress === 100) {
            const opacityTimeout = setTimeout(() => {
                setOpacity(0);
            }, 500); // Wait half a second at 100% before fading

            const visibleTimeout = setTimeout(() => {
                setVisible(false);
            }, 1500); // Fully unmount after 1 second of fading

            return () => {
                clearTimeout(opacityTimeout);
                clearTimeout(visibleTimeout);
            };
        }
    }, [active, progress]);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[200] bg-[#050816] flex flex-col justify-center items-center transition-opacity duration-1000`}
            style={{ opacity: opacity / 100 }}
        >
            <h1 className="text-white text-4xl md:text-7xl font-black tracking-widest h-20 flex items-center justify-center">
                {displayedText}<span className="animate-pulse text-[#915eff]">|</span>
            </h1>

            <div className="w-64 h-2 bg-[#100d25] rounded-full mt-8 overflow-hidden shadow-card">
                <div
                    className="h-full bg-gradient-to-r from-purple-600 to-[#915eff] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <p className="text-secondary mt-4 font-bold tracking-widest text-sm">
                SYSTEM BOOT ... {progress.toFixed(0)}%
            </p>
        </div>
    );
};

export default Preloader;
