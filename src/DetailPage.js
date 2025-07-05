import React from 'react';

function DetailPage({ num }) {
  return (
    <div className="detail-page">
      <h1>상세페이지 {num}</h1>
      <p>여기에 상세 설명과 이미지를 추가하세요.</p>
    </div>
  );
}

export default DetailPage; 