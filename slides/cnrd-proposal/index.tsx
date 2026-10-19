// CNRD 共創聚落官網提案簡報 — 2026-10-17 兩款合併版，共 15 頁（封面純色、兩款電腦版對比、Style A 影片／架構／電腦版與手機版 demo）
// 細節交給開場影片與現場 demo，簡報只留概念、影片、架構、設計系統、待確認事項
// 版面：1920 × 1080 畫布；內頁共用 Header（CNRD＋章節）＋右下頁碼；封面與結尾用夜晚城市滿版首尾呼應
import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';

// ---------- 素材（網站真實畫面，2026-10-16 從正式網址重新截取） ----------
import cityDay from './assets/city-day.jpg';
import sitemapNight from './assets/sitemap-night.jpg'; // 網站架構頁：夜晚、正上方俯視、廣場置中（直接用橫幅比例 1680×480 @2x 截）
import heroDay from './assets/hero-day.jpg';
import designSystemShot from './assets/design-system.jpg';
import videoPoster from './assets/video-poster.jpg';
import openingFilm from './assets/opening-film.mp4';
import mockupStyle1 from './assets/mockup-style1.jpg'; // MacBook Pro 情境照＋Style A 電腦版首頁
import mockupStyle2 from './assets/mockup-style2.jpg'; // Style B 還沒給，先放「待放入」佔位畫面
import phoneHome from './assets/phone-home.jpg'; // 手機版首頁截圖（非播放中的縮圖用）

// ---------- Design tokens（取自網站 hero-map.html 的 CSS 變數） ----------
export const design: DesignSystem = {
  palette: { bg: '#f2f2f2', text: '#1f2328', accent: '#fb5b1a' },
  fonts: {
    display: '"Lexend Exa", "Noto Sans TC", "PingFang TC", sans-serif',
    body: '"Noto Sans TC", "PingFang TC", -apple-system, sans-serif',
  },
  typeScale: { hero: 96, body: 30 },
  radius: 12,
};

// 設計系統以外的顏色
const c = {
  muted: '#5b6068', // 次要文字（網站 rgba(0,0,0,.6) 換算成實色）
  rule: '#d9dce1', // 分隔線
  card: '#ffffff',
  border: '#e3e5e9',
  night: '#0e1118', // 夜晚底色
  chip: 'rgba(0,0,0,.06)',
};

const SITE_URL = 'https://cathay-rd-web.vercel.app/';
const PAD = 120; // 左右內距
const TOP = 168; // 內頁內容起點（Header 下方）

// ---------- 字體與動態（module 層注入一次，id 綁定這份簡報） ----------
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Lexend+Exa:wght@600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap';
const FONT_LINK_ID = 'osd-webfont-cnrd-proposal';
const STYLE_ID = 'osd-styles-cnrd-proposal';
const css = `
  .cn-rise { animation: cn-rise .7s cubic-bezier(.2,.8,.2,1) both; }
  [data-still] .cn-rise { animation: none !important; }
  @keyframes cn-rise { from { opacity: 0; transform: translateY(16px); } }
  @media (prefers-reduced-motion: reduce) { .cn-rise { animation: none !important; } }
`;
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== css) style.textContent = css;
}

