import React, { useRef, useEffect, useState } from "react";
import "./Troop.css";

export default function Troop({ troop }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState(20);
  const [showOwners, setShowOwners] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});

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

  const available = troop.member && troop.member.length > 0;
  // Kiểm tra có member nào active true
  const hasActive = troop.member?.some((m) => m.active);

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

  // Sắp xếp member active:true lên đầu
  const sortedMembers = troop.member
    ? [...troop.member].sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0))
    : [];

  return (
    <div
      className={`troop-square ${available ? "" : "disabled"} ${
        hasActive ? " troop-active-border" : ""
      }`}
      ref={containerRef}
      tabIndex={0}
      onMouseEnter={() => setShowOwners(true)}
      onMouseLeave={() => setShowOwners(false)}
      onClick={() => {
        ``;
        setShowOwners((v) => !v);
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const popupWidth = 140;
          const popupHeight = 110;
          let style = {
            left: "50%",
            top: "100%",
            transform: "translateX(-50%)",
          };
          if (rect.right + popupWidth > window.innerWidth) {
            style = { left: "auto", right: 0, top: "100%", transform: "none" };
          } else if (rect.left - popupWidth < 0) {
            style = { left: 0, top: "100%", transform: "none" };
          }
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
        background: `${hasActive ? "#ff3c00ff" : "#ffa600ff"}`,
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
      {/* Hiển thị badge active nếu có member active:true */}
      {hasActive && (
        <div
          className="troop-active-badge"
          style={{
            right: 2,
            bottom: 2,
            position: "absolute",
            background: "#27ae60",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "0.7em",
            borderRadius: 4,
            width: size * 0.7,
            height: size * 0.7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px #0006",
          }}
        ></div>
      )}
      {showOwners && troop.member && troop.member.length > 0 && (
        <div className="troop-owners-popup" style={popupStyle}>
          <div className="troop-owners-title">Người sở hữu:</div>
          <div className="troop-owners-list">
            {sortedMembers
              .filter((m) => m.name)
              .map((m, idx) => (
                <div className="troop-owner-row" key={m.name + idx}>
                  <span className="troop-owner-name">{m.name}</span>
                  {m.active && (
                    <div
                      className="troop-active-badge"
                      style={{
                        background: "#27ae60",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.7em",
                        borderRadius: 4,
                        minWidth: 32,
                        height: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px #0006",
                        marginLeft: 6,
                      }}
                    ></div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
