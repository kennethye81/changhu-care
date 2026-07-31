import { type FC, type RefObject, useEffect, useRef } from 'react';

interface TitleWidthMatchedTextProps {
  titleRef: RefObject<HTMLElement | null>;
  children: string;
  className?: string;
}

/** Scale subtitle font size until its natural width matches the title above. */
const TitleWidthMatchedText: FC<TitleWidthMatchedTextProps> = ({ titleRef, children, className = '' }) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const fit = () => {
      const title = titleRef.current;
      const text = textRef.current;
      if (!title || !text) return;

      const targetWidth = title.getBoundingClientRect().width;
      let lo = 8;
      let hi = 28;
      let best = 12;

      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        text.style.fontSize = `${mid}px`;
        if (text.scrollWidth > targetWidth) {
          hi = mid;
        } else {
          best = mid;
          lo = mid;
        }
      }

      text.style.fontSize = `${best}px`;
    };

    fit();
    const observer = new ResizeObserver(fit);
    if (titleRef.current) observer.observe(titleRef.current);
    window.addEventListener('resize', fit);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [titleRef, children]);

  return (
    <p
      ref={textRef}
      className={`mt-1 font-display font-normal tracking-tight whitespace-nowrap leading-none text-[#6a5b54] ${className}`}
    >
      {children}
    </p>
  );
};

export default TitleWidthMatchedText;
