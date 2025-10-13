export default function Page() {
  return (
    <div className="m-80">
      <div className="flex flex-row items-stretch border border-blue-500">
        <div className="flex flex-1 items-center border border-red-500">
          This is some text that can wrap and make the row taller. This is some text that can wrap and make the row taller.
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
    </div>
  );
}
