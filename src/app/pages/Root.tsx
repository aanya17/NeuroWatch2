import { Outlet, Link } from "react-router-dom";

export function Root() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <nav style={{ width: "200px", padding: "20px", borderRight: "1px solid #ddd" }}>
        <h3>NeuroWatch</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="dashboard">Dashboard</Link>
          <Link to="gait">Gait</Link>
          <Link to="voice">Voice</Link>
          <Link to="smartwatch">Smartwatch</Link>
          <Link to="history">History</Link>
          <Link to="profile">Profile</Link>
          <Link to="appointments">Appointments</Link>
          <Link to="support">Support</Link>
          <Link to="suggestions">Suggestions</Link>
        </div>
      </nav>

      {/* Page Content */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}
