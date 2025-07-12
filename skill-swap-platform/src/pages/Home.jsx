import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "../firebase"; // Your firebase.js setup
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [availability, setAvailability] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // 🔐 Track current user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const snapshot = await get(ref(database, "users"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const result = Object.entries(data)
            .map(([id, value]) => ({
              id,
              ...value,
            }))
            .filter((profile) => profile.name); // Only if name exists
          setProfiles(result);
        } else {
          console.log("❌ No user profiles found in Realtime DB.");
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);
const navigate = useNavigate();

const handleRequest = (id) => {
  if (!currentUser) {
    alert("Please log in to send a request.");
  } else {
    navigate(`/user/${id}`);
  }
};

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch = profile.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesAvailability =
      !availability || profile.availability === availability;
    return matchesSearch && matchesAvailability;
  });

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6 text-black">
        {/* Filter and Search */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="bg-white border border-gray-300 rounded px-4 py-2"
          >
            <option value="">Availability</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
          </select>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
          />
          <button
            className="border px-4 py-2 rounded hover:bg-black hover:text-white transition"
            onClick={(e) => e.preventDefault()} // optional
          >
            Search
          </button>
        </div>

        {/* Profiles List */}
        <div className="space-y-4">
          {filteredProfiles.map((user, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between items-start md:items-center shadow"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={user.profilePic || "https://i.pravatar.cc/100"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-black object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p>
                    <span className="text-green-600">Skills Offered:</span>{" "}
                    {user.skillsOffered?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gray-300 px-2 py-1 rounded-full text-sm mx-1 inline-block"
                      >
                        {skill}
                      </span>
                    ))}
                  </p>
                  <p>
                    <span className="text-blue-600">Skills Wanted:</span>{" "}
                    {user.skillsWanted?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gray-300 px-2 py-1 rounded-full text-sm mx-1 inline-block"
                      >
                        {skill}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={() => handleRequest(user.id)}
                  className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded text-white"
                >
                  Request
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Rating: {user.rating ?? "N/A"}/5
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Mockup */}
        <div className="flex justify-center mt-6 space-x-2 text-black">
          <button className="px-3 py-1 border rounded">&lt;</button>
          <button className="px-3 py-1 border rounded bg-black text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded">2</button>
          <button className="px-3 py-1 border rounded">3</button>
          <button className="px-3 py-1 border rounded">&gt;</button>
        </div>
      </div>
    </>
  );
};

export default Home;