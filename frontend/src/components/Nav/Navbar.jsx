import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const menuOptions = [
    { label: "Trang chủ", path: "/" },
    { label: "Hội của tôi", path: "/claninfo" },
    { label: "Thành viên hội", path: "/memberlist" },
    { label: "Liên hệ", path: "/contact" },
    { label: "Trợ giúp", path: "/help" },
  ];

  return (
    <nav className="navbar">
      <button
        className="navbar-menu-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
      >
        <span className="navbar-icon">&#9776;</span>
      </button>
      <div className={`navbar-side-menu${open ? " open" : ""}`}>
        <button
          className="navbar-close-btn"
          onClick={() => setOpen(false)}
          aria-label="Đóng"
        >
          &times;
        </button>
        <ul>
          {menuOptions.map((opt) => (
            <li key={opt.path}>
              <a
                href={opt.path}
                className={
                  location.pathname === opt.path
                    ? "navbar-menu-active"
                    : undefined
                }
              >
                {opt.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-icons">
        <button className="navbar-icon-btn" aria-label="Contact">
          <span className="navbar-icon">&#9993;</span>
        </button>
        <button className="navbar-icon-btn" aria-label="Help">
          <span className="navbar-icon">&#10067;</span>
        </button>
        <button className="navbar-icon-btn" aria-label="Profile">
          <span className="navbar-icon">&#128100;</span>
        </button>
      </div>
    </nav>
  );
}
