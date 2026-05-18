'use client'

import { useState, useCallback } from 'react'

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

type ColorFamily =
  | 'red' | 'orange' | 'yellow' | 'yellow-green' | 'green'
  | 'blue-green' | 'blue' | 'purple' | 'brown' | 'neutral' | 'gray'

type ColorEntry = {
  name: string
  reading: string
  rgb: [number, number, number]
  note: string
  family: ColorFamily
}

type Question = { color: ColorEntry; choices: ColorEntry[] }

// ──────────────────────────────────────────────
// Color data (72色 / 色彩検定2〜3級)
// ──────────────────────────────────────────────

const COLORS: ColorEntry[] = [
  // ── 赤・ピンク系 ───────────────────────────
  { name: '桜色',           reading: 'さくらいろ',        rgb: [253, 213, 205], family: 'red',          note: '桜の花びらのような淡いピンク。春を代表する日本の伝統色。' },
  { name: '鴇色',           reading: 'ときいろ',           rgb: [245, 175, 173], family: 'red',          note: '朱鷺(トキ)の羽のような淡い赤みのピンク。' },
  { name: '薔薇色',         reading: 'ばらいろ',           rgb: [220, 90, 115],  family: 'red',          note: 'バラの花のような鮮やかなピンク。' },
  { name: '紅色',           reading: 'べにいろ',           rgb: [194, 35, 60],   family: 'red',          note: 'ベニバナで染めた深みのある赤。' },
  { name: '朱色',           reading: 'しゅいろ',           rgb: [228, 68, 33],   family: 'red',          note: '朱砂を原料とした鮮やかな赤橙色。神社の鳥居に使われる。' },
  { name: '緋色',           reading: 'ひいろ',             rgb: [203, 60, 31],   family: 'red',          note: '炎のような鮮烈な赤橙色。緋縅の鎧が有名。' },
  { name: '茜色',           reading: 'あかねいろ',         rgb: [175, 44, 55],   family: 'red',          note: '茜草の根で染めた深みのある赤。' },
  { name: '臙脂色',         reading: 'えんじいろ',         rgb: [145, 25, 45],   family: 'red',          note: '深みのある暗い赤紫色。臙脂(コチニール)で染めた色。' },
  { name: 'スカーレット',   reading: 'すかーれっと',       rgb: [255, 36, 0],    family: 'red',          note: '鮮やかな赤橙色。英語 scarlet に由来。' },
  { name: 'クリムゾン',     reading: 'くりむぞん',         rgb: [220, 20, 60],   family: 'red',          note: '深みのある赤色。英語 crimson に由来。' },

  // ── 橙系 ──────────────────────────────────
  { name: '柿色',           reading: 'かきいろ',           rgb: [235, 108, 40],  family: 'orange',       note: '熟した柿のような明るい橙色。' },
  { name: '蜜柑色',         reading: 'みかんいろ',         rgb: [248, 135, 0],   family: 'orange',       note: 'ミカンの果皮のような鮮やかな橙色。' },
  { name: 'テラコッタ',     reading: 'てらこった',         rgb: [196, 75, 42],   family: 'orange',       note: '素焼き陶器(terra cotta)のような赤茶色。' },
  { name: 'サーモンピンク', reading: 'さーもんぴんく',     rgb: [255, 155, 120], family: 'orange',       note: '鮭の身のような淡い橙ピンク。英語由来。' },
  { name: 'コーラル',       reading: 'こーらる',           rgb: [255, 127, 80],  family: 'orange',       note: '珊瑚のような赤みの橙色。英語 coral に由来。' },

  // ── 黄系 ──────────────────────────────────
  { name: '山吹色',         reading: 'やまぶきいろ',       rgb: [245, 165, 0],   family: 'yellow',       note: 'ヤマブキの花のような鮮やかな黄橙色。' },
  { name: '黄土色',         reading: 'おうどいろ',         rgb: [197, 155, 76],  family: 'yellow',       note: '黄土顔料のような黄褐色。' },
  { name: 'オーカー',       reading: 'おーかー',           rgb: [205, 122, 32],  family: 'yellow',       note: '黄土(ochre)顔料に由来する黄褐色。' },
  { name: 'レモンイエロー', reading: 'れもんいえろー',     rgb: [255, 240, 30],  family: 'yellow',       note: 'レモンのような鮮やかな黄色。英語由来。' },
  { name: 'ゴールデンイエロー', reading: 'ごーるでんいえろー', rgb: [250, 185, 0], family: 'yellow',   note: '黄金のような鮮やかな黄色。英語由来。' },

  // ── 黄緑系 ────────────────────────────────
  { name: '若草色',         reading: 'わかくさいろ',       rgb: [131, 176, 52],  family: 'yellow-green', note: '若い草のような明るい黄緑色。' },
  { name: '萌黄色',         reading: 'もえぎいろ',         rgb: [140, 180, 25],  family: 'yellow-green', note: '草の芽吹きのような鮮やかな黄緑色。' },
  { name: '黄緑',           reading: 'きみどり',           rgb: [147, 197, 65],  family: 'yellow-green', note: '明るく鮮やかな黄緑色。' },
  { name: '鶯色',           reading: 'うぐいすいろ',       rgb: [107, 118, 53],  family: 'yellow-green', note: 'ウグイスの羽のような渋い黄緑色。' },
  { name: 'カーキ',         reading: 'かーき',             rgb: [175, 152, 105], family: 'yellow-green', note: '軍服に用いられた黄褐色。英語 khaki に由来。' },

  // ── 緑系 ──────────────────────────────────
  { name: '草色',           reading: 'くさいろ',           rgb: [100, 130, 50],  family: 'green',        note: '草の葉のような中明度の緑色。' },
  { name: '苔色',           reading: 'こけいろ',           rgb: [89, 106, 47],   family: 'green',        note: '苔のような暗い黄緑色。' },
  { name: '松葉色',         reading: 'まつばいろ',         rgb: [78, 111, 71],   family: 'green',        note: '松の葉のような深みのある緑色。' },
  { name: '常盤色',         reading: 'ときわいろ',         rgb: [27, 107, 75],   family: 'green',        note: '常緑樹の葉のような深みのある緑色。' },
  { name: 'オリーブ',       reading: 'おりーぶ',           rgb: [107, 107, 0],   family: 'green',        note: 'オリーブの実のような暗い黄緑色。' },
  { name: 'エメラルドグリーン', reading: 'えめらるどぐりーん', rgb: [0, 201, 87], family: 'green',     note: 'エメラルドの宝石のような鮮やかな緑色。' },

  // ── 青緑系 ────────────────────────────────
  { name: '浅葱色',         reading: 'あさぎいろ',         rgb: [0, 160, 153],   family: 'blue-green',   note: '浅葱(ネギ)の葉のような青緑色。' },
  { name: '青竹色',         reading: 'あおたけいろ',       rgb: [0, 164, 137],   family: 'blue-green',   note: '青竹の表面のような緑みの青。' },
  { name: 'ターコイズブルー', reading: 'たーこいずぶるー', rgb: [0, 199, 190],   family: 'blue-green',   note: 'トルコ石のような鮮やかな青緑。英語由来。' },
  { name: 'ティールグリーン', reading: 'てぃーるぐりーん', rgb: [0, 128, 128],   family: 'blue-green',   note: 'コガモの頭部のような深みのある青緑。英語 teal に由来。' },

  // ── 青系 ──────────────────────────────────
  { name: '水色',           reading: 'みずいろ',           rgb: [176, 224, 235], family: 'blue',         note: '澄んだ水のような淡い青色。' },
  { name: '空色',           reading: 'そらいろ',           rgb: [100, 181, 206], family: 'blue',         note: '晴れた空のような爽やかな青色。' },
  { name: 'スカイブルー',   reading: 'すかいぶるー',       rgb: [135, 206, 235], family: 'blue',         note: '空のような明るい青(sky blue)。英語由来。' },
  { name: 'マリンブルー',   reading: 'まりんぶるー',       rgb: [40, 110, 160],  family: 'blue',         note: '海のような深みのある青。英語由来。' },
  { name: 'セルリアンブルー', reading: 'せるりあんぶるー', rgb: [0, 123, 167],   family: 'blue',         note: '澄んだ空を連想させる鮮やかな青色。' },
  { name: 'コバルトブルー', reading: 'こばるとぶるー',     rgb: [0, 71, 171],    family: 'blue',         note: 'コバルトガラスのような鮮やかで深い青。' },
  { name: '群青色',         reading: 'ぐんじょういろ',     rgb: [42, 67, 161],   family: 'blue',         note: 'ラピスラズリ由来の深みのある青色。' },
  { name: '瑠璃色',         reading: 'るりいろ',           rgb: [65, 72, 181],   family: 'blue',         note: '瑠璃の宝石のような紫みを帯びた青色。' },
  { name: '紺色',           reading: 'こんいろ',           rgb: [29, 40, 107],   family: 'blue',         note: '暗い深みのある青色。紺屋（染物屋）に由来。' },

  // ── 紫系 ──────────────────────────────────
  { name: '藤色',           reading: 'ふじいろ',           rgb: [166, 138, 202], family: 'purple',       note: '藤の花のような淡い紫色。' },
  { name: 'ライラック',     reading: 'らいらっく',         rgb: [200, 162, 200], family: 'purple',       note: 'ライラックの花のような淡い紫。英語由来。' },
  { name: 'ラベンダー',     reading: 'らべんだー',         rgb: [181, 126, 220], family: 'purple',       note: 'ラベンダーの花のような薄紫色。英語由来。' },
  { name: '菫色',           reading: 'すみれいろ',         rgb: [94, 55, 140],   family: 'purple',       note: 'スミレの花のような青みの深い紫色。' },
  { name: '江戸紫',         reading: 'えどむらさき',       rgb: [106, 51, 134],  family: 'purple',       note: '江戸時代に流行した赤みがかった紫色。' },
  { name: 'マゼンタ',       reading: 'まぜんた',           rgb: [255, 0, 144],   family: 'purple',       note: '印刷三原色のひとつ。鮮やかな赤紫色。' },
  { name: 'ボルドー',       reading: 'ぼるどー',           rgb: [100, 22, 44],   family: 'purple',       note: '赤ワインのような暗い赤紫色。フランス語由来。' },
  { name: 'バイオレット',   reading: 'ばいおれっと',       rgb: [127, 0, 255],   family: 'purple',       note: 'すみれ(violet)のような青みの紫。英語由来。' },

  // ── 茶系 ──────────────────────────────────
  { name: 'チョコレート',   reading: 'ちょこれーと',       rgb: [123, 63, 0],    family: 'brown',        note: 'チョコレートのような暗い赤みの茶色。' },
  { name: 'マロン',         reading: 'まろん',             rgb: [134, 63, 63],   family: 'brown',        note: '栗(marron)のような赤みの茶色。フランス語由来。' },
  { name: 'セピア',         reading: 'せぴあ',             rgb: [112, 66, 20],   family: 'brown',        note: 'イカ墨由来の暗い赤褐色。古い写真の色。' },
  { name: 'シナモン',       reading: 'しなもん',           rgb: [210, 105, 30],  family: 'brown',        note: 'シナモンスパイスのような赤みの茶色。' },
  { name: 'キャメル',       reading: 'きゃめる',           rgb: [193, 154, 107], family: 'brown',        note: 'ラクダの毛のような明るい黄褐色。英語由来。' },

  // ── ニュートラル系 ─────────────────────────
  { name: 'エクリュ',       reading: 'えくりゅ',           rgb: [244, 234, 208], family: 'neutral',      note: '未漂白の亜麻布のような薄い黄白色。フランス語由来。' },
  { name: 'ベージュ',       reading: 'べーじゅ',           rgb: [235, 218, 178], family: 'neutral',      note: '未染色の羊毛のような薄い黄褐色。フランス語由来。' },
  { name: 'アイボリー',     reading: 'あいぼりー',         rgb: [255, 253, 224], family: 'neutral',      note: '象牙のような黄みがかった白色。英語 ivory に由来。' },
  { name: 'クリーム',       reading: 'くりーむ',           rgb: [255, 248, 220], family: 'neutral',      note: '生クリームのような淡い黄白色。英語由来。' },

  // ── 灰系 ──────────────────────────────────
  { name: '灰色',           reading: 'はいいろ',           rgb: [155, 155, 155], family: 'gray',         note: '灰のような中明度の無彩色。' },
  { name: '鼠色',           reading: 'ねずみいろ',         rgb: [120, 120, 120], family: 'gray',         note: 'ネズミの毛のような暗い灰色。' },
  { name: 'シルバー',       reading: 'しるばー',           rgb: [192, 192, 192], family: 'gray',         note: '銀のような明るい灰色。英語 silver に由来。' },
  { name: 'チャコール',     reading: 'ちゃこーる',         rgb: [54, 69, 79],    family: 'gray',         note: '木炭のような暗い青みの灰色。英語 charcoal に由来。' },
  { name: 'スレートグレー', reading: 'すれーとぐれー',     rgb: [112, 128, 144], family: 'gray',         note: '粘板岩のような青みがかった灰色。英語由来。' },
]

