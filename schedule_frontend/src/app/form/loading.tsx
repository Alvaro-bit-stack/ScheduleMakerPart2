export default function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-screen 
                    bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
    >
      <div
        className="flex flex-col items-center justify-center 
                   backdrop-blur-lg bg-white/20 border border-white/30 
                   shadow-2xl rounded-2xl p-10"
      >
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />

        {/* Loading Text */}
        <p className="mt-6 text-lg font-medium text-white/90 tracking-wide drop-shadow">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
