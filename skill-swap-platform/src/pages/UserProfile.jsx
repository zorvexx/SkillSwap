import React, { useState, useEffect } from 'react';
import { ref, get, push } from 'firebase/database';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { database } from '../firebase';
import Navbar from './Navbar';
import SkillRequestPopup from './SkillRequests'; // Ensure this path is correct

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null); // viewed profile
  const [currentUser, setCurrentUser] = useState(null); // logged-in user
  const [showPopup, setShowPopup] = useState(false);

  // Load viewed user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const snapshot = await get(ref(database, `users/${id}`));
        if (snapshot.exists()) {
          setProfile(snapshot.val());
        } else {
          alert('User not found');
          navigate('/');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };
    loadProfile();
  }, [id, navigate]);

  // Load current user data
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await get(ref(database, `users/${user.uid}`));
        if (snap.exists()) {
          setCurrentUser({ ...snap.val(), uid: user.uid });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Send swap request to Firebase
  const handleSubmit = async (requestData) => {
    if (!currentUser || !currentUser.uid) {
      alert("You must be logged in.");
      return;
    }

    const requestPayload = {
      fromUserId: currentUser.uid,
      toUserId: id,
      offeredSkill: requestData.yourSkill,
      wantedSkill: requestData.theirSkill,
      message: requestData.message,
      status: 'pending',
      timestamp: Date.now()
    };

    try {
      await push(ref(database, 'requests'), requestPayload);
      alert("✅ Swap request submitted successfully!");
    } catch (error) {
      console.error("❌ Error saving request:", error);
      alert("Failed to send request. Try again.");
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 text-gray-800">
        <header className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold">SkillSwap Platform</h2>
          <nav className="flex items-center gap-4 mt-2 md:mt-0">
            <Link to="/swap-requests" className="text-purple-600 hover:underline">Swap Requests</Link>
            <Link to="/" className="text-gray-600 hover:underline">Home</Link>
            <img
              src={profile.profilePic || `https://i.pravatar.cc/40?u=${id}`}
              alt="Avatar"
              className="w-9 h-9 rounded-full"
            />
          </nav>
        </header>

        <main className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[60%]">
              <h3 className="text-2xl font-bold">{profile.name}</h3>
              <p><strong>Email:</strong> {profile.email}</p>
              {profile.about && <p><strong>About:</strong> {profile.about}</p>}
              {profile.projects?.length > 0 && (
                <p><strong>Projects:</strong> {profile.projects.map(p => p.name).join(', ')}</p>
              )}
              {profile.skillsWanted && (
                <p><strong>Looking for:</strong> {profile.skillsWanted.join(', ')}</p>
              )}
              {profile.skillsOffered && (
                <p><strong>Skills Offered:</strong> {profile.skillsOffered.join(', ')}</p>
              )}
            </div>
            <div className="flex-1 min-w-[30%] flex justify-center items-start">
              <img
                src={profile.profilePic || `https://i.pravatar.cc/100?u=${id}`}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-2"
              />
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h4 className="text-lg font-medium">Rating & Feedback</h4>
              {profile.rating
                ? <p>⭐ {profile.rating} {profile.feedback && `| "${profile.feedback}"`}</p>
                : <p>No ratings yet</p>}
            </div>
            <div className="flex gap-3 mt-4 md:mt‑0">
              <button className="px-4 py-2 bg-gray-100 rounded hover:bg-green-100 transition">👍 Like</button>
              <button className="px-4 py-2 bg-gray-100 rounded hover:bg-red-100 transition">👎 Dislike</button>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowPopup(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Request
            </button>
          </div>
        </main>
      </div>

      {showPopup && currentUser && (
        <SkillRequestPopup
          onClose={() => setShowPopup(false)}
          onSubmit={handleSubmit}
          yourSkills={currentUser.skillsOffered || []}
          theirSkills={profile.skillsWanted || []}
          toUserId={id}
        />
      )}
    </>
  );
};

export default UserProfile;
