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
  const response = await axiosInstance.get(
    `/players/${encodeURIComponent(tag)}`
  );
  return response.data;
}

// Lấy thông tin clan theo tag
export async function getClanByTag(tag) {
  const response = await axiosInstance.get(`/clans/${encodeURIComponent(tag)}`);
  return response.data;
}

// Lấy danh sách thành viên clan
export async function getClanMembers(tag) {
  const response = await axiosInstance.get(
    `/clans/${encodeURIComponent(tag)}/members`
  );
  return response.data.items;
}

// Lấy thông tin war hiện tại của clan
export async function getCurrentWar(tag) {
  const response = await axiosInstance.get(
    `/clans/${encodeURIComponent(tag)}/currentwar`
  );
  return response.data;
}

// Lấy lịch sử war của clan
export async function getWarLog(tag) {
  const response = await axiosInstance.get(
    `/clans/${encodeURIComponent(tag)}/warlog`
  );
  return response.data.items;
}

// Lấy thông tin chi tiết war normal theo clanTag
export async function getNormalWarDetails(tag) {
  const response = await axiosInstance.get(
    `/clans/${encodeURIComponent(tag)}/war`
  );
  return response.data;
}

// Lấy thông tin nhóm war league hiện tại của clan
export async function getCurrentWarLeagueGroup(tag) {
  const response = await axiosInstance.get(
    `/clans/${encodeURIComponent(tag)}/currentwar/leaguegroup`
  );
  return response.data;
}

// Lấy chi tiết war league theo warTag
export async function getWarLeagueWarDetails(warTag) {
  const response = await axiosInstance.get(
    `/clanwarleagues/wars/${encodeURIComponent(warTag)}`
  );
  return response.data;
}

// Lấy các labels của clan
export async function getClanLabels(tag) {
  const response = await axiosInstance.get(
    `/clans/${encodeURIComponent(tag)}/labels`
  );
  return response.data.items;
}

// Tìm kiếm clan theo tên
export async function searchClans(name) {
  const response = await axiosInstance.get(
    `/clans?name=${encodeURIComponent(name)}`
  );
  return response.data.items;
}

// Lấy danh sách location
export async function getLocations() {
  const response = await axiosInstance.get(`/locations`);
  return response.data.items;
}

// Lấy bảng xếp hạng clan theo location
export async function getLocationClanRankings(locationId) {
  const response = await axiosInstance.get(
    `/locations/${locationId}/rankings/clans`
  );
  return response.data.items;
}

// Lấy bảng xếp hạng người chơi theo location
export async function getLocationPlayerRankings(locationId) {
  const response = await axiosInstance.get(
    `/locations/${locationId}/rankings/players`
  );
  return response.data.items;
}

// Lấy danh sách league
export async function getLeagues() {
  const response = await axiosInstance.get(`/leagues`);
  return response.data.items;
}

// Lấy chi tiết league
export async function getLeagueDetails(leagueId) {
  const response = await axiosInstance.get(`/leagues/${leagueId}`);
  return response.data;
}

// Lấy danh sách labels cho clan
export async function getClanLabelsList() {
  const response = await axiosInstance.get(`/labels/clans`);
  return response.data.items;
}

// Lấy danh sách labels cho player
export async function getPlayerLabelsList() {
  const response = await axiosInstance.get(`/labels/players`);
  return response.data.items;
}
