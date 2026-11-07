'use client';

import { useState } from 'react';

interface SurveyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SurveyPopup({ isOpen, onClose }: SurveyPopupProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isConfirmClosing, setIsConfirmClosing] = useState(false);
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  const handleSurveyClick = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSePB2wt08eZymrTUKA3ZDGZV5vu5DTVhDH9kOCsEcGan6TcEQ/viewform?pli=1',
      '_blank'
    );
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
          } catch {
            // ignore storage errors
          }
        }
        onClose();
        setShowConfirmDialog(false);
        setIsClosing(false);
        setIsConfirmClosing(false);
      }, 300);
    }, 250);
  };

  const handleCancelClose = () => {
    setIsConfirmClosing(true);
    setTimeout(() => {
      setShowConfirmDialog(false);
      setIsConfirmClosing(false);
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`survey-popup-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleCloseClick}
    >
      <div
        className={`survey-popup-content ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="survey-popup-close" onClick={handleCloseClick}>
          ×
        </button>
        <div className="survey-popup-body">
          <h2>🎉 특별 이벤트! 🎉</h2>
          <h3>
            설문조사 참여하고
            <br />
            앱 런칭 시 다양한 보상을 받아보세요!
          </h3>
          <p>
            간단한 설문조사에 참여해주시면
            <br />
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
        <div
          className={`confirm-dialog-overlay ${isConfirmClosing ? 'closing' : ''}`}
          onClick={handleCancelClose}
        >
          <div
            className={`confirm-dialog-content ${isConfirmClosing ? 'closing' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-dialog-body">
              <div className="confirm-dialog-icon">😢</div>
              <h3>🤔 정말 포기하시겠어요?</h3>
              <p>
                이 특별한 혜택을 놓치시면
                <br />
                다시 받기 어려울 수 있어요!
              </p>
              <div
                className="confirm-dialog-option"
                style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}
              >
                <label
                  className="do-not-show-today"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={doNotShowToday}
                    onChange={(e) => setDoNotShowToday(e.target.checked)}
                  />
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

