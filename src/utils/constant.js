import { notification } from "../assets";

export const formatTime = () => {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  const day = now.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const suffix = ["th", "st", "nd", "rd"][
    day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
  ];

  const formattedDate = `${day}${suffix} ${month} ${year}`;
  const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;

  return `${formattedDate} . ${formattedTime}`;
};

export async function playNotificationSound() {
  try {
    const audio = new Audio(notification);
    await audio.play();
  } catch (e) {
    console.log("eee", e);
  }
}

// export const apiUrl = "https://bot-api-stag.kodexia.ai/";
export const apiUrl = "http://127.0.0.1:8000";

// export const socketUrl = "bot-api-stag.kodexia.ai";
export const socketUrl = "127.0.0.1:8000";

export const s3Url = "https://internal-chatbot-media.s3.us-west-1.amazonaws.com";

export const replaceTags = (text) => {
  const word = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return word;
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const phoneRegex =
  /^(\+?\d{1,4}?[-.\s]?)?(\(?\d{1,4}?\)?[-.\s]?)?[\d\s.-]{10}$/;