// ---------- 換頁：淡入＋上浮 8px，260ms ----------
export const transition: SlideTransition = {
  duration: 260,
  exit: {
    duration: 160,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
    keyframes: [{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }],
  },
  enter: {
    duration: 260,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// ---------- 共用元件 ----------
const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  WebkitFontSmoothing: 'antialiased',
};

// 頁面外框：非播放中的頁面（縮圖、總覽）加 data-still，動畫直接停在完成狀態
const Frame = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => {
  const active = useIsActivePage();
  return (
    <div data-still={active ? undefined : ''} style={{ ...fill, ...style }}>
      {children}
    </div>
  );
};

const PageNo = ({ light = false }: { light?: boolean }) => {
  const { current } = useSlidePageNumber();
  return (
    <span
      style={{
        position: 'absolute',
        right: PAD,
        bottom: 48,
        fontFamily: 'var(--osd-font-display)',
        fontSize: 22,
        fontWeight: 600,
        color: light ? 'rgba(255,255,255,.6)' : c.muted,
      }}
    >
      {String(current).padStart(2, '0')}
    </span>
  );
};

// 內頁 Header：左 CNRD、右章節名、下方細線
const Header = ({ section }: { section: string }) => (
  <>
    <div
      style={{
        position: 'absolute',
        top: 52,
        left: PAD,
        right: PAD,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 30, letterSpacing: '.02em' }}>
        CNRD
      </span>
      <span style={{ fontSize: 22, color: c.muted, letterSpacing: '.04em' }}>{section}</span>
    </div>
    <div style={{ position: 'absolute', top: 112, left: PAD, right: PAD, height: 1, background: c.rule }} />
  </>
);

const Eyebrow = ({ children, color = 'var(--osd-accent)' }: { children: ReactNode; color?: string }) => (
  <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 22, fontWeight: 600, letterSpacing: '.08em', color }}>
    {children}
  </div>
);

const Title = ({ children, size = 64, delay = 0 }: { children: ReactNode; size?: number; delay?: number }) => (
  <h2
    className="cn-rise"
    style={{ margin: '12px 0 0', fontSize: size, fontWeight: 700, lineHeight: 1.25, animationDelay: `${delay}ms` }}
  >
    {children}
  </h2>
);

// 網站截圖：白邊圓角卡片
const Shot = ({ src, w, h, pos = 'center' }: { src: string; w: number | string; h: number; pos?: string }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 12,
      overflow: 'hidden',
      background: c.card,
      boxShadow: '0 0 0 1px rgba(0,0,0,.06), 0 12px 32px -12px rgba(0,0,0,.18)',
      flex: 'none',
    }}
  >
    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, display: 'block' }} />
  </div>
);

const Tag = ({ children }: { children: ReactNode }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '6px 16px',
      borderRadius: 4,
      background: c.chip,
      fontSize: 24,
      fontWeight: 500,
      color: 'var(--osd-text)',
    }}
  >
    {children}
  </span>
);

// 封面／結尾的細框線（出血框線）
const FrameLines = () => (
  <>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 112, height: 1, background: 'rgba(255,255,255,.16)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 112, height: 1, background: 'rgba(255,255,255,.16)' }} />
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 80, width: 1, background: 'rgba(255,255,255,.16)' }} />
    <div style={{ position: 'absolute', top: 0, bottom: 0, right: 80, width: 1, background: 'rgba(255,255,255,.16)' }} />
  </>
);

// =====================================================================
// 01 封面
// =====================================================================
const Cover: Page = () => (
  // 兩款提案合併在同一份簡報，封面用純色底，不偏向任何一款
  <Frame style={{ background: 'var(--osd-text)', color: '#fff' }}>
    <FrameLines />
    <div style={{ position: 'absolute', top: 44, left: 120, fontSize: 22, color: 'rgba(255,255,255,.7)' }}>
      Website design proposal
    </div>
    <div style={{ position: 'absolute', left: 160, top: 300 }}>
      <div
        className="cn-rise"
        style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 132, lineHeight: 1, color: 'var(--osd-accent)', letterSpacing: '-4px' }}
      >
        CNRD
      </div>
      <div style={{ width: 1, height: 64, background: 'rgba(255,255,255,.3)', margin: '36px 0' }} />
      <h1
        className="cn-rise"
        style={{ margin: 0, fontSize: 'var(--osd-size-hero)', fontWeight: 700, lineHeight: 1.15, animationDelay: '120ms' }}
      >
        國泰產研租戶暨產學合作平台{''}提案
      </h1>
      <p className="cn-rise" style={{ margin: '24px 0 0', fontSize: 36, color: 'rgba(255,255,255,.85)', animationDelay: '220ms' }}>
        國泰產研中心｜臺北大學建國校區
      </p>
    </div>
    <div style={{ position: 'absolute', left: 160, bottom: 44, fontSize: 26, fontWeight: 500 }}>
      By. <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700 }}>GOONS</span>
    </div>
    <div style={{ position: 'absolute', right: 120, bottom: 44, fontSize: 22, color: 'rgba(255,255,255,.7)', fontFamily: 'var(--osd-font-display)' }}>
      2026.10
    </div>
  </Frame>
);

