const API_ROOT = "http://localhost:8000/api/v1";

export const API_URLS = {
  login: () => `${API_ROOT}/user/create-session`,
  signup: () => `${API_ROOT}/user/register`,
  createRoom: () => `${API_ROOT}/room/create`,
  getAllRooms: () => `${API_ROOT}/room/fetch-all`,
  sendMessage: () => `${API_ROOT}/room/send-message`,
  getMessages: (conversation_id) =>
    `${API_ROOT}/room/get-messages/${conversation_id}`,
};

// Helper functions to read and write on local storage
export const setItemLocalStorage = (key, value) => {
  if (!key || !value) return console.error("Cannot store in local strage");
  const valueToStore =
    typeof value !== "string" ? JSON.stringify(value) : value;
  localStorage.setItem(key, valueToStore);
};

export const getItemFromLocalStorage = (key) => {
  if (!key) return console.error("Cannot get value for undefined key");
  return localStorage.getItem(key);
};

export const removeItemFromLocalStorage = (key) => {
  if (!key) return console.error("Cannot remove value for undefined key");
  return localStorage.removeItem(key);
};

export const LOCALSTORAGE_TOKEN_KEY = "__wellness_token__";

// Get date and time

export const getFormattedDate = (date) => {
  date = new Date(date);
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  return month + "." + day + "." + year;
};
