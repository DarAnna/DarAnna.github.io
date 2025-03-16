import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  NeuHeading, 
  NeuText, 
  NeuPrimaryButton,
  ContentContainer,
  NeuAnimatedContainer,
  NeuCard,
  NeuImageContainer,
  NeuDivider,
  NeuButton,
  NeuCircle
} from '../components/NeumorphicElements';
import { useAppContext } from '../context/AppContext';
import { getCardPhotos, photos, Photo } from '../utils/photos';
import theme from '../styles/GlobalStyles';

// Inside card styled components
const CardInsideContainer = styled(NeuAnimatedContainer)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  transform-style: preserve-3d;
  perspective: 1500px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
  padding: 0;
  overflow: visible;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1; /* Position behind the front card */
`;

const CardInsideContent = styled(motion.div)`
  width: 100%;
  padding: ${theme.spacing.lg};
  transform-style: preserve-3d;
  min-height: 600px;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: 5px 5px 20px ${theme.colors.shadow1}, 
              -5px -5px 20px ${theme.colors.shadow2};
  background: linear-gradient(135deg, #f0f3f8, ${theme.colors.background});
  position: relative;
`;

const CardEdge = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(to right, 
    rgba(0,0,0,0.05),
    rgba(0,0,0,0.02) 20%,
    rgba(0,0,0,0) 80%
  );
  transform-origin: left center;
  transform: rotateY(-90deg) translateX(-10px);
  z-index: 2;
  border-radius: 5px 0 0 5px;
`;

const CardInsideTitle = styled(NeuHeading)`
  text-align: center;
  font-size: 2rem;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.lg};
  transform: translateZ(15px);
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const WishesContainer = styled(NeuCard)`
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  transform: translateZ(20px);
  box-shadow: 0 10px 15px rgba(0,0,0,0.05);
`;

const WishTitle = styled.h3`
  font-size: 1.2rem;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
`;

const WishMessage = styled(NeuText)`
  font-style: italic;
  margin-bottom: ${theme.spacing.md};
  line-height: 1.6;
`;

const WishFrom = styled.p`
  font-weight: 600;
  text-align: right;
  color: ${theme.colors.secondary};
`;

const PhotoGalleryContainer = styled.div`
  margin-top: ${theme.spacing.lg};
  transform: translateZ(10px);
`;

const GalleryTitle = styled(NeuHeading)`
  font-size: 1.5rem;
  margin-bottom: ${theme.spacing.md};
  text-align: center;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PhotoItem = styled(motion.div)`
  aspect-ratio: 1 / 1;
  cursor: pointer;
  border-radius: ${theme.borderRadius.medium};
  background-color: ${theme.colors.background};
  box-shadow: 5px 5px 10px ${theme.colors.shadow1}, 
              -5px -5px 10px ${theme.colors.shadow2};
  overflow: hidden;
  transform: translateZ(25px);
  
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const PhotoModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
  padding: ${theme.spacing.lg};
`;

const ModalContent = styled(motion.div)`
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.large};
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const ModalImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CloseButton = styled(NeuCircle)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 101;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 2px;
    background-color: ${theme.colors.primary};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  
  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

const PhotoInfo = styled.div`
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.background};
  
  h3 {
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.xs};
  }
  
  p {
    color: ${theme.colors.text};
    font-size: 0.9rem;
  }
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${theme.spacing.xl};
  transform: translateZ(15px);
`;

// Define the props interface for ConfettiItem
interface ConfettiItemProps {
  x: string;
  y: string;
  rotate: number;
  color: string;
}

const ConfettiItem = styled.div<ConfettiItemProps>`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: ${props => props.color || theme.colors.primary};
  border-radius: 50%;
  opacity: 0.7;
  z-index: 0;
  transform: ${props => `translate(${props.x}, ${props.y}) rotate(${props.rotate}deg)`};
