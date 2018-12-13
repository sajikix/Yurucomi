import axios from "axios";

const getUserIcon = async (tsName: string, userName: string) => {
  const url = `https://scrapbox.io/api/pages/yurucomi/${encodeURI(userName)}`;
  const response = await axios.get(url);
  return response.data.image;
};

export default getUserIcon;
