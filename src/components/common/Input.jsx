const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  disabled = false,
  required = false,
  icon,
  className = "",
  readOnly = false,
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          className={`
            w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900
            placeholder-gray-400 transition-all duration-200
            focus:outline-none focus:ring-2 focus:border-transparent
            ${icon ? "pl-10" : ""}
            ${readOnly ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
            ${
              error
                ? "border-danger focus:ring-danger/30"
                : "border-gray-300 focus:ring-primary/30 focus:border-primary"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-danger flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
