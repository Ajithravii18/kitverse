export let csrfToken = null;
let fetchingPromise = null;

export async function fetchCsrfToken() {
  if (fetchingPromise) return fetchingPromise;
  fetchingPromise = fetch('/api/csrf-token').then(res => res.json()).then(data => {
    csrfToken = data.csrfToken;
    fetchingPromise = null;
    return csrfToken;
  }).catch(() => {
    fetchingPromise = null;
    return null;
  });
  return fetchingPromise;
}

export function updateCsrfToken(token) {
  if (token) csrfToken = token;
}

export async function apiFetch(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const requiresCsrf = !['GET', 'HEAD', 'OPTIONS'].includes(method);

  if (requiresCsrf && !csrfToken) {
    await fetchCsrfToken();
  }

  const headers = {
    ...options.headers
  };
  
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (requiresCsrf && csrfToken) {
    headers['x-csrf-token'] = csrfToken;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  let data;
  
  if (isJson) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const errorMsg = data?.error || (typeof data === 'string' ? data : 'Request failed');
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  if (data?.csrfToken) {
    csrfToken = data.csrfToken;
  }

  return data;
}