// =====================================================================
// 02 設計核心：一句概念＋一個核心問題
// =====================================================================
const DesignCore: Page = () => (
  <Frame>
    <Header section="設計核心" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>STYLE A | Design core</Eyebrow>
      <Title size={72}>從空間場景出發，建構孕育想法的「共創聚落」</Title>
      <div
        className="cn-rise"
        style={{ position: 'relative', marginTop: 64, height: 560, borderRadius: 12, overflow: 'hidden', animationDelay: '160ms' }}
      >
        <img src={cityDay} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 45%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,24,32,.6)' }} />
        <p
          style={{
            position: 'absolute',
            inset: 0,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#fff',
            fontSize: 48,
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          如何讓企業、教授、學生，
          <br />
          在同一個畫面裡看見彼此？
        </p>
      </div>
    </div>
    <PageNo />
  </Frame>
);

// =====================================================================
// 03 主視覺概念：三個關鍵字，每點一行
// =====================================================================
const Keyword = ({ n, children }: { n: string; children: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, padding: '36px 0', borderBottom: `1px solid ${c.rule}` }}>
    <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 28, color: 'var(--osd-accent)' }}>{n}</span>
    <span style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.3 }}>{children}</span>
  </div>
);

const KeyVisual: Page = () => (
  <Frame>
    <Header section="主視覺概念" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>Key visual</Eyebrow>
      <Title size={56}>GROW BEYOND：實現創新的種種可能</Title>
    </div>
    <div style={{ position: 'absolute', top: TOP + 148, left: PAD, right: PAD, display: 'flex', gap: 64, alignItems: 'center' }}>
      <div className="cn-rise" style={{ animationDelay: '100ms' }}>
        <Shot src={heroDay} w={1060} h={596} />
      </div>
      <div style={{ flex: 1, borderTop: `1px solid ${c.rule}` }}>
        <Keyword n="01">等角視角的小城市</Keyword>
        <Keyword n="02">白天／夜晚自動切換</Keyword>
        <Keyword n="03">一鏡到底的七站動線</Keyword>
      </div>
    </div>
    <PageNo />
  </Frame>
);

