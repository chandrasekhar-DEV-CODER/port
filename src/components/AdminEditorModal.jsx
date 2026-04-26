import React, { useState, useEffect } from 'react';

const AdminEditorModal = ({ type, initialData, onClose }) => {
    const [formData, setFormData] = useState(initialData || {});
    const [loading, setLoading] = useState(false);

    // Focus trap and prevent scrolling while modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleFileChange = async (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            const b64 = await toBase64(file);
            setFormData(prev => ({ ...prev, [fieldName]: b64 }));
        }
    };

    const handleTextChange = (e, fieldName) => {
        if (fieldName === 'tags' || fieldName === 'points') {
            const val = e.target.value.split(',').map(s => s.trim());
            setFormData(prev => ({ ...prev, [fieldName]: fieldName === 'tags' ? val.map(t => ({ name: t, color: 'blue-text-gradient' })) : val }));
        } else {
            setFormData(prev => ({ ...prev, [fieldName]: e.target.value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const method = initialData && initialData._id ? 'PUT' : 'POST';
            const url = initialData && initialData._id ? `/api/portfolio?type=${type}&id=${initialData._id}` : `/api/portfolio?type=${type}`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onClose(true); // pass true to indicate successful change
            } else {
                const error = await res.json();
                alert('Action Failed: ' + (error.message || error.error));
            }
        } catch (err) {
            console.error(err);
            alert('Network Error occurred');
        } finally {
            setLoading(false);
        }
    };

    const renderFormFields = () => {
        const inputClass = "w-full bg-[#151030] py-3 px-4 placeholder-text-secondary text-white rounded-lg outline-none border-none font-medium mb-4 shadow-primary shadow-inner";
        const labelClass = "block text-white font-medium mb-2 opacity-80 text-sm";

        if (type === 'projects') {
            return (
                <>
                    <label className={labelClass}>Project Name</label>
                    <input type="text" className={inputClass} placeholder="E.g. 3D Web App" value={formData.name || ''} onChange={e => handleTextChange(e, 'name')} required />
                    <label className={labelClass}>Description</label>
                    <textarea rows="4" className={inputClass} placeholder="Full description" value={formData.description || ''} onChange={e => handleTextChange(e, 'description')} required />
                    <label className={labelClass}>Tags (comma separated)</label>
                    <input type="text" className={inputClass} placeholder="react, node, threejs" value={formData.tags ? formData.tags.map(t => typeof t === 'string' ? t : t.name).join(', ') : ''} onChange={e => handleTextChange(e, 'tags')} />
                    <label className={labelClass}>Source Code URL (optional)</label>
                    <input type="text" className={inputClass} placeholder="https://github.com/..." value={formData.source_code_link || ''} onChange={e => handleTextChange(e, 'source_code_link')} />
                    <label className={labelClass}>Project Thumbnail (Image)</label>
                    <input type="file" className={inputClass} onChange={e => handleFileChange(e, 'image')} />
                    {formData.image && <img src={formData.image} className="w-32 rounded object-cover mb-4 shadow-card" alt="Preview" />}
                </>
            );
        }

        if (type === 'experiences') {
            return (
                <>
                    <label className={labelClass}>Role Title</label>
                    <input type="text" className={inputClass} placeholder="Senior Developer" value={formData.title || ''} onChange={e => handleTextChange(e, 'title')} required />
                    <label className={labelClass}>Company/Org Name</label>
                    <input type="text" className={inputClass} placeholder="E.g. TechCorp" value={formData.company_name || ''} onChange={e => handleTextChange(e, 'company_name')} required />
                    <label className={labelClass}>Date/Duration</label>
                    <input type="text" className={inputClass} placeholder="Jan 2021 - Present" value={formData.date || ''} onChange={e => handleTextChange(e, 'date')} />
                    <label className={labelClass}>Hex Background Color for Icon</label>
                    <input type="text" className={inputClass} placeholder="#383E56" value={formData.iconBg || ''} onChange={e => handleTextChange(e, 'iconBg')} />
                    <label className={labelClass}>Experience Points (comma separated bullet points)</label>
                    <textarea rows="4" className={inputClass} placeholder="Developed X, Managed team Y..." value={formData.points?.join(', ') || ''} onChange={e => handleTextChange(e, 'points')} />
                    <label className={labelClass}>Company Icon (Image)</label>
                    <input type="file" className={inputClass} onChange={e => handleFileChange(e, 'icon')} />
                    {formData.icon && <img src={formData.icon} className="w-16 h-16 rounded object-contain mb-4 bg-white shadow-card" alt="Preview" />}
                </>
            );
        }

        if (type === 'services') {
            return (
                <>
                    <label className={labelClass}>Service Name</label>
                    <input type="text" className={inputClass} placeholder="Backend Developer" value={formData.title || ''} onChange={e => handleTextChange(e, 'title')} required />
                    <label className={labelClass}>Service Icon (Image)</label>
                    <input type="file" className={inputClass} onChange={e => handleFileChange(e, 'icon')} />
                    {formData.icon && <img src={formData.icon} className="w-16 h-16 rounded object-cover mb-4 p-2 shadow-card" alt="Preview" />}
                </>
            );
        }

        if (type === 'testimonials') {
            return (
                <>
                    <label className={labelClass}>Person's Name</label>
                    <input type="text" className={inputClass} placeholder="Jane Doe" value={formData.name || ''} onChange={e => handleTextChange(e, 'name')} required />
                    <label className={labelClass}>Designation / Role</label>
                    <input type="text" className={inputClass} placeholder="CTO" value={formData.designation || ''} onChange={e => handleTextChange(e, 'designation')} />
                    <label className={labelClass}>Company</label>
                    <input type="text" className={inputClass} placeholder="ACME Corp" value={formData.company || ''} onChange={e => handleTextChange(e, 'company')} />
                    <label className={labelClass}>Testimonial Content</label>
                    <textarea rows="4" className={inputClass} placeholder="This developer is amazing..." value={formData.testimonial || ''} onChange={e => handleTextChange(e, 'testimonial')} required />
                    <label className={labelClass}>Avatar / Image URL</label>
                    <input type="text" className={inputClass} placeholder="https://randomuser.me/api/..." value={formData.image || ''} onChange={e => handleTextChange(e, 'image')} />
                </>
            );
        }

        if (type === 'blogs') {
            return (
                <>
                    <label className={labelClass}>Blog Title</label>
                    <input type="text" className={inputClass} placeholder="E.g. Building an AI System" value={formData.title || ''} onChange={e => handleTextChange(e, 'title')} required />
                    <label className={labelClass}>Topic</label>
                    <input type="text" className={inputClass} placeholder="Technology" value={formData.topic || ''} onChange={e => handleTextChange(e, 'topic')} />
                    <label className={labelClass}>Date</label>
                    <input type="text" className={inputClass} placeholder="Mar 01, 2026" value={formData.date || ''} onChange={e => handleTextChange(e, 'date')} />
                    <label className={labelClass}>Content Snippet</label>
                    <textarea rows="4" className={inputClass} placeholder="Blog introduction or summary..." value={formData.content || ''} onChange={e => handleTextChange(e, 'content')} required />
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1 text-white">
                            <label className={labelClass}>Views</label>
                            <input type="text" className={inputClass} placeholder="10K" value={formData.views || ''} onChange={e => handleTextChange(e, 'views')} />
                        </div>
                        <div className="flex-1 text-white">
                            <label className={labelClass}>Likes</label>
                            <input type="text" className={inputClass} placeholder="1.2K" value={formData.likes || ''} onChange={e => handleTextChange(e, 'likes')} />
                        </div>
                        <div className="flex items-center text-white ml-4">
                            <input type="checkbox" className="mr-2 w-4 h-4" checked={formData.featured || false} onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))} /> <span className="text-sm">Featured</span>
                        </div>
                    </div>
                </>
            );
        }

        if (type === 'leadership') {
            return (
                <>
                    <label className={labelClass}>Role</label>
                    <input type="text" className={inputClass} placeholder="Technical Head" value={formData.role || ''} onChange={e => handleTextChange(e, 'role')} required />
                    <label className={labelClass}>Organization</label>
                    <input type="text" className={inputClass} placeholder="AI Club" value={formData.organization || ''} onChange={e => handleTextChange(e, 'organization')} required />
                    <label className={labelClass}>Duration</label>
                    <input type="text" className={inputClass} placeholder="2025 - Present" value={formData.duration || ''} onChange={e => handleTextChange(e, 'duration')} />
                    <label className={labelClass}>Description</label>
                    <textarea rows="3" className={inputClass} placeholder="Leading initiatives..." value={formData.description || ''} onChange={e => handleTextChange(e, 'description')} />
                    <label className={labelClass}>Achievements (comma separated)</label>
                    <textarea rows="3" className={inputClass} placeholder="Organized X, Mentored Y..." value={formData.achievements?.join(', ') || ''} onChange={e => { const val = e.target.value.split(',').map(s => s.trim()); setFormData(prev => ({ ...prev, achievements: val })); }} />
                    <label className={labelClass}>Metrics (e.g. 100+ Students, 10+ Projects)</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" className={inputClass} placeholder="Metric 1" value={formData.metrics1 || ''} onChange={e => handleTextChange(e, 'metrics1')} />
                        <input type="text" className={inputClass} placeholder="Metric 2" value={formData.metrics2 || ''} onChange={e => handleTextChange(e, 'metrics2')} />
                        <input type="text" className={inputClass} placeholder="Metric 3" value={formData.metrics3 || ''} onChange={e => handleTextChange(e, 'metrics3')} />
                        <input type="text" className={inputClass} placeholder="Metric 4" value={formData.metrics4 || ''} onChange={e => handleTextChange(e, 'metrics4')} />
                    </div>
                </>
            );
        }

        if (type === 'certificates') {
            return (
                <>
                    <label className={labelClass}>Certificate Title</label>
                    <input type="text" className={inputClass} placeholder="Software Engineer" value={formData.title || ''} onChange={e => handleTextChange(e, 'title')} required />
                    <label className={labelClass}>Organization</label>
                    <input type="text" className={inputClass} placeholder="HackerRank" value={formData.organization || ''} onChange={e => handleTextChange(e, 'organization')} required />
                    <label className={labelClass}>Date</label>
                    <input type="text" className={inputClass} placeholder="March 2026" value={formData.date || ''} onChange={e => handleTextChange(e, 'date')} />
                    <label className={labelClass}>Description</label>
                    <textarea rows="3" className={inputClass} placeholder="Successfully passed..." value={formData.description || ''} onChange={e => handleTextChange(e, 'description')} />
                    <label className={labelClass}>Certificate Image</label>
                    <input type="file" className={inputClass} onChange={e => handleFileChange(e, 'image')} />
                    {formData.image && <img src={formData.image} className="w-32 rounded object-cover mb-4 shadow-card" alt="Preview" />}
                    <label className={labelClass}>Credential Link (optional)</label>
                    <input type="text" className={inputClass} placeholder="https://..." value={formData.credentialLink || ''} onChange={e => handleTextChange(e, 'credentialLink')} />
                </>
            );
        }

        if (type === 'achievements') {
            return (
                <>
                    <label className={labelClass}>Category</label>
                    <input type="text" className={inputClass} placeholder="Project Innovation" value={formData.category || ''} onChange={e => handleTextChange(e, 'category')} />
                    <label className={labelClass}>Title</label>
                    <input type="text" className={inputClass} placeholder="BRAINCON 2026 Paper" value={formData.title || ''} onChange={e => handleTextChange(e, 'title')} required />
                    <label className={labelClass}>Date/Year</label>
                    <input type="text" className={inputClass} placeholder="2026" value={formData.date || ''} onChange={e => handleTextChange(e, 'date')} />
                    <label className={labelClass}>Description</label>
                    <textarea rows="4" className={inputClass} placeholder="Paper accepted..." value={formData.description || ''} onChange={e => handleTextChange(e, 'description')} required />
                </>
            );
        }

        if (type === 'global') {
            return (
                <>
                    <h3 className="text-[#915eff] mb-2 border-b border-[#2a2356] pb-1 uppercase text-xs tracking-widest font-bold">Hero Section Text</h3>
                    <label className={labelClass}>Hero Name ("Hi, I'm...")</label>
                    <input type="text" className={inputClass} value={formData.heroName || ''} onChange={e => handleTextChange(e, 'heroName')} />
                    <label className={labelClass}>Hero Description</label>
                    <textarea rows="2" className={inputClass} value={formData.heroDescription || ''} onChange={e => handleTextChange(e, 'heroDescription')} />

                    <h3 className="text-[#915eff] mb-2 mt-4 border-b border-[#2a2356] pb-1 uppercase text-xs tracking-widest font-bold">About Section Text</h3>
                    <label className={labelClass}>About Header / Subtitle</label>
                    <input type="text" className={inputClass} value={formData.aboutIntro || ''} onChange={e => handleTextChange(e, 'aboutIntro')} />
                    <label className={labelClass}>About Paragraph</label>
                    <textarea rows="4" className={inputClass} value={formData.aboutText || ''} onChange={e => handleTextChange(e, 'aboutText')} />

                    <h3 className="text-[#915eff] mb-2 mt-4 border-b border-[#2a2356] pb-1 uppercase text-xs tracking-widest font-bold">Works/Projects Text</h3>
                    <label className={labelClass}>Works Subtitle</label>
                    <input type="text" className={inputClass} value={formData.worksIntro || ''} onChange={e => handleTextChange(e, 'worksIntro')} />
                    <label className={labelClass}>Works Intro Paragraph</label>
                    <textarea rows="3" className={inputClass} value={formData.worksText || ''} onChange={e => handleTextChange(e, 'worksText')} />

                    <h3 className="text-[#915eff] mb-2 mt-4 border-b border-[#2a2356] pb-1 uppercase text-xs tracking-widest font-bold">Contact Profile Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Email Address</label>
                            <input type="text" className={inputClass} value={formData.contactEmail || ''} onChange={e => handleTextChange(e, 'contactEmail')} />
                        </div>
                        <div>
                            <label className={labelClass}>Phone Number</label>
                            <input type="text" className={inputClass} value={formData.contactPhone || ''} onChange={e => handleTextChange(e, 'contactPhone')} />
                        </div>
                        <div className="col-span-2">
                            <label className={labelClass}>Location</label>
                            <input type="text" className={inputClass} value={formData.contactLocation || ''} onChange={e => handleTextChange(e, 'contactLocation')} />
                        </div>
                    </div>

                    <h3 className="text-[#915eff] mb-2 mt-2 border-b border-[#2a2356] pb-1 uppercase text-xs tracking-widest font-bold">Social Links</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>LinkedIn URL</label>
                            <input type="text" className={inputClass} value={formData.socialLinkedin || ''} onChange={e => handleTextChange(e, 'socialLinkedin')} />
                        </div>
                        <div>
                            <label className={labelClass}>GitHub URL</label>
                            <input type="text" className={inputClass} value={formData.socialGithub || ''} onChange={e => handleTextChange(e, 'socialGithub')} />
                        </div>
                        <div>
                            <label className={labelClass}>LeetCode URL</label>
                            <input type="text" className={inputClass} value={formData.socialLeetcode || ''} onChange={e => handleTextChange(e, 'socialLeetcode')} />
                        </div>
                        <div>
                            <label className={labelClass}>Portfolio URL</label>
                            <input type="text" className={inputClass} value={formData.socialPortfolio || ''} onChange={e => handleTextChange(e, 'socialPortfolio')} />
                        </div>
                    </div>
                </>
            );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/80 backdrop-blur-md transition-all p-4">
            <div className="bg-[#100d25] p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#915eff] shadow-card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-black text-white capitalize">{initialData && initialData._id ? `Edit ${type}` : `Add New ${type}`}</h2>
                    <button onClick={() => onClose(false)} className="text-white bg-slate-800 hover:bg-red-500 rounded-full w-8 h-8 flex justify-center items-center transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    {renderFormFields()}

                    <button
                        type="submit"
                        className="bg-[#915eff] hover:bg-[#aa84ff] py-3 px-8 rounded-xl outline-none w-full text-white font-bold shadow-md transition-colors mt-6"
                        disabled={loading}
                    >
                        {loading ? 'Saving securely directly to MongoDB...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminEditorModal;
