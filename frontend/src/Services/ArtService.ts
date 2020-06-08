const generateRandomArt = (height: number, width: number, id: number) => {
  const styleOptions = [
    "cellular-automata",
    "tiles",
    "123",
    "circles",
    "mondrian",
  ];
  const colorOptions = ["26", "28", "34", "35", "40", "47", "58", "83", "93"];
  const style = styleOptions[id % styleOptions.length];
  const color = colorOptions[id % colorOptions.length];

  // const img = Math.floor(Math.random() * 10);
  return `https://generative-placeholders.glitch.me/image?width=${width}&height=${height}&style=${style}&colors=${color}}`;
};

export const ArtService = {
  generateRandomArt,
};
