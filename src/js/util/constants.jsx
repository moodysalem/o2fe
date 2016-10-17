import {PropTypes} from "react";

export const CONFIG_SHAPE = PropTypes.shape({
  API_URL: PropTypes.string.isRequired,
  CLIENT_ID: PropTypes.string.isRequired
});

export const TOKEN_SHAPE = PropTypes.shape({
  token: PropTypes.string.isRequired
});