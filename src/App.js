import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import logo from './image/logo.png';
import DetailPage from './DetailPage';

function Header({ onNavClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <span className="header-logo" style={{cursor: 'pointer'}} onClick={handleLogoClick}>U-TEED</span>
        <nav className="header-nav">
          <button onClick={() => onNavClick('section-1')}>SPOT</button>
          <button onClick={() => onNavClick('section-2')}>Project 2.</button>
        </nav>
      </div>
    </header>
  );
}

const sections = [
  {
    title: '모든 단체 스포츠를 위한',
    highlight: '인원 모집 플랫폼. SPOT',
    hashtag: '#축구뿐만 아니라 농구, 배드민턴, 야구, 배구 등 모든 스포츠',
    image: null,
    detailLink: '/detail/1',
  },
  {
    title: '프로젝트 준비중...',
    highlight: '다른 프로젝트도 의뢰해보세요!',
    hashtag: '#내가_기획하는',
    detailLink: "mailto:admin@u-teed.co.kr",
  }
];

function ParallaxSection({ title, highlight, hashtag, image, index, scrollY, detailLink, navigate, sectionRef, id }) {
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

  // 버튼 클릭 핸들러
  const handleDetailClick = () => {
    if (index === 0) {
      navigate(detailLink);
    } else {
      window.alert('서비스 준비중입니다.');
    }
  };

  return (
    <section className="parallax-section" ref={el => {
      ref.current = el;
      if (sectionRef) sectionRef.current = el;
    }} id={id}>
      {/* 첫 번째 섹션: 텍스트 위에만 로고 */}
      {index === 0 && (
        <img
          src={logo}
          alt="로고"
          className="parallax-logo-img"
        />
      )}
      <div className={`text-block ${inView ? 'show' : ''}`}>
        <h2>{title}</h2>
        <h1>{highlight}</h1>
        <p className="hashtag">{hashtag}</p>
        <button className="detail-btn" onClick={handleDetailClick}>자세히 보기</button>
      </div>
      {/* 두 번째, 세 번째 섹션: 아래 큰 이미지만 */}
      {index !== 0 && image && (
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

function MainPage({ sectionRefs }) {
  const [scrollY, setScrollY] = useState(0);
  const [footerInView, setFooterInView] = useState(false);
  const footerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <ParallaxSection
          key={i}
          {...sec}
          index={i}
          scrollY={scrollY}
          navigate={navigate}
          sectionRef={sectionRefs[i]}
          id={`section-${i+1}`}
        />
      ))}
      <FooterSection visible={footerInView} footerRef={footerRef} />
    </div>
  );
}

function App() {
  const sectionRefs = [useRef(), useRef(), useRef()];
  const handleNavClick = (id) => {
    const idx = { 'section-1': 0, 'section-2': 1, 'section-3': 2 }[id];
    sectionRefs[idx]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Router>
      <Header onNavClick={handleNavClick} />
      <Routes>
        <Route path="/" element={<MainPage sectionRefs={sectionRefs} />} />
        <Route path="/detail/1" element={<DetailPage num={1} />} />
        <Route path="/detail/2" element={<DetailPage num={2} />} />
        <Route path="/detail/3" element={<DetailPage num={3} />} />
      </Routes>
    </Router>
  );
}

export default App;
