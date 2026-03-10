import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Upload, Plus } from 'lucide-react';

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [recentMenus, setRecentMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [hotelName, setHotelName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [hotelType, setHotelType] = useState('dynamic');

  // Menu state
  const [menuFiles, setMenuFiles] = useState([]);
  const [menuNote, setMenuNote] = useState('');
  const [uploadingMenu, setUploadingMenu] = useState(false);

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/hotel/${id}`);
      const h = res.data.hotel;
      setHotel(h);
      setHotelName(h.hotelName || '');
      setPrice(h.price || '');
      setDescription(h.description || '');
      setAddress(h.address || '');
      setMobileNumber(h.mobileNumber || '');
      setHotelType(h.hotelType || 'dynamic');
      setRecentMenus(res.data.recentMenus || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load hotel info');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/hotel/${id}`, {
        hotelName,
        price,
        description,
        address,
        mobileNumber,
        hotelType
      });
      alert('Information updated successfully!');
      fetchHotelDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to update information');
    }
  };

  const handleUploadMenu = async (e) => {
    e.preventDefault();
    if (!menuFiles || menuFiles.length === 0) {
      alert("Please select at least one menu image!");
      return;
    }
    setUploadingMenu(true);
    const formData = new FormData();
    Array.from(menuFiles).forEach(file => {
      formData.append('menuImages', file);
    });
    formData.append('note', menuNote);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/hotel/${id}/menu`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Menu uploaded successfully!');
      setMenuFiles([]);
      setMenuNote('');
      fetchHotelDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to upload menu');
    } finally {
      setUploadingMenu(false);
    }
  };

  if (loading || !hotel) return <div className="admin-main"><h2>Loading...</h2></div>;

  return (
    <div className="detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <h2>Managing: {hotel.hotelName || 'Unnamed Mess'}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>

        {/* Update Details Form */}
        <div>
          <h3>Edit Details</h3>
          <form onSubmit={handleUpdateInfo}>
            <div className="form-group">
              <label>Mess Name</label>
              <input type="text" value={hotelName} onChange={e => setHotelName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Mobile Number (For Login Later)</label>
              <input type="text" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Thali Price (₹)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea rows={3} value={address} onChange={e => setAddress(e.target.value)}></textarea>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>

            <div className="form-group">
              <label>Hotel Type</label>
              <select value={hotelType} onChange={e => setHotelType(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <option value="dynamic">Dynamic Menu</option>
                <option value="fixed">Fixed Menu</option>
              </select>
            </div>

            <button type="submit" className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> Save Details
            </button>
          </form>
        </div>

        {/* Upload Daily Menu Form */}
        <div>
          <h3>Upload Today's Menu</h3>
          <form onSubmit={handleUploadMenu} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '2px dashed var(--border)' }}>
            <div className="form-group">
              <label>Menu Camera / Gallery Image</label>
              <input type="file" multiple accept="image/*" onChange={e => setMenuFiles(e.target.files)} style={{ background: 'white', width: '100%', marginBottom: '0.5rem' }} />
              {menuFiles.length > 0 && <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{menuFiles.length} file(s) selected</p>}
            </div>

            <div className="form-group">
              <label>Extra Note (Optional - e.g. "Special Gulab Jamun today")</label>
              <input type="text" value={menuNote} onChange={e => setMenuNote(e.target.value)} />
            </div>

            <button type="submit" className="btn" disabled={uploadingMenu} style={{ background: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={18} /> {uploadingMenu ? 'Uploading...' : 'Upload Menu'}
            </button>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <h4>Recent Menus (App Preview)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {recentMenus.map((m, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: '4px', padding: '0.5rem', textAlign: 'center' }}>
                  <img src={m.imageUrl} alt="Menu" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#64748b' }}>
                    {new Date(m.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {recentMenus.length === 0 && <p style={{ color: '#64748b' }}>No recent menus found.</p>}
            </div>
            <p style={{ color: '#64748b', marginTop: '1rem', fontSize: '0.9rem' }}>These are automatically pushed to the users app when you upload above.</p>
          </div>
        </div>

      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => navigate(-1)} className="btn-primary" style={{ background: '#64748b', gap: '0.5rem' }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}