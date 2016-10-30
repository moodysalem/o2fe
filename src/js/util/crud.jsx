import _ from "underscore";
import JSOG from "jsog";
import qs from "qs";

const BEARER = 'Bearer';
const START = 'X-Start';
const TOTAL_COUNT = 'X-Total-Count';

export default class crud {
  _baseUrl = null;
  _token = null;

  constructor({baseUrl, token}) {
    this._baseUrl = baseUrl;
    this._token = token;
  }

  getAuthHeader() {
    if (!this._token) {
      return null;
    }
    return {
      Authorization: [BEARER, this._token.access_token].join(' ')
    };
  }

  get(params) {
    return fetch(`${this._baseUrl}?${qs.stringify(params)}`, {
      headers: this.getAuthHeader()
    })
      .then(res => {
        if (res.ok) {
          return Promise.all([
            res.headers.get(START),
            res.headers.get(TOTAL_COUNT),
            res.json()
          ]);
        }
        return Promise.reject(res.json());
      })
      .then(
        ([start, totalCount, results]) => ({start, totalCount, results})
      );
  }

  save(data) {
    if (data == null) {
      return Promise.reject(new Error('Invalid object to save'));
    }

    if (!_.isArray(data) && _.isObject(data)) {
      data = [data];
    }

    if (!_.isArray(data)) {
      return Promise.reject(new Error('Invalid object to save'));
    }

    if (data.length == 0) {
      return Promise.resolve([]);
    }

    return fetch(this._baseUrl, {
      method: 'POST',
      body: JSOG.stringify(data),
      headers: this.getAuthHeader()
    }).then(
      res => {
        if (res.ok) {
          return res.json();
        } else {
          return Promise.reject(res.json());
        }
      }
    );
  }
}