// =====================================================================
// 04 開場影片（點擊播放；離開這頁自動暫停）
// =====================================================================
const IntroFilm: Page = () => {
  const active = useIsActivePage();
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!active) {
      ref.current?.pause();
      setPlaying(false);
    }
  }, [active]);
  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => ref.current?.play());
  };
  return (
    <Frame style={{ background: '#000', color: '#fff' }}>
      {active && playing ? (
        <video
          ref={ref}
          src={openingFilm}
          poster={videoPoster}
          controls
          playsInline
          onEnded={() => setPlaying(false)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
        />
      ) : (
        <>
          <img src={videoPoster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,.72) 100%)' }} />
          <FrameLines />
          <div style={{ position: 'absolute', top: 44, left: 120, fontSize: 22, color: 'rgba(255,255,255,.85)' }}>
            開場影片 — Intro film
          </div>
          <div style={{ position: 'absolute', top: 44, right: 120, fontSize: 22, color: 'rgba(255,255,255,.85)', fontFamily: 'var(--osd-font-display)' }}>
            0:50
          </div>
          <div style={{ position: 'absolute', left: 160, bottom: 168, maxWidth: 1240 }}>
            <Eyebrow color="#fff">STYLE A | INTRO FILM</Eyebrow>
            <h2 style={{ margin: '16px 0 0', fontSize: 88, fontWeight: 700, lineHeight: 1.2 }}>聚落的一天，一鏡到底</h2>
            <p style={{ margin: '20px 0 0', fontSize: 30, lineHeight: 1.6, color: 'rgba(255,255,255,.9)' }}>來看看聚落裡的人們都在做什麼</p>
          </div>
          <button
            type="button"
            onClick={play}
            style={{
              position: 'absolute',
              right: 200,
              bottom: 176,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              background: 'none',
              border: 0,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <span
              style={{
                width: 136,
                height: 136,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,.9)',
                background: 'rgba(0,0,0,.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 4.5v15l13-7.5z" fill="#fff" />
              </svg>
            </span>
            <span style={{ fontSize: 24 }}>點擊播放</span>
          </button>
        </>
      )}
    </Frame>
  );
};

// =====================================================================
// 05 網站架構：七站一排帶過
// =====================================================================
const Station = ({ n, name }: { n: string; name: string }) => (
  <div
    style={{
      flex: 1,
      background: c.card,
      border: `1px solid ${c.border}`,
      borderRadius: 12,
      padding: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    }}
  >
    <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 22, color: 'var(--osd-accent)' }}>{n}</span>
    <span style={{ fontSize: 32, fontWeight: 700 }}>{name}</span>
  </div>
);

const SiteMap: Page = () => (
  <Frame>
    <Header section="網站架構" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>Site map</Eyebrow>
      <Title size={56}>七站，滑一下就到下一站</Title>
    </div>
    <div style={{ position: 'absolute', top: TOP + 156, left: PAD, right: PAD, display: 'flex', gap: 16 }}>
      <Station n="01" name="總覽" />
      <Station n="02" name="理念與使命" />
      <Station n="03" name="計畫亮點" />
      <Station n="04" name="進駐企業" />
      <Station n="05" name="活動消息" />
      <Station n="06" name="交通資訊" />
      <Station n="07" name="一同起步" />
    </div>
    <div className="cn-rise" style={{ position: 'absolute', top: TOP + 316, left: PAD, right: PAD, animationDelay: '120ms' }}>
      <Shot src={sitemapNight} w="100%" h={480} pos="50% 50%" />
    </div>
    <PageNo />
  </Frame>
);

// =====================================================================
// 06 設計系統：網站上的「設計系統」頁
// =====================================================================
const DesignSystemPage: Page = () => (
  <Frame>
    <Header section="設計系統" />
    {/* 截圖：網站 ?design=models 頁面，裁掉 Header 與左右留白 */}
    <div style={{ position: 'absolute', top: TOP, bottom: 112, left: PAD, right: PAD, display: 'flex', gap: 72, alignItems: 'center' }}>
      <div className="cn-rise">
        <Shot src={designSystemShot} w={1088} h={800} pos="top" />
      </div>
      <div style={{ flex: 1 }}>
        <Eyebrow>Design system</Eyebrow>
        <Title size={56}>
          一頁看完，
          <br />
          跟網站同步
        </Title>
        <p style={{ margin: '28px 0 40px', fontSize: 30, lineHeight: 1.6, color: c.muted }}>
          網站上的「設計系統」頁，網站改了，這裡就跟著變。
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Tag>色彩</Tag>
          <Tag>字體</Tag>
          <Tag>圓角與間距</Tag>
          <Tag>元件</Tag>
          <Tag>3D 模型</Tag>
        </div>
      </div>
    </div>
    <PageNo />
  </Frame>
);

