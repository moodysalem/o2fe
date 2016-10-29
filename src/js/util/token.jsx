const TOKEN_KEY = 'o2fe_token';

export function getToken() {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY));
  } catch (err) {
    return null;
  }
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export function clearToken() {
  localStorage.clear();
}