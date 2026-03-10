import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/hotels`);
      setHotels(res.data.hotels);
    } catch (err) {
      console.error(err);
      alert('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent card click
    if (!window.confirm("Are you sure you want to completely delete this hotel? This deletes all their data, menus, and images from the database.")) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/hotel/${id}`);
      alert('Hotel deleted successfully!');
      fetchHotels();
    } catch (err) {
      console.error(err);
      alert('Failed to delete hotel');
    }
  };

  if (loading) return <div className="admin-main"><h2>Loading...</h2></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2>Dashboard Overview</h2>
          <p>Select a Mess/Hotel to edit its details or upload today's menu.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/add-hotel')}>
          + Add New Hotel
        </button>
      </div>

      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="hotel-card" onClick={() => navigate(`/hotel/${hotel._id}`)}>
            <div className="hotel-card-content" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{hotel.hotelName || hotel.name || 'Unnamed Mess'}</h3>
                <button
                  className="btn-danger"
                  onClick={(e) => handleDelete(e, hotel._id)}
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                >
                  Delete
                </button>
              </div>
              <p><strong>Thali Price:</strong> ₹{hotel.price || 0}</p>
              <p><strong>Address:</strong> {hotel.address || 'No Address'}</p>
            </div>
            {hotel.todayMenu ? (
              <img src={hotel.todayMenu.imageUrl} alt="Today's Menu" className="menu-image-preview" />
            ) : (
              <div className="no-menu">Menu has not uploaded yet</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