`;

interface MessageProps {
  from: string;
  message: string;
}

// Array of wishes from family members
const familyWishes: MessageProps[] = [
  {
    from: "Your son",
    message: "Dad, you've always been my role model and inspiration. Your dedication to work and family shows me what it means to be a great man. Happy Birthday!"
  },
  {
    from: "Your oldest daughter",
    message: "Thank you for always supporting my dreams, even when they took me far from home. Your strength and wisdom guide me every day. Love you, папа!"
  },
  {
    from: "Your youngest children",
    message: "We miss you so much when you're far away, but we're so proud of you and everything you do! Can't wait for our next family adventure. Happy Birthday!"
  },
  {
    from: "Your family in Canada",
    message: "Distance may separate us, but family bonds remain strong. Thinking of you on your special day. Remember our childhood adventures? Happy Birthday, brother!"
  }
];

// Generate confetti positions
const generateConfetti = (count: number) => {
  const confetti = [];
  const colors = [theme.colors.primary, theme.colors.secondary, theme.colors.accent];
  
  for (let i = 0; i < count; i++) {
    confetti.push({
      id: i,
      x: Math.random() * 100 + '%',
      y: Math.random() * 100 + '%',
      rotate: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  
  return confetti;
};

// Define props interface
interface CardInsideProps {
  isVisible: boolean;
  onClose: () => void;
}

const CardInside: React.FC<CardInsideProps> = ({ isVisible, onClose }) => {
  const { state } = useAppContext();
  const cardPhotos = getCardPhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentWishIndex, setCurrentWishIndex] = useState(0);
  const [confetti] = useState(generateConfetti(20));
  
  // Handle photo click
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };
  
  // Close modal
  const closeModal = () => {
    setSelectedPhoto(null);
  };
  
  // Change wish
  const cycleWish = () => {
    setCurrentWishIndex((prev) => (prev + 1) % familyWishes.length);
  };
  
  useEffect(() => {
    // Auto-cycle wishes every 10 seconds
    const interval = setInterval(cycleWish, 10000);
    return () => clearInterval(interval);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
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

  const cardVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        delay: 0.5
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
  
  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3 
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };
  
  // Wish animation variants
  const wishVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  return (
    <ContentContainer>
      <CardInsideContainer
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        exit="exit"
      >
        <CardInsideContent
          variants={cardVariants}
          initial="initial"
          animate={isVisible ? "animate" : "initial"}
        >
          <CardEdge />
          
          {/* Confetti decoration */}
          {confetti.map(item => (
            <ConfettiItem 
              key={item.id}
              x={item.x} 
              y={item.y} 
              rotate={item.rotate}
              color={item.color}
            />
          ))}
          
          <motion.div variants={itemVariants}>
            <CardInsideTitle>Happy Birthday to Someone Special</CardInsideTitle>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <WishesContainer>
              <WishTitle>Birthday Wishes</WishTitle>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWishIndex}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={wishVariants}
                  transition={{ duration: 0.5 }}
                >
                  <WishMessage>"{familyWishes[currentWishIndex].message}"</WishMessage>
                  <WishFrom>- {familyWishes[currentWishIndex].from}</WishFrom>
                </motion.div>
              </AnimatePresence>
            </WishesContainer>
          </motion.div>
          
          <NeuDivider />
          
          <motion.div variants={itemVariants}>
            <PhotoGalleryContainer>
              <GalleryTitle>Family Memories</GalleryTitle>
              <PhotoGrid>
                {cardPhotos.map((photo) => (
                  <PhotoItem 
                    key={photo.id}
                    onClick={() => handlePhotoClick(photo)}
                    whileHover={{ scale: 1.03, z: 30 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={photo.src} alt={photo.title} />
                  </PhotoItem>
                ))}
              </PhotoGrid>
            </PhotoGalleryContainer>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <NeuCard>
              <NeuText>
                From all of us to you, we wish you a day filled with joy, happiness, and love.
                Though we're scattered across different countries, our hearts are together.
                Thank you for being an amazing father, brother, doctor, and friend.
              </NeuText>
              <NeuText>
                Your dedication to family and work is truly inspiring.
                Here's to another wonderful year!
              </NeuText>
            </NeuCard>
          </motion.div>
          
          <NavButtons>
            <NeuButton onClick={cycleWish}>
              Next Message
            </NeuButton>
            <NeuPrimaryButton onClick={onClose}>
              Close Card
            </NeuPrimaryButton>
          </NavButtons>
        </CardInsideContent>
      </CardInsideContainer>
      
      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalImage src={selectedPhoto.src} alt={selectedPhoto.title} />
              <PhotoInfo>
                <h3>{selectedPhoto.title}</h3>
                <p>{selectedPhoto.description}</p>
                {selectedPhoto.year && <p>Year: {selectedPhoto.year}</p>}
              </PhotoInfo>
            </ModalContent>
            <CloseButton onClick={closeModal} />
          </PhotoModal>
        )}
      </AnimatePresence>
    </ContentContainer>
  );
};

export default CardInside; 