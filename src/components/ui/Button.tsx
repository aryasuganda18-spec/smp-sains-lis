import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'gold' | 'outline' | 'ghost' | 'danger';

interface ButtonStyleProps {
  variant?: Variant;
  size?: 'md' | 'lg' | 'sm';
  block?: boolean;
  icon?: LucideIcon;
  className?: string;
  children: ReactNode;
}

function buttonClass({ variant = 'primary', size = 'md', block, className }: ButtonStyleProps): string {
  return ['button', `button--${variant}`, `button--${size}`, block && 'button--block', className]
    .filter(Boolean)
    .join(' ');
}

export function Button({
  variant,
  size,
  block,
  icon: Icon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClass({ variant, size, block, className, children })} {...rest}>
      {Icon && <Icon size={18} aria-hidden="true" />}
      {children}
    </button>
  );
}

type ButtonLinkProps = ButtonStyleProps & ({ to: string; href?: never } | { href: string; to?: never }) & {
  onClick?: () => void;
};

export function ButtonLink({ variant, size, block, icon: Icon, className, children, to, href, onClick }: ButtonLinkProps) {
  const classes = buttonClass({ variant, size, block, className, children });
  const content = (
    <>
      {Icon && <Icon size={18} aria-hidden="true" />}
      {children}
    </>
  );

  if (to !== undefined) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  const isWeb = /^https?:/i.test(href);
  return (
    <a
      href={href}
      className={classes}
      onClick={onClick}
      {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  );
}
