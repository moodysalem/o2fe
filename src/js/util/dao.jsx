import join from "url-join";
import qs from "qs";
import crud from "./crud";

export default class dao {
  _config = null;
  _token = null;

  applications = null;

  constructor({config, token = null}) {
    this._config = config;
    this._token = token;

    const makeCrud = url => new crud({baseUrl: join(this._config.API_URL, url), token});
    this.applications = makeCrud('applications');
    this.scopes = makeCrud('scopes');
    this.clients = makeCrud('clients');
  }

  withToken(token) {
    return new dao({config: this._config, token});
  }

  tokenInfo(accessToken = null) {
    const {API_URL, CLIENT_ID} = this._config;

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

  forgetMe() {
    const {CLIENT_ID, API_URL} = this._config;

    return fetch(`${join(API_URL, 'logout')}?client_id=${encodeURIComponent(CLIENT_ID)}`, {
      credentials: 'include'
    });
  }
}
