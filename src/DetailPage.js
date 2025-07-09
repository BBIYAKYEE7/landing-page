import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DetailPage.css';
import homeImg from './image/home.png';
import searchImg from './image/scroll.png';
import communityImg from './image/community.png';
import detailImg from './image/detail.png';
import instagramImg from './image/instagram.png';

const HEADER_HEIGHT = 0; // 더 이상 필요 없음

const DetailPage = ({ num = 1 }) => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const sectionsRef = useRef([]);
  const [highlightBounce, setHighlightBounce] = useState(false);

  useEffect(() => {
    // 마운트 후 50ms 뒤에 bounce-in 클래스 추가
    const timer = setTimeout(() => setHighlightBounce(true), 50);
    return () => clearTimeout(timer);
  }, []);

  

  // 각 프로젝트별 섹션 데이터
  const projectSections = {
    1: [
      {
        id: 'SPOT',
        isTitle: true,
        title: '모든 단체 스포츠를 위한',
        highlight: '인원 모집 플랫폼. SPOT',
        hashtag: '#축구뿐만 아니라 농구, 배드민턴, 야구, 배구 등 모든 스포츠',
        description: '스크롤하여 더 자세히 알아보세요.',
      },
      {
        id: 'home',
        title: '주변에 뭐가 있지?',
        description: '지도에 현재 위치를 기반으로 하여 주변에 어떤 운동시설이 있는지 알려줍니다. 보다 편리하게 시설을 찾을 수 있죠.',
        image: homeImg
      },
      {
        id: 'search',
        title: '보다 간편한 용병 모집.',
        description: '축구와 같은 팀 스포츠를 하는데 한번쯤 다들 인원이 부족했던 적이 있었죠? 이제는 SPOT으로 쉽게 용병을 모집해보세요. 현재 위치 주변에서 누가 몇명을 모집하는지 보다 편리하게 알려줍니다.',
        image: searchImg
      },
      {
        id: 'chat',
        title: '커뮤니티 기능도 지원',
        description: '동호회 회원분들도 손쉽게 확인할 수 있도록 커뮤니티 기능도 지원합니다. 커뮤니티 공고를 확인하고 모집자와 컨택하여 운동을 즐겨보세요!',
        image: communityImg
      },
      {
        id: 'payment',
        title: '시설에 대한 정보도 간편하게.',
        description: '홈화면에서 고른 시설을 클릭하여 시설에 대한 정보와 실 사용자 리뷰, 시설 예약, 혼잡여부 등을 확인할 수 있습니다.',
        image: detailImg
      }
    ]
  };

  const sections = projectSections[num] || projectSections[1];

  // 스크롤 위치 추적
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 각 섹션의 활성화 상태 계산 (보이는 시간 늘리기)
  const getSectionStyle = (index) => {
    const vh = window.innerHeight;
    const sectionStart = vh * index;
    const sectionEnd = vh * (index + 1);
    const center = (sectionStart + sectionEnd) / 2;
    const dist = Math.abs(scrollY + vh / 2 - center);
    const visibleRange = vh * 0.3; // 완전히 보이는 구간
    let opacity = 1;
    if (dist > visibleRange) {
      const fadeRange = vh * 0.25; // fade-out 구간
      opacity = Math.max(0, 1 - (dist - visibleRange) / fadeRange);
    }
    const scale = 0.97 + 0.03 * opacity;
    return {
      position: 'sticky',
      top: 0,
      opacity,
      transform: `scale(${scale})`,
      zIndex: 10 + (opacity * 10),
      transition: 'opacity 0.7s, transform 0.7s',
      pointerEvents: opacity > 0.3 ? 'auto' : 'none',
    };
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleDotClick = (index) => {
    window.scrollTo({
      top: window.innerHeight * index,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      <div className={`detail-page visible`}>
        <div className="sections-container" style={{ paddingTop: 0 }}>
          {sections.map((section, index) => (
            <section
              key={section.id}
              ref={el => sectionsRef.current[index] = el}
              className={`detail-section ${index % 2 === 0 ? 'even-section' : ''}`}
              id={section.id}
              style={getSectionStyle(index)}
            >
              {section.isTitle ? (
                <div className="project-title-section">
                  <h2 className={`project-title-main${highlightBounce ? ' show' : ''}`}>{section.title}</h2>
                  {section.highlight && (
                    <h1 className={`project-title-highlight${highlightBounce ? ' show' : ''}`}>{section.highlight}</h1>
                  )}
                  {section.hashtag && (
                    <p className={`project-title-hashtag${highlightBounce ? ' show' : ''}`}>{section.hashtag}</p>
                  )}
                  <p className={`project-title-desc${highlightBounce ? ' show' : ''}`}>{section.description}</p>
                </div>
              ) : (
                <div className="section-content">
                  <div className="section-text">
                    <h2 className="section-title">{section.title}</h2>
                    <p className="section-description">{section.description}</p>
                  </div>
                  <div className="phone-container">
                    <div className="phone-frame">
                      <img 
                        src={section.image} 
                        alt={section.title}
                        className={`phone-image ${section.id === 'chat' ? 'community-image' : ''} ${section.id === 'payment' ? 'detail-image' : ''} ${section.id === 'search' ? 'search-image' : ''} ${section.id === 'home' ? 'home-image' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
        <div className="back-button-container">
          <button className="back-button" onClick={handleBackClick}>
            <span className="back-icon">←</span>
            돌아가기
          </button>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-dots">
            {sections.map((_, index) => (
              <div 
                key={index}
                className={`scroll-dot`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>
        {/* Footer 버튼 추가 완료 */}
      </div>
      <section className="footer-section">
        <div className="footer-content company-footer" style={{fontFamily: 'Pretendard, sans-serif', color: '#6B7684', fontWeight: 400, fontSize: '1.05rem', lineHeight: 1.7, textAlign: 'left', maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem'}}>
          <div style={{fontWeight: 700, fontSize: '1.25rem', color: '#222', marginBottom: '0.7rem'}}>U-TEED</div>
          <div>사업자 등록번호 : 000-00-00000 | 대표 : 임태호</div>
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
    </div>
  );
};

export default DetailPage;
