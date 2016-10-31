import _ from "underscore";
import JSOG from "jsog";
import join from "url-join";
import qs from "qs";

const BEARER = 'Bearer',
  START = 'X-Start',
  TOTAL_COUNT = 'X-Total-Count';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  isId = id => typeof id === 'string' && UUID_REGEX.test(id),
  INVALID_ID_PROMISE = Promise.reject(new Error('Invalid ID!'));

const toError = obj => {
  if (obj instanceof Error) {
    return obj;
  }

  if (obj && _.isObject(obj) && _.isArray(obj.requestErrors) && obj.requestErrors.length > 0) {
    return Promise.reject(
      new Error(
        obj.requestErrors
          .map(({message}) => message)
          .join('\n')
      )
    );
  }

  return Promise.reject(new Error('Unknown error occurred!'));
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
      ([start, totalCount, results]) => ({start, totalCount, results}),
      toError
    );
  }

  get(id) {
    if (!isId(id)) {
      return INVALID_ID_PROMISE;
    }

    return fetch(join(this._baseUrl, id), {
      headers: this.getAuthHeader()
    }).then(
      res => {
        if (res.ok) {
          return res.json();
        }

        return res.json().then(res => Promise.reject(res));
      },
      toError
    );
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
        }

        return res.json().then(res => Promise.reject(res));
      }
    ).then(
      json => {
        const decoded = JSOG.decode(json);
        if (single) {
          return decoded[0];
        }
        return decoded;
      },
      toError
    );
  }

  destroyId(id) {
    if (!isId(id)) {
      return INVALID_ID_PROMISE;
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
    )
  }
}