import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInTeacher, UnauthorizedTeacherError } from '../../firebase/auth';
import { useTeacherAuth } from '../../hooks/useTeacherAuth';
import { PageCard } from '../../components/ui/PageCard';

export function TeacherLoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useTeacherAuth();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate('/teacher/classes', { replace: true });
  }, [loading, user, navigate]);

  const handleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signInTeacher();
    } catch (e) {
      setError(
        e instanceof UnauthorizedTeacherError
          ? '此帳號尚未獲得使用授權，請聯絡管理員。'
          : '登入失敗，請再試一次。',
      );
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-[var(--color-parchment)]">
      <PageCard className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <h1 className="font-serif text-2xl font-bold">老師登入</h1>
        <p className="max-w-xs text-sm text-[var(--color-parchment)]/70">
          登入後可以建立班級、取得加入代碼，並查看學生的測驗結果總覽。
        </p>
        <button
          type="button"
          onClick={handleSignIn}
          disabled={signingIn}
          className="rounded-full bg-[var(--color-accent)] px-6 py-2 font-semibold text-[var(--color-accent-ink)] disabled:opacity-60"
        >
          {signingIn ? '登入中...' : '使用 Google 登入'}
        </button>
        {error && <p className="text-sm text-red-300">{error}</p>}
      </PageCard>
    </div>
  );
}
