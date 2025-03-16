import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardInside from './CardInside';

const CardInsideWrapper: React.FC = () => {
  const [isVisible] = useState(true); // Always visible when accessed directly
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/');
  };

  return (
    <CardInside isVisible={isVisible} onClose={handleClose} />
  );
};

export default CardInsideWrapper; 