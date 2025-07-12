import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { getAuth } from "firebase/auth";

const SkillRequestPopup = ({ onClose, yourSkills, theirSkills, toUserId }) => {
  const [yourSkill, setYourSkill] = useState("");
  const [theirSkill, setTheirSkill] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const db = getDatabase();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please log in to send a request.");
      return;
    }

    if (!yourSkill || !theirSkill || !message.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    const requestData = {
      fromUserId: currentUser.uid,
      toUserId: toUserId,
      offeredSkill: yourSkill,
      wantedSkill: theirSkill,
      message: message,
      status: "pending",
      timestamp: Date.now(),
    };

    try {
      await push(ref(db, "requests"), requestData);
      alert("✅ Request sent successfully!");
      onClose();
    } catch (err) {
      console.error("❌ Error sending request:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      {/* Inline CSS (scoped to component) */}
      <style>{`
        .popup-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .form-card {
          background-color: #fff;
          padding: 30px 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
          position: relative;
        }

        .form-card form {
          display: flex;
          flex-direction: column;
        }

        .form-card label {
          margin-bottom: 6px;
          font-weight: 500;
          font-size: 14px;
        }

        .form-card select,
        .form-card textarea {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
          background-color: white;
          width: 100%;
        }

        .form-card textarea {
          resize: none;
        }

        .form-card button[type="submit"] {
          background-color: #9706df;
          color: white;
          padding: 10px;
          font-size: 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .form-card button[type="submit"]:hover {
          background-color: #7e05b6;
        }

        .popup-close {
          position: absolute;
          top: 8px;
          right: 12px;
          background: none;
          border: none;
          font-size: 22px;
          cursor: pointer;
          color: #888;
        }

        @media (max-width: 500px) {
          .form-card {
            padding: 20px 15px;
          }

          .form-card button {
            font-size: 15px;
          }
        }
      `}</style>

      <div className="popup-overlay">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <label htmlFor="your-skill">Choose one of your offered skills</label>
            <select
              id="your-skill"
              value={yourSkill}
              onChange={(e) => setYourSkill(e.target.value)}
              required
            >
              <option value="" disabled>Select your skill</option>
              {yourSkills.map((skill, i) => (
                <option key={i} value={skill}>{skill}</option>
              ))}
            </select>

            <label htmlFor="their-skill">Choose one of their wanted skills</label>
            <select
              id="their-skill"
              value={theirSkill}
              onChange={(e) => setTheirSkill(e.target.value)}
              required
            >
              <option value="" disabled>Select their skill</option>
              {theirSkills.map((skill, i) => (
                <option key={i} value={skill}>{skill}</option>
              ))}
            </select>

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="4"
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <button type="submit">Submit</button>
          </form>

          <button className="popup-close" onClick={onClose}>×</button>
        </div>
      </div>
    </>
  );
};

export default SkillRequestPopup;
