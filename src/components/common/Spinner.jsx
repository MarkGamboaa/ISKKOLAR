const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
};

const Spinner = ({ size = "md", className = "" }) => {
  return (
    <div
      className={`
        ${sizeClasses[size]}
        border-primary/20 border-t-primary rounded-full
        ${className}
      `}
      style={{ animation: "spin 0.6s linear infinite" }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Full page spinner 
export const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <Spinner size="lg" className="mx-auto mb-4" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

export default Spinner;
