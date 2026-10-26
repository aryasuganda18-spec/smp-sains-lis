import type { ComponentType, SVGProps } from 'react';
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from '@/components/icons';
import { SOCIAL_LINKS } from '@/data/site';

const SOCIAL_ICONS: Record<(typeof SOCIAL_LINKS)[number]['id'], ComponentType<SVGProps<SVGSVGElement>>> = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
};

interface SocialLinksProps {
  className: string;
  buttonClassName?: string;
}

export function SocialLinks({ className, buttonClassName = 'icon-button' }: SocialLinksProps) {
  return (
    <div className={className}>
      {SOCIAL_LINKS.map((link) => {
        const Icon = SOCIAL_ICONS[link.id];
        return (
          <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label} className={buttonClassName}>
            <Icon />
          </a>
        );
      })}
    </div>
  );
}
