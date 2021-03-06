const TOKEN_KEY = "BUDBUA_AUTH_TOKEN";

export const setToken = token => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
