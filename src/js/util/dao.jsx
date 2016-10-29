import join from "url-join";
import qs from "qs";

export default class dao {
  _config = null;
  _token = null;

  tokenInfo({accessToken = null}) {
    if (accessToken == null || typeof accessToken !== 'string' || accessToken.trim().length == 0) {
      return Promise.resolve(null);
    }

    return fetch(join(API_URL, 'token', 'info'),
      {
        method: 'POST',
        body: qs.stringify({client_id: CLIENT_ID, token: accessToken}),
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      }
    ).then(
      res => {
        if (!res.ok) {
          return Promise.resolve(null);
        }

        return res.json();
      },
      err => Promise.resolve(null)
    );
  }

  static logout = ({API_URL, CLIENT_ID}) => {
    if (typeof CLIENT_ID !== 'string' || CLIENT_ID.trim().length == 0) {
      return Promise.reject('Invalid client ID');
    }

    return fetch(`${join(API_URL, 'logout')}?client_id=${encodeURIComponent(CLIENT_ID)}`, {
      credentials: 'include'
    });
  };

  constructor({config, token}) {
    this._config = config;
    this._token = token;
  }
}
