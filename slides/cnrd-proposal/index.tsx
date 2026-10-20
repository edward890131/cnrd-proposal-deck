// CNRD 共創聚落官網提案簡報 — 兩款合併版，共 21 頁（封面、兩款對比、Style A 七頁、Style B 十一頁〔含色彩概念三頁〕、結尾）
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
import heroDay from './assets/hero-day.jpg'; // 首屏白天（2026-10-20 正式網站，2880×1620）
import heroNight from './assets/hero-night.jpg'; // 首屏夜晚（同上）
import designSystemShot from './assets/design-system.jpg';
import videoPoster from './assets/video-poster.jpg';
import openingFilm from './assets/opening-film.mp4';
import mockupStyle1 from './assets/mockup-style1.jpg'; // MacBook Pro 情境照＋Style A 電腦版首頁
import mockupStyle2 from './assets/mockup-style2.jpg'; // MacBook Pro 情境照＋Style B 電腦版首頁（初稿 v68 合成）
import phoneHome from './assets/phone-home.jpg'; // 手機版首頁截圖（非播放中的縮圖用）

// ---------- Style B 素材（2026-10-19 從初稿「CRND 首屏投影 v68」截取） ----------
import aCover from './assets/a-cover.jpg'; // A 款開場：滿版 MacBook 情境圖（CNRD_city.png 裁成 16:9）
import bCover from './assets/b-cover.jpg'; // B 款開場：滿版 MacBook 情境圖
import bHero from './assets/b-hero.jpg'; // 首屏 Grow Beyond
import bCore from './assets/b-core.jpg'; // 色塊碰撞構圖（設計核心頁）
import bIntroLoop from './assets/b-intro-loop.mp4'; // loading → 首屏的動態（12 秒，循環播放）
import bIntroLoopWebm from './assets/b-intro-loop.webm'; // 同一段動態的 WebM 版（備援）
// 色塊變化的不同視角（只留 3D 色塊、隱藏文字介面截取）
import bStructField from './assets/b-struct-field.png'; // 結構概念：場域
import bStructTalent from './assets/b-struct-talent.png'; // 結構概念：人才
import bStructIndustry from './assets/b-struct-industry.png'; // 結構概念：產業推動
import bShape00 from './assets/b-shape-00.jpg';
import bShape01 from './assets/b-shape-01.jpg';
import bShape02 from './assets/b-shape-02.jpg';
import bShape03 from './assets/b-shape-03.jpg';
import bShape04 from './assets/b-shape-04.jpg';
import bShape05 from './assets/b-shape-05.jpg';
import bShape06 from './assets/b-shape-06.jpg';
import bShape07 from './assets/b-shape-07.jpg';
import bShape08 from './assets/b-shape-08.jpg';
import bShape09 from './assets/b-shape-09.jpg';
import bShape10 from './assets/b-shape-10.jpg';
import bShape11 from './assets/b-shape-11.jpg';
import bPhone from './assets/b-phone.jpg'; // 手機版首頁截圖（393 寬 @2x）
// 色彩概念：情境照（Unsplash，使用者提供的色彩資料包）
import bColorBlue from './assets/b-color-blue.jpg'; // 仰視大樓
import bColorOrange from './assets/b-color-orange.jpg'; // 夕陽跳躍
import bColorYellow from './assets/b-color-yellow.jpg'; // 燈泡
import bColorPink from './assets/b-color-pink.jpg'; // 伸手相連
import bColorMono from './assets/b-color-mono.jpg'; // 尺與筆
// Style B 網站：簡報第 14、15 頁直接嵌入正式網址，網站更新後簡報自動同步
const B_SITE_URL = 'https://cnrd-b.vercel.app/';

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

