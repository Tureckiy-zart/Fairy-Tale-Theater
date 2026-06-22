"use client";
// Field — labelled input / textarea primitive (presentational only).
// Spec: docs/core/DESIGN_SYSTEM.md §11 (form) + §13 (a11y). No submission /
// backend logic here — that is a page concern. States (helper/error/success)
// are driven by props; colour is never the sole signal (icon + text + colour).
import { useId } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { WarningCircle, CheckCircle } from "phosphor-react";
import { cx } from "./cx";

// Native input props passthrough (id/required/className are owned below).
type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "required" | "className">;

export interface FieldProps extends NativeInputProps {
  /** Always-visible label (§11) — never placeholder-only. */
  label: string;
  /** Used to build a stable, unique id linking label ↔ control ↔ message. */
  name: string;
  /** Neutral hint shown when there is no error/success. */
  helper?: string;
  /** Error message — sets the error state (border + icon + text). */
  error?: string;
  /** Success message — sets the success state (tint + check + text). */
  success?: string;
  /** Marks the field required; rendered as the word "(required)" per §11. */
  required?: boolean;
  /** Render a <textarea> instead of <input>. */
  multiline?: boolean;
  /** Textarea row count (multiline only). */
  rows?: number;
  /** Class for the field wrapper. */
  className?: string;
}

export function Field({
  label,
  name,
  helper,
  error,
  success,
  required = false,
  multiline = false,
  rows = 4,
  className,
  ...native
}: FieldProps) {
  const uid = useId();
  const id = `field-${name}-${uid}`;
  const descId = `${id}-desc`;

  const status: "error" | "success" | undefined = error ? "error" : success ? "success" : undefined;
  const message = error ?? success ?? helper;

  // §11: white fill, border-strong (≥3:1) 1.5px, radius-md, min-h 48px, pad 12–16.
  const control = cx(
    "w-full rounded-md border-[1.5px] border-border-strong bg-white px-4 py-3",
    "font-body text-base text-ink placeholder:text-ink-muted",
    "focus-visible:border-forest-600", // ring (forest-700 3px + 2px) comes from global :focus-visible
    status === "error" && "border-error",
    status === "success" && "border-success bg-success-bg",
    !multiline && "min-h-12",
    !multiline && status && "pr-11", // room for the trailing status icon
  );

  const shared = {
    id,
    name,
    required,
    "aria-required": required || undefined,
    "aria-invalid": status === "error" ? true : undefined,
    "aria-describedby": message ? descId : undefined,
    className: control,
  } as const;

  return (
    <div className={cx("flex flex-col", className)}>
      <label htmlFor={id} className="mb-1.5 font-body text-sm font-semibold text-ink">
        {label}
        {required ? <span className="font-normal text-ink-soft"> (required)</span> : null}
      </label>

      <div className="relative">
        {multiline ? (
          <textarea
            rows={rows}
            {...(native as unknown as Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "required" | "className">)}
            {...shared}
          />
        ) : (
          <>
            <input {...native} {...shared} />
            {status ? (
              <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                {status === "error" ? (
                  <WarningCircle size={20} className="text-error" />
                ) : (
                  <CheckCircle size={20} className="text-success" />
                )}
              </span>
            ) : null}
          </>
        )}
      </div>

      {message ? (
        <p
          id={descId}
          {...(status === "error" ? { role: "alert" as const } : {})}
          className={cx(
            "mt-1.5 flex items-start gap-1.5 text-sm",
            status === "error" ? "text-error-text" : status === "success" ? "text-success-text" : "text-ink-soft",
          )}
        >
          {status === "error" ? <WarningCircle size={16} aria-hidden className="mt-0.5 shrink-0" /> : null}
          {status === "success" ? <CheckCircle size={16} aria-hidden className="mt-0.5 shrink-0" /> : null}
          <span>{message}</span>
        </p>
      ) : null}
    </div>
  );
}
