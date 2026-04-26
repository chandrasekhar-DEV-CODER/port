import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { achievements } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import AdminEditorModal from "./AdminEditorModal";
import { RingsCanvas } from "./canvas";

const AchievementCard = ({
    index, category, title, description, date, isAdmin, onEdit, onDelete
}) => {
    return (
        <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)} className="relative w-full">
            {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 z-[60]">
                    <button onClick={onEdit} className="bg-[#100d25] border border-secondary px-3 py-1 rounded-full text-white font-bold hover:scale-110 active:scale-95 transition-all text-xs shadow-xl">Edit</button>
                    <button onClick={onDelete} className="bg-red-500 px-3 py-1 border border-red-700 rounded-full text-white font-bold hover:scale-110 active:scale-95 transition-all text-xs shadow-xl">Del</button>
                </div>
            )}
            <div className='bg-[#100d25] p-8 rounded-2xl w-full shadow-card border-l-4 border-[#915eff]'>
                <p className="text-secondary text-sm mb-2">{category}</p>
                <h3 className='text-white font-bold text-[24px] mb-4'>{title}</h3>
                <p className='text-secondary text-[16px] leading-[30px]'>{description}</p>
                <p className="mt-4 text-xs text-[#915eff] font-bold tracking-widest">{date}</p>
            </div>
        </motion.div>
    );
};

const Achievements = () => {
    const [dataList, setDataList] = React.useState(achievements);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [editorOpen, setEditorOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState(null);

    React.useEffect(() => {
        setIsAdmin(!!localStorage.getItem('adminToken'));
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('/api/portfolio?type=achievements')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setDataList(data);
            })
            .catch(err => console.error("Failed fetching dynamic achievements: ", err));
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this achievement?")) return;
        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`/api/portfolio?type=achievements&id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="relative z-0">
            <RingsCanvas />
            <motion.div variants={textVariant()}>
                <p className={`${styles.sectionSubText} `}>Milestones & Recognition</p>
                <h2 className={`${styles.sectionHeadText} flex items-center gap-4`}>
                    Achievements.
                    {isAdmin && <button onClick={() => { setEditingItem(null); setEditorOpen(true); }} className="text-sm bg-tertiary px-4 py-2 rounded-xl text-white font-medium border border-secondary shadow-card hover:bg-black transition-all">+ Add New</button>}
                </h2>
            </motion.div>

            <div className='w-full flex'>
                <motion.p
                    variants={fadeIn("", "", 0.1, 1)}
                    className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
                >
                    Key accomplishments that mark my journey in tech.
                </motion.p>
            </div>

            <div className='mt-10 flex flex-col gap-6 relative'>
                {dataList.map((achievement, index) => (
                    <AchievementCard
                        key={`achievement-${index}`}
                        index={index}
                        {...achievement}
                        isAdmin={isAdmin}
                        onEdit={() => { setEditingItem(achievement); setEditorOpen(true); }}
                        onDelete={() => handleDelete(achievement._id)}
                    />
                ))}
            </div>

            {editorOpen && <AdminEditorModal type="achievements" initialData={editingItem} onClose={(changed) => { setEditorOpen(false); if (changed === true) fetchData(); }} />}
        </div>
    );
};

export default SectionWrapper(Achievements, "achievements");
