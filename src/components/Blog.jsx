import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { blogs } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import AdminEditorModal from "./AdminEditorModal";
import { DonutCanvas } from "./canvas";

const BlogCard = ({
    index, title, topic, featured, views, likes, comments, date, content, isAdmin, onEdit, onDelete
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
                className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full border border-[#2a2356]'
            >
                <div className='flex justify-between'>
                    <p className="text-secondary text-[12px]">{topic}</p>
                    {featured && <p className="text-yellow-400 text-[12px]">★ Featured</p>}
                </div>

                <div className='mt-5'>
                    <h3 className='text-white font-bold text-[24px]'>{title}</h3>
                    <p className='mt-2 text-secondary text-[14px] line-clamp-4'>{content}</p>
                </div>

                <div className='mt-5 flex items-center justify-between text-secondary text-[12px]'>
                    <p>{date}</p>
                    <div className="flex gap-4">
                        <span>👁 {views}</span>
                        <span>❤ {likes}</span>
                    </div>
                </div>
            </Tilt>
        </motion.div>
    );
};

const Blog = () => {
    const [dataList, setDataList] = React.useState(blogs);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [editorOpen, setEditorOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState(null);

    React.useEffect(() => {
        setIsAdmin(!!localStorage.getItem('adminToken'));
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('/api/portfolio?type=blogs')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setDataList(data);
            })
            .catch(err => console.error("Failed fetching dynamic blogs: ", err));
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog post?")) return;
        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`/api/portfolio?type=blogs&id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="relative z-0">
            <DonutCanvas />
            <motion.div variants={textVariant()}>
                <p className={`${styles.sectionSubText} `}>My Stories</p>
                <h2 className={`${styles.sectionHeadText} flex items-center gap-4`}>
                    My Blog.
                    {isAdmin && <button onClick={() => { setEditingItem(null); setEditorOpen(true); }} className="text-sm bg-tertiary px-4 py-2 rounded-xl text-white font-medium border border-secondary shadow-card hover:bg-black transition-all">+ Add New</button>}
                </h2>
            </motion.div>

            <div className='w-full flex'>
                <motion.p
                    variants={fadeIn("", "", 0.1, 1)}
                    className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
                >
                    Sharing insights, experiences, and thoughts on web development and technology.
                </motion.p>
            </div>

            <div className='mt-20 flex flex-wrap gap-7 relative'>
                {dataList.map((blog, index) => (
                    <BlogCard
                        key={`blog-${index}`}
                        index={index}
                        {...blog}
                        isAdmin={isAdmin}
                        onEdit={() => { setEditingItem(blog); setEditorOpen(true); }}
                        onDelete={() => handleDelete(blog._id)}
                    />
                ))}
            </div>

            {editorOpen && <AdminEditorModal type="blogs" initialData={editingItem} onClose={(changed) => { setEditorOpen(false); if (changed === true) fetchData(); }} />}
        </div>
    );
};

export default SectionWrapper(Blog, "blog");
