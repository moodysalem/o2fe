import _ from "underscore";
import JSOG from "jsog";
import join from "url-join";
import qs from "qs";
import Promise from "bluebird";

const BEARER = 'Bearer',
  START = 'X-Start',
  TOTAL_COUNT = 'X-Total-Count';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  isId = id => typeof id === 'string' && UUID_REGEX.test(id),
  invalidIdPromise = () => Promise.reject(new Error('Invalid ID!'));

const toError = obj => {
  if (obj instanceof Error) {
    return obj;
  }

  if (obj && _.isObject(obj) && _.isArray(obj.requestErrors) && obj.requestErrors.length > 0) {
    return new Error(
      obj.requestErrors
        .map(({attribute, message}) =>
          _.filter([attribute, message], s => typeof s == 'string' && s.trim().length > 0).join(' - '))
        .join('\n')
    );
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
    return new Promise((resolve, reject) => {
      fetch(`${this._baseUrl}?${qs.stringify(params)}`, {
        headers: this.getAuthHeader()
      })
        .then(res => {
          if (res.ok) {
            return Promise.all([
              +res.headers.get(START),
              +res.headers.get(TOTAL_COUNT),
              res.json().then(json => JSOG.decode(json))
            ]);
          }

          return res.json().then(json => Promise.reject(json));
        }, reject)
        .then(
          ([start, totalCount, results]) => resolve({start, totalCount, results}),
          json => reject(toError(json))
        );
    });
  }

  get(id) {
    if (!isId(id)) {
      return invalidIdPromise();
    }

    return new Promise((resolve, reject) => {
      fetch(join(this._baseUrl, id), {
        headers: this.getAuthHeader()
      }).then(
        res => {
          if (res.ok) {
            return res.json().then(json => JSOG.decode(json));
          }

          return res.json().then(res => Promise.reject(res));
        }
      ).then(
        result => resolve(result),
        err => reject(toError(err))
      );
    });
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

    return new Promise((resolve, reject) => {
      fetch(this._baseUrl, {
        method: 'POST',
        body: JSOG.stringify(data),
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json'
        }
      }).then(
        res => {
          if (res.ok) {
            return res.json().then(json => JSOG.decode(json));
          }

          return res.json().then(res => Promise.reject(res));
        }
      ).then(
        decoded => {
          if (single) {
            resolve(decoded[0]);
          }
          resolve(decoded);
        },
        err => reject(toError(err))
      );
    });
  }

  destroyId(id) {
    if (!isId(id)) {
      return invalidIdPromise();
    }

    return fetch(join(this._baseUrl, id), {
      method: 'DELETE',
      headers: this.getAuthHeader()
    }).then(
      res => {
        if (res.ok) {
          return Promise.resolve();
        }

        return res.json().then(toError);
      }
    );
  }
}