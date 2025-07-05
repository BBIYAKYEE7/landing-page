import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DetailPage.css';

const HEADER_HEIGHT = 0; // 더 이상 필요 없음

const DetailPage = ({ num = 1 }) => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const sectionsRef = useRef([]);

  // 각 프로젝트별 섹션 데이터
  const projectSections = {
    1: [
      {
        id: 'project-title',
        isTitle: true,
        title: `프로젝트 ${num} 상세 정보`,
        description: '각 섹션을 스크롤하여 자세한 기능을 확인해보세요',
      },
      {
        id: 'home',
        title: '홈 화면',
        description: '모든 스포츠 활동을 한눈에 볼 수 있는 메인 화면입니다. 축구, 농구, 배드민턴, 야구, 배구 등 다양한 스포츠 카테고리를 제공합니다.',
        image: '/home.png'
      },
      {
        id: 'search',
        title: '검색 & 필터',
        description: '위치, 스포츠 종목, 시간대별로 빠르게 검색하고 필터링할 수 있습니다. 내 주변의 스포츠 모임을 쉽게 찾아보세요.',
        image: '/search.png'
      },
      {
        id: 'chat',
        title: '실시간 채팅',
        description: '모임 멤버들과 실시간으로 소통할 수 있는 채팅 기능입니다. 모임 일정, 장소, 규칙 등을 자유롭게 논의하세요.',
        image: '/chat.png'
      },
      {
        id: 'payment',
        title: '간편 정산',
        description: '구장비, 장비비 등을 간편하게 정산할 수 있는 기능입니다. 투명하고 공정한 비용 분담을 도와드립니다.',
        image: '/payment.png'
      }
    ],
    2: [
      {
        id: 'project-title',
        isTitle: true,
        title: `프로젝트 ${num} 상세 정보`,
        description: '각 섹션을 스크롤하여 자세한 기능을 확인해보세요',
      },
      {
        id: 'nearby',
        title: '주변 검색',
        description: 'GPS 기반으로 내 주변의 스포츠 모임을 실시간으로 찾아볼 수 있습니다. 거리순으로 정렬되어 가까운 모임부터 확인하세요.',
        image: '/nearby.png'
      },
      {
        id: 'matching',
        title: '스마트 매칭',
        description: '내 실력과 선호도에 맞는 모임을 자동으로 추천해드립니다. 초보자부터 전문가까지 모두가 만족할 수 있는 매칭 시스템입니다.',
        image: '/matching.png'
      },
      {
        id: 'profile',
        title: '프로필 관리',
        description: '내 스포츠 경력과 선호도를 관리할 수 있습니다. 다른 사용자들이 나를 더 잘 이해할 수 있도록 도와줍니다.',
        image: '/profile.png'
      },
      {
        id: 'notification',
        title: '알림 시스템',
        description: '새로운 모임, 채팅 메시지, 정산 알림 등을 실시간으로 받아볼 수 있습니다. 중요한 소식을 놓치지 마세요.',
        image: '/notification.png'
      }
    ],
    3: [
      {
        id: 'project-title',
        isTitle: true,
        title: `프로젝트 ${num} 상세 정보`,
        description: '각 섹션을 스크롤하여 자세한 기능을 확인해보세요',
      },
      {
        id: 'chat-room',
        title: '채팅방',
        description: '모임 전용 채팅방에서 멤버들과 자유롭게 소통하세요. 사진, 위치 공유 등 다양한 기능을 제공합니다.',
        image: '/chat-room.png'
      },
      {
        id: 'schedule',
        title: '일정 관리',
        description: '모임 일정을 체계적으로 관리할 수 있습니다. 캘린더 형태로 한눈에 보기 쉽게 구성되어 있습니다.',
        image: '/schedule.png'
      },
      {
        id: 'expense',
        title: '비용 정산',
        description: '구장비, 장비비, 음료비 등을 투명하게 정산할 수 있습니다. 각자 낸 금액과 받을 금액을 명확히 확인하세요.',
        image: '/expense.png'
      },
      {
        id: 'history',
        title: '활동 기록',
        description: '참여한 모든 모임의 기록을 관리할 수 있습니다. 나의 스포츠 활동 히스토리를 한눈에 확인하세요.',
        image: '/history.png'
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
    <div className={`detail-page visible`}>
      <div className="sections-container" style={{ paddingTop: 0 }}>
        {sections.map((section, index) => (
          <section
            key={section.id}
            ref={el => sectionsRef.current[index] = el}
            className="detail-section"
            id={section.id}
            style={getSectionStyle(index)}
          >
            {section.isTitle ? (
              <div className="project-title-section">
                <h1 className="project-title-main">{section.title}</h1>
                <p className="project-title-desc">{section.description}</p>
              </div>
            ) : (
              <div className="section-content">
                <div className="section-text">
                  <h2 className="section-title">{section.title}</h2>
                  <p className="section-description">{section.description}</p>
                </div>
                <div className="phone-container">
                  <div className="phone-frame">
                    <div className="phone-screen">
                      <img 
                        src={section.image} 
                        alt={section.title}
                        className="phone-image"
                      />
                    </div>
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
    </div>
  );
};

export default DetailPage;