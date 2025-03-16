import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  NeuHeading, 
  NeuText, 
  NeuPrimaryButton,
  ContentContainer,
  NeuAnimatedContainer,
  NeuCard,
  NeuImageContainer
} from '../components/NeumorphicElements';
import { useAppContext } from '../context/AppContext';
import { getCardPhotos } from '../utils/photos';
import theme from '../styles/GlobalStyles';

// Card styled components
const CardContainer = styled(NeuAnimatedContainer)`
  text-align: center;
  position: relative;
  overflow: visible;
  background: linear-gradient(145deg, ${theme.colors.background}, ${theme.colors.primary}10);
  max-width: 600px;
  margin: 0 auto;
  padding: 0; /* Remove padding to make the 3D effect more realistic */
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
  transform-style: preserve-3d;
  perspective: 1500px;
`;

const CardFrontContent = styled(motion.div)`
  position: relative;
  width: 100%;
  transform-style: preserve-3d;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: 5px 5px 20px ${theme.colors.shadow1}, 
              -5px -5px 20px ${theme.colors.shadow2};
  backface-visibility: hidden;
  transform-origin: left center; /* This is the spine of the card */
`;

const CardCover = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  padding: ${theme.spacing.xl};
  z-index: 1;
  background: linear-gradient(135deg, ${theme.colors.background}, #e8ecf3);
  border-radius: ${theme.borderRadius.medium};
  transform-style: preserve-3d;
  min-height: 600px; /* Set a minimum height for the card */
`;

const CardEdge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(to left, 
    rgba(0,0,0,0.05),
    rgba(0,0,0,0.02) 20%,
    rgba(0,0,0,0) 80%
  );
  transform-origin: right center;
  transform: rotateY(90deg) translateX(10px);
  z-index: 2;
  border-radius: 0 5px 5px 0;
`;

const CardTitle = styled(NeuHeading)`
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing.md};
  background: linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary});
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
  text-align: center;
  transform: translateZ(20px); /* Make title pop out slightly in 3D space */
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.8rem;
  }
`;

const CardSubtitle = styled(NeuText)`
  font-size: 1.2rem;
  margin-bottom: ${theme.spacing.xl};
  transform: translateZ(10px); /* Subtle 3D effect */
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const CardPhoto = styled(NeuImageContainer)`
  width: 100%;
  max-width: 300px;
  margin: ${theme.spacing.md} auto;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  transform: translateZ(30px); /* Make photo pop out in 3D space */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  
  img {
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const CardButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${theme.spacing.xl};
  transform: translateZ(15px); /* Subtle 3D effect */
`;

const CelebrationEmoji = styled.div`
  position: absolute;
  font-size: 3rem;
  opacity: 0.3;
  transform: rotate(${() => Math.random() * 30 - 15}deg) translateZ(5px);
  
  &.cake {
    top: 10%;
    right: 10%;
  }
  
  &.gift {
    bottom: 15%;
    left: 5%;
  }
  
  &.balloon {
    top: 5%;
    left: 10%;
  }
  
  &.party {
    bottom: 10%;
    right: 15%;
  }
`;

// Card back glow effect
const CardGlow = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, 
    ${theme.colors.secondary}20, 
    transparent 60%
  );
  opacity: 0;
  z-index: 0;
  border-radius: ${theme.borderRadius.medium};
`;

// Define props interface
interface CardFrontProps {
  isOpen: boolean;
  onOpen: () => void;
}

const CardFront: React.FC<CardFrontProps> = ({ isOpen, onOpen }) => {
  const { state, openCard } = useAppContext();
  const navigate = useNavigate();
  const [isOpening, setIsOpening] = useState(false);
  const cardPhotos = getCardPhotos();
  // Use the specific photo requested
  const mainPhoto = { 
    src: `${process.env.PUBLIC_URL}/photos/photoshoot_with_kids_on_steps.JPG?t=${Date.now()}`,
    title: "Family on Steps" 
  };
  
  const handleOpenCard = () => {
    setIsOpening(true);
    setTimeout(() => {
      openCard();
      onOpen(); // Call the provided onOpen prop
      navigate('/inside');
    }, 1000); // Increased timeout to allow animation to complete
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.4 }
    }
  };

  const cardVariants = {
    closed: { rotateY: 0 },
    opening: { 
      rotateY: -105, // Open the card to reveal the inside (-105 degrees gives a more natural look)
      transition: { 
        duration: 1.5, 
        type: "spring", 
        stiffness: 40, // Lower stiffness for more natural movement
        damping: 15 // Add damping for a more natural stop
      }
    }
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 0.7, 
      transition: { 
        delay: 0.5, 
        duration: 1.5 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <ContentContainer>
      <CardContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <CardFrontContent
          variants={cardVariants}
          initial="closed"
          animate={isOpen || isOpening ? "opening" : "closed"}
          transition={{ duration: 1.2 }}
        >
          <CardEdge />
          <CardCover>
            <CelebrationEmoji className="cake">🎂</CelebrationEmoji>
            <CelebrationEmoji className="gift">🎁</CelebrationEmoji>
            <CelebrationEmoji className="balloon">🎈</CelebrationEmoji>
            <CelebrationEmoji className="party">🎉</CelebrationEmoji>
            
            <motion.div variants={itemVariants}>
              <CardTitle>Happy Birthday!</CardTitle>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CardSubtitle>
                To an amazing father, doctor, and inspiration.
              </CardSubtitle>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CardPhoto>
                {mainPhoto && <img src={mainPhoto.src} alt={mainPhoto.title} />}
              </CardPhoto>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CardButtons>
                <NeuPrimaryButton onClick={handleOpenCard}>
                  Open Card
                </NeuPrimaryButton>
              </CardButtons>
            </motion.div>
          </CardCover>
          
          <CardGlow
            variants={glowVariants}
            initial="hidden"
            animate={isOpen || isOpening ? "visible" : "hidden"}
          />
        </CardFrontContent>
      </CardContainer>
    </ContentContainer>
  );
};

export default CardFront; 