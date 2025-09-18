import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import "./WarDetail.css";

const getTHImage = (level) => {
  const key = `TH${level}`;
  return assets[key] || assets.TH1;
};

const getArrowColor = (stars) => {
  if (stars === 3) return "#22c55e";
  if (stars === 2) return "#ffd600";
  if (stars === 1) return "#ff9800";
  return "#ef4444";
};

const MEMBER_HEIGHT = 54;

export default function WarDetail() {
  const location = useLocation();
  const war = location.state?.warDetail;
  const containerRef = useRef();
  const clanRefs = useRef([]);
  const oppRefs = useRef([]);
  const [activeAttacker, setActiveAttacker] = useState(null);
  const [lines, setLines] = useState([]);

  // Dummy warScore, bạn có thể fetch từ API nếu cần
  const [dummyWarScore] = useState(null);

  // Dummy scoreMap, nếu có warScore thì map tag → score
  const scoreMap = {};
  if (dummyWarScore && Array.isArray(dummyWarScore.members)) {
    dummyWarScore.members.forEach((m) => {
      scoreMap[m.tag] = m;
    });
  }

  useEffect(() => {
    if (!war || !activeAttacker) {
      setLines([]);
      return;
    }
    const { clan, opponent } = war;
    let clanMembers = [...(clan.members || [])].sort(
      (a, b) => (b.townhallLevel || 0) - (a.townhallLevel || 0)
    );
    let oppMembers = [...(opponent.members || [])].sort(
      (a, b) => (b.townhallLevel || 0) - (a.townhallLevel || 0)
    );

    const newLines = [];
    if (activeAttacker.side === "clan") {
      const mem = clanMembers[activeAttacker.idx];
      if (mem?.attacks) {
        mem.attacks.forEach((atk) => {
          const defenderIdx = oppMembers.findIndex(
            (m) => m.tag === atk.defenderTag
          );
          if (
            defenderIdx !== -1 &&
            clanRefs.current[activeAttacker.idx] &&
            oppRefs.current[defenderIdx]
          ) {
            const fromDiv = clanRefs.current[activeAttacker.idx];
            const toDiv = oppRefs.current[defenderIdx];
            const fromRect = fromDiv.getBoundingClientRect();
            const toRect = toDiv.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const PADDING = 10;
            newLines.push({
              x1: fromRect.right - containerRect.left - PADDING,
              y1: fromRect.top + fromRect.height / 2 - containerRect.top,
              x2: toRect.left - containerRect.left + PADDING,
              y2: toRect.top + toRect.height / 2 - containerRect.top,
              color: getArrowColor(atk.stars),
            });
          }
        });
      }
    } else if (activeAttacker.side === "opp") {
      const mem = oppMembers[activeAttacker.idx];
      if (mem?.attacks) {
        mem.attacks.forEach((atk) => {
          const defenderIdx = clanMembers.findIndex(
            (m) => m.tag === atk.defenderTag
          );
          if (
            defenderIdx !== -1 &&
            oppRefs.current[activeAttacker.idx] &&
            clanRefs.current[defenderIdx]
          ) {
            const fromDiv = oppRefs.current[activeAttacker.idx];
            const toDiv = clanRefs.current[defenderIdx];
            const fromRect = fromDiv.getBoundingClientRect();
            const toRect = toDiv.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const PADDING = 10;
            newLines.push({
              x1: fromRect.left - containerRect.left + PADDING,
              y1: fromRect.top + fromRect.height / 2 - containerRect.top,
              x2: toRect.right - containerRect.left - PADDING,
              y2: toRect.top + toRect.height / 2 - containerRect.top,
              color: getArrowColor(atk.stars),
            });
          }
        });
      }
    }
    setLines(newLines);
  }, [activeAttacker, war]);

  // MVP logic (dummy, nếu có warScore)
  let mvpTag = null;
  if (
    dummyWarScore &&
    Array.isArray(dummyWarScore.members) &&
    dummyWarScore.members.length > 0
  ) {
    const maxScore = Math.max(
      ...dummyWarScore.members.map((m) => m.score || 0)
    );
    const topMembers = dummyWarScore.members.filter(
      (m) => m.score === maxScore
    );
    if (topMembers.length > 0) {
      topMembers.sort((a, b) => (b.order || 0) - (a.order || 0));
      mvpTag = topMembers[0].tag;
    }
  }

  const handleMemberEnter = (side, idx) => setActiveAttacker({ side, idx });
  const handleMemberLeave = () => setActiveAttacker(null);

  if (!war) {
    return (
      <div className="war-detail-empty">Chọn một trận để xem chi tiết</div>
    );
  }

  const { clan, opponent, state } = war;
  let clanMembers = [...(clan.members || [])].sort(
    (a, b) => (b.townhallLevel || 0) - (a.townhallLevel || 0)
  );
  let oppMembers = [...(opponent.members || [])].sort(
    (a, b) => (b.townhallLevel || 0) - (a.townhallLevel || 0)
  );

  return (
    <div
      className="war-detail"
      ref={containerRef}
      style={{ position: "relative" }}
    >
      {/* Header */}
      <div className="war-detail-header">
        <span className="war-detail-name">{clan.name}</span>
        <img
          src={clan.badgeUrls?.medium}
          alt={clan.name}
          className="war-detail-logo"
        />
        <img
          src={opponent.badgeUrls?.medium}
          alt={opponent.name}
          className="war-detail-logo"
        />
        <span className="war-detail-name">{opponent.name}</span>
      </div>

      {/* Score */}
      <div className="war-detail-score">
        <div>
          <b>{clan.destructionPercentage?.toFixed(2) || 0}%</b>
        </div>
        <div>
          <b>{clan.stars}</b> ⭐ - ⭐ <b>{opponent.stars}</b>
        </div>
        <div>
          <b>{opponent.destructionPercentage?.toFixed(2) || 0}%</b>
        </div>
      </div>

      {/* Result */}
      <div className="war-detail-result">
        {state === "preparation"
          ? "Đang chuẩn bị"
          : state === "inWar"
          ? "Đang diễn ra"
          : clan.stars > opponent.stars
          ? "Thắng"
          : clan.stars < opponent.stars
          ? "Thua"
          : clan.destructionPercentage > opponent.destructionPercentage
          ? "Thắng"
          : clan.destructionPercentage < opponent.destructionPercentage
          ? "Thua"
          : "Hòa"}
      </div>

      {/* SVG arrows */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="6"
            markerHeight="6"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 6 3, 0 6" fill="currentColor" />
          </marker>
        </defs>
        {lines.map((line, idx) => (
          <line
            key={idx}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color}
            strokeWidth={2}
            markerEnd="url(#arrowhead)"
          />
        ))}
      </svg>

      {/* Members */}
      <div className="war-detail-columns">
        {/* Clan members */}
        <div className="war-detail-col">
          {clanMembers.map((mem, idx) => {
            // Đảm bảo luôn có title là object
            const title = mem.title || {};
            return (
              <div
                className="war-detail-member"
                key={mem.tag || idx}
                ref={(el) => (clanRefs.current[idx] = el)}
                style={{ height: MEMBER_HEIGHT }}
                onMouseEnter={() => handleMemberEnter("clan", idx)}
                onMouseLeave={handleMemberLeave}
                onClick={() => handleMemberEnter("clan", idx)}
              >
                <div className="war-detail-member-info">
                  <div className="war-detail-member-name">
                    {mem.name}
                    <div className="war-detail-titles">
                      {title.keyWarrior > 0 ||
                      title.giantSlayer > 0 ||
                      title.lastHit ||
                      mem.tag === mvpTag ? (
                        <>
                          {title.keyWarrior > 0 && (
                            <span className="badge-icon">
                              <img src={assets.keyWarrior} alt="KeyWarrior" />x
                              {title.keyWarrior}
                            </span>
                          )}
                          {title.giantSlayer > 0 && (
                            <span className="badge-icon">
                              <img src={assets.giantSlayer} alt="GiantSlayer" />
                              x{title.giantSlayer}
                            </span>
                          )}
                          {title.lastHit && (
                            <span className="badge-icon">
                              <img src={assets.lastHit} alt="LastHit" />
                            </span>
                          )}
                          {mem.tag === mvpTag && (
                            <span className="badge-icon">
                              <img src={assets.MvP} alt="MvP" />
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="badge-icon">-/-</span>
                      )}
                    </div>
                  </div>
                  <img
                    src={getTHImage(mem.townhallLevel?.toString())}
                    alt="TH"
                    className="war-detail-th"
                    style={{ marginRight: 6 }}
                  />
                  <div className="war-detail-member-sub">
                    <span>
                      {Array.isArray(mem.attacks) && mem.attacks.length > 0
                        ? null
                        : "bỏ lượt"}
                    </span>
                    {Array.isArray(mem.attacks) &&
                      mem.attacks.length > 0 &&
                      mem.attacks.map((atk, i) => (
                        <div className="war-detail-attack" key={i}>
                          <span
                            className="war-detail-arrow"
                            style={{ color: getArrowColor(atk.stars) }}
                          >
                            {atk.stars}⭐
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Opponent members */}
        <div className="war-detail-col">
          {oppMembers.map((mem, idx) => (
            <div
              className="war-detail-member"
              key={mem.tag || idx}
              ref={(el) => (oppRefs.current[idx] = el)}
              style={{ height: MEMBER_HEIGHT }}
              onMouseEnter={() => handleMemberEnter("opp", idx)}
              onMouseLeave={handleMemberLeave}
              onClick={() => handleMemberEnter("opp", idx)}
            >
              <div className="war-detail-member-info">
                <div className="war-detail-member-name">{mem.name}</div>
                <img
                  src={getTHImage(mem.townhallLevel?.toString())}
                  alt="TH"
                  className="war-detail-th"
                  style={{ marginRight: 6 }}
                />
                <div className="war-detail-member-sub">
                  <span>
                    {Array.isArray(mem.attacks) && mem.attacks.length > 0
                      ? null
                      : "bỏ lượt"}
                  </span>
                  {Array.isArray(mem.attacks) &&
                    mem.attacks.length > 0 &&
                    mem.attacks.map((atk, i) => (
                      <div className="war-detail-attack" key={i}>
                        <span
                          className="war-detail-arrow"
                          style={{ color: getArrowColor(atk.stars) }}
                        >
                          {atk.stars}⭐
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
