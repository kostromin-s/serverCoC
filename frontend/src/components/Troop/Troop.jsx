import React, { useRef, useEffect, useState } from "react";
import "./Troop.css";

export default function Troop({ troop }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState(20);
  const [showOwners, setShowOwners] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});

  // Tính kích thước dựa trên phần tử cha
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setSize(w);
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Tìm level cao nhất đối
  const maxLv = troop.maxLevel;
  const highestLv =
    troop.member && troop.member.length
      ? Math.max(...troop.member.map((m) => m.level || 0))
      : 0;

  // Xử lý đóng popup khi click ra ngoài
  useEffect(() => {
    if (!showOwners) return;
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowOwners(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [showOwners]);
  const available = troop.member && troop.member.length > 0;
  return (
    <div
      className={`troop-square ${!available ? "disabled" : ""}`}
      ref={containerRef}
      tabIndex={0}
      onMouseEnter={() => setShowOwners(true)}
      onMouseLeave={() => setShowOwners(false)}
      onClick={() => {
        setShowOwners((v) => !v);
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const popupWidth = 140; // ước lượng width popup
          const popupHeight = 110; // ước lượng height popup
          let style = {
            left: "50%",
            top: "100%",
            transform: "translateX(-50%)",
          };

          // Nếu troop gần lề phải
          if (rect.right + popupWidth > window.innerWidth) {
            style = { left: "auto", right: 0, top: "100%", transform: "none" };
          }
          // Nếu troop gần lề trái
          else if (rect.left - popupWidth < 0) {
            style = { left: 0, top: "100%", transform: "none" };
          }
          // Nếu troop gần lề dưới
          if (rect.bottom + popupHeight > window.innerHeight) {
            style.top = "auto";
            style.bottom = "100%";
          }
          setPopupStyle(style);
        }
      }}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size,
      }}
    >
      <img
        src={troop.img}
        alt={troop.name}
        className="troop-img"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: size * 0.12,
        }}
      />
      <div
        className="troop-level-badge"
        style={{
          fontSize: "0.7em",
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: 4,
          background: highestLv === maxLv ? "#ff9800" : "#222",
          color: "#fff",
          right: 2,
          bottom: 2,
          position: "absolute",
          textAlign: "center",
          lineHeight: `${size * 0.7}px`,
        }}
      >
        {highestLv}
      </div>
      {showOwners && troop.member && troop.member.length > 0 && (
        <div className="troop-owners-popup" style={popupStyle}>
          <div className="troop-owners-title">Người sở hữu:</div>
          <div className="troop-owners-list">
            {troop.member
              .filter((m) => m.name && m.level)
              .map((m, idx) => (
                <div className="troop-owner-row" key={m.name + idx}>
                  <span className="troop-owner-name">{m.name}</span>
                  <span className="troop-owner-lv">Lv {m.level}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