// =====================================================================
// 07 可操作網站原型（播放中才載入 iframe，縮圖顯示截圖）
// =====================================================================
const LivePrototype: Page = () => {
  const active = useIsActivePage();
  return (
    <Frame>
      <div style={{ position: 'absolute', top: 44, left: PAD, right: PAD, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 24 }}>
          <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '.06em', marginRight: 16 }}>LIVE</span>
          <span style={{ fontWeight: 700 }}>可操作網站原型</span>
          <span style={{ color: c.muted, marginLeft: 16 }}>拖曳轉地圖、滾輪換站</span>
        </div>
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 22, color: c.muted, textDecoration: 'none' }}>
          cathay-rd-web.vercel.app ↗
        </a>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 104,
          left: PAD,
          right: PAD,
          bottom: 56,
          borderRadius: 16,
          border: '3px solid var(--osd-text)',
          overflow: 'hidden',
          background: c.card,
        }}
      >
        {active ? (
          <iframe title="共創聚落官網" src={SITE_URL} style={{ width: '100%', height: '100%', border: 0, display: 'block' }} allow="autoplay; fullscreen" />
        ) : (
          <img src={heroDay} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
        )}
      </div>
    </Frame>
  );
};


// =====================================================================
// 兩款首頁對比：電腦版放進 MacBook Pro 情境照
// =====================================================================
const MockupCard = ({ src, n, name }: { src: string; n: string; name: string }) => (
  <figure style={{ margin: 0, flex: 1, minWidth: 0 }}>
    <img src={src} alt="" style={{ width: '100%', aspectRatio: '1500 / 960', objectFit: 'cover', borderRadius: 12, display: 'block' }} />
    <figcaption style={{ marginTop: 28, display: 'flex', alignItems: 'baseline', gap: 16 }}>
      <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 24, color: 'var(--osd-accent)', letterSpacing: '.06em' }}>{n}</span>
      <span style={{ fontSize: 34, fontWeight: 700 }}>{name}</span>
    </figcaption>
  </figure>
);

const Compare: Page = () => (
  <Frame>
    <Header section="兩款首頁對比" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>Desktop homepage</Eyebrow>
      <Title size={56}>兩款視覺風格</Title>
    </div>
    <div className="cn-rise" style={{ position: 'absolute', top: TOP + 176, left: PAD, right: PAD, display: 'flex', gap: 40, animationDelay: '160ms' }}>
      <MockupCard src={mockupStyle1} n="STYLE A" name="3D 微縮聚落" />
      <MockupCard src={mockupStyle2} n="STYLE B" name="（待放入）" />
    </div>
    <PageNo />
  </Frame>
);

// =====================================================================
// 手機版 demo：手機外框裡直接嵌正式網站（393 寬會切成手機版面）
// =====================================================================
const PHONE_W = 393;
const PHONE_H = 852;
const PhoneDemo: Page = () => {
  const active = useIsActivePage();
  return (
    <Frame>
      <Header section="手機版" />
      <div style={{ position: 'absolute', top: TOP, left: PAD, width: 760 }}>
        <Eyebrow>Mobile</Eyebrow>
        <Title size={56}>手機上，一樣逛得到整座聚落</Title>
        <p className="cn-rise" style={{ margin: '32px 0 0', fontSize: 32, lineHeight: 1.6, color: c.muted, animationDelay: '120ms' }}>
          上面看地圖、下面讀內容，手指一滑就換站。
        </p>
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 40, fontSize: 24, color: c.muted, textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '.06em', marginRight: 16 }}>LIVE</span>
          cathay-rd-web.vercel.app ↗
        </a>
      </div>
      {/* 手機外框：黑色機身＋圓角螢幕 */}
      <div
        style={{
          position: 'absolute',
          right: 360,
          top: (1080 - PHONE_H - 28) / 2,
          width: PHONE_W,
          height: PHONE_H,
          padding: 14,
          borderRadius: 64,
          background: '#111',
          boxShadow: '0 0 0 2px #2a2d33, 0 40px 80px -24px rgba(0,0,0,.35)',
          boxSizing: 'content-box',
        }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: 50, overflow: 'hidden', background: c.card, position: 'relative' }}>
          {active ? (
            <iframe title="共創聚落官網（手機版）" src={SITE_URL} style={{ width: PHONE_W, height: PHONE_H, border: 0, display: 'block' }} allow="autoplay; fullscreen" />
          ) : (
            <img src={phoneHome} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
          )}
        </div>
      </div>
      <PageNo />
    </Frame>
  );
};


