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

const HintText = styled(NeuText)`
  color: ${theme.colors.text};
  font-size: 0.9rem;
  font-style: italic;
  margin-top: ${theme.spacing.sm};
`;

const ErrorText = styled(motion.div)`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: ${theme.spacing.sm};
  height: 20px;
`;

const Welcome: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUserName, advanceStage } = useAppContext();
  const navigate = useNavigate();

  const CORRECT_PASSWORD = '1999200120092012';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      setError('');
      setUserName('Dad'); // Still setting a name for the rest of the app
      advanceStage();
      navigate('/puzzle');
    } else {
      setError('Hmm, that doesn\'t seem right. Try again!');
      // Shake animation will be triggered by key change
      setPassword('');
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

  const errorVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 }
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
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
            Before you can continue, you need to solve a little puzzle...
          </NeuText>
        </motion.div>

        <motion.div variants={itemVariants}>
          <NeuCard style={{ padding: theme.spacing.md, marginTop: theme.spacing.md }}>
            <NeuText>
              <strong>Enter the birth years of all your children from oldest to youngest</strong>
            </NeuText>
            <HintText>
              Hint: Just the years, no spaces or separators (e.g., 19992001...)
            </HintText>
          </NeuCard>
        </motion.div>
        
        <StyledForm onSubmit={handleSubmit}>
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <InputGroup>
              <motion.div
                animate={error ? "shake" : ""}
                variants={shakeVariants}
                style={{ width: '100%' }}
              >
                <NeuInput
                  type="password"
                  placeholder="Enter the years..."
                  value={password}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setPassword(value);
                    if (error) setError('');
                  }}
                  required
                />
              </motion.div>
            </InputGroup>
            <ErrorText
              key={error} // This causes a re-render and animation when error changes
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {error}
            </ErrorText>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NeuPrimaryButton type="submit">
              Unlock
            </NeuPrimaryButton>
          </motion.div>
        </StyledForm>
      </WelcomeContainer>
    </ContentContainer>
  );
};

export default Welcome; 