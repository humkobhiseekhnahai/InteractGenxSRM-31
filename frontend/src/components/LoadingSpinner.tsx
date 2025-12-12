
export default function LoadingSpinner({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="inline-block animate-spin">
      <svg viewBox="0 0 24 24" className="w-full h-full text-white" aria-hidden>
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
}