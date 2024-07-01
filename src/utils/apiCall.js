export default async function apiCall(
  url,
  method = "GET",
  data = null,
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjY2OTg5NTc2OWM2NTQ0ZWExNmUwNGNjIn0.5eSCbDf1QOn_eyJmdWnMdvfOtETlKGyMfZ4yc2o5VSU"
) {
  try {
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      // "authorization": `Bearer ${token}`,
    };

    const options = {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
      credentials: "include",
    };
    console.log(`https://web-chatbot-internal.onrender.com/${url}`, options);
    const response = await fetch(
      `https://web-chatbot-internal.onrender.com/${url}`,
      options
    )
    console.log("====>", response);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      console.log("hello---->", response.json());
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
