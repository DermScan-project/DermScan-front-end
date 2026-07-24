import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sauge",
          {
            "bg-sauge text-white hover:bg-sauge/90": variant === "primary",
            "bg-sauge-clair text-sauge hover:bg-sauge-clair/70": variant === "secondary",
            "bg-transparent text-encre hover:bg-sauge-clair/50": variant === "ghost",
            "bg-urgent text-white hover:bg-urgent/90": variant === "danger",
          },
          {
            "text-sm px-3 py-1.5": size === "sm",
            "text-sm px-4 py-2.5": size === "md",
            "text-base px-6 py-3.5": size === "lg",
          },
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);

export default Button;