export default (url, token) => {
  const headers = {
    Accept: 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return new Promise((resolve) => {
    fetch(url, {
      method: 'GET',
      headers
    })
      .then((res) => {
        if (res.status >= 400) {
          console.warn(`loading of url failed: ${url}`);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      }).catch((err) => {
        console.warn(err);
      });
  });
};
