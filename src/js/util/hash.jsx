import qs from 'qs';

export function clearHash() {
  history.replaceState('', document.title, window.location.pathname);
}

export function readHash() {
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

  clearHash();
  return hash;
}
