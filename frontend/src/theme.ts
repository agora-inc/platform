export const Theme = {
  global: {
    font: {
      family: "Arial",
      size: "14px",
      height: "16px",
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
      brand: "#7E1115",
      selected: "F5F5F5",
    },
    drop: {
      //background: "transparent",
      shadowSize: "none",
      border: {
        radius: "10px",
      },
    },
    focus: {
      border: {
        color: "#7E1115",
      }
    }
  },
  tab: {
    color: "#F5F5F5",
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
        light: "#F5F5F5",
      },
      active: {
        color: {
          light: "black",
        },
      },
      hover: {
        color: "#F5F5F5"
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
  select: {
    width: "",
    container: {
      extend: "",
    },
    icons: {color: "grey"},
    options: {
      text: {
        margin: 'none',
        size: 'medium',
        color: "black"
      },
    }
  },
  anchor: {
    color: "pink",
  },
  hover: {
    background: {
      color: "#F5F5F5"
    },
    color: {"dark": "white"}
  },
};
