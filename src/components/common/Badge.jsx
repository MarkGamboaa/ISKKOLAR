const variantClasses = {
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-yellow-700",
  danger: "bg-danger-light text-danger",
  info: "bg-info-light text-info",
  default: "bg-gray-100 text-gray-600",
};

const Badge = ({ variant = "default", label, className = "" }) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {label}
    </span>
  );
};

export default Badge;
