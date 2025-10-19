export default function Page() {
  return (
    <div className="m-8 border p-8 shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]">
      <div className="flex flex-row items-stretch border border-blue-500">
        <div className="flex flex-1 items-center border border-red-500">
          This is some text that can wrap and make the row taller. This is some
          text that can wrap and make the row taller.
        </div>

        <div className="flex items-center border  border-red-500">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="10" cy="10" r="8" />
          </svg>
        </div>

        <div className="flex items-center border border-red-500">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <rect x="4" y="4" width="12" height="12" />
          </svg>
        </div>
      </div>

      <div className="p-4 shadow-[10px_10px_rgba(0,98,90,0.3)]">
        <p>ASD</p>
      </div>
    </div>
  );
}
