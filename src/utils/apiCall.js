export default async function apiCall(
  url,
  method = "GET",
  data = null,
) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  };

  const options = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
    credentials: "include",
  };

  return fetch(`http://127.0.0.1:8000/${url}`, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error("Fetch error:", error);
      throw error;
    });
}
