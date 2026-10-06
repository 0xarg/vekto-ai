import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * There is no `tone` prop. Every color here resolves through a token that the
 * `[data-tone="inverse"]` block in globals.css reassigns, so a button inside a
 * dark band re-themes itself and the caller never has to know which surface it
 * landed on. That prop used to be mandatory on dark bands and silently wrong
 * when forgotten, which is the failure this removes.
 *
 * `primary` is the indigo, carrying white, and it is the one control on the
 * site with a gradient on it — see `.control-gloss` in globals.css for why that
 * is allowed and what keeps it honest. The short version: the ramp is measured
 * at the stop that is worst for the text sitting on it, exactly as the two
 * auras are, so the gloss cannot be pushed to the point where the label stops
 * clearing AA without `pnpm contrast` failing first.
 *
 * This docblock used to describe clay and near-black text, and the reasoning
 * was sound for that colour: clay measured 3.28:1 under white and could only
 * carry dark ink. Both the colour and the constraint are gone — the indigo
 * measures 7.90:1 under white — and the dark-on-accent rule must not come back
 * with some later palette by inertia.
 *
 * `secondary` and `ghost` stay flat. A gradient on every control states
 * nothing; a gradient on one states which action the band is for.
 *
 * Labels wrap, and the sizes are `min-h-*` rather than fixed heights. The base
 * carried `whitespace-nowrap` for a while, which is harmless until a caller
 * sets `w-full` — `CtaBand` and `EngagementModels` both do — and the label is
 * the 26-character "Get a Migration Assessment". At 320px that label was wider
 * than the panel holding it, and since `Card` is `overflow-hidden` it was
 * clipped rather than merely overflowing. A minimum height means a second line
 * grows the control instead of spilling out of a fixed box.
 */
const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-center font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "control-gloss bg-accent-fill text-accent-ink border-accent-fill hover:border-accent-fill-hover border",
        secondary:
          "bg-surface text-ink border-rule-strong hover:border-ink hover:bg-surface-2 border shadow-card",
        ghost:
          "text-ink hover:bg-surface-2 hover:border-rule border border-transparent",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "min-h-9 px-3.5 py-2 text-sm",
        md: "min-h-11 px-5 py-2.5 text-[0.9375rem]",
        lg: "min-h-12 px-6 py-3 text-base",
      },
    },
    compoundVariants: [
      /* `link` is text, not a control: it takes no button box. This has to sit
         in compoundVariants so it resolves after the `size` classes — as a
         plain variant its reset lost to the `min-h-*` steps and the link
         silently rendered at button height. */
      {
        variant: "link",
        class: "min-h-0 rounded-sm p-0 shadow-none active:scale-100",
      },
    ],
    defaultVariants: { variant: "primary", size: "md" },
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
  className,
  children,
}: ButtonProps & { href: string }) {
  const external = href.startsWith("http");
  const classes = cn(button({ variant, size }), className);

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
  className,
  children,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(button({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
}