// =====================================================================
// Style B 文案（集中在這裡；設計稿更新時只改這一區＋替換 assets/b-*.jpg）
// 來源：初稿 HTML（CRND 首屏投影 v68）＋ Figma「10/06 視覺溝通」B 方向
// =====================================================================
const B = {
  name: '創意匯流', // 第 2 頁對比用的風格名稱
  siteUrl: B_SITE_URL,
  siteLabel: 'cnrd-b.vercel.app', // demo 頁右上角顯示的文字
  core: {
    title: '從靈動結構出發，展現多元活力，匯聚改變的能量',
    statement: ['抽象示意能量的碰撞，', '以更前瞻的視角訴說品牌精神'],
    textLeft: 900, // 文字在框內的起始 x（對齊色塊圖中間的留白）
  },
  // 色彩概念（三頁）：文案照 Figma「color system」（國泰產研_前台視覺提案 node 385:3172）
  color: {
    concept: {
      title: ['Different Minds,', 'Shared Possibilities.'],
      body: ['不同領域、專業與觀點，各自保有鮮明的個性。', '透過交流、碰撞與組合，讓差異成為共創的起點。'],
      keywords: [
        { en: 'Diversity', zh: '多元共存' },
        { en: 'Interaction', zh: '交流碰撞' },
        { en: 'Possibility', zh: '創造可能' },
      ],
    },
    roles: { title: ['色彩系統：', '多元活潑的能量'] },
    breaking: {
      eyebrow: 'Why this palette',
      title: ['Breaking the', 'Conventional.'],
      body: ['跳脫傳統機構網站偏向冷靜、保守的科技形象，', '以更開放、多元且具有實驗精神的色彩，重新詮釋產學合作。'],
      footer: 'Color as a language of collaboration.',
    },
  },
  story: {
    title: '讓故事持續：一組色塊，激發多變想像力',
    // 代表性色塊組合（來源：Figma「結構概念」）
    structures: [
      { src: bStructField, name: '場域' },
      { src: bStructTalent, name: '人才' },
      { src: bStructIndustry, name: '產業推動' },
    ],
  },
  keyVisual: {
    title: 'Grow Beyond：產學共生，驅動創新未來',
    keywords: ['取樣建築結構的多元色塊', '幾何的碰撞、變化與轉場', '捲動串連每一個段落'],
  },
  siteMap: {
    // 標題裡的數字跟著縮圖張數自動變
    title: (n: number) => `${n} 種多變結構，一路推進，打開創造力`,
    shapes: [bShape00, bShape01, bShape02, bShape03, bShape04, bShape05, bShape06, bShape07, bShape08, bShape09, bShape10, bShape11],
  },
  // 開場影片：src 設為 null 會顯示「製作中」佔位畫面
  film: {
    // 影片放在 B 網站正式版（una4498/crnd-B 的 film/），網站更新同檔名，簡報自動換新版
    src: 'https://cnrd-b.vercel.app/film/b-film.mp4' as string | null,
    poster: 'https://cnrd-b.vercel.app/film/b-film-poster.jpg' as string | null,
    title: '匯聚創意能量，打開多變視角', // 影片標題（空白就不顯示）
    subtitle: '',
    duration: '', // 留空＝自動從影片讀取片長
  },
  live: { hint: '往下捲動看轉場、點上方重播開場' },
  phone: {
    title: '手機上，色塊轉場一樣完整',
    desc: '改成單欄閱讀，捲動時的幾何轉場照樣播放。',
  },
};
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
  @keyframes cn-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cn-fade-out { from { opacity: 1; } to { opacity: 0; } }
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

// 循環動態：播放中的頁面自動靜音循環播放；縮圖／總覽顯示 poster 靜態圖
const LoopShot = ({ src, webm, poster, w, h }: { src: string; webm?: string; poster: string; w: number | string; h: number }) => {
  const active = useIsActivePage();
  return (
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
      {active ? (
        <video poster={poster} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
          <source src={src} type="video/mp4" />
          {webm && <source src={webm} type="video/webm" />}
        </video>
      ) : (
        <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      )}
    </div>
  );
};

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

