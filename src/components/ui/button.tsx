import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * `tone="inverse"` is required on `--inverse` surfaces, not cosmetic: the accent
 * measures 2.15:1 against the dark band, so a navy fill there is below the 3:1
 * WCAG 1.4.11 floor for a control's own boundary — the button stops reading as
 * a shape at all. On dark the primary inverts to a light fill (17.22:1), which
 * is both legible and the stronger hierarchy.
 */
const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border",
        secondary: "border",
        ghost: "border border-transparent",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-[0.9375rem]",
        lg: "h-12 px-6 text-base",
      },
      tone: {
        default: "",
        inverse: "",
      },
    },
    compoundVariants: [
      /* ---- on light surfaces ------------------------------------------- */
      {
        variant: "primary",
        tone: "default",
        class:
          "bg-accent text-accent-ink border-accent hover:bg-accent-hover hover:border-accent-hover",
      },
      {
        variant: "secondary",
        tone: "default",
        class:
          "bg-surface text-ink border-rule-strong hover:border-ink hover:bg-surface-2",
      },
      {
        variant: "ghost",
        tone: "default",
        class: "text-ink hover:bg-surface-2 hover:border-rule",
      },
      { variant: "link", tone: "default", class: "text-accent" },

      /* ---- on --inverse ------------------------------------------------- */
      {
        variant: "primary",
        tone: "inverse",
        class:
          "bg-ground text-inverse border-ground hover:bg-white hover:border-white",
      },
      {
        variant: "secondary",
        tone: "inverse",
        class:
          "text-ink-inverse border-ink-inverse-faint hover:border-ink-inverse hover:bg-white/5 bg-transparent",
      },
      {
        variant: "ghost",
        tone: "inverse",
        class: "text-ink-inverse-muted hover:text-ink-inverse hover:bg-white/5",
      },
      { variant: "link", tone: "inverse", class: "text-accent-on-dark" },

      /* `link` is text, not a control: it takes no button box. This has to sit
         in compoundVariants so it resolves after the `size` classes — as a
         plain variant its `h-auto` lost to `h-9`/`h-11`/`h-12` and the link
         silently rendered at button height. */
      { variant: "link", class: "h-auto p-0" },
    ],
    defaultVariants: { variant: "primary", size: "md", tone: "default" },
  },
);

type ButtonProps = VariantProps<typeof button> & {
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({
  href,
  variant,
  size,
  tone,
  className,
  children,
}: ButtonProps & { href: string }) {
  const external = href.startsWith("http");
  const classes = cn(button({ variant, size, tone }), className);

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        rel="noreferrer noopener"
        target="_blank"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function Button({
  variant,
  size,
  tone,
  className,
  children,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(button({ variant, size, tone }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
