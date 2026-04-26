import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import AdminEditorModal from "./AdminEditorModal";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  isAdmin,
  onEdit,
  onDelete
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)} className="relative">
      {isAdmin && (
        <div className="absolute -top-3 -right-3 flex gap-2 z-[60]">
          <button onClick={onEdit} className="bg-[#100d25] border border-secondary px-3 py-1 rounded-full text-white font-bold hover:scale-110 active:scale-95 transition-all text-xs shadow-xl">Edit</button>
          <button onClick={onDelete} className="bg-red-500 px-3 py-1 border border-red-700 rounded-full text-white font-bold hover:scale-110 active:scale-95 transition-all text-xs shadow-xl">Del</button>
        </div>
      )}
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={image}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
            >
              <img
                src={github}
                alt='source code'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
          </div>
        </div>

        <div className='mt-5'>
          <h3 className='text-white font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags && tags.map((tag) => (
            <p
              key={`${name}-${tag?.name || tag}`}
              className={`text-[14px] ${tag?.color || ''}`}
            >
              #{tag?.name || tag}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  const [dataList, setDataList] = React.useState(projects);
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
    fetch('/api/portfolio?type=projects')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setDataList(data);
      })
      .catch(err => console.error("Failed fetching dynamic projects: ", err));

    fetch('/api/portfolio?type=global')
      .then(res => res.json())
      .then(data => setGlobalData(data))
      .catch(err => console.error("Failed fetching global context: ", err));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`/api/portfolio?type=projects&id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
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
          <p className={`${styles.sectionSubText} `}>{globalData === null ? "\u00A0" : (globalData.worksIntro || "My work")}</p>
          <h2 className={`${styles.sectionHeadText} flex items-center gap-4`}>
            Projects.
            {isAdmin && <button onClick={() => { setEditingItem(null); setEditorOpen(true); }} className="text-sm bg-tertiary px-4 py-2 rounded-xl text-white font-medium border border-secondary shadow-card hover:bg-black transition-all">+ Add New</button>}
          </h2>
        </motion.div>

        <div className='w-full flex'>
          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
          >
            {globalData === null ? "\u00A0" : (globalData.worksText || "Following projects showcases my skills and experience through real-world examples of my work. Each project is briefly described with links to code repositories and live demos in it. It reflects my ability to solve complex problems, work with different technologies, and manage projects effectively.")}
          </motion.p>
        </div>
      </div>

      <div className='mt-20 flex flex-wrap gap-7 relative'>
        {dataList.map((project, index) => (
          <ProjectCard
            key={`project-${index}`}
            index={index}
            {...project}
            isAdmin={isAdmin}
            onEdit={() => { setEditingItem(project); setEditorOpen(true); }}
            onDelete={() => handleDelete(project._id)}
          />
        ))}
      </div>

      {editorOpen && <AdminEditorModal type="projects" initialData={editingItem} onClose={(changed) => { setEditorOpen(false); if (changed === true) fetchData(); }} />}
      {globalEditorOpen && <AdminEditorModal type="global" initialData={globalData} onClose={(changed) => { setGlobalEditorOpen(false); if (changed === true) fetchData(); }} />}
    </>
  );
};

export default SectionWrapper(Works, "");
