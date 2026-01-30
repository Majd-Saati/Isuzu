import { useState, useEffect, useCallback } from 'react';

const MIN_DRAWER_WIDTH = 400;
const MAX_DRAWER_WIDTH_PERCENT = 50; // 50% of screen on desktop
const MOBILE_BREAKPOINT = 768; // Mobile breakpoint

export const useDrawerResize = ({ isOpen }) => {
  const [drawerWidth, setDrawerWidth] = useState(480);
  const [isDragging, setIsDragging] = useState(false);

  // Get max drawer width based on screen size
  const getMaxDrawerWidth = useCallback(() => {
    if (typeof window === 'undefined') return window.innerWidth * (MAX_DRAWER_WIDTH_PERCENT / 100);
    return window.innerWidth < MOBILE_BREAKPOINT 
      ? window.innerWidth // Full width on mobile
      : window.innerWidth * (MAX_DRAWER_WIDTH_PERCENT / 100); // 50% on desktop
  }, []);

  // Handle drag resize
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const maxWidth = getMaxDrawerWidth();
      const newWidth = window.innerWidth - e.clientX;
      
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        // On mobile, allow full width
        if (newWidth >= MIN_DRAWER_WIDTH && newWidth <= maxWidth) {
          setDrawerWidth(newWidth);
        } else if (newWidth < MIN_DRAWER_WIDTH) {
          setDrawerWidth(MIN_DRAWER_WIDTH);
        } else if (newWidth > maxWidth) {
          setDrawerWidth(maxWidth);
        }
      } else {
        // On desktop, limit to 50%
        if (newWidth >= MIN_DRAWER_WIDTH && newWidth <= maxWidth) {
          setDrawerWidth(newWidth);
        } else if (newWidth < MIN_DRAWER_WIDTH) {
          setDrawerWidth(MIN_DRAWER_WIDTH);
        } else if (newWidth > maxWidth) {
          setDrawerWidth(maxWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, getMaxDrawerWidth]);

  // Set initial drawer width based on screen size when drawer opens
  useEffect(() => {
    if (isOpen) {
      const currentIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (currentIsMobile) {
        // On mobile, set to full width
        setDrawerWidth(window.innerWidth);
      } else {
        // On desktop, use default or maintain current width if already set
        if (drawerWidth < MIN_DRAWER_WIDTH || drawerWidth > window.innerWidth * (MAX_DRAWER_WIDTH_PERCENT / 100)) {
          setDrawerWidth(480); // Default desktop width
        }
      }
    }
  }, [isOpen]); // Only run when drawer opens/closes

  // Handle window resize - adjust drawer width when switching between mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      if (!isOpen) return;
      
      const currentIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const maxWidth = getMaxDrawerWidth();
      
      if (currentIsMobile) {
        // If resized to mobile, set drawer to full width
        setDrawerWidth(window.innerWidth);
      } else {
        // If resized to desktop, ensure drawer doesn't exceed 50% max
        if (drawerWidth > maxWidth) {
          setDrawerWidth(maxWidth);
        } else if (drawerWidth < MIN_DRAWER_WIDTH) {
          setDrawerWidth(MIN_DRAWER_WIDTH);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, drawerWidth, getMaxDrawerWidth]);

  return {
    drawerWidth,
    isDragging,
    handleMouseDown,
  };
};
