import React, { useRef } from 'react';
import './DetailPage.css';

const appScreens = [
  '/app1.png',
  '/app2.png',
  '/app3.png',
];

function DetailPage({ num }) {
  const scrollRef = useRef();

  return (
    <div className="detail-page">
      <h1>U-TEED 앱 소개</h1>
      <p>우리 서비스의 실제 앱 화면을 확인해보세요!</p>
      <div className="app-screens-container" ref={scrollRef}>
        {appScreens.map((src, idx) => (
          <img key={idx} src={src} alt={`앱 화면 ${idx+1}`} className="app-screen-img" />
        ))}
      </div>
    </div>
  );
}

export default DetailPage; 