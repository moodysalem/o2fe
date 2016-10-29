let _config = null;

export default function getConfig() {
  if (_config != null) {
    return Promise.resolve(_config);
  }

  return fetch('config.json')
    .then(
      res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(new Error('Failed to load config!'));
      }
    )
    .then(
      config => {
        if (typeof config !== 'object' || typeof config.API_URL !== 'string' || typeof config.CLIENT_ID !== 'string') {
          return Promise.reject(new Error('Config was missing either API_URL or CLIENT_ID or both'));
        }

        _config = config;
        return _config;
      }
    );
}