// 首屏截圖：白天 ↔ 夜晚每 10 秒交叉淡入淡出（只在播放這頁時輪播；縮圖、總覽固定顯示白天）
// open-slide 會關掉頁面裡的 transition，所以淡入淡出改用 keyframes 動畫；第一次切換前不加動畫，避免一開頁就閃一下夜晚
const DayNightShot = ({ w, h }: { w: number; h: number }) => {
  const active = useIsActivePage();
  const [night, setNight] = useState(false);
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    if (!active) { setNight(false); setMoved(false); return; }
    const id = setInterval(() => { setMoved(true); setNight(v => !v); }, 10000);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <Shot src={heroDay} w={w} h={h} />
      <div style={{ position: 'absolute', inset: 0, opacity: night ? 1 : 0, animation: moved ? `${night ? 'cn-fade-in' : 'cn-fade-out'} 1.2s ease both` : 'none' }}>
        <Shot src={heroNight} w={w} h={h} />
      </div>
    </div>
  );
};

const KeyVisual: Page = () => (
  <Frame>
    <Header section="主視覺概念" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>Key visual</Eyebrow>
      <Title size={56}>GROW BEYOND：實現創新的種種可能</Title>
    </div>
    <div style={{ position: 'absolute', top: TOP + 148, left: PAD, right: PAD, display: 'flex', gap: 64, alignItems: 'center' }}>
      <div className="cn-rise" style={{ animationDelay: '100ms' }}>
        <DayNightShot w={1060} h={596} />
      </div>
      <div style={{ flex: 1, borderTop: `1px solid ${c.rule}` }}>
        <Keyword n="01">等角視角打造趣味城市</Keyword>
        <Keyword n="02">辦公、交流和休憩的人們</Keyword>
        <Keyword n="03">日夜切換與配樂身歷其境</Keyword>
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
      <Title size={56}>跟隨鏡頭，循序漸進探索空間亮點</Title>
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
      <MockupCard src={mockupStyle2} n="STYLE B" name={B.name} />
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
// Style B 頁面：設計核心、捲動轉場分鏡、主視覺概念、網站架構、電腦版 demo、手機版 demo
// 版面沿用 Style A 的同一套元件；文案都在檔案上方的 B 物件
// =====================================================================
// B 款開場：滿版 MacBook 情境圖（進入 Style B 前的過場頁）
// A 款開場：跟 B 款開場同一個版型，滿版 MacBook 情境圖
const StyleACover: Page = () => (
  <Frame style={{ background: '#000' }}>
    <img src={aCover} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  </Frame>
);

const Style2Cover: Page = () => (
  <Frame style={{ background: '#000' }}>
    <img src={bCover} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  </Frame>
);

const Style2Core: Page = () => (
  <Frame>
    <Header section="Style B・設計核心" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>STYLE B | Design core</Eyebrow>
      <Title size={72}>{B.core.title}</Title>
      {/* 色塊構圖滿版（使用者提供 3360×1200 @2x），文字放在中間的留白區 */}
      <div
        className="cn-rise"
        style={{
          position: 'relative',
          marginTop: 56,
          height: 600,
          borderRadius: 12,
          overflow: 'hidden',
          background: c.card,
          boxShadow: '0 0 0 1px rgba(0,0,0,.06)',
          animationDelay: '160ms',
        }}
      >
        <img src={bCore} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <p
          style={{
            position: 'absolute',
            left: B.core.textLeft,
            top: '50%',
            transform: 'translateY(-50%)',
            margin: 0,
            fontSize: 40,
            fontWeight: 500,
            lineHeight: 1.6,
            color: 'var(--osd-text)',
          }}
        >
          {B.core.statement[0]}
          <br />
          {B.core.statement[1]}
        </p>
      </div>
    </div>
    <PageNo />
  </Frame>
);

// ---------- 色彩概念（三頁，接在設計核心之後） ----------
// 版面照 Figma「color system」三個 frame；頁首、小標、細線、編號換成簡報共用樣式
// 色值照 Figma（與 B 網站 CSS 只差一點點）
const bc = {
  blue: '#478AFA',
  orange: '#FF813F',
  yellow: '#F5ED00',
  pink: '#F5A5E8',
  pinkShape: '#FFBDF8', // 第 1 頁扇形用的淺粉
  ink: '#171717',
};

// 大標（英文／中文都用同一個樣式，逐行斷開）
const BigTitle = ({ lines, size, top, lh }: { lines: string[]; size: number; top: number; lh: number }) => (
  <h2
    className="cn-rise"
    style={{ position: 'absolute', top, left: PAD, margin: 0, fontSize: size, fontWeight: 700, lineHeight: `${lh}px`, letterSpacing: '-.01em' }}
  >
    {lines.map((l) => (
      <span key={l} style={{ display: 'block', whiteSpace: 'nowrap' }}>
        {l}
      </span>
    ))}
  </h2>
);

// 第 1 頁右側的幾何構圖（Figma 座標，整組右移 40px 對齊簡報內距）
const ColorShapes = () => (
  <svg
    className="cn-rise"
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', animationDelay: '160ms' }}
    aria-hidden
  >
    <g transform="translate(40 0)">
      <circle cx={1694.5} cy={329.5} r={31.5} fill={bc.ink} />
      <circle cx={1487.5} cy={440.6} r={116.7} fill={bc.yellow} />
      <rect x={1236} y={239} width={182.5} height={182.5} rx={8} fill={bc.blue} />
      <path d="M 1470 637.5 L 1367.9 609.2 A 106 106 0 0 1 1502.9 536.7 Z" fill={bc.pinkShape} />
      <path d="M 1547.5 411.7 A 122.8 122.8 0 1 1 1671.2 623.9 L 1643.0 574.1 A 65.6 65.6 0 1 0 1576.9 460.8 Z" fill={bc.orange} />
    </g>
  </svg>
);

const ConceptKeyword = ({ n, en, zh }: { n: string; en: string; zh: string }) => (
  <div style={{ width: 576, display: 'flex', gap: 24, alignItems: 'baseline' }}>
    <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 24, color: 'var(--osd-accent)' }}>{n}</span>
    <div>
      <div style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 34, textTransform: 'uppercase', letterSpacing: '.02em' }}>{en}</div>
      <div style={{ marginTop: 12, fontSize: 28, fontWeight: 700 }}>{zh}</div>
    </div>
  </div>
);

