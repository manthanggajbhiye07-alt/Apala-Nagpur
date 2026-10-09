import type { ReactNode } from 'react';
import { CheckCircle2, Clock, XCircle, HelpCircle } from 'lucide-react';

type BadgeVariant = 'default' | 'teal' | 'lime' | 'warning' | 'error' | 'success' | 'info' | 'neutral';

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-sand-100 text-sand-700 border-sand-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
  lime: 'bg-lime-50 text-lime-700 border-lime-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  neutral: 'bg-ink-100 text-ink-700 border-ink-200',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
}

export function Badge({ children, variant = 'default', icon, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${VARIANTS[variant]} ${className}`}>
      {icon}
      {children}
    </span>
  );
}

const STATUS_META = {
  pending: { label: 'Pending Review', variant: 'warning' as BadgeVariant, icon: <Clock className="w-3.5 h-3.5" /> },
  verified: { label: 'Verified', variant: 'success' as BadgeVariant, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected: { label: 'Rejected', variant: 'error' as BadgeVariant, icon: <XCircle className="w-3.5 h-3.5" /> },
  unknown: { label: 'Unknown', variant: 'neutral' as BadgeVariant, icon: <HelpCircle className="w-3.5 h-3.5" /> },
};

export function StatusBadge({ status }: { status: keyof typeof STATUS_META }) {
  const m = STATUS_META[status];
  return <Badge variant={m.variant} icon={m.icon}>{m.label}</Badge>;
}
