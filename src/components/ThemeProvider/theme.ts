const colors = {
  danger: {
    default: '#c4063c',
    light: '#ef6894',
    lighter: '#FEDDE4',
    dark: '#7B0218',
  },
  warning: {
    default: 'hsla(20, 100%, 50%, 1)',
  },

  text: {
    default: 'black',
  },
  link: {
    default: '#3a506b',
    disabled: '#5e7389',
    hover: '#003249',
    visited: '#29274c',
  },
  success: {
    default: '#3ba60a',
    light: '#98DF6D',
  },
  disabled: '#808080',
  grays: {
    700: '#999',
    800: '#ddd',
    900: '#fafafa',
  },
};

export const theme = {
  colors,
  fonts: {
    default: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(', '),
  },
  rhythms: {
    inside: {
      vertical: 8,
      horizontal: 12,
    },
    outside: {
      vertical: 24,
      horizontal: 24,
    },
  },
  button: {
    colors: {
      border: {
        default: colors.text.default,
        danger: colors.danger.default,
        link: colors.link.default,
        icon: colors.text.default,
        success: colors.success.default,
      },
      backgroundColor: {
        normal: {
          default: 'white',
          danger: colors.danger.default,
          link: 'transparent',
          icon: 'white',
          success: colors.success.default,
        },
        hover: {
          default: '#f5f5f5',
          danger: colors.danger.default,
          link: 'transparent',
          icon: '#f5f5f5',
          success: colors.success.default,
        },
      },
      textColor: {
        default: colors.text.default,
        danger: 'white',
        link: colors.link.default,
        icon: colors.text.default,
        success: 'white',
      },
      disabled: {
        textColor: {
          default: colors.disabled,
          danger: 'white',
          link: colors.link.disabled,
          icon: colors.disabled,
          success: 'white',
        },
        backgroundColor: {
          default: 'white',
          danger: colors.danger.light,
          link: 'transparent',
          icon: 'white',
          success: colors.success.light,
        },
        borderColor: {
          default: colors.disabled,
          danger: colors.danger.light,
          link: 'transparent',
          icon: colors.disabled,
          success: colors.success.light,
        },
      },
    },
  },
  input: {
    borderColor: {
      normal: colors.grays[800],
      error: colors.danger.default,
    },
    padding: {
      default: '10px',
      inline: '0 6px',
    },
  },
  box: {
    borderColors: {
      info: colors.text.default,
      success: colors.success.default,
      warning: colors.warning.default,
      danger: colors.danger.default,
    },
    titleBackgroundColor: {
      info: 'white',
      success: colors.success.default,
      warning: colors.warning.default,
      danger: colors.danger.default,
    },
  },
} as const;

export type Theme = typeof theme;