const Style2ColorConcept: Page = () => (
  <Frame>
    <Header section="Style B・色彩概念" />
    <div style={{ position: 'absolute', top: TOP, left: PAD }}>
      <Eyebrow>Color concept</Eyebrow>
    </div>
    <ColorShapes />
    <BigTitle lines={B.color.concept.title} size={110} top={250} lh={124} />
    <p className="cn-rise" style={{ position: 'absolute', top: 596, left: PAD, margin: 0, fontSize: 30, lineHeight: 1.55, animationDelay: '100ms' }}>
      {B.color.concept.body[0]}
      <br />
      {B.color.concept.body[1]}
    </p>
    <div style={{ position: 'absolute', top: 829, left: PAD, right: PAD, height: 1, background: c.rule }} />
    <div className="cn-rise" style={{ position: 'absolute', top: 868, left: PAD, right: PAD, display: 'flex', animationDelay: '200ms' }}>
      <ConceptKeyword n="01" en={B.color.concept.keywords[0].en} zh={B.color.concept.keywords[0].zh} />
      <ConceptKeyword n="02" en={B.color.concept.keywords[1].en} zh={B.color.concept.keywords[1].zh} />
      <ConceptKeyword n="03" en={B.color.concept.keywords[2].en} zh={B.color.concept.keywords[2].zh} />
    </div>
    <PageNo />
  </Frame>
);

// 第 2 頁：五個色卡（上：情境照、下：色帶＋英文關鍵字；卡片下方：名稱、中文、色號）
const ColorRole = ({
  src,
  color,
  dark,
  tag,
  name,
  zh,
}: {
  src: string;
  color: string;
  dark?: boolean; // 色帶較淺時，色帶上的字改用深色
  tag: string;
  name: string;
  zh: string;
}) => (
  <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{ borderRadius: 12, overflow: 'hidden', background: color }}>
      <img src={src} alt="" style={{ width: '100%', height: 217, objectFit: 'cover', display: 'block' }} />
      <div
        style={{
          height: 100,
          padding: '0 16px 18px',
          display: 'flex',
          alignItems: 'flex-end',
          fontFamily: 'var(--osd-font-display)',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '.02em',
          color: dark ? 'rgba(0,0,0,.6)' : '#fff',
          whiteSpace: 'nowrap',
        }}
      >
        {tag}
      </div>
    </div>
    <div style={{ marginTop: 72, fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 26 }}>{name}</div>
    <div style={{ marginTop: 12, fontSize: 32, fontWeight: 700 }}>{zh}</div>
    <div style={{ marginTop: 12, fontFamily: 'var(--osd-font-display)', fontSize: 18, color: c.muted }}>{color}</div>
  </div>
);

