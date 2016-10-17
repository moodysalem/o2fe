import config from "file?name=config.json!../../config.json";
import join from "url-join";
import qs from "qs";

export default class DAO {
  static getConfig = () => fetch(config).then(response => response.json());

  static loadToken = ({config: {API_URL, CLIENT_ID}, hash = null}) => {
    if (hash == null || typeof hash.access_token !== 'string' || hash.access_token.length == 0) {
      return Promise.resolve(null);
    }

    return fetch(join(API_URL, 'token', 'info'),
      {
        method: 'POST',
        body: qs.stringify({client_id: CLIENT_ID, token: hash.access_token}),
        headers: new Headers({'Content-Type': 'application/x-www-form-urlencoded'})
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
  };

  constructor({url, token}) {
    this._url = url;
    this._token = token;
  }
}
