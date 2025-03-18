import React, { useState, useRef, useEffect } from 'react';
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
  NeuButton
} from '../components/NeumorphicElements';
import { useAppContext } from '../context/AppContext';
import theme from '../styles/GlobalStyles';

// Map journey styled components
const MapContainer = styled(NeuAnimatedContainer)`
  width: 100%;
  text-align: center;
`;

const MapCanvas = styled.div`
  width: 100%;
  height: 400px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  position: relative;
  margin: ${theme.spacing.lg} 0;
  overflow: hidden;
  box-shadow: inset 3px 3px 6px ${theme.colors.shadow1}, 
              inset -3px -3px 6px ${theme.colors.shadow2};
`;

const MapPoint = styled(motion.div)<{ active?: boolean }>`
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: ${props => props.active ? theme.colors.secondary : theme.colors.primary};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  z-index: 5;
  
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: ${theme.colors.background};
    border-radius: 50%;
  }
`;

const MapLine = styled(motion.div)<{ x1: number; y1: number; x2: number; y2: number; active?: boolean }>`
  position: absolute;
  width: ${props => Math.sqrt(Math.pow(props.x2 - props.x1, 2) + Math.pow(props.y2 - props.y1, 2))}px;
  height: 2px;
  background-color: ${props => props.active ? theme.colors.secondary : theme.colors.primary};
  transform-origin: 0 0;
  transform: ${props => `translate(${props.x1}px, ${props.y1}px) rotate(${Math.atan2(props.y2 - props.y1, props.x2 - props.x1)}rad)`};
  opacity: ${props => props.active ? 1 : 0.5};
  z-index: 1;
`;

const MapFlightLine = styled(motion.div)<{ x1: number; y1: number; x2: number; y2: number; active?: boolean }>`
  position: absolute;
  width: ${props => Math.sqrt(Math.pow(props.x2 - props.x1, 2) + Math.pow(props.y2 - props.y1, 2))}px;
  height: 2px;
  background-color: ${props => props.active ? theme.colors.secondary : theme.colors.primary};
  transform-origin: 0 0;
  transform: ${props => `translate(${props.x1}px, ${props.y1}px) rotate(${Math.atan2(props.y2 - props.y1, props.x2 - props.x1)}rad)`};
  opacity: ${props => props.active ? 1 : 0.5};
  z-index: 1;
  
  &::before {
    content: '✈️';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
  }
`;

const MapLabel = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transform: translate(-50%, -100%);
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  font-size: 0.75rem;
  box-shadow: 2px 2px 4px ${theme.colors.shadow1}, 
              -2px -2px 4px ${theme.colors.shadow2};
  z-index: 10;