const Style2ColorRoles: Page = () => (
  <Frame>
    <Header section="Style B・色彩系統" />
    <div style={{ position: 'absolute', top: TOP, left: PAD }}>
      <Eyebrow>Color roles</Eyebrow>
    </div>
    <BigTitle lines={B.color.roles.title} size={92} top={214} lh={104} />
    <div className="cn-rise" style={{ position: 'absolute', top: 469, left: PAD, right: PAD, display: 'flex', gap: 24, animationDelay: '140ms' }}>
      <ColorRole src={bColorBlue} color={bc.blue} tag="KNOWLEDGE / EXPLORATION" name="BLUE" zh="科技、場域與探索" />
      <ColorRole src={bColorOrange} color={bc.orange} tag="ACTION / TRANSFORMATION" name="ORANGE" zh="實踐、能量與轉化" />
      <ColorRole src={bColorYellow} color={bc.yellow} dark tag="IDEAS / POSSIBILITY" name="YELLOW" zh="靈感、好奇與可能" />
      <ColorRole src={bColorPink} color={bc.pink} dark tag="CONNECTION / CO-CREATION" name="PINK" zh="交流、溫度與共創" />
      <ColorRole src={bColorMono} color={bc.ink} tag="CLARITY / STRUCTURE" name="BLACK / WHITE" zh="秩序、平衡與閱讀" />
    </div>
    <PageNo />
  </Frame>
);

// 第 3 頁：大標＋說明，下方三欄重點（每欄頂端一條色條）
const BreakPoint = ({ n, color, en, children }: { n: string; color: string; en: string; children: ReactNode }) => (
  <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{ height: 8, borderRadius: 4, background: color }} />
    <div style={{ marginTop: 38, fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 36, color: 'var(--osd-accent)' }}>{n}</div>
    <div style={{ marginTop: 22, fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 24, letterSpacing: '.02em' }}>{en}</div>
    <p style={{ margin: '20px 0 0', fontSize: 26, lineHeight: 1.5, color: c.muted }}>{children}</p>
  </div>
);

const Style2ColorBreaking: Page = () => (
  <Frame>
    <Header section="Style B・色彩策略" />
    <div style={{ position: 'absolute', top: TOP, left: PAD }}>
      <Eyebrow>{B.color.breaking.eyebrow}</Eyebrow>
    </div>
    <BigTitle lines={B.color.breaking.title} size={100} top={222} lh={113} />
    <p className="cn-rise" style={{ position: 'absolute', top: 486, left: PAD, margin: 0, fontSize: 30, lineHeight: 1.6, animationDelay: '100ms' }}>
      {B.color.breaking.body[0]}
      <br />
      {B.color.breaking.body[1]}
    </p>
    <div className="cn-rise" style={{ position: 'absolute', top: 679, left: PAD, right: PAD, display: 'flex', gap: 44, animationDelay: '180ms' }}>
      <BreakPoint n="01" color={bc.blue} en="DISTINCT YET CONNECTED">
        讓不同色彩保持個性，
        <br />
        並透過組合形成共同語言。
      </BreakPoint>
      <BreakPoint n="02" color={bc.orange} en="BREAKING THE CONVENTIONAL">
        突破制式科技識別，
        <br />
        帶入探索與創新的活力。
      </BreakPoint>
      <BreakPoint n="03" color={bc.pink} en="FLEXIBLE BY DESIGN">
        從品牌識別延伸到幾何動畫、
        <br />
        UI 與資訊設計的一致系統。
      </BreakPoint>
    </div>
    <div
      style={{
        position: 'absolute',
        left: PAD,
        bottom: 48,
        fontFamily: 'var(--osd-font-display)',
        fontWeight: 600,
        fontSize: 18,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        color: c.muted,
      }}
    >
      {B.color.breaking.footer}
    </div>
    <PageNo />
  </Frame>
);

