import React, { useRef, useEffect, useContext } from 'react';
import { v4 as uuid4 } from 'uuid';

import { SlideManagerContext } from '../SlideManager';

interface SlideInProps {
  id: string;
  isOpen?: boolean;
  slide: React.ReactNode;
  slideTitle: string;
}

export const SlideIn = function SlideInFn({
  id,
  isOpen = false,
  slide,
  slideTitle,
  ...otherProps
}: SlideInProps) {
  const slideManagerContext = useContext(SlideManagerContext);

  const slideId = useRef(uuid4());

  useEffect(() => {
    if (isOpen) {
      slideManagerContext.addSlide(slideId.current, { element: slide, title: slideTitle });
    } else {
      slideManagerContext.removeSlide(slideId.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, slide, slideTitle]);

  useEffect(
    () => {
      const slideIdCopy = slideId.current;
      return () => {
        slideManagerContext.removeSlide(slideIdCopy);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [true]
  );

  return null;
};
