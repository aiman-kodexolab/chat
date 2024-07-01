import apiCall from "../utils/apiCall";

function getSessions(method, system_id) {
  try {
    const result = apiCall(
      `session/get_user_sessions?system_id=${system_id}&user_id=""`,
      method
    );
  } catch (error) {}
}

async function createSession(method, data) {
  try {
    const result = await apiCall("session/create_session", method, data);
    console.log("Result", result);
  } catch (error) {
    console.log("error-->", error);
  }
}

const getUserSession = async (method, system_id, user_id) => {
  try {
    const result = await apiCall(
      `/session/get_user_sessions?system_id=${system_id}&user_id=${user_id}`,
      method
    );
    console.log("Result", result);
  } catch (error) {
    console.log("error-->", error);
  }
};

export { getSessions, createSession, getUserSession };
