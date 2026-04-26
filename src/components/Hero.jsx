import { motion } from "framer-motion";

import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";

import React, { useState, useEffect } from "react";
import AdminEditorModal from "./AdminEditorModal";

const Hero = () => {
  const [globalData, setGlobalData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('adminToken'));
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('/api/portfolio?type=global')
      .then(res => res.json())
      .then(data => setGlobalData(data))
      .catch(err => console.error(err));
  };
  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <div
        className={`absolute inset-0 top-[120px]  max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        <div>
          {isAdmin && (
            <button onClick={() => setEditorOpen(true)} className="relative bg-[#915eff] border border-secondary px-3 py-1 rounded-full text-white font-bold hover:scale-110 shadow-xl z-[60] text-xs mb-2 block">
              Edit Intro
            </button>
          )}
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className='text-[#915EFF]'>{globalData === null ? "\u00A0" : (globalData.heroName || "Adrian")}</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            {globalData === null ? "\u00A0" : (globalData.heroDescription || "I develop 3D visuals, user interfaces and web applications")}
          </p>
        </div>
      </div>

      {editorOpen && <AdminEditorModal type="global" initialData={globalData} onClose={(changed) => { setEditorOpen(false); if (changed === true) fetchData(); }} />}

      <ComputersCanvas />

      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href='#about'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
