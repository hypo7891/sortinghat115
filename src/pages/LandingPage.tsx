import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveJoinCode } from '../firebase/firestore';
import { useQuizStore } from '../lib/quizStore';

export function LandingPage() {
  const navigate = useNavigate();
  const startQuiz = useQuizStore((s) => s.startQuiz);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('請輸入你的名字。');
      return;
    }
    if (!code.trim()) {
      setError('請輸入老師提供的班級代碼。');
      return;
    }

    setLoading(true);
    try {
      const resolved = await resolveJoinCode(code);
      if (!resolved) {
        setError('找不到這個班級代碼，請確認後再試一次。');
        return;
      }
      startQuiz(name.trim(), resolved.classId, code.trim().toUpperCase());
      navigate('/quiz');
    } catch {
      setError('連線發生問題，請稍後再試一次。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-[var(--color-parchment)]">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center font-serif text-2xl font-bold">
          霍格華茲新生學院傾向測驗
        </h1>
        <p className="mb-8 text-center text-sm text-[var(--color-parchment)]/70">
          歡迎來到霍格華茲！這份測驗沒有標準答案，請選擇最接近你平常想法的答案。
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            你的名字
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-[var(--color-parchment)]/30 bg-white/5 px-3 py-2 text-[var(--color-parchment)] outline-none focus:border-[var(--color-parchment)]/60"
              placeholder="例如：陳小明"
              maxLength={40}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            班級代碼
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="rounded-lg border border-[var(--color-parchment)]/30 bg-white/5 px-3 py-2 uppercase tracking-widest text-[var(--color-parchment)] outline-none focus:border-[var(--color-parchment)]/60"
              placeholder="向老師索取"
              maxLength={6}
            />
          </label>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-[var(--color-hufflepuff-light)] px-6 py-2 font-semibold text-[var(--color-ink)] disabled:opacity-60"
          >
            {loading ? '確認中...' : '開始測驗'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[var(--color-parchment)]/50">
          我是老師？
          <button
            type="button"
            onClick={() => navigate('/teacher')}
            className="ml-1 underline"
          >
            前往老師登入
          </button>
        </p>
      </div>
    </div>
  );
}
