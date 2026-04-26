import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { leadership } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import AdminEditorModal from "./AdminEditorModal";
import { CrystalCanvas } from "./canvas";

const LeadershipCard = ({
    index, organization, role, duration, description, achievements, metrics1, metrics2, metrics3, metrics4, isAdmin, onEdit, onDelete
}) => {
    return (
        <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)} className="relative w-full">
            {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 z-[60]">
                    <button onClick={onEdit} className="bg-[#100d25] border border-secondary px-3 py-1 rounded-full text-white font-bold hover:scale-110 active:scale-95 transition-all text-xs shadow-xl">Edit</button>
                    <button onClick={onDelete} className="bg-red-500 px-3 py-1 border border-red-700 rounded-full text-white font-bold hover:scale-110 active:scale-95 transition-all text-xs shadow-xl">Del</button>
                </div>
            )}
            <div className='bg-tertiary p-8 rounded-2xl w-full border border-[#2a2356] shadow-card'>
                <div>
                    <h3 className='text-white font-bold text-[24px]'>{role}</h3>
                    <p className='mt-2 text-secondary text-[16px] font-medium'>{organization}</p>
                    <p className='mt-1 text-secondary text-[14px]'>{duration}</p>
                </div>

                <p className='mt-5 text-white text-[16px] leading-[30px]'>{description}</p>

                {achievements && achievements.length > 0 && (
                    <ul className='mt-5 list-disc ml-5 space-y-2'>
                        {achievements.map((achievement, i) => (
                            <li key={`achievement-${i}`} className='text-white-100 text-[14px] pl-1 tracking-wider'>
                                {achievement}
                            </li>
                        ))}
                    </ul>
                )}

                {(metrics1 || metrics2 || metrics3 || metrics4) && (
                    <div className="mt-8 flex flex-wrap gap-6 border-t border-[#383e56] pt-6">
                        {metrics1 && <div className="text-center"><p className="text-2xl font-bold text-[#915eff]">{metrics1}</p><p className="text-secondary text-xs uppercase tracking-wider">Metrics 1</p></div>}
                        {metrics2 && <div className="text-center"><p className="text-2xl font-bold text-[#915eff]">{metrics2}</p><p className="text-secondary text-xs uppercase tracking-wider">Metrics 2</p></div>}
                        {metrics3 && <div className="text-center"><p className="text-2xl font-bold text-[#915eff]">{metrics3}</p><p className="text-secondary text-xs uppercase tracking-wider">Metrics 3</p></div>}
                        {metrics4 && <div className="text-center"><p className="text-2xl font-bold text-[#915eff]">{metrics4}</p><p className="text-secondary text-xs uppercase tracking-wider">Metrics 4</p></div>}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const Leadership = () => {
    const [dataList, setDataList] = React.useState(leadership);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [editorOpen, setEditorOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState(null);

    React.useEffect(() => {
        setIsAdmin(!!localStorage.getItem('adminToken'));
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('/api/portfolio?type=leadership')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setDataList(data);
            })
            .catch(err => console.error("Failed fetching dynamic leadership: ", err));
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this leadership role?")) return;
        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`/api/portfolio?type=leadership&id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="relative z-0">
            <CrystalCanvas />
            <motion.div variants={textVariant()}>
                <p className={`${styles.sectionSubText} `}>Community Engagement</p>
                <h2 className={`${styles.sectionHeadText} flex items-center gap-4`}>
                    Leadership.
                    {isAdmin && <button onClick={() => { setEditingItem(null); setEditorOpen(true); }} className="text-sm bg-tertiary px-4 py-2 rounded-xl text-white font-medium border border-secondary shadow-card hover:bg-black transition-all">+ Add New</button>}
                </h2>
            </motion.div>

            <div className='w-full flex'>
                <motion.p
                    variants={fadeIn("", "", 0.1, 1)}
                    className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
                >
                    Building developer communities and empowering student programmers.
                </motion.p>
            </div>

            <div className='mt-20 flex flex-col gap-10 relative'>
                {dataList.map((leader, index) => (
                    <LeadershipCard
                        key={`leadership-${index}`}
                        index={index}
                        {...leader}
                        isAdmin={isAdmin}
                        onEdit={() => { setEditingItem(leader); setEditorOpen(true); }}
                        onDelete={() => handleDelete(leader._id)}
                    />
                ))}
            </div>

            {editorOpen && <AdminEditorModal type="leadership" initialData={editingItem} onClose={(changed) => { setEditorOpen(false); if (changed === true) fetchData(); }} />}
        </div>
    );
};

export default SectionWrapper(Leadership, "leadership");