// 捲動轉場：三組代表性的色塊組合（場域／人才／產業推動）
const Style2Story: Page = () => (
  <Frame>
    <Header section="Style B・捲動轉場" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>STYLE B | Scroll story</Eyebrow>
      <Title size={56}>{B.story.title}</Title>
    </div>
    <div
      className="cn-rise"
      style={{ position: 'absolute', top: TOP + 172, left: PAD, right: PAD, display: 'flex', gap: 40, animationDelay: '120ms' }}
    >
      {B.story.structures.map((s, i) => (
        <figure key={s.name} style={{ margin: 0, flex: 1, minWidth: 0 }}>
          <div
            style={{
              height: 480,
              borderRadius: 12,
              background: c.card,
              boxShadow: '0 0 0 1px rgba(0,0,0,.06), 0 12px 32px -12px rgba(0,0,0,.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={s.src} alt="" style={{ width: 440, height: 440, objectFit: 'contain', display: 'block' }} />
          </div>
          <figcaption style={{ marginTop: 28, display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, fontSize: 24, color: 'var(--osd-accent)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{ fontSize: 36, fontWeight: 700 }}>{s.name}</span>
          </figcaption>
        </figure>
      ))}
    </div>
    <PageNo />
  </Frame>
);

const Style2KeyVisual: Page = () => (
  <Frame>
    <Header section="Style B・主視覺概念" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>Key visual</Eyebrow>
      <Title size={56}>{B.keyVisual.title}</Title>
    </div>
    <div style={{ position: 'absolute', top: TOP + 148, left: PAD, right: PAD, display: 'flex', gap: 64, alignItems: 'center' }}>
      <div className="cn-rise" style={{ animationDelay: '100ms' }}>
        <LoopShot src={bIntroLoop} webm={bIntroLoopWebm} poster={bHero} w={1060} h={596} />
      </div>
      <div style={{ flex: 1, borderTop: `1px solid ${c.rule}` }}>
        {B.keyVisual.keywords.map((k, i) => (
          <Keyword key={k} n={String(i + 1).padStart(2, '0')}>
            {k}
          </Keyword>
        ))}
      </div>
    </div>
    <PageNo />
  </Frame>
);

// 網站架構：色塊在不同段落的變化視角（4 × 3），數字跟著張數變
const Style2SiteMap: Page = () => (
  <Frame>
    <Header section="Style B・網站架構" />
    <div style={{ position: 'absolute', top: TOP, left: PAD, right: PAD }}>
      <Eyebrow>Site map</Eyebrow>
      <Title size={56}>{B.siteMap.title(B.siteMap.shapes.length)}</Title>
    </div>
    <div
      className="cn-rise"
      style={{
        position: 'absolute',
        top: TOP + 148,
        left: PAD,
        right: PAD,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        animationDelay: '120ms',
      }}
    >
      {B.siteMap.shapes.map((src, i) => (
        <div key={src} style={{ position: 'relative' }}>
          <Shot src={src} w="100%" h={212} />
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: 12,
              padding: '2px 10px',
              borderRadius: 4,
              background: 'rgba(255,255,255,.92)',
              fontFamily: 'var(--osd-font-display)',
              fontWeight: 700,
              fontSize: 18,
              color: 'var(--osd-accent)',
            }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
        </div>
      ))}
    </div>
    <PageNo />
  </Frame>
);

// 開場影片：B.film.src 有檔案就跟 A 一樣點擊播放；沒有就顯示「製作中」
const Style2Film: Page = () => {
  const active = useIsActivePage();
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!active) {
      ref.current?.pause();
      setPlaying(false);
    }
  }, [active]);
  const { src, poster, title, subtitle } = B.film;
  // 片長：有填就用填的，沒填就從影片本身讀取（影片更新後自動跟著變）
  const [autoDur, setAutoDur] = useState('');
  useEffect(() => {
    if (!src || B.film.duration) return;
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.src = src;
    const onMeta = () => {
      const t = Math.round(v.duration || 0);
      if (t > 0) setAutoDur(`${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`);
    };
    v.addEventListener('loadedmetadata', onMeta);
    return () => {
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeAttribute('src');
      v.load();
    };
  }, [src]);
  const duration = B.film.duration || autoDur;
  return (
    <Frame style={{ background: '#000', color: '#fff' }}>
      {src && active && playing ? (
        <video
          ref={ref}
          src={src}
          poster={poster ?? undefined}
          controls
          playsInline
          autoPlay
          onEnded={() => setPlaying(false)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
        />
      ) : (
        <>
          {poster && <img src={poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,.72) 100%)' }} />
          <FrameLines />
          <div style={{ position: 'absolute', top: 44, left: 120, fontSize: 22, color: 'rgba(255,255,255,.85)' }}>開場影片 — Intro film</div>
          {duration && (
            <div style={{ position: 'absolute', top: 44, right: 120, fontSize: 22, color: 'rgba(255,255,255,.85)', fontFamily: 'var(--osd-font-display)' }}>
              {duration}
            </div>
          )}
          {!src && (
            <div
              style={{
                position: 'absolute',
                left: 160,
                right: 160,
                top: 200,
                bottom: 400,
                border: '2px dashed rgba(255,255,255,.25)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                color: 'rgba(255,255,255,.5)',
              }}
            >
              影片製作中，完成後放入
            </div>
          )}
          <div style={{ position: 'absolute', left: 160, bottom: 168, maxWidth: 1240 }}>
            <Eyebrow color="#fff">STYLE B | INTRO FILM</Eyebrow>
            {title && <h2 style={{ margin: '16px 0 0', fontSize: 88, fontWeight: 700, lineHeight: 1.2 }}>{title}</h2>}
            {subtitle && <p style={{ margin: '20px 0 0', fontSize: 30, lineHeight: 1.6, color: 'rgba(255,255,255,.9)' }}>{subtitle}</p>}
          </div>
          {src && (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              style={{ position: 'absolute', right: 200, bottom: 176, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, background: 'none', border: 0, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span style={{ width: 136, height: 136, borderRadius: '50%', border: '2px solid rgba(255,255,255,.9)', background: 'rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 4.5v15l13-7.5z" fill="#fff" />
                </svg>
              </span>
              <span style={{ fontSize: 24 }}>點擊播放</span>
            </button>
          )}
        </>
      )}
    </Frame>
  );
};

// 電腦版 demo：跟 A 同一個外框，播放中才載入 iframe
const Style2Live: Page = () => {
  const active = useIsActivePage();
  return (
    <Frame>
      <div style={{ position: 'absolute', top: 44, left: PAD, right: PAD, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 24 }}>
          <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '.06em', marginRight: 16 }}>LIVE</span>
          <span style={{ fontWeight: 700 }}>Style B 可操作網站原型</span>
          <span style={{ color: c.muted, marginLeft: 16 }}>{B.live.hint}</span>
        </div>
        <a href={B.siteUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 22, color: c.muted, textDecoration: 'none' }}>
          {B.siteLabel} ↗
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
          <iframe title="Style B 網站原型" src={B.siteUrl} style={{ width: '100%', height: '100%', border: 0, display: 'block' }} allow="autoplay; fullscreen" />
        ) : (
          <img src={bHero} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
        )}
      </div>
    </Frame>
  );
};

