import React, { useRef, useEffect, useState } from 'react';
import './App.css';

const sections = [
  {
    title: '모임의 기본',
    highlight: '채팅',
    hashtag: '#즐겨찾기',
    image: '/logo192.png',
  },
  {
    title: '돈은 확실하게',
    highlight: '정산',
    hashtag: '#여러 결제 사이트와 연동 #손쉬운 송금',
    image: '/logo512.png',
  },
];

function ParallaxSection({ title, highlight, hashtag, image, index, scrollY }) {
  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        setInView(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax offset (이미지에만 적용)
  const parallaxOffset = scrollY * 0.2 * (index + 1);

  return (
    <section className="parallax-section">
      <div className={`text-block ${inView ? 'show' : ''}`} ref={ref}>
        <h2>{title}</h2>
        <h1>{highlight}</h1>
        <p className="hashtag">{hashtag}</p>
      </div>
      <img
        src={image}
        alt={highlight}
        className="parallax-img"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      />
    </section>
  );
}

function App() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="App">
      {sections.map((sec, i) => (
        <ParallaxSection key={i} {...sec} index={i} scrollY={scrollY} />
      ))}
    </div>
  );
}

export default App;
