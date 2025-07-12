import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import logo from "../Images/Swap-removebg-preview.png";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch profilePic from Realtime Database
        try {
          const snapshot = await get(ref(database, `users/${currentUser.uid}`));
          if (snapshot.exists()) {
            const data = snapshot.val();
            setProfilePhoto(data.profilePic || `https://i.pravatar.cc/150?u=${currentUser.uid}`);
          }
        } catch (err) {
          console.error("Error fetching profile photo:", err);
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between relative overflow-visible">
      {/* Left: Logo + Swap Requests */}
      <div className="flex items-center gap-4 relative">
        <Link to="/">
          <img
            src={logo}
            alt="SkillSwap"
            className="h-32 w-auto object-contain -mt-12"
            style={{ marginBottom: "-2rem", cursor: "pointer" }}
          />
        </Link>

        <Link
          to="/swap-requests"
          className="text-purple-600 font-medium hover:underline transition ml-2"
        >
          Swap Requests
        </Link>
      </div>

      {/* Right: Profile or Login */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <img
              src={profilePhoto}
              alt="Profile"
              className="h-8 w-8 rounded-full border-2 border-purple-500 object-cover cursor-pointer"
              onClick={() => navigate("/profile")}
              title="Go to Profile"
            />
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-purple-600 text-white px-3 py-1.5 text-sm rounded hover:bg-purple-700 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;