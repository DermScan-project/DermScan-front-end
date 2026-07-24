import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-[11px] font-medium tracking-wide uppercase text-ardoise">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "rounded-xl border border-ardoise/25 bg-white px-4 py-3 text-[15px] text-encre placeholder:text-ardoise/50 outline-none transition-colors",
            "focus:border-sauge focus:ring-2 focus:ring-sauge/15",
            error && "border-urgent focus:border-urgent focus:ring-urgent/15",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-urgent">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;