import axios from "axios";

const getIcon = async (groupName: string, userName: string): Promise<any> => {
  const url = `https://scrapbox.io/api/pages/yurucomi/${encodeURI(userName)}`;
  const response = await axios.get(url);
  return response.data.image;
};

export default getIcon;
