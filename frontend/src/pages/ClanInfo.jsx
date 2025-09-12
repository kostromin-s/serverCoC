import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ClanInfo.css";
import Troop from "../components/Troop/Troop.jsx";
import SuperTroop from "../components/Troop/SuperTroop.jsx";

export default function ClanInfo() {
  const [clanData, setData] = useState(null);
  const [troopData, setTroopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kích thước troop nhỏ
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const troopSize = isMobile ? 15 : 20;

  useEffect(() => {
    const myClanTag = encodeURIComponent("#UPQJR8JR");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}clan/claninfo/${myClanTag}`
        );
        if (!response.data) {
          throw new Error("No data found");
        }

        setData(response.data);

        const troopResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}clan/troops/${myClanTag}`
        );
        if (!troopResponse.data) {
          throw new Error("No troop data found");
        }
        setTroopData(troopResponse.data);
        console.log(troopResponse.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const leader = clanData.memberList?.find((m) => m.role === "leader");
  const coLeaders = clanData.memberList?.filter((m) => m.role === "coLeader");
  const topMembers = clanData.memberList
    ?.filter((m) => m.role === "member" || m.role === "admin")
    ?.sort((a, b) => b.trophies - a.trophies)
    ?.slice(0, 5);

  // Các nhóm binh lính
  const troopGroups = [
    { title: "Binh lính thường", troops: troopData.normalTroop },
    { title: "Binh lính siêu cấp", troops: troopData.superTroop },
    { title: "Binh lính căn cứ thợ xây", troops: troopData.builderBaseTroop },
    { title: "Cỗ máy chiến đấu", troops: troopData.machineTroop },
    { title: "Thần chú", troops: troopData.spells },
  ];

  return (
    <>
      <div className="claninfo-banner">
        <img
          src="https://res.cloudinary.com/djur9k6hk/image/upload/v1754723963/CoC_bod_2025_vkzk9l.jpg"
          alt="Clan Cover"
          className="claninfo-banner-bg"
        />
        <div className="claninfo-banner-info">
          <img
            src={clanData.badgeUrls?.large}
            alt="Clan Logo"
            className="claninfo-banner-logo claninfo-banner-logo-nobg"
          />
          <span className="claninfo-banner-name">{clanData.name}</span>
        </div>
      </div>
      {leader && (
        <div className="claninfo-leaderbar">
          <div className="claninfo-join-section">
            <div className="claninfo-leaderbar-description">
              {clanData.description}
            </div>
            <a
              className="claninfo-join-btn"
              href={`https://link.clashofclans.com/vi?action=OpenClanProfile&tag=${clanData.tag.replace(
                "#",
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Gia nhập Clan
            </a>
          </div>
          <div className="claninfo-leader-info">
            <div className="claninfo-leader-avatar-wrap">
              <img
                src={leader.league?.iconUrls?.medium}
                alt={leader.name}
                className="claninfo-leader-avatar"
              />
            </div>
            <div className="claninfo-leader-namebox">
              <span className="claninfo-leader-label">Thủ lĩnh</span>
              <span className="claninfo-leader-name">{leader.name}</span>
            </div>
          </div>
        </div>
      )}
      {/* Thông tin clan */}
      <div className="claninfo-details">
        {/* Labels */}
        <div className="clan-labels">
          {clanData.labels?.map((label) => (
            <img
              key={label.id}
              src={label.iconUrls.small}
              alt={label.name}
              title={label.name}
            />
          ))}
        </div>
        {/* Stats */}
        <div className="clan-stats">
          <div>
            <strong>Điểm:</strong> {clanData.clanPoints}
          </div>
          <div>
            <strong>Thành viên:</strong> {clanData.members}
          </div>
          <div>
            <strong>Yêu cầu chiến tích:</strong> {clanData.requiredTrophies}
          </div>
          <div>
            <strong>Yêu cầu nhà chính cấp:</strong>{" "}
            {clanData.requiredTownhallLevel}
          </div>
        </div>
        {/* War */}
        <div className="clan-war">
          <div>
            <strong>Tần suất:</strong> {clanData.warFrequency}
          </div>
          <div>
            <strong>Chuỗi thắng:</strong> {clanData.warWinStreak}
          </div>
          <div>
            <strong>Thắng/Tổng số trận:</strong> {clanData.warWins} /{" "}
            {clanData.warTies + clanData.warLosses + clanData.warWins}
            {/* Thanh biểu đồ kết quả war */}
            <div className="clan-war-bar">
              <div
                style={{
                  background: "#ffd700",
                  width:
                    (clanData.warWins /
                      (clanData.warWins +
                        clanData.warTies +
                        clanData.warLosses)) *
                      100 +
                    "%",
                  transition: "width 0.5s",
                }}
                title={`Thắng: ${clanData.warWins}`}
              />
              <div
                style={{
                  background: "#7afff4ff",
                  width:
                    (clanData.warTies /
                      (clanData.warWins +
                        clanData.warTies +
                        clanData.warLosses)) *
                      100 +
                    "%",
                  transition: "width 0.5s",
                }}
                title={`Hòa: ${clanData.warTies}`}
              />
              <div
                style={{
                  background: "#e53935",
                  width:
                    (clanData.warLosses /
                      (clanData.warWins +
                        clanData.warTies +
                        clanData.warLosses)) *
                      100 +
                    "%",
                  transition: "width 0.5s",
                }}
                title={`Thua: ${clanData.warLosses}`}
              />
            </div>
          </div>
        </div>
        {/* Language */}
        <div className="clan-lang">
          <strong>Ngôn ngữ chat:</strong> {clanData.chatLanguage?.name}
        </div>
      </div>
      {/* Danh sách đồng thủ lĩnh và Top 5 thành viên tiêu biểu */}
      {(coLeaders?.length > 0 || topMembers?.length > 0) && (
        <div className="claninfo-lists-row">
          {coLeaders?.length > 0 && (
            <div className="claninfo-coleader-list">
              <h3>Đồng thủ lĩnh</h3>
              <div className="claninfo-coleaders">
                {coLeaders.map((co) => (
                  <div className="claninfo-coleader" key={co.tag}>
                    <img
                      src={co.league?.iconUrls?.small}
                      alt={co.name}
                      className="claninfo-coleader-avatar"
                    />
                    <span className="claninfo-coleader-name">{co.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {topMembers?.length > 0 && (
            <div className="claninfo-topmembers-list">
              <h3>Top 5 thành viên tiêu biểu</h3>
              <div className="claninfo-topmembers">
                {topMembers.map((mem) => (
                  <div className="claninfo-topmember" key={mem.tag}>
                    <img
                      src={mem.league?.iconUrls?.small}
                      alt={mem.name}
                      className="claninfo-topmember-avatar"
                    />
                    <div className="claninfo-topmember-info">
                      <span className="claninfo-topmember-name">
                        {mem.name}
                      </span>
                      <span className="claninfo-topmember-trophy">
                        {mem.trophies}🏆
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Hiển thị các nhóm binh lính */}
      <div className="claninfo-troop-section">
        {/*Nếu là troop siêu cấp thì hiển thị component SuperTroop */}
        {troopGroups.map(
          (group) =>
            group.troops?.length > 0 && (
              <TroopGroup
                key={group.title}
                title={group.title}
                troops={group.troops}
                size={troopSize}
              />
            )
        )}
      </div>
    </>
  );
}

function TroopGroup({ title, troops, size }) {
  return (
    <div className="troop-group">
      <h3 className="troop-group-title">{title}</h3>
      <div className="troop-group-list">
        {troops.map((troop) => (
          <div className="troop-group-item" key={troop.name}>
            {title === "Binh lính siêu cấp" ? (
              <SuperTroop troop={troop} size={size} />
            ) : (
              <Troop troop={troop} size={size} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
