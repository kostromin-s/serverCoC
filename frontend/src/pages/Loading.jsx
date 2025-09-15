import React from "react";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2 style={{ color: "#646cff", marginBottom: "24px" }}>
        Đang tải dữ liệu...
      </h2>
      <div className="wave-loading-bar">
        {[...Array(7)].map((_, i) => (
          <div
            className="wave-bar"
            key={i}
            style={{ animationDelay: `${i * 0.13}s` }}
          />
        ))}
      </div>
      <style>
        {`
        .wave-loading-bar {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          height: 48px;
        }
        .wave-bar {
          width: 12px;
          height: 40px;
          background: #646cff;
          border-radius: 8px;
          animation: waveJump 1s infinite ease-in-out;
        }
        @keyframes waveJump {
          0%, 100% { transform: scaleY(0.5);}
          40% { transform: scaleY(1.4);}
          60% { transform: scaleY(0.8);}
        }
        @media (prefers-color-scheme: dark) {
          .wave-bar {
            background: #ffd700;
          }
          body, .wave-loading-bar {
            background: #23272f !important;
          }
          h2 {
            color: #ffd700 !important;
          }
        }
        `}
      </style>
    </div>
  );
}
