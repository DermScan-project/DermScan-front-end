import { clsx } from "clsx";

interface Rule {
  label: string;
  test: (pw: string) => boolean;
}

const RULES: Rule[] = [
  { label: "8 caractères minimum", test: (pw) => pw.length >= 8 },
  { label: "Une majuscule", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Un chiffre", test: (pw) => /\d/.test(pw) },
  { label: "Un caractère spécial", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export function isPasswordStrong(pw: string) {
  return RULES.every((r) => r.test(pw));
}

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const passedCount = RULES.filter((r) => r.test(password)).length;
  const barColor =
    passedCount <= 1 ? "bg-urgent" : passedCount <= 3 ? "bg-modere" : "bg-faible";

  return (
    <div className="flex flex-col gap-2 -mt-1">
      <div className="flex  gap-1">
        {RULES.map((_, i) => (
          <div
            key={i}
            className={clsx(
              "h-1 flex-1 rounded-full transition-colors",
              i < passedCount ? barColor : "bg-ardoise/15"
            )}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1">
        {RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <li key={rule.label} className={clsx("flex items-center gap-1.5 text-[11px]", passed ? "text-faible" : "text-ardoise/70")}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {passed ? (
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
                )}
              </svg>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}