import ColorQuiz from '@/components/color-quiz'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-100 py-8 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-wide text-slate-700">慣用色名クイズ</h1>
          <p className="mt-0.5 text-xs text-slate-400">色彩検定2級 対策</p>
        </div>
        <ColorQuiz />
      </div>
    </main>
  )
}
