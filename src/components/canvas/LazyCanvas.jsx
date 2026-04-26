import React, { useRef, useState, useEffect } from "react";

const LazyCanvas = ({ children }) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            { rootMargin: "600px" } // Pre-load smoothly while scrolling
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="w-full h-full">
            {inView ? children : null}
        </div>
    );
};

export default LazyCanvas;
