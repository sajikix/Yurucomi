import axios from "axios";

const getUserIcon = async (tsName: string, userName: string) => {
  const url = `https://scrapbox.io/api/pages/yurucomi/${encodeURI(userName)}`;
  try {
    const response = await axios.get(url);
    return response.data.image;
  } catch (e) {
    return "./images/unknown.png";
  }
};

export default getUserIcon;
