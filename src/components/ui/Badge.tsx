import React from 'react';

type BadgeVariant =
  | 'success' |'error' |'warning' |'info' |'neutral' |'accent' |'primary';

interface BadgeProps {
  label?: string;
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-positive/10 text-positive border-positive/20',
  error: 'bg-negative/10 text-negative border-negative/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  info: 'bg-info/10 text-info border-info/20',
  neutral: 'bg-muted text-muted-foreground border-border',
  accent: 'bg-accent/10 text-accent border-accent/20',
  primary: 'bg-primary/10 text-primary border-primary/20',
};

const dotClasses: Record<BadgeVariant, string> = {
  success: 'bg-positive',
  error: 'bg-negative',
  warning: 'bg-warning',
  info: 'bg-info',
  neutral: 'bg-muted-foreground',
  accent: 'bg-accent',
  primary: 'bg-primary',
};

export default function Badge({
  label,
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${variantClasses[variant]} ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses[variant]}`}
        />
      )}
      {children ?? label}
    </span>
  );
}