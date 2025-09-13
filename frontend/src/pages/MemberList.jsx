import React, { useEffect, useState } from "react";
import "./Memberlist.css";

const API_URL = `${
  import.meta.env.VITE_SERVER_URL
}clan/playerscores/%23UPQJR8JR`;
const SCORE_TYPES = [
  { key: "warPoints", label: "Lực chiến" },
  { key: "InfluencePoints", label: "Điểm ảnh hưởng" },
  { key: "activepoints", label: "Điểm hoạt động" },
  { key: "clanGamePoints", label: "Điểm sự kiện" },
];

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [sortType, setSortType] = useState("warPoints");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  // Chuẩn hóa dữ liệu và xếp hạng
  const sortedMembers = [...members].sort((a, b) => {
    const getScore = (m) => {
      const scoreObj = m.scores?.[0]?.[sortType];
      return scoreObj && !scoreObj.hidden ? scoreObj.value : -Infinity;
    };
    return sortOrder === "desc"
      ? getScore(b) - getScore(a)
      : getScore(a) - getScore(b);
  });

  return (
    <div className="memberlist-page">
      <div className="memberlist-controls">
        <label>
          Loại điểm:&nbsp;
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            {SCORE_TYPES.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Thứ tự:&nbsp;
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </label>
      </div>
      <div className="memberlist-table-wrap">
        <table className="memberlist-table">
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Người chơi</th>
              <th>{SCORE_TYPES.find((t) => t.key === sortType)?.label}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>Đang tải...</td>
              </tr>
            ) : (
              sortedMembers.map((mem, idx) => {
                const scoreObj = mem.scores?.[0];
                const s = scoreObj?.[sortType];
                return (
                  <tr key={scoreObj?._id || mem.player}>
                    <td>{idx + 1}</td>
                    <td>
                      <span className="memberlist-player">{mem.player}</span>
                    </td>
                    <td>
                      {s
                        ? s.hidden
                          ? "-/-"
                          : typeof s.value === "number"
                          ? s.value.toFixed(2)
                          : s.value
                        : "-/-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
