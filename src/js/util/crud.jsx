import _ from "underscore";
import JSOG from "jsog";

export default class crud {
  _baseUrl = null;
  _token = null;

  constructor({baseUrl, token}) {
    this._baseUrl = baseUrl;
    this._token = token;
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
      body: JSOG.stringify(data)
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