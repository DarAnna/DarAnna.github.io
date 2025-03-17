import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  NeuHeading, 
  NeuText, 
  NeuPrimaryButton,
  NeuAnimatedContainer,
  NeuCard,
  NeuButton,
  NeuCircle,
  NeuDivider
} from '../components/NeumorphicElements';
import { useAppContext } from '../context/AppContext';
import { getCardPhotos, Photo } from '../utils/photos';
import theme from '../styles/GlobalStyles';

// Album styled components
const CardInsideContainer = styled(NeuAnimatedContainer)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  transform-style: preserve-3d;
  perspective: 1500px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
  padding: 0;
  overflow: visible;
  position: relative;
  z-index: 1;
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
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
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

const AlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  position: relative;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: ${theme.spacing.md};
  }
`;

const PhotoFrame = styled(motion.div)`
  position: relative;
  padding: 10px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    pointer-events: none;
  }

  &:hover {
    transform: scale(1.02) rotate(1deg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 130px;
  }
`;

const PhotoTape = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7);
  height: 20px;
  width: 40px;
  top: -5px;
  left: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const PhotoDate = styled.div`
  position: absolute;
  bottom: 5px;
  right: 15px;
  font-size: 0.7rem;
  font-family: 'Courier New', monospace;
  color: rgba(0, 0, 0, 0.5);
  transform: rotate(-3deg);
`;

const PhotoCaption = styled.div`
  font-size: 0.85rem;
  font-family: 'Courier New', monospace;
  margin-top: 8px;
  text-align: center;
  color: ${theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px;
`;

const IconScattered = styled(motion.div)`
  position: absolute;
  font-size: 1.5rem;
  color: ${props => props.color || theme.colors.primary};
  opacity: 0.6;
  z-index: 1;
  user-select: none;
`;

const WishModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
`;

const WishModalContent = styled(motion.div)`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.xl};
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const WishModalImageContainer = styled.div`
  margin: -${theme.spacing.xl};
  margin-bottom: ${theme.spacing.lg};
  overflow: hidden;
  border-radius: ${theme.borderRadius.large} ${theme.borderRadius.large} 0 0;
  height: 200px;
`;

const WishModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const WishModalMessage = styled.div`
  margin-top: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${theme.colors.text};
  flex: 1;
  overflow-y: auto;
  padding-right: ${theme.spacing.sm};
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
`;

const WishModalFrom = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
`;

const CloseButton = styled(NeuCircle)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${theme.colors.text};
  font-size: 1.2rem;
  z-index: 10;
  
  &::before {
    content: '×';
    font-size: 24px;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
`;

// Define dad-related icons
const dadIcons = [
  '⚽', '🎣', '🎬', '🛠️', '🔧', '📚', '🎵', '🎹', '📱', '⌚', '💼', '🧗‍♂️', 
  '🚗', '🌍', '🏠', '☕', '🍕', '🧠', '❤️', '🎮', '🖥️', '📷', '🎤', '🎂', '🎉'
];

// Define placeholder wishes
const wishes = [
  {
    from: 'Mom',
    message: "Happy birthday to the most wonderful husband and father! You make our family complete with your love, wisdom, and those terrible dad jokes that we secretly love. Wishing you all the happiness in the world today and always."
  },
  {
    from: 'Sister',
    message: "Big bro! Can't believe you're another year older (and hopefully wiser!). Thanks for always being there for me and setting such a great example. You're the best brother anyone could ask for. Happy birthday!"
  },
  {
    from: 'Brother',
    message: "Happy birthday to my awesome brother who taught me everything I know about persistence and hard work. You've always been my role model. Enjoy your special day, you deserve it!"
  },
  {
    from: 'Grandma',
    message: "My dearest grandson, watching you grow into the man you are today has been one of my greatest joys. Your kindness and strength remind me so much of your grandfather. Sending you all my love on your birthday."
  },
  {
    from: 'Cousin Sarah',
    message: "Happy birthday to my favorite cousin! Remember all those summer adventures we had as kids? Those are still some of my favorite memories. Hope your day is filled with as much fun as those summers were!"
  },
  {
    from: 'Uncle Jim',
    message: "Happy birthday, nephew! It's been a privilege watching you grow up into the man you've become. Your dedication to your family reminds me of your father. Wishing you continued success and happiness in the coming year."
  },
  {
    from: 'Aunt Mary',
    message: "Happy birthday to my wonderful nephew! Your positivity and energy always light up the room. You've grown into such a thoughtful and caring person. Enjoy your special day!"
  },
  {
    from: 'Childhood Friend',
    message: "We've been friends since we were little tykes, and I've watched you grow into an amazing father and husband. So proud to call you my friend. Happy birthday, buddy!"
  }
];

interface CardInsideProps {
  isVisible: boolean;
  onClose: () => void;
}

const CardInside: React.FC<CardInsideProps> = ({ isVisible, onClose }) => {
  const { state } = useAppContext();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentWish, setCurrentWish] = useState<typeof wishes[0] | null>(null);
  const photos = getCardPhotos();
  const controls = useAnimation();
  
  // Randomly place icons across the album
  const generateIcons = () => {
    const icons = [];
    const iconCount = 12;
    
    for (let i = 0; i < iconCount; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const rotation = Math.random() * 60 - 30;
      const icon = dadIcons[Math.floor(Math.random() * dadIcons.length)];
      const delay = Math.random() * 0.5;
      const color = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`;
      
      icons.push(
        <IconScattered 
          key={i}
          style={{ 
            top: `${y}%`, 
            left: `${x}%`, 
            transform: `rotate(${rotation}deg)`,
            color 
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ delay, duration: 0.4 }}
        >
          {icon}
        </IconScattered>
      );
    }
    
    return icons;
  };
  
  const openWishModal = (photo: Photo) => {
    setSelectedPhoto(photo);
    // Randomly select a wish to display
    const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
    setCurrentWish(randomWish);
  };
  
  const closeModal = () => {
    setSelectedPhoto(null);
    setCurrentWish(null);
  };
  
  // Render each photo with a vintage photo frame look
  const renderPhoto = (photo: Photo, index: number) => {
    const delay = index * 0.08;
    const rotation = Math.random() * 6 - 3;
    const tapeRotation = Math.random() * 10 - 5;
    
    return (
      <PhotoFrame
        key={photo.id}
        style={{ transform: `rotate(${rotation}deg)` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        onClick={() => openWishModal(photo)}
        whileHover={{ 
          y: -5,
          transition: { duration: 0.2 } 
        }}
      >
        <PhotoTape style={{ transform: `translateX(-50%) rotate(${tapeRotation}deg)` }} />
        <PhotoImage src={photo.src} alt={photo.title} />
        <PhotoCaption>{photo.title}</PhotoCaption>
        {photo.year && <PhotoDate>{photo.year}</PhotoDate>}
      </PhotoFrame>
    );
  };
  
  useEffect(() => {
    if (isVisible) {
      controls.start("visible");
    }
  }, [isVisible, controls]);
  
  return (
    <CardInsideContainer
      initial="hidden"
      animate={controls}
      exit="hidden"
      variants={{
        visible: { opacity: 1, rotateY: 0, transition: { duration: 0.8 } },
        hidden: { opacity: 0, rotateY: 90, transition: { duration: 0.4 } }
      }}
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      <CardInsideContent>
        <CardEdge />
        
        <CardInsideTitle>Dad's Memory Album</CardInsideTitle>
        <NeuText style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
          Click on any photo to see birthday wishes!
        </NeuText>
        
        <IconContainer>
          {generateIcons()}
        </IconContainer>
        
        <AlbumGrid>
          {photos.map(renderPhoto)}
        </AlbumGrid>
        
        <NeuButton 
          onClick={onClose}
          style={{ margin: '0 auto', marginTop: theme.spacing.md }}
        >
          Return to Card
        </NeuButton>
      </CardInsideContent>
      
      <AnimatePresence>
        {selectedPhoto && currentWish && (
          <WishModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <WishModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <WishModalImageContainer>
                <WishModalImage src={selectedPhoto.src} alt={selectedPhoto.title} />
              </WishModalImageContainer>
              
              <CloseButton onClick={closeModal} />
              
              <WishModalFrom>From {currentWish.from}:</WishModalFrom>
              <WishModalMessage>{currentWish.message}</WishModalMessage>
              
              <NeuDivider style={{ margin: `${theme.spacing.md} 0` }} />
              
              <NeuPrimaryButton onClick={closeModal}>
                Back to Album
              </NeuPrimaryButton>
            </WishModalContent>
          </WishModalOverlay>
        )}
      </AnimatePresence>
    </CardInsideContainer>
  );
};

export default CardInside; 