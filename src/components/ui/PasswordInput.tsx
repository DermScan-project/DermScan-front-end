import { InputHTMLAttributes, forwardRef, useState } from "react";
import { clsx } from "clsx";
import { EyeIcon, EyeOffIcon } from "./icons";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-[11px] font-medium tracking-wide uppercase text-ardoise">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            className={clsx(
              "w-full rounded-xl border border-ardoise/25 bg-white px-4 py-3 pr-11 text-[15px] text-encre placeholder:text-ardoise/50 outline-none transition-colors",
              "focus:border-sauge focus:ring-2 focus:ring-sauge/15",
              error && "border-urgent focus:border-urgent focus:ring-urgent/15",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ardoise/60 hover:text-ardoise"
            tabIndex={-1}
          >
            {visible ? EyeOffIcon : EyeIcon}
          </button>
        </div>
        {error && <span className="text-xs text-urgent">{error}</span>}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export default PasswordInput;