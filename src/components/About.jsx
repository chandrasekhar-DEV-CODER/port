import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import AdminEditorModal from "./AdminEditorModal";

const ServiceCard = ({ index, title, icon, isAdmin, onEdit, onDelete }) => (
  <Tilt className='xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card relative'
    >
      {isAdmin && (
        <div className="absolute -top-3 -right-3 flex gap-2 z-[60]">
          <button onClick={onEdit} className="bg-[#100d25] border border-secondary px-3 py-1 rounded-full text-white font-bold hover:scale-110 transition-all text-xs shadow-xl">Edit</button>
          <button onClick={onDelete} className="bg-red-500 px-3 py-1 border border-red-700 rounded-full text-white font-bold hover:scale-110 transition-all text-xs shadow-xl">Del</button>
        </div>
      )}
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <img
          src={icon}
          alt='web-development'
          className='w-16 h-16 object-contain'
        />

        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  const [dataList, setDataList] = React.useState(services);
  const [globalData, setGlobalData] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [globalEditorOpen, setGlobalEditorOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);

  React.useEffect(() => {
    setIsAdmin(!!localStorage.getItem('adminToken'));
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('/api/portfolio?type=services')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setDataList(data);
      })
      .catch(err => console.error("Failed fetching dynamic services: ", err));

    fetch('/api/portfolio?type=global')
      .then(res => res.json())
      .then(data => setGlobalData(data))
      .catch(err => console.error("Failed fetching global context: ", err));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`/api/portfolio?type=services&id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <div className="relative z-10 pointer-events-auto">
        {isAdmin && (
          <button onClick={() => setGlobalEditorOpen(true)} className="absolute -top-10 left-0 bg-[#915eff] border border-secondary px-3 py-1 rounded-full text-white font-bold hover:scale-110 shadow-xl z-[60] text-xs">
            Edit Intro
          </button>
        )}
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>{globalData === null ? "\u00A0" : (globalData.aboutIntro || "Introduction")}</p>
          <h2 className={`${styles.sectionHeadText} flex items-center gap-4`}>
            Overview.
            {isAdmin && <button onClick={() => { setEditingItem(null); setEditorOpen(true); }} className="text-sm bg-tertiary px-4 py-2 rounded-xl text-white font-medium border border-secondary shadow-card hover:bg-black transition-all">+ Add New</button>}
          </h2>
        </motion.div>

        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          {globalData === null ? "\u00A0" : (globalData.aboutText || "I'm a skilled software developer with experience in TypeScript and JavaScript, and expertise in frameworks like React, Node.js, and Three.js. I'm a quick learner and collaborate closely with clients to create efficient, scalable, and user-friendly solutions that solve real-world problems. Let's work together to bring your ideas to life!")}
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-10 relative'>
        {dataList.map((service, index) => (
          <ServiceCard
            key={service.title || index}
            index={index}
            {...service}
            isAdmin={isAdmin}
            onEdit={() => { setEditingItem(service); setEditorOpen(true); }}
            onDelete={() => handleDelete(service._id)}
          />
        ))}
      </div>

      {editorOpen && <AdminEditorModal type="services" initialData={editingItem} onClose={(changed) => { setEditorOpen(false); if (changed === true) fetchData(); }} />}
      {globalEditorOpen && <AdminEditorModal type="global" initialData={globalData} onClose={(changed) => { setGlobalEditorOpen(false); if (changed === true) fetchData(); }} />}
    </>
  );
};

export default SectionWrapper(About, "about");
