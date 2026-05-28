export default function Navbar() {
  return (
    <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-white text-sm font-semibold">
          D
        </div>
        <span className="text-base font-medium text-[#e8e6e1] tracking-tight">200 DMA</span>
        <span className="badge bg-brand-red-bg text-brand-red-dark border border-brand-red/20">
          Bearish Screener
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-[#888780]">
        <span>World</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Live
        </span>
      </div>
    </nav>
  );
}
