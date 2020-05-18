export const theme = {
  global: {
    font: {
      family: "Helvetica Neue",
      size: "18px",
      height: "20px",
    },
    size: {
      xxsmall: "48px",
      xsmall: "96px",
      small: "192px",
      smallmedium: "278px",
      medium: "384px",
      large: "768px",
      xlarge: "1152px",
      xxlarge: "1536px",
      full: "100%",
      streamViewRow1: "70vh",
      streamViewColumn1: "65.2vw",
      streamViewColumn2: "24.2vw",
      homeRow1: "202px",
      homeRow2: "172px",
      homeRow3: "212px",
      homeColumn1: "389px",
      homeColumn2: "864px",
      calendarSize: "192px",
    },
    colors: {
      brand: "#61EC9F",
    },
    drop: {
      background: "transparent",
      shadowSize: "none",
      border: {
        radius: "10px",
      },
    },
  },
  tab: {
    color: "grey",
    active: { color: "black" },
    margin: {
      vertical: "none",
      horizontal: "none",
      bottom: "small",
      right: "small",
    },
    fontSize: 18,
    fontWeight: "bold",
    border: {
      side: "bottom",
      size: "medium",
      color: {
        light: "grey",
      },
      active: {
        color: {
          light: "black",
        },
      },
      hover: {
        color: {
          light: "black",
        },
      },
    },
  },
  calendar: {
    medium: {
      // daySize: "27.428571428571427px",
      daySize: "40px",
      fontSize: "14px",
      lineHeight: 1.375,
      slideDuration: "0.2s",
    },
    day: {
      extend: {
        "margin-right": "7.5px",
        "margin-left": "7.5px",
      },
    },
  },
};
