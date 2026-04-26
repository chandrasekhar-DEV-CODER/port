import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { certificates } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import AdminEditorModal from "./AdminEditorModal";
import { StarsCanvas } from "./canvas";

const CertificateCard = ({
    index, title, organization, description, date, image, isAdmin, onEdit, onDelete
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
                    max: 20,
                    scale: 1,
                    speed: 450,
                }}
                className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full h-full'
            >
                <div className='relative w-full h-[230px] rounded-2xl overflow-hidden bg-[#100d25] flex items-center justify-center border border-[#2a2356]'>
                    {image ? (
                        <img src={image} alt={title} className='w-full h-full object-cover' />
                    ) : (
                        <p className="text-secondary text-center italic opacity-50 px-4">No Image Provided</p>
                    )}
                </div>

                <div className='mt-5'>
                    <h3 className='text-white font-bold text-[24px]'>{title}</h3>
                    <p className='mt-2 text-[#915eff] text-[14px] font-semibold'>{organization}</p>
                    <p className='mt-2 text-secondary text-[14px]'>{description}</p>
                </div>

                <p className="mt-4 text-xs text-white opacity-40">{date}</p>
            </Tilt>
        </motion.div>
    );
};

const Certificates = () => {
    const [dataList, setDataList] = React.useState(certificates);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [editorOpen, setEditorOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState(null);

    React.useEffect(() => {
        setIsAdmin(!!localStorage.getItem('adminToken'));
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('/api/portfolio?type=certificates')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setDataList(data);
            })
            .catch(err => console.error("Failed fetching dynamic certificates: ", err));
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this certificate?")) return;
        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`/api/portfolio?type=certificates&id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="relative z-0">
            <StarsCanvas />
            <motion.div variants={textVariant()}>
                <p className={`${styles.sectionSubText} `}>Credentials & Learning</p>
                <h2 className={`${styles.sectionHeadText} flex items-center gap-4`}>
                    Certifications.
                    {isAdmin && <button onClick={() => { setEditingItem(null); setEditorOpen(true); }} className="text-sm bg-tertiary px-4 py-2 rounded-xl text-white font-medium border border-secondary shadow-card hover:bg-black transition-all">+ Add New</button>}
                </h2>
            </motion.div>

            <div className='mt-20 flex flex-wrap gap-7 relative'>
                {dataList.map((cert, index) => (
                    <CertificateCard
                        key={`cert-${index}`}
                        index={index}
                        {...cert}
                        isAdmin={isAdmin}
                        onEdit={() => { setEditingItem(cert); setEditorOpen(true); }}
                        onDelete={() => handleDelete(cert._id)}
                    />
                ))}
            </div>

            {editorOpen && <AdminEditorModal type="certificates" initialData={editingItem} onClose={(changed) => { setEditorOpen(false); if (changed === true) fetchData(); }} />}
        </div>
    );
};

export default SectionWrapper(Certificates, "certificates");
