import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTeacherAuth } from '../../hooks/useTeacherAuth';
import {
  subscribeClassDoc,
  subscribeClassSubmissions,
  type ClassDoc,
  type SubmissionDoc,
} from '../../firebase/firestore';
import { HouseBadge } from '../../components/badges/HouseBadge';
import { HOUSE_NAMES, HOUSE_ORDER } from '../../data/houseTypes';

const AXIS_POLES: [string, string][] = [
  ['E', 'I'],
  ['S', 'N'],
  ['T', 'F'],
  ['J', 'P'],
];

export function TeacherClassDashboardPage() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useTeacherAuth();
  const [klass, setKlass] = useState<ClassDoc | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionDoc[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/teacher', { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!classId) return;
    const unsubClass = subscribeClassDoc(classId, setKlass);
    const unsubSubs = subscribeClassSubmissions(classId, setSubmissions);
    return () => {
      unsubClass();
      unsubSubs();
    };
  }, [classId]);

  const houseChartData = useMemo(
    () =>
      HOUSE_ORDER.map((house) => ({
        house: HOUSE_NAMES[house],
        人數: submissions.filter((s) => s.primaryHouse === house).length,
      })),
    [submissions],
  );

  const axisChartData = useMemo(
    () =>
      AXIS_POLES.map(([a, b], axisIndex) => {
        const counts = { [a]: 0, [b]: 0 } as Record<string, number>;
        for (const s of submissions) {
          const letter = s.mbtiType?.[axisIndex];
          if (letter === a || letter === b) counts[letter] += 1;
        }
        return {
          label: `${a} / ${b}`,
          bars: [
            { name: a, 人數: counts[a] },
            { name: b, 人數: counts[b] },
          ],
        };
      }),
    [submissions],
  );

  const handleCopy = async () => {
    if (!klass) return;
    await navigator.clipboard.writeText(klass.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 text-[var(--color-parchment)]">
      <button
        type="button"
        onClick={() => navigate('/teacher/classes')}
        className="mb-4 text-sm underline text-[var(--color-parchment)]/60"
      >
        ← 回到班級列表
      </button>

      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">{klass?.className ?? '載入中...'}</h1>
        {klass && (
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full bg-white/10 px-4 py-2 text-sm tracking-widest hover:bg-white/20"
          >
            代碼 {klass.joinCode} {copied ? '已複製' : '（點擊複製）'}
          </button>
        )}
      </div>

      <section className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mb-3 font-serif text-lg font-semibold">學院分佈</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={houseChartData}>
              <CartesianGrid strokeOpacity={0.1} vertical={false} />
              <XAxis dataKey="house" stroke="currentColor" fontSize={12} />
              <YAxis allowDecimals={false} stroke="currentColor" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#14101c', border: 'none', color: '#f3ead9' }}
              />
              <Bar dataKey="人數" fill="var(--color-hufflepuff-light)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="mb-3 font-serif text-lg font-semibold">MBTI 各軸分佈</h2>
          <div className="grid grid-cols-2 gap-4">
            {axisChartData.map((axis) => (
              <div key={axis.label}>
                <p className="mb-1 text-center text-xs text-[var(--color-parchment)]/60">
                  {axis.label}
                </p>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart data={axis.bars}>
                    <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                    <YAxis allowDecimals={false} hide />
                    <Tooltip
                      contentStyle={{ background: '#14101c', border: 'none', color: '#f3ead9' }}
                    />
                    <Bar dataKey="人數" fill="var(--color-ravenclaw-light)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-lg font-semibold">學生名單（{submissions.length}）</h2>
        <div className="flex flex-col gap-2">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-parchment)]/15 bg-white/5 px-4 py-3"
            >
              <HouseBadge house={s.primaryHouse} size={36} />
              <span className="flex-1 font-medium">{s.studentDisplayName}</span>
              <span className="text-sm text-[var(--color-parchment)]/70">
                {HOUSE_NAMES[s.primaryHouse]}
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{s.mbtiType}</span>
            </div>
          ))}
          {submissions.length === 0 && (
            <p className="text-sm text-[var(--color-parchment)]/60">
              還沒有學生完成測驗。
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
