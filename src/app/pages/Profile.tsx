import { useState, useEffect } from "react";

export function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    age: "",
    gender: ""
  });

  // Load saved profile on page load
  useEffect(() => {
    const savedProfile = localStorage.getItem("neuro_profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updatedProfile = {
      ...profile,
      [e.target.name]: e.target.value
    };

    setProfile(updatedProfile);

    // Save instantly to localStorage
    localStorage.setItem("neuro_profile", JSON.stringify(updatedProfile));
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px" }}>
      <h2>Profile Settings</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={profile.age}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Gender</label>
          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

      </div>
    </div>
  );
}
