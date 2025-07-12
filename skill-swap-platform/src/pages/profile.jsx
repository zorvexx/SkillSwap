import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, update, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const skillList = [
  "Web Development",
  "App Development",
  "Python",
  "Java",
  "C++",
  "Machine Learning",
  "UI/UX Design",
  "Graphic Design",
  "Cybersecurity",
  "Blockchain",
  "React",
  "Node.js",
  "Firebase",
  "SQL",
  "MongoDB",
  "Cloud Computing",
  "DevOps",
];

const isValidGitHubLink = (link) =>
  /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(link);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    about: "",
    skillsOffered: [],
    skillsWanted: [],
    projectName: "",
    projectLink: "",
    projectDesc: "",
    projects: [],
    availability: "",
    profilePic: "https://i.pravatar.cc/150",
  });

  const [skillInput, setSkillInput] = useState("");
  const [wantInput, setWantInput] = useState("");
  const navigate = useNavigate();

  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setForm((prev) => ({ ...prev, ...data, email: currentUser.email }));
        } else {
          setForm((prev) => ({ ...prev, email: currentUser.email }));
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const match = skillList.find(
        (skill) => skill.toLowerCase() === skillInput.trim().toLowerCase()
      );
      if (match && !form.skillsOffered.includes(match)) {
        setForm((prev) => ({
          ...prev,
          skillsOffered: [...prev.skillsOffered, match],
        }));
        setSkillInput("");
      } else {
        alert("❌ Please select a valid skill from the list.");
      }
    }
  };

  const addWant = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const match = skillList.find(
        (skill) => skill.toLowerCase() === wantInput.trim().toLowerCase()
      );
      if (match && !form.skillsWanted.includes(match)) {
        setForm((prev) => ({
          ...prev,
          skillsWanted: [...prev.skillsWanted, match],
        }));
        setWantInput("");
      } else {
        alert("❌ Please select a valid skill from the list.");
      }
    }
  };

  const removeSkill = (index) => {
    const updated = [...form.skillsOffered];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, skillsOffered: updated }));
  };

  const removeWant = (index) => {
    const updated = [...form.skillsWanted];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, skillsWanted: updated }));
  };

  const addProject = () => {
    if (form.projectName && form.projectLink) {
      if (!isValidGitHubLink(form.projectLink)) {
        alert("❌ Please provide a valid GitHub repository link.");
        return;
      }
      const newProject = {
        name: form.projectName,
        link: form.projectLink,
        desc: form.projectDesc,
      };
      setForm((prev) => ({
        ...prev,
        projects: [...prev.projects, newProject],
        projectName: "",
        projectLink: "",
        projectDesc: "",
      }));
    }
  };

  const removeProject = (index) => {
    if (!user) return;
    const updatedProjects = [...form.projects];
    updatedProjects.splice(index, 1);
    setForm((prev) => ({ ...prev, projects: updatedProjects }));

    const userRef = ref(db, `users/${user.uid}`);
    update(userRef, { projects: updatedProjects }).catch((err) =>
      console.error("❌ Error removing project:", err)
    );
  };

  const uploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setForm((prev) => ({ ...prev, profilePic: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setForm((prev) => ({
      ...prev,
      profilePic: "https://i.pravatar.cc/150",
    }));
  };

  const handleSubmit = () => {
    if (!user) return;
    const dataToSave = {
      name: form.name,
      email: form.email,
      location: form.location,
      availability: form.availability,
      about: form.about,
      skillsOffered: form.skillsOffered,
      skillsWanted: form.skillsWanted,
      projects: form.projects,
      profilePic: form.profilePic,
    };
    const userRef = ref(db, `users/${user.uid}`);
    update(userRef, dataToSave)
      .then(() => {
        alert("✅ Profile updated successfully.");
      })
      .catch((error) => {
        console.error("❌ Error saving profile data:", error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-5">
        <form className="flex flex-wrap gap-8" onSubmit={(e) => e.preventDefault()}>
          <div className="flex-1 min-w-[300px]">
            {/* Name, Email, Location */}
            <div className="mb-4">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="mb-4">
              <label>Email</label>
              <input type="email" value={form.email} readOnly className="w-full border px-3 py-2 rounded bg-gray-100" />
            </div>
            <div className="mb-4">
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="mb-4">
              <label>Availability</label>
              <select
                name="availability"
                value={form.availability}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
              </select>
            </div>

            {/* Skills Offered */}
            <div className="mb-4">
              <label>Skills Offered</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.skillsOffered.map((skill, i) => (
                  <span key={i} className="bg-gray-200 px-3 py-1 rounded-full">
                    {skill}{" "}
                    <button type="button" onClick={() => removeSkill(i)}>×</button>
                  </span>
                ))}
              </div>
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder="Type & press Enter"
                className="w-full border px-3 py-2 rounded"
              />
              {skillInput && (
                <div className="border bg-white rounded shadow p-2 max-h-40 overflow-y-auto">
                  {skillList
                    .filter(
                      (skill) =>
                        skill.toLowerCase().includes(skillInput.toLowerCase()) &&
                        !form.skillsOffered.includes(skill)
                    )
                    .map((skill, i) => (
                      <div
                        key={i}
                        className="cursor-pointer hover:bg-purple-100 px-2 py-1"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            skillsOffered: [...prev.skillsOffered, skill],
                          }));
                          setSkillInput("");
                        }}
                      >
                        {skill}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Skills Wanted */}
            <div className="mb-4">
              <label>Skills Wanted</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.skillsWanted.map((skill, i) => (
                  <span key={i} className="bg-gray-200 px-3 py-1 rounded-full">
                    {skill}{" "}
                    <button type="button" onClick={() => removeWant(i)}>×</button>
                  </span>
                ))}
              </div>
              <input
                value={wantInput}
                onChange={(e) => setWantInput(e.target.value)}
                onKeyDown={addWant}
                placeholder="Type & press Enter"
                className="w-full border px-3 py-2 rounded"
              />
              {wantInput && (
                <div className="border bg-white rounded shadow p-2 max-h-40 overflow-y-auto">
                  {skillList
                    .filter(
                      (skill) =>
                        skill.toLowerCase().includes(wantInput.toLowerCase()) &&
                        !form.skillsWanted.includes(skill)
                    )
                    .map((skill, i) => (
                      <div
                        key={i}
                        className="cursor-pointer hover:bg-purple-100 px-2 py-1"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            skillsWanted: [...prev.skillsWanted, skill],
                          }));
                          setWantInput("");
                        }}
                      >
                        {skill}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Projects */}
            <div className="mb-4">
              <label>Project Name</label>
              <input name="projectName" value={form.projectName} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="mb-4">
              <label>GitHub Link</label>
              <input name="projectLink" value={form.projectLink} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="mb-4">
              <label>Project Description</label>
              <textarea name="projectDesc" value={form.projectDesc} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <button type="button" onClick={addProject} className="bg-purple-600 text-white px-5 py-2 rounded">Add Project</button>
          </div>

          {/* Right Section */}
          <div className="flex-1 min-w-[300px]">
            <div className="text-center mb-4">
              <img src={form.profilePic} alt="Profile" className="w-32 h-32 rounded-full mx-auto object-cover border-2" />
              <div className="mt-2 flex justify-center gap-2">
                <label className="bg-gray-200 px-4 py-2 rounded cursor-pointer">
                  Upload
                  <input type="file" accept="image/*" onChange={uploadPhoto} className="hidden" />
                </label>
                <button type="button" className="text-red-600" onClick={removePhoto}>Remove</button>
              </div>
            </div>

            <div className="mb-4">
              <label>About Me</label>
              <textarea name="about" value={form.about} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" rows="6" />
            </div>

            {/* Projects List */}
            <div>
              <h4 className="font-semibold mt-4 mb-2">Projects</h4>
              {form.projects.map((proj, i) => (
                <div key={i} className="bg-white shadow p-3 mb-2 rounded relative">
                  <strong>{proj.name}</strong><br />
                  <a href={proj.link} target="_blank" rel="noopener noreferrer">{proj.link}</a>
                  <p>{proj.desc}</p>
                  <button
                    onClick={() => removeProject(i)}
                    className="absolute top-1 right-2 text-red-500 text-lg font-bold"
                    title="Remove project"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="text-center mt-6">
          <button onClick={handleSubmit} className="bg-purple-600 text-white px-6 py-3 rounded font-semibold hover:bg-purple-700">Save</button>
        </div>
      </div>
    </>
  );
};

export default Profile;
