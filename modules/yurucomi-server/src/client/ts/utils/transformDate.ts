export const transfromDate = (data: number) => {
  const date = new Date(data);
  const time = date.toLocaleTimeString("ja-JP", { hour12: false });
  const day = date.toLocaleDateString("ja-JP").slice(5);
  return `${day} ${time}`;
};
