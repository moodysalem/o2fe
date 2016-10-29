import qs from "qs";

export default function readHash() {
  let {hash} = window.location;
  if (hash.length > 0 && hash[0] === '#') {
    hash = hash.substring(1);
  }
  if (hash.length > 0) {
    try {
      hash = qs.parse(hash);
    } catch (err) {
      console.error(err);
      hash = null;
    }
  } else {
    hash = null;
  }

  history.replaceState('', document.title, window.location.pathname);

  return hash;
}

export function getTokenFromHash() {
  const hash = readHash();
  if (hash == null) {
    return null;
  }
  if (typeof hash.access_token === 'string') {
    return hash.access_token;
  }
  return null;
}