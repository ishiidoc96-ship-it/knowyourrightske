import { Video, Youtube, Instagram, Facebook, Link2 } from 'lucide-react';

interface SocialIconProps {
  platform: string;
  size?: number;
  className?: string;
}

export default function SocialIcon({ platform, size = 20, className = "" }: SocialIconProps) {
  // We use specific colors or just inherit the color passed in via className
  const defaultClassName = className || "text-gold";

  switch (platform.toLowerCase()) {
    case 'youtube':
      return <Youtube size={size} className={defaultClassName} />;
    case 'instagram':
      return <Instagram size={size} className={defaultClassName} />;
    case 'facebook':
      return <Facebook size={size} className={defaultClassName} />;
    case 'tiktok':
      // Since Lucide doesn't have a TikTok icon, we use a generic Video icon or custom SVG
      // But let's use a stylized Video icon for TikTok
      return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={defaultClassName}
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );
    case 'podcast':
      return (
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={defaultClassName}
        >
          <circle cx="12" cy="11" r="3" />
          <path d="M5 11a7 7 0 0 1 14 0" />
          <path d="M12 21v-3" />
          <path d="M8 21h8" />
        </svg>
      );
    default:
      return <Link2 size={size} className={defaultClassName} />;
  }
}
