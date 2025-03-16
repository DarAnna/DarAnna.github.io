import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import CardFront from './CardFront';
import CardInside from './CardInside';
import { useNavigate } from 'react-router-dom';

const CardContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  aspect-ratio: 5/7;
  position: relative;
  perspective: 2000px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Card = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardOpen = () => {
    setIsOpen(true);
  };

  const handleCardClose = () => {
    navigate('/thankyou');
  };

  return (
    <CardContainer>
      <CardFront isOpen={isOpen} onOpen={handleCardOpen} />
      <CardInside isVisible={isOpen} onClose={handleCardClose} />
    </CardContainer>
  );
};

export default Card; 