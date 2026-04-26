import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";
import AdminEditorModal from "./AdminEditorModal";

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
  isAdmin,
  onEdit,
  onDelete
}) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className='bg-black-200 p-10 rounded-3xl xs:w-[320px] w-full relative'
  >
    {isAdmin && (
      <div className="absolute -top-3 -right-3 flex gap-2 z-[60]">
        <button onClick={onEdit} className="bg-[#100d25] border border-secondary px-3 py-1 rounded-full text-white font-bold hover:scale-110 transition-all text-xs shadow-xl">Edit</button>
        <button onClick={onDelete} className="bg-red-500 px-3 py-1 border border-red-700 rounded-full text-white font-bold hover:scale-110 transition-all text-xs shadow-xl">Del</button>
      </div>
    )}
    <p className='text-white font-black text-[48px]'>"</p>

    <div className='mt-1'>
      <p className='text-white tracking-wider text-[18px]'>{testimonial}</p>

      <div className='mt-7 flex justify-between items-center gap-1'>
        <div className='flex-1 flex flex-col'>
          <p className='text-white font-medium text-[16px]'>
            <span className='blue-text-gradient'>@</span> {name}
          </p>
          <p className='mt-1 text-secondary text-[12px]'>
            {designation} of {company}
          </p>
        </div>

        <img
          src={image}
          alt={`feedback_by-${name}`}
          className='w-10 h-10 rounded-full object-cover'
        />
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  const [dataList, setDataList] = React.useState(testimonials);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);

  React.useEffect(() => {
    setIsAdmin(!!localStorage.getItem('adminToken'));
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('/api/portfolio?type=testimonials')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setDataList(data);
      })
      .catch(err => console.error("Failed fetching dynamic testimonials: ", err));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`/api/portfolio?type=testimonials&id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className={`mt-12 bg-black-100 rounded-[20px]`}>
      <div
        className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px]`}
      >
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>What others say</p>
          <h2 className={`${styles.sectionHeadText} flex items-center gap-4`}>
            Testimonials.
            {isAdmin && <button onClick={() => { setEditingItem(null); setEditorOpen(true); }} className="text-sm bg-black px-4 py-2 rounded-xl text-white font-medium border border-secondary shadow-card hover:bg-black transition-all">+ Add New</button>}
          </h2>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7 relative`}>
        {dataList.map((testimonial, index) => (
          <FeedbackCard
            key={testimonial.name || index}
            index={index}
            {...testimonial}
            isAdmin={isAdmin}
            onEdit={() => { setEditingItem(testimonial); setEditorOpen(true); }}
            onDelete={() => handleDelete(testimonial._id)}
          />
        ))}
      </div>

      {editorOpen && <AdminEditorModal type="testimonials" initialData={editingItem} onClose={(changed) => { setEditorOpen(false); if (changed === true) fetchData(); }} />}
    </div>
  );
};

export default SectionWrapper(Feedbacks, "");
