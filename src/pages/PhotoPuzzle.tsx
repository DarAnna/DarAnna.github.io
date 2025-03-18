import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  NeuCard, 
  NeuHeading, 
  NeuText, 
  NeuPrimaryButton,
  ContentContainer,
  NeuAnimatedContainer,
  NeuImageContainer,
  NeuButton
} from '../components/NeumorphicElements';
import { useAppContext } from '../context/AppContext';
import { getPuzzlePieces, Photo } from '../utils/photos';
import theme from '../styles/GlobalStyles';

// Styled components for the puzzle
const PuzzleContainer = styled(NeuAnimatedContainer)`
  text-align: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding-bottom: ${theme.spacing.xl};
`;

const PuzzleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.sm};
  margin: ${theme.spacing.xl} 0;
  width: 100%;
  aspect-ratio: 1 / 1;
`;

const PuzzlePiece = styled(motion.div)<{ $isSelected?: boolean }>`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* Creates a perfect square */
  overflow: hidden;
  border-radius: ${theme.borderRadius.small};
  cursor: pointer;
  background-color: ${theme.colors.background};
  box-shadow: ${props => props.$isSelected 
    ? `0 0 0 2px ${theme.colors.accent}` 
    : `3px 3px 5px ${theme.colors.shadow1}, -3px -3px 5px ${theme.colors.shadow2}`};
`;

const PuzzlePieceImage = styled.div<{ position: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 300% 300%;
  background-repeat: no-repeat;
  
  ${({ position }) => {
    const row = Math.floor(position / 3);
    const col = position % 3;
    return `
      background-position: ${col === 0 ? '0%' : col === 1 ? '50%' : '100%'} ${row === 0 ? '0%' : row === 1 ? '50%' : '100%'};
    `;
  }}
`;

const CompletedPuzzleImage = styled(NeuImageContainer)`
  width: 100%;
  max-width: 300px;
  margin: ${theme.spacing.lg} auto;
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const ButtonContainer = styled.div`
  margin-top: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  display: flex;
  justify-content: center;
`;

// Interfaces
interface PuzzlePieceType {
  id: number;
  correctPosition: number;
  currentPosition: number;
  imageUrl: string;
}

const PhotoPuzzle: React.FC = () => {
  const { completePuzzle1 } = useAppContext();
  const navigate = useNavigate();
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePieceType[]>([]);
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [photo, setPhoto] = useState<Photo | null>(null);
  
  // Initialize puzzle
  useEffect(() => {
    const puzzlePhoto = getPuzzlePieces(1)[0]; // Get the puzzle photo
    setPhoto(puzzlePhoto);
    
    // Create puzzle pieces
    const totalPieces = 9;
    const pieces: PuzzlePieceType[] = [];
    
    for (let i = 0; i < totalPieces; i++) {
      pieces.push({
        id: i,
        correctPosition: i,
        currentPosition: i,
        imageUrl: puzzlePhoto.src,
      });
    }
    
    // Create a shuffled array with all positions
    const shuffledPositions = Array.from({ length: totalPieces }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
      
    // Assign each piece a random position (but ensure all positions are used)
    const shuffledPieces = pieces.map((piece, index) => ({
      ...piece,
      currentPosition: shuffledPositions[index]
    }));
    
    // Sort by current position for display
    shuffledPieces.sort((a, b) => a.currentPosition - b.currentPosition);
    
    setPuzzlePieces(shuffledPieces);
  }, []);
  
  // Check if puzzle is complete
  useEffect(() => {
    if (puzzlePieces.length === 0) return;
    
    const isComplete = puzzlePieces.every(piece => piece.correctPosition === piece.currentPosition);
    setIsPuzzleComplete(isComplete);
  }, [puzzlePieces]);
  
  // Handle piece selection
  const handlePieceClick = (id: number) => {
    if (isPuzzleComplete) return;
    
    if (selectedPieceId === null) {
      // First piece selected
      setSelectedPieceId(id);
    } else {
      // Second piece selected, swap them
      const firstPieceIndex = puzzlePieces.findIndex(piece => piece.id === selectedPieceId);
      const secondPieceIndex = puzzlePieces.findIndex(piece => piece.id === id);
      
      const updatedPieces = [...puzzlePieces];
      
      // Swap current positions
      const temp = updatedPieces[firstPieceIndex].currentPosition;
      updatedPieces[firstPieceIndex].currentPosition = updatedPieces[secondPieceIndex].currentPosition;
      updatedPieces[secondPieceIndex].currentPosition = temp;
      
      // Sort by current position to reorder the pieces visually
      updatedPieces.sort((a, b) => a.currentPosition - b.currentPosition);
      
      setPuzzlePieces(updatedPieces);
      setSelectedPieceId(null);
    }
  };
  
  // Handle continue
  const handleContinue = () => {
    completePuzzle1();
    navigate('/journey');
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
        staggerChildren: 0.1
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
      <PuzzleContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div variants={itemVariants}>
          <NeuHeading>Фотопазл</NeuHeading>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <NeuText>
            {isPuzzleComplete 
              ? "Супер! Ти склав пазл!" 
              : "Все не так просто! Тепер склади частинки пазла аби отримати ціле фото! Обери спочатку одну частинку і потім другу, щоб поміняти їх місцями"}
          </NeuText>
        </motion.div>
        
        {isPuzzleComplete ? (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CompletedPuzzleImage>
              {photo && <img src={photo.src} alt="Completed Puzzle" />}
            </CompletedPuzzleImage>
            
            <ButtonContainer>
              <NeuPrimaryButton onClick={handleContinue}>
                Continue to Next Challenge
              </NeuPrimaryButton>
            </ButtonContainer>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <PuzzleGrid>
              {puzzlePieces.map((piece) => (
                <PuzzlePiece
                  key={piece.id}
                  $isSelected={selectedPieceId === piece.id}
                  onClick={() => handlePieceClick(piece.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: selectedPieceId === piece.id ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <PuzzlePieceImage 
                    position={piece.correctPosition}
                    style={{
                      backgroundImage: `url(${piece.imageUrl})`
                    }}
                  />
                </PuzzlePiece>
              ))}
            </PuzzleGrid>
          </motion.div>
        )}
        
        {selectedPieceId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <NeuText>Now select another piece to swap with</NeuText>
          </motion.div>
        )}
      </PuzzleContainer>
    </ContentContainer>
  );
};

export default PhotoPuzzle; 