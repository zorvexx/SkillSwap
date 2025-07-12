import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from './Navbar';

const SwapRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const db = getDatabase();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        loadRequests(user.uid);
      }
    });
  }, []);

  const loadRequests = async (uid) => {
    const snapshot = await get(ref(db, 'requests'));
    const usersSnap = await get(ref(db, 'users'));
    const allUsers = usersSnap.exists() ? usersSnap.val() : {};

    const reqs = [];
    snapshot.forEach((snap) => {
      const data = snap.val();
      if (data.toUserId === uid) {
        reqs.push({
          id: snap.key,
          ...data,
          sender: allUsers[data.fromUserId] || {}
        });
      }
    });
    setRequests(reqs);
    setFiltered(reqs);
  };

  const handleFilter = (status) => {
    setFilter(status);
    const f = status === 'all' ? requests : requests.filter(r => r.status === status);
    setFiltered(f);
  };

  const handleSearch = () => {
    const filteredBySearch = requests.filter(r =>
      r.sender.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const finalFilter = filter === 'all' ? filteredBySearch : filteredBySearch.filter(r => r.status === filter);
    setFiltered(finalFilter);
  };

  const updateStatus = async (id, newStatus) => {
    await update(ref(db, `requests/${id}`), { status: newStatus });
    const updated = requests.map(req => req.id === id ? { ...req, status: newStatus } : req);
    setRequests(updated);
    handleFilter(filter);
  };

  return (
    <>
      <Navbar />
      <div className="bg-white text-gray-800 min-h-screen">
        {/* Filter + Search */}
        <div className="flex flex-wrap justify-between items-center gap-4 px-6 py-4 border-b border-gray-200">
          <select
            onChange={(e) => handleFilter(e.target.value)}
            className="border border-[#9333EA] text-[#9333EA] rounded px-4 py-2 focus:outline-none"
            value={filter}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="flex items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-[#9333EA] rounded-l px-4 py-2 w-full sm:w-64 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-[#9333EA] text-white px-4 py-2 rounded-r hover:bg-violet-700"
            >
              Search
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="px-6 py-10">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 text-lg italic">No requests found.</p>
          ) : (
            filtered.map((req, idx) => (
              <div key={idx} className="border rounded-lg p-4 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-4 flex-wrap">
                  <img
                    src={req.sender.profilePic || `https://i.pravatar.cc/80?u=${req.fromUserId}`}
                    className="w-16 h-16 rounded-full border"
                    alt="Sender"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{req.sender.name || 'Unknown'}</h3>
                    <p className="text-sm text-gray-600">Rating: {req.sender.rating || 'N/A'}</p>
                    <p><span className="text-green-700 font-medium">Skills Offered: </span>{req.offeredSkill}</p>
                    <p><span className="text-blue-700 font-medium">Skill Wanted: </span>{req.wantedSkill}</p>
                    <p className="text-sm text-gray-500 italic mt-1">{req.message}</p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 text-center md:text-right">
                  <p className="text-sm mb-2">
                    Status: <span className={
                      req.status === 'pending' ? 'text-yellow-600' :
                      req.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                    }>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </p>
                  {req.status === 'pending' && (
                    <div className="flex gap-3 justify-center md:justify-end">
                      <button
                        onClick={() => updateStatus(req.id, 'accepted')}
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, 'rejected')}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SwapRequests;
