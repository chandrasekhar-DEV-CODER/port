import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects');
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(true);

    // States for form
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
        } else {
            fetchData();
        }
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/portfolio?type=${activeTab}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setDataList(data);
            } else {
                setDataList([]);
                if (data.error || data.message) {
                    alert('Database Error: ' + (data.error || data.message) + '\n\nPlease double check that your current WiFi IP Address is added to the Network Access Whitelist in MongoDB Atlas!');
                }
            }
        } catch (err) {
            console.error(err);
            setDataList([]);
        } finally {
            setLoading(false);
        }
    };

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
            // Very basic implementation: parse string into array or handle properly based on object structure.
            // For Projects tags: "name1,name2". We'll handle this simply as mapped values.
            const val = e.target.value.split(',').map(s => s.trim());
            setFormData(prev => ({ ...prev, [fieldName]: fieldName === 'tags' ? val.map(t => ({ name: t, color: 'blue-text-gradient' })) : val }));
        } else {
            setFormData(prev => ({ ...prev, [fieldName]: e.target.value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const method = selectedItem ? 'PUT' : 'POST';
            const url = selectedItem ? `/api/portfolio?type=${activeTab}&id=${selectedItem._id}` : `/api/portfolio?type=${activeTab}`;
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setSelectedItem(null);
                setFormData({});
                fetchData();
            } else {
                const error = await res.json();
                alert('Error: ' + error.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`/api/portfolio?type=${activeTab}&id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const renderFormFields = () => {
        if (activeTab === 'projects') {
            return (
                <>
                    <input type="text" placeholder="Project Name" className="w-full p-2 mb-2 bg-primary rounded" value={formData.name || ''} onChange={e => handleTextChange(e, 'name')} required />
                    <textarea placeholder="Description" className="w-full p-2 mb-2 bg-primary rounded" value={formData.description || ''} onChange={e => handleTextChange(e, 'description')} required />
                    <input type="text" placeholder="Tags (comma separated names)" className="w-full p-2 mb-2 bg-primary rounded" value={formData.tags ? formData.tags.map(t => t.name).join(', ') : ''} onChange={e => handleTextChange(e, 'tags')} />
                    <input type="text" placeholder="Source Code Link" className="w-full p-2 mb-2 bg-primary rounded" value={formData.source_code_link || ''} onChange={e => handleTextChange(e, 'source_code_link')} />
                    <label className="block mb-2 text-sm text-gray-400">Project Image (Upload):</label>
                    <input type="file" onChange={e => handleFileChange(e, 'image')} className="mb-4" />
                    {formData.image && <img src={formData.image} className="w-32 h-auto mb-4 rounded" alt="Preview" />}
                </>
            );
        }
        // Simplistic handling for other tabs
        if (activeTab === 'experiences') {
            return (
                <>
                    <input type="text" placeholder="Job Title" className="w-full p-2 mb-2 bg-primary rounded" value={formData.title || ''} onChange={e => handleTextChange(e, 'title')} required />
                    <input type="text" placeholder="Company Name" className="w-full p-2 mb-2 bg-primary rounded" value={formData.company_name || ''} onChange={e => handleTextChange(e, 'company_name')} required />
                    <input type="text" placeholder="Date (e.g. March 2020 - April 2021)" className="w-full p-2 mb-2 bg-primary rounded" value={formData.date || ''} onChange={e => handleTextChange(e, 'date')} />
                    <input type="text" placeholder="Icon BG Color (e.g. #383E56)" className="w-full p-2 mb-2 bg-primary rounded" value={formData.iconBg || ''} onChange={e => handleTextChange(e, 'iconBg')} />
                    <textarea placeholder="Points (comma separated sentences)" className="w-full p-2 mb-2 bg-primary rounded h-24" value={formData.points?.join(', ') || ''} onChange={e => handleTextChange(e, 'points')} />
                    <label className="block mb-2 text-sm text-gray-400">Company Icon (Upload):</label>
                    <input type="file" onChange={e => handleFileChange(e, 'icon')} className="mb-4" />
                    {formData.icon && <img src={formData.icon} className="w-16 h-16 object-contain mb-4 rounded bg-white" alt="Preview" />}
                </>
            );
        }
        return <p className="mb-4 text-red-400">Form implementation simplified for this tab temporarily. Add proper fields natively.</p>;
    };

    return (
        <div className="min-h-screen bg-primary text-white p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <button className="bg-red-500 px-4 py-2 rounded" onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }}>Logout</button>
            </div>

            <div className="flex gap-4 mb-8">
                {['projects', 'experiences', 'services', 'testimonials'].map(tab => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded capitalize font-bold ${activeTab === tab ? 'bg-secondary text-white' : 'bg-tertiary text-secondary'}`}
                        onClick={() => { setActiveTab(tab); setSelectedItem(null); setFormData({}); }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Item List */}
                <div className="bg-tertiary p-6 rounded-2xl h-[70vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4 capitalize">Existing {activeTab}</h2>
                    {loading ? <p>Loading...</p> : (
                        <div className="flex flex-col gap-4">
                            {Array.isArray(dataList) && dataList.map(item => (
                                <div key={item._id} className="bg-primary p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg">{item.name || item.title || item.testimonial?.substring(0, 20)}</h3>
                                        {item.company_name && <p className="text-sm text-secondary">{item.company_name}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="bg-blue-500 px-3 py-1 rounded" onClick={() => { setSelectedItem(item); setFormData(item); }}>Edit</button>
                                        <button className="bg-red-500 px-3 py-1 rounded" onClick={() => handleDelete(item._id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                            {dataList.length === 0 && <p className="text-gray-400">No data found in database.</p>}
                        </div>
                    )}
                </div>

                {/* Edit/Add Form */}
                <div className="bg-tertiary p-6 rounded-2xl h-[70vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4">{selectedItem ? 'Edit Item' : 'Add New Item'}</h2>
                    {(activeTab === 'projects' || activeTab === 'experiences') ? (
                        <form onSubmit={handleSubmit}>
                            {renderFormFields()}
                            <div className="flex gap-4 mt-6">
                                <button type="submit" className="bg-green-500 px-6 py-2 rounded font-bold w-full">Save</button>
                                {selectedItem && (
                                    <button type="button" className="bg-gray-500 px-6 py-2 rounded font-bold w-full" onClick={() => { setSelectedItem(null); setFormData({}); }}>Cancel</button>
                                )}
                            </div>
                        </form>
                    ) : (
                        <p className="text-yellow-500">Form implementation missing for {activeTab}. Please switch to projects or experiences for now.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
