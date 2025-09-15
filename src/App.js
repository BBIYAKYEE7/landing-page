import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import logo from './image/logo.png';
import instagramImg from './image/instagram.png';
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
          <button onClick={() => onNavClick('section-2')}>프로젝트 의뢰하기</button>
        </nav>
      </div>
    </header>
  );
}

const sections = [
  {
    title: '지금 당신 주변의 모든 운동.',
    highlight: 'SPOT',
    hashtag: '#축구뿐만 아니라 농구, 배드민턴, 야구, 배구 등 모든 스포츠를 위한',
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
      window.location.href = 'mailto:admin@u-teed.co.kr';
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
        <button className="detail-btn" onClick={handleDetailClick}>
          {index === 1 ? '의뢰하기' : '자세히 보기'}
        </button>
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
      <div className="footer-content company-footer" style={{fontFamily: 'Pretendard, sans-serif', color: '#6B7684', fontWeight: 400, fontSize: '1.05rem', lineHeight: 1.7, textAlign: 'left', maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem'}}>
        <div style={{fontWeight: 700, fontSize: '1.25rem', color: '#222', marginBottom: '0.7rem'}}>U-TEED</div>
        <div>사업자 등록번호 : 000-00-00000 | 대표 : 임태호</div>
        <div>이메일: admin@u-teed.co.kr</div>
        <div>Copyright © 2025 U-TEED. All Rights Reserved.</div>
        <div></div>
        {/* 버튼 영역 */}
        <div style={{display: 'flex', gap: '1.2rem', marginTop: '1.7rem'}}>
          <a href="https://instagram.com/spot_uteed" target="_blank" rel="noopener noreferrer" className="footer-btn">
            <img src={instagramImg} alt="Instagram" width="16" height="16" />
          </a>
          <a href="mailto:admin@u-teed.co.kr" className="footer-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4h20v16H2V4zm2 2v12h16V6H4zm8 5l8-5H4l8 5zm0 2l-8-5v10h16V8l-8 5z" fill="#fff"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// 설문조사 팝업 컴포넌트
function SurveyPopup({ isOpen, onClose }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isConfirmClosing, setIsConfirmClosing] = useState(false);
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  const handleSurveyClick = () => {
    // 설문조사 링크로 이동 (여기에 실제 설문조사 URL을 넣으세요)
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdqQtfpAPCYGEEdrLw8C481TITGkscFc29dVmPOBBPsBx5fPA/viewform', '_blank');
  };

  const handleCloseClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmClosing(true);
    setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        if (doNotShowToday) {
          try {
            const expireAt = Date.now() + 24 * 60 * 60 * 1000; // 24시간
            window.localStorage.setItem('surveyPopupHideUntil', String(expireAt));
          } catch (e) {
            // ignore storage errors
          }
        }
        onClose();
        setShowConfirmDialog(false);
        setIsClosing(false);
        setIsConfirmClosing(false);
      }, 300); // 메인 팝업 애니메이션 시간
    }, 250); // 확인 다이얼로그 애니메이션 시간
  };

  const handleCancelClose = () => {
    setIsConfirmClosing(true);
    setTimeout(() => {
      setShowConfirmDialog(false);
      setIsConfirmClosing(false);
    }, 250); // 확인 다이얼로그 애니메이션 시간
  };

  if (!isOpen) return null;

  return (
    <div className={`survey-popup-overlay ${isClosing ? 'closing' : ''}`} onClick={handleCloseClick}>
      <div className={`survey-popup-content ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="survey-popup-close" onClick={handleCloseClick}>×</button>
        <div className="survey-popup-body">
          <h2>🎉 특별 이벤트! 🎉</h2>
          <h3>설문조사 참여하고<br/>앱 런칭 시 다양한 보상을 받아보세요!</h3>
          <p>
            간단한 설문조사에 참여해주시면<br/>
            U-TEED 앱 출시 시 특별한 혜택을 드립니다.
          </p>
          <div className="survey-benefits">
            <div className="benefit-item">🏆 런칭 기념 프리미엄 기능 무료 체험</div>
            <div className="benefit-item">🎁 특별 할인 쿠폰 제공</div>
            <div className="benefit-item">⭐ 얼리버드 전용 특전</div>
          </div>
          <button className="survey-participate-btn" onClick={handleSurveyClick}>
            설문조사 참여하기
          </button>
          <p className="survey-note">* 설문조사는 약 3분 소요됩니다</p>
        </div>
      </div>
      
      {/* 확인 다이얼로그 */}
      {showConfirmDialog && (
        <div className={`confirm-dialog-overlay ${isConfirmClosing ? 'closing' : ''}`} onClick={handleCancelClose}>
          <div className={`confirm-dialog-content ${isConfirmClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="confirm-dialog-body">
              <div className="confirm-dialog-icon">😢</div>
              <h3>🤔 정말 포기하시겠어요?</h3>
              <p>
                이 특별한 혜택을 놓치시면<br/>
                다시 받기 어려울 수 있어요!
              </p>
              <div className="confirm-dialog-option" style={{marginTop: '0.5rem', marginBottom: '0.75rem'}}>
                <label className="do-not-show-today" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                  <input type="checkbox" checked={doNotShowToday} onChange={(e) => setDoNotShowToday(e.target.checked)} />
                  오늘 하루 보지 않기
                </label>
              </div>
              <div className="confirm-dialog-buttons">
                <button className="confirm-btn-no" onClick={handleCancelClose}>
                  아니요, 다시 볼게요
                </button>
                <button className="confirm-btn-yes" onClick={handleConfirmClose}>
                  네, 포기할게요
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MainPage({ sectionRefs }) {
  const [scrollY, setScrollY] = useState(0);
  const [footerInView, setFooterInView] = useState(false);
  const [showSurveyPopup, setShowSurveyPopup] = useState(false);
  const footerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // 하루 동안 보지 않기 체크 여부 확인
    try {
      const hideUntilStr = window.localStorage.getItem('surveyPopupHideUntil') || '0';
      const hideUntil = parseInt(hideUntilStr, 10);
      if (hideUntil > Date.now()) {
        return;
      }
    } catch (e) {
      // ignore storage errors
    }
    // 페이지 로딩 후 1초 뒤에 팝업 표시
    const timer = setTimeout(() => {
      setShowSurveyPopup(true);
    }, 1000);
    return () => clearTimeout(timer);
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

  const closeSurveyPopup = () => {
    setShowSurveyPopup(false);
  };

  return (
    <div className="App snap-container">
      <SurveyPopup isOpen={showSurveyPopup} onClose={closeSurveyPopup} />
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
