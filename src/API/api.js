import apiCall from "../utils/apiCall";

async function verifyKey(method, key) {
  try {
    const result = await apiCall(`reference/verify_key?api_key=${key}`, method);
    console.log("api reference ",result);
    return result;
  } catch (error) {
    throw error;
  }
}

async function getSessions(method, system_id) {
  try {
    const result = await apiCall(
      `session/get_user_sessions?system_id=${system_id}&user_id=`,
      method
    );
    return result;
  } catch (error) {
    throw error;
  }
}

async function getChatHistory(method, session_id) {
  try {
    const result = await apiCall(
      `chat/chat_history?session_id=${session_id}`,
      method
    );
    return result;
  } catch (error) {
    throw error;
  }
}

async function createSession(method, data) {
  try {
    const result = await apiCall("session/create_session", method, data);
    return result;
  } catch (error) {
    throw error;
  }
}

async function sessionDetail(method, data) {
  try {
    const result = await apiCall("session/session_details", method, data);
    return result;
  } catch (error) {
    throw error;
  }
}

async function deleteChat(method, data) {
  try {
    const result = await apiCall("chat/delete_chat", method, data);
    return result;
  } catch (error) {
    throw error;
  }
}
export {
  getSessions,
  createSession,
  sessionDetail,
  deleteChat,
  getChatHistory,
  verifyKey
};
