import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { PageContainer } from './components/NeumorphicElements';

// Import pages
import Welcome from './pages/Welcome';
import PhotoPuzzle from './pages/PhotoPuzzle';
import MapJourney from './pages/MapJourney';
import Card from './pages/Card';
import CardInsideWrapper from './pages/CardInsideWrapper';

// Routes guard component
const ProtectedRoute: React.FC<{
  element: React.ReactNode;
  condition: boolean;
  redirectTo: string;
}> = ({ element, condition, redirectTo }) => {
  return condition ? <>{element}</> : <Navigate to={redirectTo} />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <PageContainer>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route 
                path="/puzzle" 
                element={
                  <ProtectedRoute 
                    element={<PhotoPuzzle />} 
                    condition={true} 
                    redirectTo="/" 
                  />
                } 
              />
              <Route 
                path="/journey" 
                element={
                  <ProtectedRoute 
                    element={<MapJourney />} 
                    condition={true} 
                    redirectTo="/" 
                  />
                } 
              />
              <Route 
                path="/card" 
                element={
                  <ProtectedRoute 
                    element={<Card />} 
                    condition={true} 
                    redirectTo="/" 
                  />
                } 
              />
              <Route 
                path="/inside" 
                element={
                  <ProtectedRoute 
                    element={<CardInsideWrapper />} 
                    condition={true} 
                    redirectTo="/" 
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </PageContainer>
      </Router>
    </AppProvider>
  );
};

export default App; 