// =====================================================================
// Style B 預留頁：影片、電腦版 demo、手機版 demo（素材到了再換掉）
// =====================================================================
const Slot = ({ label, style }: { label: string; style?: CSSProperties }) => (
  <div
    style={{
      position: 'absolute',
      border: `3px dashed ${c.rule}`,
      borderRadius: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
      color: c.muted,
      ...style,
    }}
  >
    <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 28, letterSpacing: '.06em', color: 'var(--osd-accent)' }}>STYLE B</span>
    <span style={{ fontSize: 40, fontWeight: 500 }}>{label}</span>
  </div>
);

// Style B 的設計核心、主視覺概念、網站架構（跟 Style A 同一個順序，先佔位）
const Style2Core: Page = () => (
  <Frame>
    <Header section="Style B・設計核心" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>STYLE B | Design core</Eyebrow>
      <Title size={72}>（概念標語待補）</Title>
    </div>
    <Slot label="設計核心配圖待放入" style={{ top: TOP + 164, left: PAD, right: PAD, height: 560 }} />
    <PageNo />
  </Frame>
);

const Style2KeyVisual: Page = () => (
  <Frame>
    <Header section="Style B・主視覺概念" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>Key visual</Eyebrow>
      <Title size={56}>（主視覺標題待補）</Title>
    </div>
    <Slot label="主視覺截圖與重點待放入" style={{ top: TOP + 148, left: PAD, right: PAD, bottom: 112 }} />
    <PageNo />
  </Frame>
);

const Style2SiteMap: Page = () => (
  <Frame>
    <Header section="Style B・網站架構" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>Site map</Eyebrow>
      <Title size={56}>（網站架構標題待補）</Title>
    </div>
    <Slot label="網站架構與配圖待放入" style={{ top: TOP + 148, left: PAD, right: PAD, bottom: 112 }} />
    <PageNo />
  </Frame>
);

const Style2Film: Page = () => (
  <Frame>
    <Header section="Style B・開場影片" />
    <Slot label="開場影片待放入" style={{ top: TOP, left: PAD, right: PAD, bottom: 96 }} />
    <PageNo />
  </Frame>
);

const Style2Live: Page = () => (
  <Frame>
    <Header section="Style B・可操作網站原型" />
    <Slot label="電腦版網站 demo 待放入" style={{ top: TOP, left: PAD, right: PAD, bottom: 96 }} />
    <PageNo />
  </Frame>
);

const Style2Phone: Page = () => (
  <Frame>
    <Header section="Style B・手機版" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, width: 760 }}>
      <Eyebrow>Mobile</Eyebrow>
      <Title size={56}>（標題待補）</Title>
    </div>
    <Slot label="手機版 demo 待放入" style={{ right: 360, top: (1080 - PHONE_H - 28) / 2, width: PHONE_W + 28, height: PHONE_H + 28, borderRadius: 64 }} />
    <PageNo />
  </Frame>
);

// =====================================================================
// 08 上線前待確認
// =====================================================================
const CheckList = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ flex: 1, background: c.card, borderRadius: 12, border: `1px solid ${c.border}`, padding: '48px 56px' }}>
    <h3 style={{ margin: 0, fontSize: 44, fontWeight: 700 }}>{title}</h3>
    <ul style={{ margin: '36px 0 0', paddingLeft: 36, fontSize: 36, lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 28 }}>
      {children}
    </ul>
  </div>
);

