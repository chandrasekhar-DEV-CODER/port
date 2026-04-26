import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Tilt from "react-tilt";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { socialLinks as defaultLinks } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import AdminEditorModal from "./AdminEditorModal";

const SocialLinkCard = ({ 
  index, platform, url, icon, color, isAdmin, onEdit, onDelete 
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.3, 0.75)} className="relative w-full">
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 z-[60]">
          <button 
            onClick={onEdit}
            className="bg-[#100d25] border border-secondary px-2 py-1 rounded-full text-white font-bold hover:scale-110 active:scale-95 transition-all text-xs shadow-lg"
          >
            Edit
          </button>
          <button 
            onClick={onDelete}
            className="bg-red-500 px-2 py-1 border border-red-700 rounded-full text-white font-bold hover:scale-110 active:scale-95 transition-all text-xs shadow-lg"
          >
            ✕
          </button>
        </div>
      )}
      
      <Tilt
        options={{
          max: 45,
          scale: 1.05,
          speed: 450,
        }}
        className="w-full"
      >
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`
            relative group
            bg-gradient-to-br from-[#1a1a3e] to-[#0f0f2e]
            p-6 rounded-2xl
            border border-[#915eff]/30 hover:border-[#915eff]
            shadow-lg hover:shadow-[0_0_30px_rgba(145,94,255,0.3)]
            transition-all duration-300
            flex flex-col items-center justify-center
            min-h-[200px]
            overflow-hidden
          `}
        >
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#915eff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            {/* Icon with 3D effect */}
            <div className="relative">
              <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
              {/* Glow effect */}
              <div className={`
                absolute inset-0 blur-lg opacity-0 group-hover:opacity-100 
                transition-opacity duration-300
                ${color}
              `} />
            </div>
            
            {/* Platform Name */}
            <div>
              <h3 className="text-white font-bold text-[18px] group-hover:text-[#915eff] transition-colors">
                {platform}
              </h3>
              <p className="text-secondary text-sm mt-1">Connect with me</p>
            </div>
            
            {/* Hover Action */}
            <button className="mt-2 px-4 py-2 bg-[#915eff]/20 hover:bg-[#915eff] text-white rounded-full text-sm font-medium transition-all duration-300 group-hover:shadow-lg">
              Visit Profile
            </button>
          </div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#915eff] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </a>
      </Tilt>
    </motion.div>
  );
};

const SocialLinks = () => {
  const [dataList, setDataList] = useState(defaultLinks);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('adminToken'));
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('/api/portfolio?type=socialLinks')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setDataList(data);
      })
      .catch(err => console.error("Failed fetching social links: ", err));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this social link?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`/api/portfolio?type=socialLinks&id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative z-0">
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText}`}>Connect & Collaborate</p>
        <h2 className={`${styles.sectionHeadText} flex items-center gap-4`}>
          Social Links.
          {isAdmin && (
            <button 
              onClick={() => { 
                setEditingItem(null); 
                setEditorOpen(true); 
              }}
              className="text-sm bg-tertiary px-4 py-2 rounded-xl text-white font-medium border border-secondary hover:bg-[#915eff] transition-all"
            >
              + Add
            </button>
          )}
        </h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Find me on multiple coding platforms and social networks. Connect, collaborate, or just say hello!
        </motion.p>
      </div>

      {/* Responsive Grid */}
      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative'>
        {dataList.map((link, index) => (
          <SocialLinkCard
            key={`social-${link._id || index}`}
            index={index}
            {...link}
            isAdmin={isAdmin}
            onEdit={() => { 
              setEditingItem(link); 
              setEditorOpen(true); 
            }}
            onDelete={() => handleDelete(link._id)}
          />
        ))}
      </div>

      {editorOpen && (
        <AdminEditorModal 
          type="socialLinks" 
          initialData={editingItem} 
          onClose={(changed) => { 
            setEditorOpen(false); 
            if (changed === true) fetchData(); 
          }} 
        />
      )}
    </div>
  );
};

export default SectionWrapper(SocialLinks, "socialLinks");
