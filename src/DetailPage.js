import React, { useRef, useEffect, useState } from 'react';
import './DetailPage.css';

const appScreens = [
  '/app1.png',
  '/app2.png',
  '/app3.png',
];

function DetailPage() {
  const mockupRef = useRef();
  const sliderRef = useRef();
  const [active, setActive] = useState(false);

  // Intersection Observer로 mockup이 중앙에 오면 active
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.7 }
    );
    if (mockupRef.current) observer.observe(mockupRef.current);
    return () => observer.disconnect();
  }, []);

  // active일 때 세로 스크롤을 가로 슬라이드로 변환
  useEffect(() => {
    if (!active) return;
    const handleWheel = (e) => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    const el = mockupRef.current;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [active]);

  return (
    <div className="detail-page">
      <h1>U-TEED 앱 소개</h1>
      <div className="mockup-outer" ref={mockupRef}>
        <div className="mockup-container">
          <img src="/mockup.png" alt="앱 목업" className="mockup-img" />
          <div className="mockup-screen">
            <div className="mockup-slider" ref={sliderRef}>
              {appScreens.map((src, idx) => (
                <img key={idx} src={src} alt={`앱 화면 ${idx+1}`} className="mockup-app-img" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default DetailPage;
=======
export default DetailPage; 
>>>>>>> parent of 45fd2fe8 (😅 살려주세요)
