import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import AdminEditorModal from "./AdminEditorModal";

const ExperienceCard = ({ experience, isAdmin, onEdit, onDelete }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className='flex justify-center items-center w-full h-full'>
          <img
            src={experience.icon}
            alt={experience.company_name}
            className='w-[60%] h-[60%] object-contain'
          />
        </div>
      }
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 z-[60]">
          <button onClick={onEdit} className="bg-[#100d25] border border-secondary px-3 py-1 rounded-full text-white font-bold hover:scale-110 transition-all text-xs shadow-xl">Edit</button>
          <button onClick={onDelete} className="bg-red-500 px-3 py-1 border border-red-700 rounded-full text-white font-bold hover:scale-110 transition-all text-xs shadow-xl">Del</button>
        </div>
      )}
      <div>
        <h3 className='text-white text-[24px] font-bold'>{experience.title}</h3>
        <p
          className='text-secondary text-[16px] font-semibold'
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>

      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className='text-white-100 text-[14px] pl-1 tracking-wider'
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const [dataList, setDataList] = React.useState(experiences);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);

  React.useEffect(() => {
    setIsAdmin(!!localStorage.getItem('adminToken'));
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('/api/portfolio?type=experiences')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setDataList(data);
      })
      .catch(err => console.error("Failed fetching dynamic experiences: ", err));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`/api/portfolio?type=experiences&id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          What I have done so far
        </p>
        <h2 className={`${styles.sectionHeadText} text-center flex items-center justify-center gap-4`}>
          Work Experience.
          {isAdmin && <button onClick={() => { setEditingItem(null); setEditorOpen(true); }} className="text-sm bg-tertiary px-4 py-2 rounded-xl text-white font-medium border border-secondary shadow-card hover:bg-black transition-all">+ Add New</button>}
        </h2>
      </motion.div>

      <div className='mt-20 flex flex-col relative'>
        <VerticalTimeline>
          {dataList.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
              isAdmin={isAdmin}
              onEdit={() => { setEditingItem(experience); setEditorOpen(true); }}
              onDelete={() => handleDelete(experience._id)}
            />
          ))}
        </VerticalTimeline>
      </div>

      {editorOpen && <AdminEditorModal type="experiences" initialData={editingItem} onClose={(changed) => { setEditorOpen(false); if (changed === true) fetchData(); }} />}
    </>
  );
};

export default SectionWrapper(Experience, "work");
