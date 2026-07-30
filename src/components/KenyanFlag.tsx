interface KenyanFlagProps {
  size?: number;
  className?: string;
}

export default function KenyanFlag({ size = 20, className = "" }: KenyanFlagProps) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 30 18"
      className={className}
      aria-label="Kenyan Flag"
    >
      <rect width="30" height="18" fill="#000" />
      <rect y="4" width="30" height="10" fill="#BB0000" />
      <rect y="6" width="30" height="6" fill="#fff" />
      <rect y="7" width="30" height="4" fill="#006600" />
      <g transform="translate(15,9)">
        <path d="M-4,-6 L4,-6 L4,6 L-4,6 Z" fill="#000" opacity="0.9" />
        <path d="M0,-7 L1,-4 L1,4 L0,7 L-1,4 L-1,-4 Z" fill="#8B4513" />
        <rect x="-2" y="-1" width="4" height="2" fill="#888" />
        <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#888" strokeWidth="0.5" />
        <line x1="-4" y1="4" x2="4" y2="4" stroke="#888" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
