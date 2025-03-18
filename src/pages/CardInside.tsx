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
  
  /* Ensure content is scrollable on mobile */
  max-height: 100%;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    overflow-y: auto;
    height: 100vh;
    padding-bottom: 20px;
  }
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
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    min-height: auto;
    overflow: visible;
  }
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
    margin-bottom: ${theme.spacing.xl}; /* Add more space at the bottom for mobile */
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

// Define placeholder wishes
const wishes = [
  {
    from: 'Макс',
    message: "Поздравляю с днем рождения!! Желаю крепкого здоровья, побольше совместных счастливых моментов и чтобы всей нашей семье сопутствовала удача. Спасибо за постоянную поддержку и заботу. Любим! P.S Яхта не за горами🛥️"
  },
  {
    from: 'Валерия',
    message: "Я очень рада познакомиться с Вами и Вашей семьей. Вы поистине являетесь примером силы, мудрости и стойкости. Искренне желаю Вам и всей семье побольше радостных и теплых моментов вместе, желаю, чтобы мечты сбывались, а цели достигались быстро и легко. И, конечно, мирного неба над головой, чтобы мы всей большой дружной компанией встретились в Киеве! З днем народження!!"
  },
  {
    from: 'Аня',
    message: "Дуже люблю тебе, тато! Бажаю найкращого дня народження цього року і всі наступні роки. Вірю в тебе і в твої завжди грандіозні плани і беру приклад!"
  },
  {
    from: 'Rafael',
    message: "Alles Gute zum Älterwerden und bleib stabil"
  },
  {
    from: 'Оля',
    message: "Від себе хочеться побажати тобі ще не менш ніж 50 років такої енергії і бажання творити добро, якими ти сяєш сьогодні!"
  },
  {
    from: 'Світлана Олексіївна',
    message: "С Днем Рождения! благодарю как врача за помощь в любую минуту"
  },
  {
    from: 'Інна',
    message: "Саша, вся наша семья от мала  до велика поздравляет тебя ,любим тебя за все -за твою доброту,готовность всегда прийти на помощь,за мудрые советы ….."
  },
  {
    from: 'Женя',
    message: "З Днем народження! 🥳 Ти – людина великої мудрості, справедливості й доброти. Ти не просто найкращий у своїй справі, ти найкращий у всьому – як лікар, як друг, як чоловік. Я безмежно пишаюся тобою, твоїм талантом, твоїм серцем, твоєю здатністю дарувати людям щастя.Нехай у твоєму житті завжди буде світло, радість і гармонія. Нехай доля віддячує тобі за все добро, яке ти даруєш іншим. Я щаслива йти поруч із тобою♥️"
  },
  {
    from: 'Сергей, Галина, Кирилл, Мария"',
    message: "Поздравляем брата и дядю Сашу С Днём Рождения!Желаем жизнью наслаждаться,Почаще вместе собираться!В любви жены и деток искупаться,В признанье пациентов пребыватьИ никогда не унывать! От счастья только улыбатьсяИ много мирных светлых днейВ кругу семьи, родни, друзей!"
  },
  {
    from: 'Кирилл',
    message: "Happy Birthday Саша! Wish you the best birthday ever and hopefully this year brings you lots of adventures and checkmates!"
  },
  {
    from: 'Стася',
    message: "папа, с днем рождения тебя! желаю тебе здоровья, удачи, любви, и исполнения всех желаний. пусть каждый день приносит счастье и успех в любимом деле. спасибо за твою поддержку и мудрость! <3"
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
          
        <CardInsideTitle>Альбом для тата</CardInsideTitle>
        <NeuText style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
          Під фото ховаються привітання, нажми на фото щоб їх побачити!
        </NeuText>
        
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