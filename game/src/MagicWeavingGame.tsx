import { useEffect, useRef, useState, type CSSProperties } from 'react';

export type MbtiElement = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface MagicWeavingGameProps {
  mbtiElements: MbtiElement[];
  onGameComplete: (score: number, dominantElement: string) => void;
}

type Bubble = { x: number; y: number; radius: number; element: MbtiElement; alive: boolean; shake: number };
type Ball = { x: number; y: number; vx: number; vy: number; radius: number; element: MbtiElement; active: boolean; trail: { x: number; y: number }[] };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number };

const WIDTH = 800;
const HEIGHT = 600;
const GAME_DURATION_SECONDS = 5 * 60;
const ELEMENTS: Record<MbtiElement, { color: string; name: string; glyph: string }> = {
  E: { color: '#ef4444', name: '熾紅', glyph: 'E' }, I: { color: '#3b82f6', name: '幽藍', glyph: 'I' },
  S: { color: '#f59e0b', name: '琥珀', glyph: 'S' }, N: { color: '#8b5cf6', name: '靛紫', glyph: 'N' },
  T: { color: '#9ca3af', name: '亮銀', glyph: 'T' }, F: { color: '#10b981', name: '翠綠', glyph: 'F' },
  J: { color: '#a855f7', name: '紫電', glyph: 'J' }, P: { color: '#f97316', name: '澄風', glyph: 'P' },
};

function makeBubbles(elements: MbtiElement[]) {
  return Array.from({ length: 40 }, (_, index) => ({
    x: 57 + (index % 10) * 76,
    y: 67 + Math.floor(index / 10) * 45,
    radius: 17,
    element: elements[index % elements.length] ?? 'E',
    alive: true,
    shake: 0,
  }));
}

function newBall(element: MbtiElement): Ball {
  return { x: WIDTH / 2, y: HEIGHT - 58, vx: 0, vy: 0, radius: 9, element, active: false, trail: [] };
}

