import { createTheme } from "@mui/material/styles";

/*--- */
export const PersonalizedTextArea = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root": {
            background: "none!important",
            /*border:"none!important",*/
            borderRadius: "1.5rem",
            border: "3px solid #6817FF!important",
            backgroundColor: "#ffffff",
          },
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});
export const PersonalizedTextKeywords = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root": {
            background: "none!important",
            /*border:"none!important",*/
            borderRadius: "1.5rem",
            border: "3px solid #6817FF!important",
            backgroundColor: "#ffffff",
            paddingLeft: "2rem",
          },
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});
export const PersonalizedTextAutocomplete = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root": {
            background: "none!important",
            /*border:"none!important",*/
            borderRadius: "2rem",
            border: "3px solid #6817FF!important",
            backgroundColor: "#ffffff",
            paddingLeft: "2rem",
          },
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});
/*
const PersonalizedText = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root":{
            background: "none!important",

            borderRadius: "2rem",
            border:"3px solid #6817FF!important",
            backgroundColor:"#ffffff!important"
          },
          "&.MuiInputBase-root::after":{
            background: "none!important",
            border:"none!important"
          },
          "&.MuiInputBase-root::before":{
            background: "none!important",
            border:"none!important"
          }
          // Some CSS

        },

      },
      defaultProps:{

      }
    },
  },
});
*/

export const FiltersMenu = createTheme({
  components: {
    // Name of the component
    MuiMenu: {
      styleOverrides: {
        // Name of the slot
        root: {
          ".MuiMenu-paper": {
            marginTop: "0.5rem",

            backgroundColor: "#FFF",
            borderRadius: "20px",
          },
          ".MuiMenu-paper li": {
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});
export const PersonalizedSelect = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root": {
            background: "none!important",
            borderRadius: "2rem",
            border: "3px solid #6817FF!important",
            backgroundColor: "#ffffff!important",
          },
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          ".MuiSelect-select.MuiSelect-filled.MuiInputBase-input.MuiFilledInput-input":
            {
              padding: "15px 2rem 10px 2rem !important",
              boxSizing: "border-box",
              background: "none!important",
            },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});
export const PersonalizedText = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root.Mui-focused": {
            background: "none!important",
            backgroundColor: "#ffffff!important",
          },
          "&.MuiInputBase-root": {
            background: "none!important",
            borderRadius: "2rem",
            border: "3px solid #6817FF!important",
            backgroundColor: "#ffffff!important",
          },
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          ".MuiInputAdornment-root": {
            marginRight: "7px!important",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});
export const PersonalizedTextDatePicker = createTheme({
  palette: {
    primary: { main: "#6817FF" },
  },
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root": {
            background: "none!important",
            borderRadius: "2rem",
            border: "3px solid #6817FF!important",
            backgroundColor: "#ffffff!important",
          },
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          ".MuiInputAdornment-positionEnd": {
            marginRight: "7px",
          },
          "&.MuiButtonBase-root.MuiPickersDay-root.Mui-selected": {
            backgroundColor: "#6817FF!important;",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});
//veryf
export const PersonalizedTextWhite = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          "&.MuiInputBase-root": {
            background: "none!important",
            borderRadius: "2rem",
            border: "none!important",
            backgroundColor: "#ffffff!important",
            padding: "0!important",
          },
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});
export const PersonalizedTextSearchWhite = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          /*"&.MuiInputBase-root":{
              background: "none!important",
              border:"none!important"
            },*/
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root": {
            background: "none!important",
            border: "none!important",
            borderRadius: "2rem",
            backgroundColor: "#FFFFFF!important",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});
/*
  =createTheme({
    components: {
      // Name of the component
      MuiInputBase: {
        styleOverrides: {
          // Name of the slot
          root: {
            "&.MuiInputBase-root::after":{
              background: "none!important",
              border:"none!important"
            },
            "&.MuiInputBase-root::before":{
              background: "none!important",
              border:"none!important"
            },
            "&.MuiInputBase-root":{
              background: "none!important",
              border:"none!important",
              borderRadius: "2rem",
              backgroundColor: "#F8F8F8!important"
            },
            ".MuiInputAdornment-root":{
              marginRight: "7px!important"
            }
            // Some CSS

          },

        },
        defaultProps:{

        }
      },
    },
  });*/
export const PersonalizedTextSearch = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          /*"&.MuiInputBase-root":{
                background: "none!important",
                border:"none!important"
              },*/
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root": {
            background: "none!important",
            border: "none!important",
            borderRadius: "2rem",
            backgroundColor: "#F8F8F8!important",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});
/*
export const PersonalizedTextSearchWhite = createTheme({
      components: {
        // Name of the component
        MuiInputBase: {
          styleOverrides: {
            // Name of the slot
            root: {
              "&.MuiInputBase-root::after":{
                background: "none!important",
                border:"none!important"
              },
              "&.MuiInputBase-root::before":{
                background: "none!important",
                border:"none!important"
              },
              "&.MuiInputBase-root":{
                background: "none!important",
                border:"none!important",
                borderRadius: "2rem",
                backgroundColor: "#FFFFFF!important"
              }
              // Some CSS

            },

          },
          defaultProps:{

          }
        },
      },
    });

    */
export const PersonalizedFilterSearch = createTheme({
  components: {
    // Name of the component
    MuiInputBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          /*"&.MuiInputBase-root":{
              background: "none!important",
              border:"none!important"
            },*/
          "&.MuiInputBase-root::after": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root::before": {
            background: "none!important",
            border: "none!important",
          },
          "&.MuiInputBase-root": {
            background: "none!important",
            border: "none!important",
            borderRadius: "2rem",
            backgroundColor: "#F8F8F8!important",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});

export { createTheme, ThemeProvider } from "@mui/material/styles";
