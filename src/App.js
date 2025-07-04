import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import logo from './logo.png';

function Header() {
  return (
    <header className="main-header">
      <div className="header-content">
        <span className="header-logo">U-TEED</span>
      </div>
    </header>
  );
}

const sections = [
  {
    title: '모든 단체 스포츠를 위한',
    highlight: '인원 모집 플랫폼',
    hashtag: '#축구뿐만 아니라 농구, 배드민턴, 족구, 배구 등 모든 스포츠',
    image: logo,
    detailLink: '/detail/1',
  },
  {
    title: '주변에서 바로 찾는',
    highlight: '스포츠 멤버',
    hashtag: '#내 주변에서 빠르게 인원 모집',
    image: logo,
    detailLink: '/detail/2',
  },
  {
    title: '모임의 기본',
    highlight: '채팅 & 정산',
    hashtag: '#실시간 채팅 #간편 정산',
    image: logo,
    detailLink: '/detail/3',
  },
];

function ParallaxSection({ title, highlight, hashtag, image, index, scrollY, detailLink, navigate }) {
  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Parallax offset (이미지에만 적용)
  const parallaxOffset = scrollY * 0.2 * (index + 1);

  return (
    <section className="parallax-section" ref={ref}>
      <div className={`text-block ${inView ? 'show' : ''}`}>
        <h2>{title}</h2>
        <h1>{highlight}</h1>
        <p className="hashtag">{hashtag}</p>
        <button className="detail-btn" onClick={() => navigate(detailLink)}>자세히 보기</button>
      </div>
      {index === 0 && image && (
        <img
          src={image}
          alt={highlight}
          className="parallax-img"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        />
      )}
    </section>
  );
}

function FooterSection({ visible, footerRef }) {
  return (
    <section ref={footerRef} className={`parallax-section footer-section ${visible ? 'footer-visible' : ''}`}>
      <div className="footer-content">© 2025 U-TEED. All rights reserved.</div>
    </section>
  );
}

function MainPage() {
  const [scrollY, setScrollY] = useState(0);
  const [footerInView, setFooterInView] = useState(false);
  const footerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.background = footerInView ? '#333' : '#fff';
    return () => { document.body.style.background = '#fff'; };
  }, [footerInView]);

  return (
    <div className="App snap-container">
      {sections.map((sec, i) => (
        <ParallaxSection key={i} {...sec} index={i} scrollY={scrollY} navigate={navigate} />
      ))}
      <FooterSection visible={footerInView} footerRef={footerRef} />
    </div>
  );
}

function DetailPage({ num }) {
  return (
    <div className="detail-page">
      <h1>상세페이지 {num}</h1>
      <p>여기에 상세 설명과 이미지를 추가하세요.</p>
    </div>
  );
}

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/detail/1" element={<DetailPage num={1} />} />
          <Route path="/detail/2" element={<DetailPage num={2} />} />
          <Route path="/detail/3" element={<DetailPage num={3} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