export function MagicWeavingGame({ mbtiElements, onGameComplete }: MagicWeavingGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const gameRef = useRef({ bubbles: makeBubbles(mbtiElements), particles: [] as Particle[], balls: mbtiElements.slice(0, 4).map(newBall), currentBall: 0, score: 0, destroyed: {} as Record<string, number>, started: false, completed: false, paddleX: WIDTH / 2, lastTime: 0, timerRemaining: GAME_DURATION_SECONDS });
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [currentBall, setCurrentBall] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION_SECONDS);
  const timerDisplayRef = useRef(GAME_DURATION_SECONDS);
  const [complete, setComplete] = useState(false);
  const [dominant, setDominant] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const game = gameRef.current;
    const draw = (time: number) => {
      const delta = Math.min((time - game.lastTime) / 16.67 || 1, 2);
      game.lastTime = time;
      if (game.started && !game.completed) {
        game.timerRemaining = Math.max(0, game.timerRemaining - delta / 60);
        const nextTime = Math.ceil(game.timerRemaining);
        if (nextTime !== timerDisplayRef.current) {
          timerDisplayRef.current = nextTime;
          setTimeRemaining(nextTime);
        }
      }
      context.clearRect(0, 0, WIDTH, HEIGHT);
      const background = context.createRadialGradient(WIDTH / 2, 120, 20, WIDTH / 2, 320, 620);
      background.addColorStop(0, '#242052'); background.addColorStop(0.5, '#10162f'); background.addColorStop(1, '#080b19');
      context.fillStyle = background; context.fillRect(0, 0, WIDTH, HEIGHT);
      const timerMinutes = Math.floor(game.timerRemaining / 60).toString().padStart(2, '0');
      const timerSeconds = Math.floor(game.timerRemaining % 60).toString().padStart(2, '0');
      context.fillStyle = game.timerRemaining <= 30 ? '#fb7185' : '#cbd2f5'; context.font = '500 14px monospace'; context.textAlign = 'right'; context.fillText(`TIME ${timerMinutes}:${timerSeconds}`, WIDTH - 18, 24);
      context.strokeStyle = 'rgba(142, 161, 255, .08)'; context.lineWidth = 1;
      for (let x = 0; x < WIDTH; x += 40) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, HEIGHT); context.stroke(); }
      for (let y = 0; y < HEIGHT; y += 40) { context.beginPath(); context.moveTo(0, y); context.lineTo(WIDTH, y); context.stroke(); }
      for (let i = 0; i < 32; i++) { const x = (i * 97) % WIDTH; const y = (i * 47) % 300; context.fillStyle = `rgba(220, 226, 255, ${0.22 + (i % 3) * 0.12})`; context.fillRect(x, y, 1.5, 1.5); }

      game.bubbles.forEach((bubble) => {
        if (!bubble.alive) return;
        bubble.shake *= 0.85;
        const color = ELEMENTS[bubble.element].color;
        const x = bubble.x + Math.sin(bubble.shake * 3) * bubble.shake;
        context.shadowColor = color; context.shadowBlur = 16; context.beginPath(); context.arc(x, bubble.y, bubble.radius, 0, Math.PI * 2); context.fillStyle = `${color}34`; context.fill(); context.strokeStyle = `${color}cc`; context.lineWidth = 1.5; context.stroke(); context.shadowBlur = 0;
        context.beginPath(); context.arc(x - 5, bubble.y - 5, 3, 0, Math.PI * 2); context.fillStyle = 'rgba(255,255,255,.65)'; context.fill();
        context.fillStyle = '#f8fafc'; context.font = '700 12px system-ui'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(bubble.element, x, bubble.y + 1);
      });

      if (game.started && !game.completed) {
        const ball = game.balls[game.currentBall];
        if (ball?.active) {
          ball.x += ball.vx * delta; ball.y += ball.vy * delta; ball.trail.unshift({ x: ball.x, y: ball.y }); ball.trail = ball.trail.slice(0, 8);
          if (ball.x - ball.radius < 0 || ball.x + ball.radius > WIDTH) { ball.vx *= -1; ball.x = Math.max(ball.radius, Math.min(WIDTH - ball.radius, ball.x)); }
          if (ball.y - ball.radius < 0) { ball.vy = Math.abs(ball.vy); ball.y = ball.radius; }
          const paddleY = HEIGHT - 34; const paddleWidth = 116;
          if (ball.vy > 0 && ball.y + ball.radius >= paddleY - 8 && ball.y < paddleY + 10 && Math.abs(ball.x - game.paddleX) < paddleWidth / 2 + ball.radius) { const offset = (ball.x - game.paddleX) / (paddleWidth / 2); const angle = offset * 0.9; const speed = Math.max(5.3, Math.hypot(ball.vx, ball.vy)); ball.vx = Math.sin(angle) * speed; ball.vy = -Math.cos(angle) * speed; ball.y = paddleY - 10; }
          if (ball.y - ball.radius > HEIGHT) { ball.active = false; game.currentBall += 1; setCurrentBall(game.currentBall); if (game.balls[game.currentBall]) { game.balls[game.currentBall].x = game.paddleX; game.balls[game.currentBall].active = false; } }
          game.bubbles.forEach((bubble) => {
            if (!bubble.alive) return;
            const distance = Math.hypot(ball.x - bubble.x, ball.y - bubble.y);
            if (distance < ball.radius + bubble.radius) {
              const normalX = (ball.x - bubble.x) / (distance || 1); const normalY = (ball.y - bubble.y) / (distance || 1); const dot = ball.vx * normalX + ball.vy * normalY;
              ball.vx -= 2 * dot * normalX; ball.vy -= 2 * dot * normalY;
              if (ball.element === bubble.element) { bubble.alive = false; game.score += 100; game.destroyed[ball.element] = (game.destroyed[ball.element] || 0) + 1; setScore(game.score); for (let i = 0; i < 15; i++) game.particles.push({ x: bubble.x, y: bubble.y, vx: (Math.random() - .5) * 5, vy: (Math.random() - .5) * 5, life: 1, color: ELEMENTS[bubble.element].color, size: 2 + Math.random() * 3 }); }
              else bubble.shake = 3;
            }
          });
        }
      }
      game.particles = game.particles.filter((particle) => { particle.x += particle.vx * delta; particle.y += particle.vy * delta; particle.vy += 0.08 * delta; particle.life -= 0.035 * delta; context.globalAlpha = Math.max(0, particle.life); context.fillStyle = particle.color; context.beginPath(); context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2); context.fill(); context.globalAlpha = 1; return particle.life > 0; });
      const paddleY = HEIGHT - 34; context.shadowColor = '#8b5cf6'; context.shadowBlur = 18; context.fillStyle = '#c4b5fd'; context.beginPath(); context.roundRect(game.paddleX - 58, paddleY - 7, 116, 14, 7); context.fill(); context.shadowBlur = 0; context.fillStyle = 'rgba(255,255,255,.75)'; context.fillRect(game.paddleX - 39, paddleY - 4, 78, 2);
      const ball = game.balls[game.currentBall]; if (ball && !ball.active) { ball.x = game.paddleX; ball.y = HEIGHT - 58; const color = ELEMENTS[ball.element].color; context.shadowColor = color; context.shadowBlur = 20; context.fillStyle = color; context.beginPath(); context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); context.fill(); context.shadowBlur = 0; }
      if (ball?.active) ball.trail.forEach((point, index) => { context.globalAlpha = (8 - index) / 42; context.fillStyle = ELEMENTS[ball.element].color; context.beginPath(); context.arc(point.x, point.y, Math.max(2, ball.radius - index), 0, Math.PI * 2); context.fill(); context.globalAlpha = 1; });
      if (game.started && !game.completed && (game.bubbles.every((bubble) => !bubble.alive) || game.currentBall >= game.balls.length || game.timerRemaining <= 0)) { game.completed = true; const nextDominant = Object.entries(game.destroyed).sort((a, b) => b[1] - a[1])[0]?.[0] || mbtiElements[0] || 'E'; setDominant(nextDominant); setComplete(true); onGameComplete(game.score, nextDominant); }
      frameRef.current = requestAnimationFrame(draw);
    };
    frameRef.current = requestAnimationFrame(draw);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [mbtiElements, onGameComplete]);

  const launch = () => { const game = gameRef.current; if (game.completed || game.timerRemaining <= 0) return; if (!game.started) { game.started = true; setStarted(true); } const ball = game.balls[game.currentBall]; if (!ball || ball.active) return; const angle = (Math.random() * 0.9 - 0.45); ball.vx = Math.sin(angle) * 5.3; ball.vy = -Math.cos(angle) * 5.3; ball.active = true; };
  const movePaddle = (clientX: number) => { const canvas = canvasRef.current; if (!canvas) return; const bounds = canvas.getBoundingClientRect(); gameRef.current.paddleX = Math.max(60, Math.min(WIDTH - 60, ((clientX - bounds.left) / bounds.width) * WIDTH)); };
  const restart = () => { gameRef.current = { bubbles: makeBubbles(mbtiElements), particles: [], balls: mbtiElements.slice(0, 4).map(newBall), currentBall: 0, score: 0, destroyed: {}, started: false, completed: false, paddleX: WIDTH / 2, lastTime: 0, timerRemaining: GAME_DURATION_SECONDS }; timerDisplayRef.current = GAME_DURATION_SECONDS; setScore(0); setStarted(false); setCurrentBall(0); setTimeRemaining(GAME_DURATION_SECONDS); setComplete(false); setDominant(''); };
  useEffect(() => { const handleKey = (event: KeyboardEvent) => { if (event.code === 'Space') { event.preventDefault(); launch(); } }; window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey); });
  const currentElement = mbtiElements[currentBall] ?? mbtiElements[0] ?? 'E';
  return <main className="game-shell"><div className="game-header"><div><span className="eyebrow">ARCANE PRACTICUM / FINAL TRIAL</span><h1>魔法編織 <em>Magic Weaving</em></h1></div><div className="header-mark"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span>MW</span></div></div><section className="game-layout"><aside className="side-panel"><div className="panel-kicker">CURRENT WEAVE</div><p className="panel-title">你的性格元素</p><div className="element-stack">{mbtiElements.slice(0, 4).map((element, index) => <div className={`element-row ${index === currentBall ? 'is-current' : ''}`} key={`${element}-${index}`}><span className="element-orb" style={{ '--orb-color': ELEMENTS[element].color } as CSSProperties}>{element}</span><span><strong>{ELEMENTS[element].name}</strong><small>{index === currentBall ? '正在施放' : index < currentBall ? '已完成' : '待命'}</small></span><b>{String(index + 1).padStart(2, '0')}</b></div>)}</div><div className="side-note">同色元素擊中泡泡時，法術會產生共鳴並獲得分數。</div></aside><div className="arena-wrap"><div className="arena-top"><div><span className="stat-label">SCORE</span><strong>{String(score).padStart(4, '0')}</strong></div><div className="arena-instruction">{complete ? '試煉完成' : started ? '移動光板，維持法術連鎖' : '點擊畫布或按下空白鍵開始'}</div><div className="lives"><span className="stat-label">SPELLS</span>{mbtiElements.slice(0, 4).map((element, index) => <span className={`life-orb ${index < currentBall ? 'used' : ''}`} style={{ '--orb-color': ELEMENTS[element].color } as CSSProperties} key={`${element}-life-${index}`}>{element}</span>)}</div></div><div className="canvas-frame"><canvas ref={canvasRef} width={WIDTH} height={HEIGHT} onClick={launch} onMouseMove={(event) => movePaddle(event.clientX)} onTouchMove={(event) => movePaddle(event.touches[0].clientX)} aria-label="魔法泡泡消除遊戲" /></div><div className="game-controls"><span>DRAG TO WEAVE</span><span className="control-key">SPACE</span><span>LAUNCH</span></div>{complete && <div className="result-card"><span className="result-eyebrow">TRIAL COMPLETE</span><h2>共鳴完成</h2><p>你與 <b style={{ color: ELEMENTS[dominant as MbtiElement]?.color }}>{dominant} · {ELEMENTS[dominant as MbtiElement]?.name}</b> 元素產生最深連結。</p><strong>{score}<small> POINTS</small></strong><button onClick={restart}>再次編織</button></div>}</div></section><footer className="spell-footer"><span>ELEMENTAL SPELL PACK</span><div className="spell-list">{mbtiElements.slice(0, 4).map((element, index) => <div className={`spell-chip ${index === currentBall ? 'next' : ''}`} key={`${element}-chip-${index}`}><i style={{ backgroundColor: ELEMENTS[element].color }} />{ELEMENTS[element].name}<b>{element}</b></div>)}</div><span className="next-label">NEXT: {currentElement}</span></footer></main>;
}