const Style2Phone: Page = () => {
  const active = useIsActivePage();
  return (
    <Frame>
      <Header section="Style B・手機版" />
      <div style={{ position: 'absolute', top: TOP, left: PAD, width: 760 }}>
        <Eyebrow>Mobile</Eyebrow>
        <Title size={56}>{B.phone.title}</Title>
        <p className="cn-rise" style={{ margin: '32px 0 0', fontSize: 32, lineHeight: 1.6, color: c.muted, animationDelay: '120ms' }}>
          {B.phone.desc}
        </p>
        <a href={B.siteUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 40, fontSize: 24, color: c.muted, textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--osd-font-display)', fontWeight: 700, color: 'var(--osd-accent)', letterSpacing: '.06em', marginRight: 16 }}>LIVE</span>
          {B.siteLabel} ↗
        </a>
      </div>
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
            <iframe title="Style B 網站原型（手機版）" src={B.siteUrl} style={{ width: PHONE_W, height: PHONE_H, border: 0, display: 'block' }} allow="autoplay; fullscreen" />
          ) : (
            <img src={bPhone} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
          )}
        </div>
      </div>
      <PageNo />
    </Frame>
  );
};

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
  '這次準備了兩種風格，左邊 A 款是 3D 微縮聚落，右邊 B 款是創意匯流。先介紹 A 款。',
  '先看 A 款「3D 微縮聚落」的首頁在電腦上的樣子。',
  '客戶不希望寫實還原大樓，所以我們把園區做成一座小城市。想解決的問題就一個：讓企業、教授、學生在同一個畫面裡看見彼此。',
  '先看開場影片，大概 50 秒，全部是用網站本身的 3D 場景錄的。（點擊播放）',
  '主視覺就三件事：用等角視角打造一座有趣的小城市、城裡有辦公、交流和休憩的人們，再加上日夜切換和配樂，讓人身歷其境。',
  '網站一共七站，每一站就是地圖上的一個鏡頭位置，滑一下就到下一站。',
  '接下來直接操作網站。先點一下畫面就能拖曳、滾動；要回簡報，點網站外面再按方向鍵。',
  '手機版一樣能操作，上面是地圖、下面是內容，用手指拖曳就能逛。',
  '接下來是 B 款「創意匯流」，先看它的首頁在電腦上的樣子。',
  'B 款從靈動的結構出發，把建築簡化成多元的色塊，用抽象的幾何展現多元活力。用抽象的方式示意能量的碰撞，以更前瞻的視角訴說品牌精神。',
  'B 款的色彩概念是 Different Minds, Shared Possibilities。不同領域、專業與觀點，各自保有鮮明的個性，透過交流、碰撞與組合，讓差異成為共創的起點。三個關鍵字：多元共存、交流碰撞、創造可能。',
  '色彩系統有五組：藍色代表科技、場域與探索，橘色是實踐、能量與轉化，黃色是靈感、好奇與可能，粉色是交流、溫度與共創，黑白則負責秩序、平衡與閱讀。',
  '為什麼選這組顏色？我們想跳脫傳統機構網站冷靜、保守的科技形象，用更開放、多元、有實驗精神的色彩重新詮釋產學合作。三個重點：色彩各有個性卻能組成共同語言、突破制式的科技識別，以及從品牌延伸到動畫、UI 與資訊設計的一致系統。',
  '來看 B 款的概念影片，大約 44 秒。從色彩、形狀到動態，看這組色塊怎麼一路組成整個網站。（點擊播放）',
  '這是 B 款從 loading 進到首屏的過程：先是 CRND 的建築平面，接著長出量體、轉成正面的色塊，最後帶出 Grow Beyond。三個重點：色塊取樣自建築結構，幾何的碰撞、變化與轉場，以及用捲動把每個段落串起來。',
  '往下捲的時候，故事會一直延續。同一組色塊會組合成不同的結構，分別代表場域、人才和產業推動。',
  '這頁是色塊在不同段落的樣子，同一組色塊一路推進，變出十二種不同的結構。',
  '直接操作看看。往下捲就能看到轉場，上方可以重播開場。要回簡報，點網站外面再按方向鍵。',
  '手機版改成單欄，色塊轉場一樣會播放。',
  '以上，謝謝大家，歡迎提問。',
];

export const meta: SlideMeta = {
  title: 'CNRD 國泰產研租戶暨產學合作平台_官網視覺提案',
  createdAt: '2026-10-15T09:24:29.808Z',
};

export default [
  Cover,
  Compare,
  StyleACover,
  DesignCore,
  IntroFilm,
  KeyVisual,
  SiteMap,
  LivePrototype,
  PhoneDemo,
  Style2Cover,
  Style2Core,
  Style2ColorConcept,
  Style2ColorRoles,
  Style2ColorBreaking,
  Style2Film,
  Style2KeyVisual,
  Style2Story,
  Style2SiteMap,
  Style2Live,
  Style2Phone,
  Closing,
] satisfies Page[];
