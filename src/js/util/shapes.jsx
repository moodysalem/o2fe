import {PropTypes} from "react";

export const CONFIG_SHAPE = PropTypes.shape({
  API_URL: PropTypes.string.isRequired,
  CLIENT_ID: PropTypes.string.isRequired
});

export const TOKEN_SHAPE = PropTypes.shape({
  access_token: PropTypes.string.isRequired,
  expires_in: PropTypes.number.isRequired,
  scope: PropTypes.string.isRequired,
  client_id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  application_id: PropTypes.string.isRequired,
  token_type: PropTypes.oneOf(['bearer']).isRequired
});

export const NOTIFICATION_HANDLERS = {
  onError: PropTypes.func.isRequired,
  onInfo: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onWarning: PropTypes.func.isRequired
};