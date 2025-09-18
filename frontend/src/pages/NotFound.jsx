import React from "react";
import { assets } from "../assets/assets";

export default function NotFound() {
  return (
    <div
      className="notfound-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 8px",
      }}
    >
      <img
        src={assets.notthing} //xóa background
        alt="Not Found"
        style={{
          width: "220px",
          maxWidth: "80vw",
          marginBottom: "32px",
        }}
      />
      <h1 className="notfound-title">404 - Không tìm thấy trang!</h1>
      <p className="notfound-desc">
        Trang bạn yêu cầu không tồn tại hoặc hệ thống đang bảo trì.
        <br />
        Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
      </p>
      <a href="/" className="notfound-home-btn">
        Về trang chủ
      </a>
      <style>
        {`
        .notfound-page {
          background: #fff;
        }
        .notfound-title {
          color: #646cff;
          font-size: 2.2em;
          font-weight: bold;
          margin-bottom: 12px;
          text-shadow: 0 2px 8px #646cff22;
        }
        .notfound-desc {
          color: #213547;
          font-size: 1.15em;
          margin-bottom: 24px;
          text-align: center;
          max-width: 400px;
        }
        .notfound-home-btn {
          background: #646cff;
          color: #fff;
          padding: 10px 28px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 1em;
          text-decoration: none;
          box-shadow: 0 2px 8px #646cff44;
          transition: background 0.2s;
        }
        .notfound-home-btn:hover {
          background: #ffd700;
          color: #213547;
        }
        @media (prefers-color-scheme: dark) {
          .notfound-page {
            background: #23272f;
          }
          .notfound-title {
            color: #ffd700;
            text-shadow: 0 2px 8px #ffd70044;
          }
          .notfound-desc {
            color: #fff;
          }
          .notfound-home-btn {
            background: #ffd700;
            color: #23272f;
          }
          .notfound-home-btn:hover {
            background: #646cff;
            color: #fff;
          }
        }
        `}
      </style>
    </div>
  );
}
