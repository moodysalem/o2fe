import qs from "qs";
import join from "url-join";

export default function getLoginUrl({API_URL, CLIENT_ID}) {
  return `${join(API_URL, 'authorize')}` +
    `?${qs.stringify({client_id: CLIENT_ID, redirect_uri: window.location.href, response_type: 'token'})}`;
}