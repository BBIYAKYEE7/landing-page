'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useThemeLang } from './ThemeLanguageProvider';

export default function ProjectRequest() {
  const { lang } = useThemeLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState('');
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let playbackVersion = 0;
    const updatePlayback = () => {
      const currentVersion = ++playbackVersion;
      if (reducedMotion.matches) {
        video.pause();
      } else {
        video.play().catch(error => {
          if (currentVersion !== playbackVersion && error instanceof DOMException && error.name === 'AbortError') return;
          console.error('Unable to play the project request background video:', error);
        });
      }
    };
    updatePlayback();
    reducedMotion.addEventListener('change', updatePlayback);
    return () => {
      reducedMotion.removeEventListener('change', updatePlayback);
      playbackVersion++;
      video.pause();
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !idea.trim()) {
      setError(lang === 'ko' ? '이름과 아이디어를 입력해 주세요.' : 'Please enter your name and project idea.');
      return;
    }

    setError('');
    const subject = lang === 'ko' ? '[U-TEED] 프로젝트 의뢰' : '[U-TEED] Project Inquiry';
    const body = lang === 'ko'
      ? `이름: ${name.trim()}\r\n이메일: ${email.trim()}\r\n\r\n프로젝트 아이디어:\r\n${idea.trim()}`
      : `Name: ${name.trim()}\r\nEmail: ${email.trim()}\r\n\r\nProject idea:\r\n${idea.trim()}`;
    window.location.href = `mailto:taeho@u-teed.co.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="intro-slide intro-request-slide" id="project-request" aria-labelledby="request-title">
      <video ref={videoRef} className="request-background" muted loop playsInline preload="metadata" aria-hidden="true">
        <source src="/images/loop.webm" type="video/webm" />
      </video>
      <div className="request-content" tabIndex={0} role="region" aria-label={lang === 'ko' ? '프로젝트 의뢰 입력' : 'Project inquiry form'}>
        <div className="request-copy">
          <span className="request-eyebrow">Let&apos;s work together</span>
          <h2 id="request-title">{lang === 'ko' ? '아이디어를 현실로' : 'Bring your idea to life'}</h2>
          <p>{lang === 'ko' ? '구상 중인 프로젝트를 들려주세요. U-TEED가 함께 고민하겠습니다.' : 'Tell us about your project. U-TEED is ready to build it with you.'}</p>
        </div>
        <form className="request-form" onSubmit={handleSubmit}>
          <label>
            <span>{lang === 'ko' ? '이름' : 'Name'}</span>
            <input name="name" autoComplete="name" required maxLength={100} value={name} onChange={event => setName(event.target.value)} />
          </label>
          <label>
            <span>{lang === 'ko' ? '이메일' : 'Email'}</span>
            <input name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} />
          </label>
          <label className="request-idea">
            <span>{lang === 'ko' ? '프로젝트 아이디어' : 'Project idea'}</span>
            <textarea name="idea" required maxLength={1000} rows={4} value={idea} onChange={event => setIdea(event.target.value)} placeholder={lang === 'ko' ? '만들고 싶은 서비스를 자유롭게 알려주세요.' : 'Tell us what you would like to create.'} />
          </label>
          {error && <p className="request-error" role="alert">{error}</p>}
          <button type="submit">
            {lang === 'ko' ? '이메일 작성하기' : 'Compose email'} <span aria-hidden="true">↗</span>
          </button>
          <p className="request-notice">
            {lang === 'ko' ? '이메일 앱에서 내용을 확인한 뒤 직접 보내주세요. 앱이 열리지 않으면' : 'Review and send the message in your email app. If it does not open, contact'}{' '}
            <a href="mailto:taeho@u-teed.co.kr">taeho@u-teed.co.kr</a>{lang === 'ko' ? '로 문의해 주세요.' : '.'}
          </p>
        </form>
      </div>
    </section>
  );
}
