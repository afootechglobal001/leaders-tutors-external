interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  frontIcon?: React.ReactNode;
  backIcon?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  size?: "sm" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  text,
  frontIcon,
  className,
  backIcon,
  disabled,
  variant = "primary",
  fullWidth = false,
  isLoading,
  size = "lg",
  ...rest
}) => {
  const isDisabled = disabled || isLoading;
  const baseClasses =
    "flex inline-flex items-center justify-center p-5 gap-2 font-medium-custom transition-all duration-200 hover:bg-[length:200%_100%] hover:bg-right hover:scale-105";

  const currentSize =
    size === "sm"
      ? "h-[35px] text-sm gap-1.5 hover:gap-4 rounded-[7px]"
      : "h-[55px] text-[15px] gap-2 hover:gap-5 rounded-[10px]"; // lg default

  // ✅ Backgrounds with darker hover states
  const buttonStyles =
    variant === "primary"
      ? "bg-gradient-to-r from-[var(--primary-hover-color)] to-[var(--secondary-hover-color)] bg-left transition-[background-position,transform] duration-400 ease-in-out transform text-white"
      : variant === "secondary"
        ? "bg-gray-200 hover:bg-gray-600 text-black hover:text-white"
        : "bg-red-500 hover:bg-red-700 text-white";

  const disabledStyles = isDisabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "cursor-pointer transform transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.97]";

  if (isLoading) {
    return (
      <button
        disabled
        className={`flex justify-center items-center  ${currentSize}  ${
          fullWidth ? "w-full" : ""
        } bg-gray-200 cursor-not-allowed`}
      >
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
      </button>
    );
  }

  return (
    <button
      title={text}
      disabled={isDisabled}
      className={`${baseClasses} ${currentSize} ${buttonStyles} ${
        fullWidth ? "w-full" : ""
      } ${disabledStyles} ${className}`}
      {...rest}
    >
      {backIcon && <span className="flex items-center">{backIcon}</span>}
      <span>{text}</span>
      {frontIcon && <span className="flex items-center">{frontIcon}</span>}
    </button>
  );
};
