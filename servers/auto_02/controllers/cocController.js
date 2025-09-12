import axios from "axios";

const BASE_URL = "https://api.clashofclans.com/v1";
const API_TOKEN = process.env.COC_API_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

// Lấy thông tin player theo tag
export async function getPlayerByTag(tag) {
  try {
    const response = await axiosInstance.get(
      `/players/${encodeURIComponent(tag)}`
    );
    return response.data;
  } catch (err) {
    console.error("getPlayerByTag error:", err.message);
    throw err;
  }
}

// Lấy thông tin clan theo tag
export async function getClanByTag(tag) {
  try {
    const response = await axiosInstance.get(
      `/clans/${encodeURIComponent(tag)}`
    );
    return response.data;
  } catch (err) {
    console.error("getClanByTag error:", err.message);
    throw err;
  }
}

// Lấy danh sách thành viên clan
export async function getClanMembers(tag) {
  try {
    const response = await axiosInstance.get(
      `/clans/${encodeURIComponent(tag)}/members`
    );
    return response.data.items;
  } catch (err) {
    console.error("getClanMembers error:", err.message);
    throw err;
  }
}

// Lấy thông tin war hiện tại của clan
export async function getCurrentWar(tag) {
  try {
    const response = await axiosInstance.get(
      `/clans/${encodeURIComponent(tag)}/currentwar`
    );
    return response.data;
  } catch (err) {
    console.error("getCurrentWar error:", err.message);
    throw err;
  }
}

// Lấy lịch sử war của clan
export async function getWarLog(tag) {
  try {
    const response = await axiosInstance.get(
      `/clans/${encodeURIComponent(tag)}/warlog`
    );
    return response.data.items;
  } catch (err) {
    console.error("getWarLog error:", err.message);
    throw err;
  }
}

// Lấy thông tin chi tiết war normal theo clanTag
export async function getNormalWarDetails(tag) {
  try {
    const response = await axiosInstance.get(
      `/clans/${encodeURIComponent(tag)}/currentwar`
    );
    return response.data;
  } catch (err) {
    console.error("getNormalWarDetails error:", err.message);
    throw err;
  }
}

// Lấy thông tin nhóm war league hiện tại của clan
export async function getCurrentWarLeagueGroup(clanTag) {
  try {
    const res = await axiosInstance.get(
      `/clans/${encodeURIComponent(clanTag)}/currentwar/leaguegroup`
    );
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.log(`⚠️ Clan ${clanTag} không tham gia CWL, bỏ qua.`);
      return null;
    } else {
      console.error("getCurrentWarLeagueGroup error:", err.message);
      throw err;
    }
  }
}

// Lấy chi tiết war league theo warTag
export async function getWarLeagueWarDetails(warTag) {
  try {
    const response = await axiosInstance.get(
      `/clanwarleagues/wars/${encodeURIComponent(warTag)}`
    );
    return response.data;
  } catch (err) {
    console.error("getWarLeagueWarDetails error:", err.message);
    throw err;
  }
}

// Lấy các labels của clan
export async function getClanLabels(tag) {
  try {
    const response = await axiosInstance.get(
      `/clans/${encodeURIComponent(tag)}/labels`
    );
    return response.data.items;
  } catch (err) {
    console.error("getClanLabels error:", err.message);
    throw err;
  }
}

// Tìm kiếm clan theo tên
export async function searchClans(name) {
  try {
    const response = await axiosInstance.get(
      `/clans?name=${encodeURIComponent(name)}`
    );
    return response.data.items;
  } catch (err) {
    console.error("searchClans error:", err.message);
    throw err;
  }
}

// Lấy danh sách location
export async function getLocations() {
  try {
    const response = await axiosInstance.get(`/locations`);
    return response.data.items;
  } catch (err) {
    console.error("getLocations error:", err.message);
    throw err;
  }
}

// Lấy bảng xếp hạng clan theo location
export async function getLocationClanRankings(locationId) {
  try {
    const response = await axiosInstance.get(
      `/locations/${locationId}/rankings/clans`
    );
    return response.data.items;
  } catch (err) {
    console.error("getLocationClanRankings error:", err.message);
    throw err;
  }
}

// Lấy bảng xếp hạng người chơi theo location
export async function getLocationPlayerRankings(locationId) {
  try {
    const response = await axiosInstance.get(
      `/locations/${locationId}/rankings/players`
    );
    return response.data.items;
  } catch (err) {
    console.error("getLocationPlayerRankings error:", err.message);
    throw err;
  }
}

// Lấy danh sách league
export async function getLeagues() {
  try {
    const response = await axiosInstance.get(`/leagues`);
    return response.data.items;
  } catch (err) {
    console.error("getLeagues error:", err.message);
    throw err;
  }
}

// Lấy chi tiết league
export async function getLeagueDetails(leagueId) {
  try {
    const response = await axiosInstance.get(`/leagues/${leagueId}`);
    return response.data;
  } catch (err) {
    console.error("getLeagueDetails error:", err.message);
    throw err;
  }
}

// Lấy danh sách labels cho clan
export async function getClanLabelsList() {
  try {
    const response = await axiosInstance.get(`/labels/clans`);
    return response.data.items;
  } catch (err) {
    console.error("getClanLabelsList error:", err.message);
    throw err;
  }
}

// Lấy danh sách labels cho player
export async function getPlayerLabelsList() {
  try {
    const response = await axiosInstance.get(`/labels/players`);
    return response.data.items;
  } catch (err) {
    console.error("getPlayerLabelsList error:", err.message);
    throw err;
  }
}
