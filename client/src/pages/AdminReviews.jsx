import React, { useState, useEffect } from 'react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReviews = () => {
    setLoading(true);
    fetch('/api/admin/reviews')
      .then(r => r.json())
      .then(data => {
        setReviews(data.reviews || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.generatedDiscount) {
        alert(`Review approved! Generated voucher code: ${data.generatedDiscount}`);
      }
      fetchReviews();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Reviews</h1>
      
      
      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          placeholder="Search by product or email..." 
          className="border p-2 rounded flex-1 text-sm max-w-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select 
          className="border p-2 rounded text-sm"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
{loading ? <p>Loading...</p> : (
        <div className="flex flex-col gap-4">
          {reviews
          .filter(r => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = ((r.productId && r.productId.name) || '').toLowerCase().includes(searchLower) || 
                                  ((r.userId && r.userId.email) || '').toLowerCase().includes(searchLower) ||
                                  (r.text || '').toLowerCase().includes(searchLower);
            const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
            return matchesSearch && matchesStatus;
          })
          .map(r => (
            <div key={r._id} className="border p-4 rounded bg-white shadow-sm flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold">{r.productId?.name}</span>
                  <span className="text-sm text-gray-500">{r.userId?.email}</span>
                </div>
                <div className="mb-2">
                  <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                </div>
                <p className="text-gray-800 italic">"{r.text}"</p>
                <div className="mt-2 text-xs font-bold uppercase text-gray-400">Status: {r.status}</div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0 shrink-0">
                {r.status !== 'approved' && (
                  <button onClick={() => handleUpdate(r._id, 'approved')} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold">Approve (₹150 Reward)</button>
                )}
                {r.status !== 'rejected' && (
                  <button onClick={() => handleUpdate(r._id, 'rejected')} className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold">Reject</button>
                )}
              </div>
            </div>
          ))}
          {!reviews.length && <p className="text-gray-500">No reviews yet.</p>}
        </div>
      )}
    </div>
  );
}
