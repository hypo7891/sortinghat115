import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTeacherAuth } from '../../hooks/useTeacherAuth';
import { subscribeClassDoc, type ClassDoc } from '../../firebase/firestore';
import { PageCard } from '../../components/ui/PageCard';

export function ClassPresentPage() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useTeacherAuth();
  const [klass, setKlass] = useState<ClassDoc | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/teacher', { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!classId) return;
    return subscribeClassDoc(classId, setKlass);
  }, [classId]);

  if (loading || !user) return null;

  const joinUrl = klass ? `${window.location.origin}/?code=${klass.joinCode}` : '';

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-6 py-10 text-[var(--color-parchment)]">
      <button
        type="button"
        onClick={() => navigate(`/teacher/classes/${classId}`)}
        className="mb-4 self-start text-sm underline text-[var(--color-parchment)]/60"
      >
        ← 回到班級儀表板
      </button>

      <PageCard className="flex w-full flex-col items-center gap-6 text-center">
        <h1 className="font-serif text-2xl font-bold">{klass?.className ?? '載入中...'}</h1>

        {klass && (
          <>
            <div className="rounded-2xl bg-white p-5">
              <QRCodeSVG value={joinUrl} size={240} />
            </div>

            <p className="text-sm text-[var(--color-parchment)]/70">
              掃描 QR Code，或到首頁輸入班級代碼：
            </p>

            <p className="rounded-full bg-white/10 px-8 py-3 font-serif text-4xl font-bold tracking-[0.3em]">
              {klass.joinCode}
            </p>
          </>
        )}
      </PageCard>
    </div>
  );
}
