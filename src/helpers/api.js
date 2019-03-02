export const api = function(method, url, data, headers = {}) {
  return fetch(url, {
    method: method.toUpperCase(),
    mode: "cors", // no-cors, cors, *same-origin
    body: JSON.stringify(data), // send it as stringified json
    headers: Object.assign({}, api.headers, headers) // extend the headers
  }).then(res => (res.ok ? res.json() : Promise.reject(res)));
};

// Defaults that can be globally overwritten
api.credentials = "";
api.headers = {
  "csrf-token": window.csrf || "", // only if globally set, otherwise ignored
  Accept: "application/json", // receive json
  "Content-Type": "application/json" // send json
};

// Convenient methods
["get", "post", "put", "delete"].forEach(method => {
  api[method] = api.bind(null, method);
});
