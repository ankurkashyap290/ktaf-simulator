import { notification } from 'antd';
import axios from 'axios';

const customError = e => {
  const errorJson = e.errorJson || { message: e.toString() };
  return { error: errorJson, status: 'ERROR' };
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, responseType = 'json') {
  const defaultOptions = {
    // credentials: 'include',
    method: 'GET',
  };
  const newOptions = { ...defaultOptions, ...options };
  let postData;
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    postData = { ...newOptions.body };
  }
  return axios({
    method: newOptions.method.toLowerCase(),
    url,
    responseType,
    headers: newOptions.headers,
    data: postData,
  })
    .then(response => {
      return {
        data: response.data || null,
        headers: response.headers,
        status: response.statusText,
      };
    })
    .catch(error => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: `Request error:${url}`,
          description: error.message,
        });
      }
      return customError(error);
    });
}
