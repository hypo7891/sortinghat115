import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacherAuth } from '../../hooks/useTeacherAuth';
import { createClass, subscribeTeacherClasses, type ClassDoc } from '../../firebase/firestore';
import { signOutTeacher } from '../../firebase/auth';
import { PageCard } from '../../components/ui/PageCard';

export function TeacherClassesPage() {
  const navigate = useNavigate();
  const { user, loading } = useTeacherAuth();
  const [classes, setClasses] = useState<ClassDoc[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/teacher', { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    return subscribeTeacherClasses(user.uid, setClasses);
  }, [user]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newClassName.trim()) return;
    setCreating(true);
    try {
      await createClass(user.uid, newClassName.trim());
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
          <h1 className="font-serif text-2xl font-bold">我的班級</h1>
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
            <button
              key={c.id}
              type="button"
              onClick={() => navigate(`/teacher/classes/${c.id}`)}
              className="flex items-center justify-between rounded-xl border border-[var(--color-parchment)]/20 bg-white/5 px-4 py-3 text-left hover:bg-white/10"
            >
              <span className="font-medium">{c.className}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs tracking-widest">
                {c.joinCode}
              </span>
            </button>
          ))}
        </div>
      </PageCard>
    </div>
  );
}