const TOTAL = 30

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 同系統の色を優先して選択肢を生成
function buildQuestions(): Question[] {
  return shuffle(COLORS)
    .slice(0, TOTAL)
    .map(color => {
      const sameFamily = shuffle(COLORS.filter(c => c.name !== color.name && c.family === color.family))
      const otherFamily = shuffle(COLORS.filter(c => c.name !== color.name && c.family !== color.family))
      const wrongs = [...sameFamily, ...otherFamily].slice(0, 3)
      return { color, choices: shuffle([color, ...wrongs]) }
    })
}

function choiceCls(
  choice: ColorEntry,
  answered: boolean,
  selected: string | null,
  correct: string,
): string {
  const base = 'w-full rounded-2xl border-2 px-3 py-3 transition-all duration-150'
  if (!answered)
    return `${base} border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer`
  if (choice.name === correct)
    return `${base} border-green-500 bg-green-50 text-green-800 cursor-default`
  if (choice.name === selected)
    return `${base} border-red-400 bg-red-50 text-red-800 cursor-default`
  return `${base} border-slate-200 bg-white text-slate-400 cursor-default`
}

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

function QuizScreen({
  question,
  idx,
  score,
  answered,
  selected,
  onAnswer,
  onNext,
  onShowResult,
}: {
  question: Question
  idx: number
  score: number
  answered: boolean
  selected: string | null
  onAnswer: (name: string) => void
  onNext: () => void
  onShowResult: () => void
}) {
  const { color, choices } = question
  const isCorrect = selected === color.name
  const barWidth = answered ? ((idx + 1) / TOTAL) * 100 : (idx / TOTAL) * 100

  return (
    <div>
      {/* Progress */}
      <div className="mb-1.5 flex justify-between px-0.5 text-xs text-slate-500">
        <span>第{idx + 1}問 / 全{TOTAL}問</span>
        <span className="font-semibold text-indigo-600">正解 {score}問</span>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-indigo-500"
          style={{ width: `${barWidth}%`, transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        {/* Color swatch */}
        <div
          className="mb-4 w-full rounded-[20px] border border-black/5"
          style={{
            height: 200,
            backgroundColor: `rgb(${color.rgb.join(',')})`,
            boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
          }}
        />

        <p className="mb-3.5 text-center text-[11px] font-medium tracking-widest text-slate-400 uppercase">
          この色の慣用色名は？
        </p>

        {/* Choices */}
        <div key={idx} className="grid grid-cols-2 gap-2.5">
          {choices.map(c => (
            <button
              key={c.name}
              disabled={answered}
              className={choiceCls(c, answered, selected, color.name)}
              onClick={() => onAnswer(c.name)}
            >
              {answered ? (
                // 答え合わせ：色見本 + テキスト
                <div className="flex items-center gap-2 text-left">
                  <div
                    className="h-8 w-8 flex-shrink-0 rounded-lg border border-black/10 shadow-inner"
                    style={{ backgroundColor: `rgb(${c.rgb.join(',')})` }}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{c.name}</div>
                    <div className="mt-0.5 truncate text-[10px] text-slate-400">{c.reading}</div>
                  </div>
                </div>
              ) : (
                // 回答前：テキストのみ中央寄せ
                <div className="text-center">
                  <div className="text-sm font-bold">{c.name}</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">{c.reading}</div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {answered && (
          <div
            className={`animate-slide-up mt-4 rounded-2xl border p-3.5 ${
              isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className={`mb-1 text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
              {isCorrect ? '✓ 正解！' : '✗ 不正解'}
            </div>
            <div className="text-sm font-semibold text-slate-700">
              正解：{color.name}（{color.reading}）
            </div>
            <div className="mt-0.5 text-xs leading-relaxed text-slate-500">{color.note}</div>
          </div>
        )}

        {/* Navigation */}
        {answered && (
          <div className="mt-4 flex justify-center">
            {idx < TOTAL - 1 ? (
              <button
                onClick={onNext}
                className="rounded-2xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all duration-150 hover:bg-indigo-700 active:scale-95"
              >
                次の問題へ →
              </button>
            ) : (
              <button
                onClick={onShowResult}
                className="rounded-2xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all duration-150 hover:bg-indigo-700 active:scale-95"
              >
                結果を見る →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ResultScreen({
  score,
  wrong,
  onRetry,
}: {
  score: number
  wrong: { color: ColorEntry; answer: string }[]
  onRetry: () => void
}) {
  const pct = score / TOTAL
  const [emoji, rank] =
    pct >= 0.9
      ? ['🏆', '色彩マスター！見事な正解率です']
      : pct >= 0.7
        ? ['⭐️', 'よくできました！もう少しで満点']
        : pct >= 0.5
          ? ['📖', 'まずまずです。繰り返し覚えましょう']
          : ['💪', 'これから練習していきましょう！']

  return (
    <div className="animate-slide-up rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
      <div className="mb-3 text-5xl">{emoji}</div>
      <h2 className="text-xl font-bold text-slate-700">クイズ完了！</h2>
      <p className="mt-1 mb-5 text-sm text-slate-400">{rank}</p>

      <div className="mb-6 flex items-end justify-center gap-1">
        <span className="text-6xl font-bold text-indigo-600">{score}</span>
        <span className="mb-1.5 text-2xl text-slate-300"> / 10</span>
      </div>

      {wrong.length > 0 && (
        <div className="mb-6 text-left">
          <p className="mb-2.5 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            間違えた色（復習）
          </p>
          <div className="space-y-2">
            {wrong.map(({ color, answer }) => (
              <div
                key={color.name}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-2.5"
              >
                <div
                  className="h-12 w-12 flex-shrink-0 rounded-xl border border-black/5"
                  style={{ backgroundColor: `rgb(${color.rgb.join(',')})` }}
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-slate-700">
                    {color.name}
                    <span className="ml-1 text-xs font-normal text-slate-400">（{color.reading}）</span>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">あなたの回答：{answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onRetry}
        className="w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-colors hover:bg-indigo-700"
      >
        もう一度挑戦する ↩
      </button>
    </div>
  )
}

// ──────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────

export default function ColorQuiz() {
  const [phase, setPhase] = useState<'quiz' | 'result'>('quiz')
  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions())
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [wrong, setWrong] = useState<{ color: ColorEntry; answer: string }[]>([])

  const handleAnswer = useCallback(
    (name: string) => {
      if (answered) return
      const correct = questions[idx].color.name
      setAnswered(true)
      setSelected(name)
      if (name === correct) {
        setScore(s => s + 1)
      } else {
        setWrong(w => [...w, { color: questions[idx].color, answer: name }])
      }
    },
    [answered, questions, idx],
  )

  const handleNext = useCallback(() => {
    setIdx(i => i + 1)
    setAnswered(false)
    setSelected(null)
  }, [])

  const handleRetry = useCallback(() => {
    setQuestions(buildQuestions())
    setIdx(0)
    setScore(0)
    setAnswered(false)
    setSelected(null)
    setWrong([])
    setPhase('quiz')
  }, [])

  if (phase === 'result') {
    return <ResultScreen score={score} wrong={wrong} onRetry={handleRetry} />
  }

  return (
    <QuizScreen
      question={questions[idx]}
      idx={idx}
      score={score}
      answered={answered}
      selected={selected}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onShowResult={() => setPhase('result')}
    />
  )
}
