export default function Loader({ progress }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-8 h-8 border-2 border-white/10 border-t-brand-red rounded-full animate-spin" />
      <p className="text-sm text-[#888780]">
        Fetching live prices & calculating 200 DMA…
      </p>
      <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-red rounded-full transition-all duration-300"
          style={{ width: progress + "%" }}
        />
      </div>
      <p className="text-xs text-[#5F5E5A]">{progress}% complete</p>
    </div>
  );
}
