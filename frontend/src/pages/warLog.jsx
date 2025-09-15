import React, { useState, useEffect } from "react";
import "./warLog.css";

export default function WarLogPage() {
  const [mode, setMode] = useState("war"); // "war" | "legend"

  // Xử lý chuyển mode
  const handleToggleMode = () => {
    setMode((prev) => (prev === "war" ? "legend" : "war"));
  };

  return (
    <div className="warlog-page">
      <div className="warlog-header">
        <button className="warlog-toggle-btn" onClick={handleToggleMode}>
          {mode === "war" ? "Nhật kí Hội chiến" : "Giải đấu Huyền thoại"}
        </button>
      </div>
      <div className="warlog-content">
        {mode === "war" ? <WarDetailPanel /> : <LegendPanel />}
      </div>
    </div>
  );
}

// Panel hiển thị Hội chiến
function WarDetailPanel() {
  const [warData, setWarData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchWarData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }clan/wardetails/%23UPQJR8JR?page=${page}&limit=40`
      );
      const data = await response.json();
      if (data.warData.length === 0) {
        setHasMore(false);
      } else {
        setWarData((prev) =>
          prev.length ? [...prev, ...data.warData] : data.warData
        );
      }
    } catch (error) {
      console.error("Error fetching war data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarData(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  if (!warData.length && loading) {
    return <div>Loading...</div>;
  }
  if (!warData.length) {
    return <div>No war data available.</div>;
  }

  return (
    <div className="warlog-war-panel">
      <h2>Hội chiến gần đây ({warData.length} trận)</h2>
      <div className="warlog-match-list">
        {warData.map(({ warDetail, warScore }, idx) => {
          // Dữ liệu clan và opponent
          const teamSize = warDetail.teamSize || 15;
          const clanA = warDetail.clan;
          const clanB = warDetail.opponent;
          const starsA = clanA.stars || 0;
          const starsB = clanB.stars || 0;
          const destructionA = clanA.destructionPercentage || 0;
          const destructionB = clanB.destructionPercentage || 0;
          const totalStars = starsA + starsB || 1;
          const totalDestruction = destructionA + destructionB || 1;

          // Kết quả: win/lost/draw
          let resultText = "Hòa";
          let resultClass = "draw";
          if (warScore?.result === "win") {
            resultText = "Thắng";
            resultClass = "win";
          } else if (warScore?.result === "lost") {
            resultText = "Thua";
            resultClass = "lose";
          }

          return (
            <div
              key={`${warDetail._id || "noid"}-${idx}`}
              className="warlog-match-card"
            >
              {/* Dòng 1: Logo - team size - Logo */}
              <div className="warlog-match-row warlog-match-row-logos">
                <img
                  src={clanA.badgeUrls?.small}
                  alt={clanA.name}
                  className="warlog-match-logo-1"
                />
                <span className="warlog-match-size-center">
                  {teamSize}&nbsp;&amp;&nbsp;{teamSize}
                </span>
                <img
                  src={clanB.badgeUrls?.small}
                  alt={clanB.name}
                  className="warlog-match-logo-2"
                />
              </div>
              {/* Dòng 2: Tên - kết quả - tên */}
              <div className="warlog-match-row warlog-match-row-names">
                <span className="warlog-match-clan">{clanA.name}</span>
                <span
                  className={`warlog-match-result warlog-match-result-${resultClass}`}
                >
                  {resultText}
                </span>
                <span className="warlog-match-clan">{clanB.name}</span>
              </div>
              {/* Dòng 3: Thanh sao */}
              <div className="warlog-match-row warlog-match-row-bar">
                <div className="warlog-match-bar warlog-match-bar-stars">
                  <div
                    className="warlog-match-bar-fill warlog-match-bar-fill-a"
                    style={{
                      width: `${(starsA / totalStars) * 100}%`,
                      background: "#ffd700",
                    }}
                    title={`Sao: ${starsA}`}
                  />
                  <div
                    className="warlog-match-bar-fill warlog-match-bar-fill-b"
                    style={{
                      width: `${(starsB / totalStars) * 100}%`,
                      background: "#e0e7ff",
                    }}
                    title={`Sao: ${starsB}`}
                  />
                </div>
                <div className="warlog-match-bar-labels">
                  <span>{starsA}⭐</span>
                  <span>{starsB}⭐</span>
                </div>
              </div>
              {/* Dòng 4: Thanh phá hủy */}
              <div className="warlog-match-row warlog-match-row-bar">
                <div className="warlog-match-bar warlog-match-bar-destruction">
                  <div
                    className="warlog-match-bar-fill warlog-match-bar-fill-a"
                    style={{
                      width: `${(destructionA / totalDestruction) * 100}%`,
                      background: "#27ae60",
                    }}
                    title={`Phá hủy: ${destructionA.toFixed(2)}%`}
                  />
                  <div
                    className="warlog-match-bar-fill warlog-match-bar-fill-b"
                    style={{
                      width: `${(destructionB / totalDestruction) * 100}%`,
                      background: "#e53935",
                    }}
                    title={`Phá hủy: ${destructionB.toFixed(2)}%`}
                  />
                </div>
                <div className="warlog-match-bar-labels">
                  <span>{destructionA.toFixed(2)}%</span>
                  <span>{destructionB.toFixed(2)}%</span>
                </div>
              </div>
              <div className="warlog-match-footer">
                <span>
                  Ngày:{" "}
                  {new Date(warDetail.endTime).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        {loading && (
          <div style={{ textAlign: "center", margin: "16px" }}>Loading...</div>
        )}
        {!hasMore && (
          <div style={{ textAlign: "center", margin: "16px" }}>
            Không còn trận nào nữa.
          </div>
        )}
      </div>
    </div>
  );
}

// Panel hiển thị Giải đấu Huyền thoại (demo)
function LegendPanel() {
  return (
    <div className="warlog-legend-panel">
      <h2>Giải đấu Huyền thoại</h2>
      <div className="warlog-legend-info">
        <p>Chưa có dữ liệu giải đấu huyền thoại.</p>
      </div>
    </div>
  );
}
