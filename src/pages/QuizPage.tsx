import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapScreen } from '../components/MapScreen';
import { QuestionCard } from '../components/QuestionCard';
import { ZoneIntro } from '../components/ZoneIntro';
import { CorridorScene } from '../components/corridor/CorridorScene';
import { LanternHud } from '../components/corridor/LanternHud';
import { MagicWeavingGame, type MbtiElement } from '../components/game/MagicWeavingGame';
import { useQuizStore } from '../lib/quizStore';
import {
  MAP_ZONES,
  QUIZ_NODES,
  TOTAL_QUESTIONS,
  TRIALS_NODES,
  zoneStartIndex,
} from '../data/mapZones';
import { HOUSE_QUESTIONS } from '../data/houseQuestions';
import { MBTI_QUESTIONS, type MbtiAxis } from '../data/mbtiQuestions';
import { scoreHouse, type HouseScoreResult } from '../lib/scoring/houseScoring';
import { scoreMbti, type MbtiScoreResult } from '../lib/scoring/mbtiScoring';
import { submitQuizResult } from '../firebase/firestore';

export function QuizPage() {
  const navigate = useNavigate();
  const {
    studentName,
    classId,
    startedAt,
    currentQuestionIndex,
    houseAnswers,
    mbtiAnswers,
    answerCurrent,
    revisitNode,
  } = useQuizStore();

  const [introShown, setIntroShown] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [pendingResult, setPendingResult] = useState<{
    houseAnswers: typeof houseAnswers;
    mbtiAnswers: typeof mbtiAnswers;
    houseResult: HouseScoreResult;
    mbtiResult: MbtiScoreResult;
  } | null>(null);

  const currentNode = QUIZ_NODES[currentQuestionIndex];
  const currentZone = currentNode
    ? MAP_ZONES.find((z) => z.id === currentNode.zoneId)!
    : null;

  const needsIntro =
    currentNode &&
    currentQuestionIndex === zoneStartIndex(currentNode.zoneId) &&
    !introShown.has(currentNode.zoneId);

  const houseQuestionMap = useMemo(
    () => new Map(HOUSE_QUESTIONS.map((q) => [q.id, q])),
    [],
  );
  const mbtiQuestionMap = useMemo(
    () => new Map(MBTI_QUESTIONS.map((q) => [q.id, q])),
    [],
  );
  const mbtiLiveResult = useMemo(() => scoreMbti(mbtiAnswers), [mbtiAnswers]);

  if (!studentName || !classId) {
    navigate('/', { replace: true });
    return null;
  }

  const handleAnswer = (letter: string) => {
    answerCurrent(letter as 'A' | 'B' | 'C' | 'D');

    if (currentQuestionIndex + 1 >= TOTAL_QUESTIONS) {
      const finalHouseAnswers =
        currentNode.kind === 'house'
          ? { ...houseAnswers, [currentNode.questionId]: letter as 'A' | 'B' | 'C' | 'D' }
          : houseAnswers;
      const finalMbtiAnswers =
        currentNode.kind === 'mbti'
          ? { ...mbtiAnswers, [currentNode.questionId]: letter as 'A' | 'B' }
          : mbtiAnswers;

      const houseResult = scoreHouse(finalHouseAnswers);
      const mbtiResult = scoreMbti(finalMbtiAnswers);

      setPendingResult({
        houseAnswers: finalHouseAnswers,
        mbtiAnswers: finalMbtiAnswers,
        houseResult,
        mbtiResult,
      });
    }
  };

  const handleGameComplete = async (gameScore: number, gameDominantElement: string) => {
    if (!pendingResult || !classId) return;
    setSubmitting(true);
    const { houseAnswers: finalHouseAnswers, mbtiAnswers: finalMbtiAnswers, houseResult, mbtiResult } =
      pendingResult;

    const mbtiAxisScores = Object.fromEntries(
      Object.entries(mbtiResult.axisResults).map(([axis, r]) => [axis, r.counts]),
    );
    const mbtiAxisStrength = Object.fromEntries(
      Object.entries(mbtiResult.axisResults).map(([axis, r]) => [axis, r.strength]),
    );

    await submitQuizResult(classId, {
      studentDisplayName: studentName,
      startedAt: startedAt ?? Date.now(),
      houseAnswers: finalHouseAnswers,
      mbtiAnswers: finalMbtiAnswers,
      houseScores: houseResult.scores,
      primaryHouse: houseResult.primaryHouse,
      secondaryHouse: houseResult.secondaryHouse,
      houseTie: houseResult.houseTie,
      mbtiType: mbtiResult.mbtiType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mbtiAxisScores: mbtiAxisScores as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mbtiAxisStrength: mbtiAxisStrength as any,
      gameScore,
      gameDominantElement,
    });

    navigate('/results', {
      replace: true,
      state: { houseResult, mbtiResult, gameScore, gameDominantElement },
    });
  };

  if (pendingResult) {
    const mbtiElements = pendingResult.mbtiResult.mbtiType.split('') as MbtiElement[];
    return (
      <div className="min-h-dvh bg-[#080b19]">
        <MagicWeavingGame mbtiElements={mbtiElements} onGameComplete={handleGameComplete} />
        {submitting && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 text-center text-[var(--color-parchment)]">
            <p>分類帽正在思考...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {currentNode?.kind === 'mbti' ? (
        <>
          <CorridorScene />
          <LanternHud
            axisResults={mbtiLiveResult.axisResults}
            activeAxis={currentNode.zoneId as MbtiAxis}
          />
        </>
      ) : (
        <MapScreen
          nodes={TRIALS_NODES}
          currentIndex={currentQuestionIndex}
          onSelectNode={revisitNode}
        />
      )}

      {needsIntro && currentZone && (
        <ZoneIntro
          label={currentZone.label}
          intro={currentZone.intro}
          onContinue={() =>
            setIntroShown((prev) => new Set(prev).add(currentZone.id))
          }
        />
      )}

      {currentNode && !needsIntro && (
        <QuestionCardForNode
          key={currentNode.questionId}
          node={currentNode}
          progressLabel={`${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS}`}
          onAnswer={handleAnswer}
          houseQuestionMap={houseQuestionMap}
          mbtiQuestionMap={mbtiQuestionMap}
        />
      )}
    </div>
  );
}

function QuestionCardForNode({
  node,
  progressLabel,
  onAnswer,
  houseQuestionMap,
  mbtiQuestionMap,
}: {
  node: (typeof QUIZ_NODES)[number];
  progressLabel: string;
  onAnswer: (letter: string) => void;
  houseQuestionMap: Map<string, (typeof HOUSE_QUESTIONS)[number]>;
  mbtiQuestionMap: Map<string, (typeof MBTI_QUESTIONS)[number]>;
}) {
  if (node.kind === 'house') {
    const q = houseQuestionMap.get(node.questionId)!;
    return (
      <QuestionCard
        questionKey={q.id}
        title={q.title}
        text={q.body}
        options={q.options.map((o) => ({ letter: o.letter, text: o.text }))}
        progressLabel={progressLabel}
        onAnswer={onAnswer}
      />
    );
  }

  const q = mbtiQuestionMap.get(node.questionId)!;
  return (
    <QuestionCard
      questionKey={q.id}
      text={q.text}
      options={[
        { letter: 'A', text: q.optionA.text },
        { letter: 'B', text: q.optionB.text },
      ]}
      progressLabel={progressLabel}
      onAnswer={onAnswer}
    />
  );
}
