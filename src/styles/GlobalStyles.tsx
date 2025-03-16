import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    background: '#e0e5ec',
    text: '#4d5e6f',
    primary: '#6d83a5',
    secondary: '#f792a9',
    accent: '#92d2f7',
    shadow1: '#a3b1c6',
    shadow2: '#ffffff',
  },
  fonts: {
    primary: "'Poppins', sans-serif",
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '20px',
    circle: '50%',
  },
  neuDepth: {
    small: '0.3rem',
    medium: '0.5rem',
    large: '0.8rem',
  },
};

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: ${theme.fonts.primary};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: ${theme.spacing.md};
  }

  p {
    line-height: 1.6;
    margin-bottom: ${theme.spacing.md};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${theme.colors.accent};
    }
  }

  button {
    cursor: pointer;
    font-family: ${theme.fonts.primary};
  }

  img {
    max-width: 100%;
    height: auto;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    html {
      font-size: 14px;
    }
  }
`;

// Neumorphic styled utilities
export const neuInset = `
  box-shadow: inset 3px 3px 6px ${theme.colors.shadow1}, 
              inset -3px -3px 6px ${theme.colors.shadow2};
`;

export const neuOutset = `
  box-shadow: 5px 5px 10px ${theme.colors.shadow1}, 
              -5px -5px 10px ${theme.colors.shadow2};
`;

export const neuButton = `
  background: ${theme.colors.background};
  box-shadow: 5px 5px 10px ${theme.colors.shadow1}, 
              -5px -5px 10px ${theme.colors.shadow2};
  transition: all 0.2s ease;
  
  &:active {
    box-shadow: inset 3px 3px 6px ${theme.colors.shadow1}, 
                inset -3px -3px 6px ${theme.colors.shadow2};
  }
`;

export default theme; 