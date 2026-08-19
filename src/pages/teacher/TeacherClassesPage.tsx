import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacherAuth } from '../../hooks/useTeacherAuth';
import {
  createClass,
  subscribeAllClasses,
  subscribeTeacherClasses,
  type ClassDoc,
} from '../../firebase/firestore';
import { signOutTeacher } from '../../firebase/auth';
import { PageCard } from '../../components/ui/PageCard';
import { ADMIN_EMAILS } from '../../lib/admin';

export function TeacherClassesPage() {
  const navigate = useNavigate();
  const { user, loading } = useTeacherAuth();
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);
  const [classes, setClasses] = useState<ClassDoc[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/teacher', { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    return isAdmin
      ? subscribeAllClasses(setClasses)
      : subscribeTeacherClasses(user.uid, setClasses);
  }, [user, isAdmin]);

  const handleCopy = async (code: string, classId: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(classId);
    setTimeout(() => setCopiedId((current) => (current === classId ? null : current)), 1500);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newClassName.trim()) return;
    setCreating(true);
    try {
      await createClass(user.uid, newClassName.trim(), user.email ?? '');
      setNewClassName('');
    } finally {
      setCreating(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-lg px-6 py-10 text-[var(--color-parchment)]">
      <PageCard>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold">{isAdmin ? '所有班級（管理員）' : '我的班級'}</h1>
          <button
            type="button"
            onClick={() => signOutTeacher()}
            className="text-sm underline text-[var(--color-parchment)]/60"
          >
            登出
          </button>
        </div>

        <form onSubmit={handleCreate} className="mb-8 flex gap-2">
          <input
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="新班級名稱，例如：七年三班"
            className="flex-1 rounded-lg border border-[var(--color-parchment)]/30 bg-white/5 px-3 py-2 outline-none focus:border-[var(--color-parchment)]/60"
          />
          <button
            type="submit"
            disabled={creating || !newClassName.trim()}
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 font-semibold text-[var(--color-accent-ink)] disabled:opacity-60"
          >
            建立
          </button>
        </form>

        <div className="flex flex-col gap-3">
          {classes.length === 0 && (
            <p className="text-sm text-[var(--color-parchment)]/60">
              還沒有班級，先建立一個吧。
            </p>
          )}
          {classes.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-[var(--color-parchment)]/20 bg-white/5 px-4 py-3"
            >
              <button
                type="button"
                onClick={() => navigate(`/teacher/classes/${c.id}`)}
                className="flex flex-1 flex-col text-left"
              >
                <span className="font-medium">{c.className}</span>
                {isAdmin && c.teacherEmail && (
                  <span className="text-xs text-[var(--color-parchment)]/50">{c.teacherEmail}</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleCopy(c.joinCode, c.id)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs tracking-widest hover:bg-white/20"
                title="複製班級代碼"
              >
                {copiedId === c.id ? '已複製' : c.joinCode}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/teacher/classes/${c.id}/present`)}
                className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-ink)] hover:opacity-90"
                title="顯示代碼與 QR Code"
              >
                QR
              </button>
            </div>
          ))}
        </div>
      </PageCard>
    </div>
  );
}
