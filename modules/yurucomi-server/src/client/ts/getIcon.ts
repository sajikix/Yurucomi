const getIcon = async (
  groupName: string,
  userName: string
): Promise<string> => {
  const url = `https://scrapbox.io/api/pages/yurucomi/${encodeURI(userName)}`;
  const response = await fetch(url, {
    mode: "cors",
  });
  const { image } = await response.json();
  return image;
};

export default getIcon;
