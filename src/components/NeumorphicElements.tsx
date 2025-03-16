import styled from 'styled-components';
import { motion } from 'framer-motion';
import theme, { neuInset, neuOutset, neuButton } from '../styles/GlobalStyles';

// Container with neumorphic styling
export const NeuContainer = styled.div`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.lg};
  ${neuOutset}
  position: relative;
  overflow: hidden;
`;

export const NeuInsetContainer = styled.div`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.lg};
  ${neuInset}
  position: relative;
  overflow: hidden;
`;

// Buttons
export const NeuButton = styled.button`
  border: none;
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-weight: 500;
  color: ${theme.colors.text};
  ${neuButton}
  
  &:focus {
    outline: none;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const NeuPrimaryButton = styled(NeuButton)`
  color: ${theme.colors.primary};
  font-weight: 600;
`;

export const NeuAnimatedButton = styled(motion.button)`
  border: none;
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-weight: 500;
  color: ${theme.colors.text};
  background-color: ${theme.colors.background};
  ${neuButton}
  
  &:focus {
    outline: none;
  }
`;

// Card
export const NeuCard = styled.div`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.lg};
  ${neuOutset}
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  &.inset {
    ${neuInset}
  }
`;

// Input fields
export const NeuInput = styled.input`
  width: 100%;
  border: none;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.small};
  padding: ${theme.spacing.md};
  color: ${theme.colors.text};
  font-family: ${theme.fonts.primary};
  ${neuInset}
  
  &:focus {
    outline: none;
    box-shadow: inset 4px 4px 8px ${theme.colors.shadow1}, 
                inset -4px -4px 8px ${theme.colors.shadow2};
  }
`;

// Circle element
export const NeuCircle = styled.div<{ size?: string }>`
  width: ${props => props.size || '64px'};
  height: ${props => props.size || '64px'};
  border-radius: 50%;
  background-color: ${theme.colors.background};
  ${neuOutset}
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.inset {
    ${neuInset}
  }
`;

// Icon container
export const NeuIconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${theme.colors.background};
  ${neuOutset}
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:active {
    ${neuInset}
  }
`;

// Divider
export const NeuDivider = styled.hr`
  border: none;
  height: 3px;
  background-color: ${theme.colors.background};
  margin: ${theme.spacing.lg} 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: ${theme.colors.shadow1};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: ${theme.colors.shadow2};
  }
`;

// Text elements
export const NeuHeading = styled.h2`
  color: ${theme.colors.primary};
  font-weight: 600;
  text-shadow: 1px 1px 2px ${theme.colors.shadow2}, 
               -1px -1px 2px ${theme.colors.shadow1};
`;

export const NeuText = styled.p`
  color: ${theme.colors.text};
  line-height: 1.6;
`;

// Animated container
export const NeuAnimatedContainer = styled(motion.div)`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.lg};
  ${neuOutset}
  position: relative;
  overflow: hidden;
`;

// Image container
export const NeuImageContainer = styled.div`
  border-radius: ${theme.borderRadius.medium};
  background-color: ${theme.colors.background};
  ${neuOutset}
  overflow: hidden;
  
  img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`;

// Page Container
export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xl};
  }
`;

// Layout Container (for centered content with max width)
export const ContentContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    max-width: 700px;
  }
`; 