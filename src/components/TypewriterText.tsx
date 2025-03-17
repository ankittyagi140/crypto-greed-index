'use client';

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  restartInterval?: number;
}

export default function TypewriterText({ 
  text, 
  className = '', 
  speed = 50,
  delay = 500,
  restartInterval = 30000
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const resetTypewriter = () => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsTyping(true);
  };

  useEffect(() => {
    const startDelay = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startDelay);
  }, [delay]);

  useEffect(() => {
    if (!restartInterval) return;

    const intervalId = setInterval(() => {
      resetTypewriter();
    }, restartInterval);

    return () => clearInterval(intervalId);
  }, [restartInterval]);

  useEffect(() => {
    if (!isTyping || currentIndex >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed, isTyping]);

  return (
    <span className={className}>
      {displayText}
      {isTyping && currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
} 