import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  NeuCard, 
  NeuHeading, 
  NeuText, 
  NeuInput, 
  NeuPrimaryButton,
  ContentContainer,
  NeuAnimatedContainer
} from '../components/NeumorphicElements';
import { useAppContext } from '../context/AppContext';
import theme from '../styles/GlobalStyles';

const WelcomeContainer = styled(NeuAnimatedContainer)`
  text-align: center;
  max-width: 90%;
  margin: 0 auto;
`;

const BirthdayHeading = styled(NeuHeading)`
  font-size: 2rem;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.secondary};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const InputGroup = styled.div`
  margin: ${theme.spacing.lg} 0;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Welcome: React.FC = () => {
  const [name, setName] = useState('');
  const { setUserName, advanceStage } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name);
      advanceStage();
      navigate('/puzzle');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      y: -50,
      transition: { duration: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ContentContainer>
      <WelcomeContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div variants={itemVariants}>
          <BirthdayHeading>Happy Birthday!</BirthdayHeading>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <NeuText>
            Welcome to your personalized birthday experience.
            To start your journey, I need to know who you are...
          </NeuText>
        </motion.div>
        
        <StyledForm onSubmit={handleSubmit}>
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <InputGroup>
              <NeuInput
                type="text"
                placeholder="Your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputGroup>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NeuPrimaryButton type="submit">
              Let's Begin
            </NeuPrimaryButton>
          </motion.div>
        </StyledForm>
      </WelcomeContainer>
    </ContentContainer>
  );
};

export default Welcome; 