`;

const TripInfo = styled(NeuCard)`
  margin-top: ${theme.spacing.lg};
  text-align: left;
  
  h3 {
    margin-bottom: ${theme.spacing.sm};
    color: ${theme.colors.primary};
  }
  
  p {
    margin-bottom: ${theme.spacing.sm};
    font-size: 0.9rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

// Dev skip button
const DevSkipButton = styled(NeuButton)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 8px 12px;
  font-size: 0.8rem;
  opacity: 0.6;
  z-index: 100;
  
  &:hover {
    opacity: 1;
  }
`;

// Journey location interface
interface JourneyLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
  distanceInHours: number;
  isFlight?: boolean;
}

// Define interfaces for the filter components
interface MapPointProps {
  active: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  whileHover?: any;
  animate?: any;
  transition?: any;
  [key: string]: any; // For any other props
}

interface MapLineProps {
  active: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  initial?: any;
  animate?: any;
  transition?: any;
  [key: string]: any; // For any other props
}

// Modify where the components are used - create a component to filter props for MapPoint
const FilteredMapPoint: React.FC<MapPointProps> = ({ active, ...rest }) => {
  return <MapPoint data-active={active ? "true" : "false"} {...rest} />;
};

// Modify where the components are used - create a component to filter props for MapLine
const FilteredMapLine: React.FC<MapLineProps> = ({ active, x1, y1, x2, y2, ...rest }) => {
  return <MapLine data-active={active ? "true" : "false"} x1={x1} y1={y1} x2={x2} y2={y2} {...rest} />;
};

// Modify where the components are used - create a component to filter props for MapFlightLine
const FilteredMapFlightLine: React.FC<MapLineProps> = ({ active, x1, y1, x2, y2, ...rest }) => {
  return <MapFlightLine data-active={active ? "true" : "false"} x1={x1} y1={y1} x2={x2} y2={y2} {...rest} />;
};

const MapJourney: React.FC = () => {
  const { completePuzzle2 } = useAppContext();
  const navigate = useNavigate();
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);
  const [isRouteComplete, setIsRouteComplete] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Define journey locations
  const locations: JourneyLocation[] = [
    {
      id: 'kyiv',
      name: 'Kyiv',
      x: 75,
      y: 100,
      description: 'Початок доооовгої дороги. І місто, де живе твоя пʼята дитина 🏥',
      distanceInHours: 0
    },
    {
      id: 'dessau',
      name: 'Dessau',
      x: 200,
      y: 170,
      description: 'Дессау, Німеччина - тут тебе чекають дуже багато людей! Довга дорога, але це варто того!',
      distanceInHours: 24
    },
    {
      id: 'nuremberg',
      name: 'Nuremberg',
      x: 190,
      y: 230,
      description: 'Нюрнберг - заїжджай на тренування до головного танцора родини!',
      distanceInHours: 30
    },
    {
      id: 'munich',
      name: 'Munich',
      x: 180,
      y: 280,
      description: 'Мюнхен - остання локація в Європі. Оце нас розкидало по світу! Зато не скучно і тебе скрізь чекають!',
      distanceInHours: 31
    },
    {
      id: 'toronto',
      name: 'Toronto',
      x: 90,
      y: 200,
      description: 'Торонто - нічого собі, тебе і тут чекають)) ',
      distanceInHours: 39,
      isFlight: true
    }
  ];
  
  // Handle location click
  const handleLocationClick = (index: number) => {
    // Only allow clicking the next location in sequence
    if (index === activeLocationIndex + 1) {
      setActiveLocationIndex(index);
      
      // Check if route is complete
      if (index === locations.length - 1) {
        setIsRouteComplete(true);
      }
    }
  };
  
  // Handle continue
  const handleContinue = () => {
    completePuzzle2();
    navigate('/card');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <ContentContainer>
      <MapContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div variants={itemVariants}>
          <NeuHeading>Подорож до сім'ї</NeuHeading>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <NeuText>
            {isRouteComplete 
              ? "Ти пройшов цей шлях! Родина завжди варта цієї подорожі, незважаючи на відстань." 
              : "Ти майже досяг цілі! Але спочатку тобі треба помандрувати твоєю довгою дорогою, якою ти проїжджаєш аби побачитись з усією родиною! Нажми на кожну точку на карті, щоб пройти цей шлях."}
          </NeuText>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <MapCanvas ref={mapRef}>
            {/* Map Lines */}
            {locations.slice(0, -1).map((location, index) => {
              const nextLocation = locations[index + 1];
              const isActive = activeLocationIndex > index;
              
              // Determine if it's a flight path
              if (nextLocation.isFlight) {
                return (
                  <FilteredMapFlightLine
                    key={`flight-${location.id}-${nextLocation.id}`}
                    x1={location.x}
                    y1={location.y}
                    x2={nextLocation.x}
                    y2={nextLocation.y}
                    active={isActive}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.3,
                      backgroundColor: isActive ? theme.colors.secondary : theme.colors.primary
                    }}
                    transition={{ duration: 0.5 }}
                  />
                );
              }
              
              return (
                <FilteredMapLine
                  key={`line-${location.id}-${nextLocation.id}`}
                  x1={location.x}
                  y1={location.y}
                  x2={nextLocation.x}
                  y2={nextLocation.y}
                  active={isActive}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0.3,
                    backgroundColor: isActive ? theme.colors.secondary : theme.colors.primary
                  }}
                  transition={{ duration: 0.5 }}
                />
              );
            })}
            
            {/* Map Points */}
            {locations.map((location, index) => {
              const isActive = index <= activeLocationIndex;
              const isNext = index === activeLocationIndex + 1;
              
              return (
                <React.Fragment key={location.id}>
                  <FilteredMapPoint 
                    style={{ left: location.x, top: location.y }}
                    active={isActive}
                    onClick={() => handleLocationClick(index)}
                    whileHover={{ scale: isNext ? 1.5 : 1 }}
                    animate={{ 
                      scale: isActive ? 1.2 : 1,
                      backgroundColor: isActive 
                        ? theme.colors.secondary 
                        : isNext ? theme.colors.accent : theme.colors.primary
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <MapLabel x={location.x} y={location.y - 12}>
                    {location.name}
                  </MapLabel>
                </React.Fragment>
              );
            })}
          </MapCanvas>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <TripInfo>
            <h3>Твоя локація: {locations[activeLocationIndex].name}</h3>
            <p>{locations[activeLocationIndex].description}</p>
          </TripInfo>
        </motion.div>
        
        {isRouteComplete && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <ButtonGroup>
              <NeuPrimaryButton onClick={handleContinue}>
                Нарешті до листівки
              </NeuPrimaryButton>
            </ButtonGroup>
          </motion.div>
        )}
      </MapContainer>
    </ContentContainer>
  );
};

export default MapJourney; 