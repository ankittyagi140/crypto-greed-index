interface LoaderProps {
  message?: string;
}

export default function Loader({ message = 'Loading...' }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center max-w-sm mx-4">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border-4 border-green-100 rounded-full"></div>
          {/* Spinning ring */}
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full absolute inset-0 animate-spin"></div>
        </div>
        <p className="mt-4 text-lg text-gray-700 font-medium text-center">
          {message}
        </p>
      </div>
    </div>
  );
} 