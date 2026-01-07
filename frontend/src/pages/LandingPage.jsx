import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { Activity, User, Droplet, Bed, X, CalendarCheck, Search, Clock, CheckCircle, FlaskConical } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [beds, setBeds] = useState([]);
  const [blood, setBlood] = useState([]);
  
  // Modals
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  // Forms
  const [booking, setBooking] = useState({ patientName: '', mobile: '', doctorName: '', date: '', time: '' });
  const [labForm, setLabForm] = useState({ patientName: '', mobile: '', testType: 'Blood Test', date: '', time: '' });

  // Search Data
  const [searchMobile, setSearchMobile] = useState('');
  const [myAppointments, setMyAppointments] = useState(null);
  const [myTests, setMyTests] = useState(null);

  // Fetch Live Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRes = await API.get('/doctors');
        const invRes = await API.get('/inventory');
        setDoctors(docRes.data);
        setBeds(invRes.data.filter(item => item.type === 'Bed'));
        setBlood(invRes.data.filter(item => item.type === 'Blood'));
      } catch (error) { console.error("Error connecting to backend"); }
    };
    fetchData();
  }, []);

  // Handlers
  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await API.post('/appointments/book', booking);
      alert('✅ Appointment Request Sent!');
      setShowBookingModal(false);
    } catch (error) { alert('Error booking appointment.'); }
  };

  const handleLabBooking = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tests/book', labForm);
      alert('✅ Lab Test Request Sent!');
      setShowLabModal(false);
    } catch (error) { alert('Error booking test.'); }
  };

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    try {
      const appRes = await API.get(`/appointments/status/${searchMobile}`);
      setMyAppointments(appRes.data);
    } catch (e) { setMyAppointments([]); }

    try {
      const testRes = await API.get(`/tests/search/${searchMobile}`);
      setMyTests(testRes.data);
    } catch (e) { setMyTests([]); }
    
    setShowStatusModal(true);
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 px-10 bg-white shadow-md fixed w-full top-0 z-40">
        <div className="text-2xl font-bold text-primary flex items-center gap-2"><Activity size={28} /> MediVerse</div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/login')} className="px-5 py-2 border-2 border-primary text-primary font-bold rounded-full hover:bg-blue-50">Staff Login</button>
          <button onClick={() => setShowStatusModal(true)} className="px-5 py-2 bg-gray-100 text-gray-700 font-bold rounded-full flex items-center gap-2"><Search size={18} /> Check Status</button>
          <button onClick={() => setShowLabModal(true)} className="px-5 py-2 bg-purple-600 text-white font-bold rounded-full flex items-center gap-2 hover:bg-purple-700 shadow-lg"><FlaskConical size={18} /> Book Test</button>
          <button onClick={() => setShowBookingModal(true)} className="px-5 py-2 bg-primary text-white font-bold rounded-full hover:bg-blue-700 shadow-lg animate-pulse">Book Appointment</button>
        </div>
      </nav>

      {/* Hero */}
      <header className="mt-24 text-center p-10 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Your Health, <span className="text-primary">Our Priority</span></h1>
        <p className="text-gray-500 text-lg mb-8">Check real-time availability, book tests & appointments instantly.</p>
      </header>

      {/* Live Status Board */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><User className="text-primary"/> Doctor Availability</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {doctors.map(doc => (
              <div key={doc._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                <div><h3 className="font-bold text-gray-800">{doc.name}</h3><p className="text-xs text-gray-500">{doc.specialty}</p></div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${doc.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{doc.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Bed className="text-blue-500"/> Bed Availability</h2>
            <div className="grid grid-cols-2 gap-4">{beds.map(item => (
              <div key={item._id} className={`p-4 rounded-xl text-center border shadow-sm ${item.quantity > 0 ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                <h3 className={`text-3xl font-extrabold ${item.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>{item.quantity}</h3>
                <p className="text-gray-700 font-bold text-sm">{item.itemName}</p>
                <span className={`px-2 py-1 rounded text-xs font-bold ${item.quantity > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{item.quantity > 0 ? 'AVAILABLE' : 'OCCUPIED'}</span>
              </div>
            ))}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-red-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Droplet className="text-red-500"/> Blood Bank</h2>
            <div className="flex flex-wrap gap-3">{blood.map(item => (<div key={item._id} className="px-4 py-2 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2"><Droplet size={16} className="text-red-500 fill-current"/><span className="font-bold text-gray-700">{item.itemName}:</span><span className="text-red-600 font-extrabold">{item.quantity}</span></div>))}</div>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-gray-400"><X /></button>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2"><CalendarCheck /> Book Appointment</h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <input required placeholder="Name" className="w-full p-3 border rounded" onChange={e => setBooking({...booking, patientName: e.target.value})} />
              <input required placeholder="Mobile" className="w-full p-3 border rounded" onChange={e => setBooking({...booking, mobile: e.target.value})} />
              <select className="w-full p-3 border rounded bg-white" onChange={e => setBooking({...booking, doctorName: e.target.value})}>
                <option value="">Select Doctor</option>
                {doctors.map(doc => <option key={doc._id} value={doc.name}>{doc.name} ({doc.specialty})</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input required type="date" className="w-full p-3 border rounded" onChange={e => setBooking({...booking, date: e.target.value})} />
                <input required type="time" className="w-full p-3 border rounded" onChange={e => setBooking({...booking, time: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded">Confirm</button>
            </form>
          </div>
        </div>
      )}

      {/* Lab Booking Modal */}
      {showLabModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setShowLabModal(false)} className="absolute top-4 right-4 text-gray-400"><X /></button>
            <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2"><FlaskConical /> Book Lab Test</h2>
            <form onSubmit={handleLabBooking} className="space-y-4">
              <input required placeholder="Name" className="w-full p-3 border rounded" onChange={e => setLabForm({...labForm, patientName: e.target.value})} />
              <input required placeholder="Mobile" className="w-full p-3 border rounded" onChange={e => setLabForm({...labForm, mobile: e.target.value})} />
              <select className="w-full p-3 border rounded bg-white" onChange={e => setLabForm({...labForm, testType: e.target.value})}>
                <option>Blood Test (CBC)</option><option>X-Ray</option><option>MRI Scan</option><option>Sugar Test</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input required type="date" className="w-full p-3 border rounded" onChange={e => setLabForm({...labForm, date: e.target.value})} />
                <input required type="time" className="w-full p-3 border rounded" onChange={e => setLabForm({...labForm, time: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded">Request Test</button>
            </form>
          </div>
        </div>
      )}

      {/* Check Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => { setShowStatusModal(false); setMyAppointments(null); setMyTests(null); }} className="absolute top-4 right-4 text-gray-400"><X /></button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Search /> Check Status</h2>
            <form onSubmit={handleCheckStatus} className="flex gap-2 mb-6">
              <input required placeholder="Enter Mobile Number" className="w-full p-3 border rounded" value={searchMobile} onChange={e => setSearchMobile(e.target.value)} />
              <button type="submit" className="bg-primary text-white px-4 rounded font-bold">Search</button>
            </form>

            <div className="space-y-4 max-h-60 overflow-y-auto">
              {myAppointments && myAppointments.map(apt => (
                <div key={apt._id} className={`p-3 border-l-4 rounded bg-gray-50 ${apt.status === 'Confirmed' ? 'border-green-500' : 'border-orange-500'}`}>
                   <p className="font-bold">📅 Dr. {apt.doctorName}</p>
                   <p className="text-sm">Status: {apt.status}</p>
                </div>
              ))}
              {/* Replace the LAB TEST RESULTS SECTION with this: */}

{myTests && myTests.map(test => (
  <div key={test._id} className="p-3 border-l-4 border-purple-500 rounded bg-gray-50">
      <div className="flex justify-between">
        <span className="font-bold">🧪 {test.testType}</span>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{test.status}</span>
      </div>
      
      {/* DOWNLOAD BUTTON */}
      {test.status === 'Report Ready' && test.pdfPath ? (
        <a 
          href={`http://localhost:5000/uploads/${test.pdfPath}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-3 block text-center bg-green-600 text-white py-2 rounded text-sm font-bold hover:bg-green-700"
        >
          📄 Download Report
        </a>
      ) : (
        <p className="text-xs text-gray-400 mt-1">Report pending...</p>
      )}
  </div>
))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;