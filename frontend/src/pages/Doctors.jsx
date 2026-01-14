import React, { useState, useEffect } from 'react';
import API from '../api';
import { Plus, Trash2, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ name: '', specialty: '', mobile: '', availability: 'Available' });

  // 1. Fetch Doctors (Debugging added)
  const fetchDoctors = async () => {
    try {
      const { data } = await API.get('/doctors');
      console.log("Doctors Data Loaded:", data); // Check Console if data is coming
      setDoctors(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load doctors');
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // 2. Add Doctor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/doctors/add', form);
      alert('✅ Doctor Added!');
      setShowForm(false);
      fetchDoctors();
      setForm({ name: '', specialty: '', mobile: '', availability: 'Available' });
    } catch (error) {
      alert('Error adding doctor');
    }
  };

 // 3. Update Status (Universal Fix)
  const updateStatus = async (id, newStatus) => {
    // UI को तुरंत अपडेट करें (ताकि बटन क्लिक होते ही बदल जाए)
    setDoctors(prev => prev.map(doc => 
      doc._id === id ? { ...doc, availability: newStatus, status: newStatus } : doc
    ));

    try {
      // ✅ Trick: Hum dono naam bhejenge taki Backend mana na kar sake
      const payload = { 
        availability: newStatus, 
        status: newStatus 
      };

      await API.put(`/doctors/${id}/status`, payload);
      
      // Alert hata dein ya chhota kar dein taki bar bar click karne me pareshani na ho
      console.log("Updated in DB");
      
      // ⚠️ Important: fetchDoctors() ko abhi ke liye hata diya hai
      // Kyunki agar DB update slow hua to ye wapas purana data dikha dega
      // fetchDoctors(); 

    } catch (error) {
      alert('❌ Server Error: Save nahi hua');
      fetchDoctors(); // Error aane par hi purana data wapas layein
    }
  };
  // 4. Delete Doctor
  const handleDelete = async (id) => {
    if (window.confirm('Delete this doctor?')) {
      await API.delete(`/doctors/${id}`);
      fetchDoctors();
    }
  };

  // 5. Dynamic Colors (Improved)
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-700 border-green-300 shadow-sm ring-1 ring-green-300';
      case 'in surgery': return 'bg-red-100 text-red-700 border-red-300 shadow-sm ring-1 ring-red-300';
      case 'off duty': return 'bg-gray-100 text-gray-700 border-gray-300 shadow-sm ring-1 ring-gray-300';
      default: return 'bg-white border-gray-200 text-gray-400';
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-3 bg-white rounded-xl shadow-sm hover:bg-slate-100 transition-colors">
            <ArrowLeft className="text-slate-600"/>
          </button>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Doctor Management</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95">
          <Plus size={20} /> Add Doctor
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-10 border border-slate-100 animate-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-4 text-slate-700">Add New Doctor</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input required placeholder="Dr. Name" className="p-4 bg-slate-50 border-none rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input required placeholder="Specialty (e.g. Heart)" className="p-4 bg-slate-50 border-none rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} />
            <div className="flex items-center">
               <span className="text-slate-400 font-bold mr-2">Default:</span>
               <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg">Available</span>
            </div>
            <button type="submit" className="bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Save Doctor</button>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => {
            // Safe Status Check (Handles undefined or different casing)
            const currentStatus = doc.availability || doc.status || "Off Duty";
            
            return (
              <div key={doc._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {doc.name ? doc.name[0] : "D"}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">Dr. {doc.name}</h3>
                      <p className="text-sm font-semibold text-slate-400">{doc.specialty}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(doc._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={20}/></button>
                </div>
                
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Set Live Status</p>
                  <div className="flex flex-wrap gap-2">
                    {['Available', 'In Surgery', 'Off Duty'].map((statusOption) => {
                      // Comparison Logic: Match lowercase strings
                      const isActive = currentStatus.toLowerCase() === statusOption.toLowerCase();
                      
                      return (
                        <button
                          key={statusOption}
                          onClick={() => updateStatus(doc._id, statusOption)}
                          className={`
                            px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer select-none
                            ${isActive 
                              ? getStatusColor(statusOption) + ' scale-105' 
                              : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500'
                            }
                            active:scale-95
                          `}
                        >
                          {statusOption}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Doctors;