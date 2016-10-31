import _ from "underscore";
import JSOG from "jsog";
import join from "url-join";
import qs from "qs";

const BEARER = 'Bearer',
  START = 'X-Start',
  TOTAL_COUNT = 'X-Total-Count';

const toError = obj => {
  if (obj instanceof Error) {
    return obj;
  }

  if (obj && _.isObject(obj) && true) {

  }

  return new Error('Unknown error occurred!');
};


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

  list(params) {
    return fetch(`${this._baseUrl}?${qs.stringify(params)}`, {
      headers: this.getAuthHeader()
    }).then(res => {
      if (res.ok) {
        return Promise.all([
          +res.headers.get(START),
          +res.headers.get(TOTAL_COUNT),
          res.json()
        ]);
      }

      return Promise.reject(res.json());
    }).then(
      ([start, totalCount, results]) => ({start, totalCount, results})
    ).catch(toError);
  }

  get(id) {
    if (typeof id !== 'string' || id.trim().length == 0) {
      return Promise.reject(new Error('Invalid ID'));
    }

    return fetch(join(this._baseUrl, id), {
      headers: this.getAuthHeader()
    }).then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(res.json());
    }).catch(toError)
  }

  save(data) {
    if (data == null) {
      return Promise.reject(new Error('Invalid object to save'));
    }

    let single = false;

    if (!_.isArray(data) && _.isObject(data)) {
      single = true;
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
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'application/json'
      }
    }).then(
      res => {
        if (res.ok) {
          return res.json();
        } else {
          return Promise.reject(res.json());
        }
      }
    ).then(
      json => JSOG.decode(json)
    ).then(
      result => {
        if (single) {
          return result[0];
        }
      }
    ).catch(toError);
  }
}