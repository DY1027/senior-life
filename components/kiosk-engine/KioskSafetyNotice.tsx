export default function KioskSafetyNotice({
  message,
  additionalMessage,
  className = "",
}: {
  message: string;
  additionalMessage?: string;
  className?: string;
}) {
  return (
    <div
      role="note"
      aria-label="연습용 안전 안내"
      className={`rounded-2xl border-2 border-[#BBD9F5] bg-[#EAF3FC] px-4 py-3 text-left ${className}`}
    >
      <p className="break-keep text-[15px] font-extrabold leading-relaxed text-[#0C447C]">🛡️ {message}</p>
      {additionalMessage && (
        <p className="mt-1 break-keep text-[15px] font-bold leading-relaxed text-[#7C2D12]">⚠️ {additionalMessage}</p>
      )}
    </div>
  );
}
