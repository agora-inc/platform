const generateRandomArt = (height: number, width: number) => {
  const styleOptions = [
    "cellular-automata",
    "tiles",
    "123",
    "circles",
    "mondrian",
  ];
  const colorOptions = ["26", "28", "34", "35", "40", "47", "58", "83", "93"];
  const style = styleOptions[Math.floor(Math.random() * 5)];
  const color = colorOptions[Math.floor(Math.random() * 8)];
  const img = Math.floor(Math.random() * 10);
  return `https://generative-placeholders.glitch.me/image?width=600&height=300&style=${style}&colors=${color}&img=${img}`;
};

export const ArtService = {
  generateRandomArt,
};