const NextSteps: Page = () => (
  <Frame>
    <Header section="上線前待確認" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>Next steps</Eyebrow>
      <Title size={56}>上線前，需要一起確認的事</Title>
    </div>
    <div style={{ position: 'absolute', top: TOP + 148, left: PAD, right: PAD, display: 'flex', gap: 32 }}>
      <CheckList title="需要客戶提供">
        <li>招商專線與信箱</li>
        <li>進駐企業 Logo 與授權</li>
        <li>活動照片與內容</li>
      </CheckList>
      <CheckList title="上線前設定">
        <li>正式網域、開放搜尋收錄</li>
        <li>真機測試（手機、平板）</li>
        <li>英文版校對</li>
      </CheckList>
    </div>
    <p style={{ position: 'absolute', left: PAD, bottom: 48, margin: 0, fontSize: 28, color: c.muted }}>
      這幾項確認完，就能正式上線。
    </p>
    <PageNo />
  </Frame>
);

// =====================================================================
// 09 結尾
// =====================================================================
const Closing: Page = () => (
  // 跟封面一樣用純色底，首尾呼應
  <Frame style={{ background: 'var(--osd-text)', color: '#fff' }}>
    <FrameLines />
    <div style={{ position: 'absolute', top: 44, left: 120, fontSize: 22, color: 'rgba(255,255,255,.7)' }}>Website design proposal</div>
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="cn-rise" style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 132, lineHeight: 1, color: 'var(--osd-accent)', letterSpacing: '-4px' }}>
        CNRD
      </div>
      <h2 className="cn-rise" style={{ margin: '40px 0 0', fontSize: 'var(--osd-size-hero)', fontWeight: 700, lineHeight: 1.2, animationDelay: '120ms' }}>和你一起，從這裡起步</h2>
      <p className="cn-rise" style={{ margin: '24px 0 0', fontSize: 32, color: 'rgba(255,255,255,.8)', animationDelay: '220ms' }}>感謝您的聆聽</p>
    </div>
    <div style={{ position: 'absolute', left: 160, bottom: 44, fontSize: 26, fontWeight: 500 }}>
      By. <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700 }}>GOONS</span>
    </div>
  </Frame>
);

// ---------- 講稿（簡報者模式顯示，跟頁面一對一） ----------
export const notes: (string | undefined)[] = [
  '大家好，今天來介紹國泰產研中心「共創聚落」的官網提案。簡報很短，重點會放在影片跟現場操作。',
  '這次準備了兩種風格，先看兩款的電腦版首頁放在一起的樣子。接下來先介紹 A 款。',
  '客戶不希望寫實還原大樓，所以我們把園區做成一座小城市。想解決的問題就一個：讓企業、教授、學生在同一個畫面裡看見彼此。',
  '先看開場影片，大概 50 秒，全部是用網站本身的 3D 場景錄的。（點擊播放）',
  '主視覺就三件事：等角的小城市、白天夜晚會自動切換、七站一鏡到底逛完。細節等一下直接看影片。',
  '網站一共七站，每一站就是地圖上的一個鏡頭位置，滑一下就到下一站。',
  '接下來直接操作網站。先點一下畫面就能拖曳、滾動；要回簡報，點網站外面再按方向鍵。',
  '手機版一樣能操作，上面是地圖、下面是內容，用手指拖曳就能逛。',
  '接下來介紹 B 款，先講它的設計核心。（待補）',
  'B 款的開場影片。（待補）',
  'B 款的主視覺概念。（待補）',
  'B 款的網站架構。（待補）',
  'B 款的網站 demo。（待補）',
  'B 款的手機版。（待補）',
  '以上，謝謝大家，歡迎提問。',
];

export const meta: SlideMeta = {
  title: 'CNRD 國泰產研租戶暨產學合作平台_官網視覺提案',
  createdAt: '2026-10-15T09:24:29.808Z',
};

export default [
  Cover,
  Compare,
  DesignCore,
  IntroFilm,
  KeyVisual,
  SiteMap,
  LivePrototype,
  PhoneDemo,
  Style2Core,
  Style2Film,
  Style2KeyVisual,
  Style2SiteMap,
  Style2Live,
  Style2Phone,
  Closing,
] satisfies Page[];
