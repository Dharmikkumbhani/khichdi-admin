import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, Upload, MapPin } from 'lucide-react';

export default function AddHotel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Required Auth fields
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  // Info fields
  const [name, setName] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Ambiance files
  const [files, setFiles] = useState([]);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude.toString());
        setLongitude(longitude.toString());

        try {
          // Free reverse geocoding (OpenStreetMap Nominatim API)
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (res.data && res.data.display_name) {
            setAddress(res.data.display_name);
          }
        } catch (err) {
          console.error("Geocoding failed", err);
        } finally {
          setFetchingLocation(false);
          alert("Location captured successfully!");
        }
      },
      (error) => {
        console.error(error);
        alert("Failed to get location. Please allow location permissions.");
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobileNumber || !password) {
      alert("Mobile Number (ID) and Password are required!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('mobileNumber', mobileNumber);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('hotelName', hotelName);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('address', address);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    Array.from(files).forEach((file) => {
      formData.append('ambiance', file);
    });

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/hotel`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Hotel created successfully!');
      navigate('/');
    } catch (err) {
      console.error(err.response?.data?.message || err);
      alert(err.response?.data?.message || 'Failed to create hotel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="detail-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <h2>Add New Hotel / Mess</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Login Credentials</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Login ID (Mobile Number) *</label>
            <input type="text" required placeholder="e.g. 9876543210" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input type="text" required placeholder="Set a password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>

        <h3 style={{ color: 'var(--primary)', margin: '2rem 0 1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Hotel Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Mess Owner Name</label>
            <input type="text" placeholder="e.g. Ramesh" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Hotel / Mess Name</label>
            <input type="text" placeholder="e.g. Ramesh Mess" value={hotelName} onChange={e => setHotelName(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label>Base Price / Thali Price (₹)</label>
          <input type="number" placeholder="e.g. 100" value={price} onChange={e => setPrice(e.target.value)} onWheel={e => e.target.blur()} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea rows={2} placeholder="Description..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </div>

        <div className="form-group" style={{ position: 'relative' }}>
          <label>Address</label>
          <textarea rows={3} placeholder="Full address..." value={address} onChange={e => setAddress(e.target.value)}></textarea>
        </div>

        <button
          type="button"
          onClick={handleGetLocation}
          disabled={fetchingLocation}
          className="btn-primary"
          style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', marginBottom: '1.5rem', width: 'auto', gap: '0.5rem', alignSelf: 'start' }}
        >
          <MapPin size={18} /> {fetchingLocation ? 'Fetching Location...' : 'Use Current Location'}
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Latitude (Location)</label>
            <input type="number" step="any" placeholder="e.g. 22.5532" value={latitude} onChange={e => setLatitude(e.target.value)} onWheel={e => e.target.blur()} />
          </div>
          <div className="form-group">
            <label>Longitude (Location)</label>
            <input type="number" step="any" placeholder="e.g. 72.9231" value={longitude} onChange={e => setLongitude(e.target.value)} onWheel={e => e.target.blur()} />
          </div>
        </div>

        <h3 style={{ color: 'var(--primary)', margin: '2rem 0 1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Hotel Ambiance</h3>
        <div className="form-group">
          <label>Upload Photos (Select multiple)</label>
          <input type="file" multiple accept="image/*" onChange={e => setFiles(e.target.files)} style={{ border: '1px dashed var(--border)', padding: '2rem', background: '#f8fafc', cursor: 'pointer' }} />
          {files.length > 0 && <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>{files.length} file(s) selected</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem', padding: '1rem', fontSize: '1.1rem' }}>
          {loading ? 'Creating...' : '+ Create Hotel Profile'}
        </button>
      </form>
    </div>
  );
}
