/* Line icons in the style of a streaming app. All 24×24, currentColor. */
type P = { className?: string };
const base = (className = "h-6 w-6") => ({
  className,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
});

export const Play = ({ className }: P) => (
  <svg {...base(className)} fill="currentColor">
    <path d="M5 2.7a1 1 0 0 1 1.5-.86l15.6 9.3a1 1 0 0 1 0 1.72L6.5 22.16A1 1 0 0 1 5 21.3z" />
  </svg>
);
export const Pause = ({ className }: P) => (
  <svg {...base(className)} fill="currentColor">
    <rect x="4.5" y="3" width="5" height="18" rx="1" />
    <rect x="14.5" y="3" width="5" height="18" rx="1" />
  </svg>
);
export const Info = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 11v6M12 7v.5" strokeLinecap="round" />
  </svg>
);
export const Plus = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M12 4v16M4 12h16" />
  </svg>
);
export const Check = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);
export const ThumbUp = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
    <path d="M7 10v11H3V10zM7 10l4.2-7.5a2 2 0 0 1 3.6 1.5L14 9h5.6a2 2 0 0 1 2 2.4l-1.6 8A2 2 0 0 1 18 21H7" />
  </svg>
);
export const ChevronDown = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5.5 9 6.5 6.5L18.5 9" />
  </svg>
);
export const ChevronRight = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 5 7 7-7 7" />
  </svg>
);
export const ChevronLeft = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 5-7 7 7 7" />
  </svg>
);
export const Close = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Back = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12H4m7-7-7 7 7 7" />
  </svg>
);
export const Bell = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
    <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20.5a2 2 0 0 0 4 0" />
  </svg>
);
export const Mail = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6 8.5 7 8.5-7" />
  </svg>
);
export const Social = ({ label, className }: P & { label: string }) => {
  const k = label.toLowerCase();
  if (k.includes("linkedin"))
    return (
      <svg {...base(className)} fill="currentColor">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.93c0-1.18-.02-2.7-1.64-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4z" />
      </svg>
    );
  if (k.includes("github"))
    return (
      <svg {...base(className)} fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
      </svg>
    );
  if (k.includes("instagram"))
    return (
      <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
      </svg>
    );
  if (k.includes("youtube"))
    return (
      <svg {...base(className)} fill="currentColor">
        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z" />
      </svg>
    );
  if (k === "x" || k.includes("twitter"))
    return (
      <svg {...base(className)} fill="currentColor">
        <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.36 5.77zm-1.08 16.2h1.7L7.4 4.73H5.58z" />
      </svg>
    );
  return <Mail className={className} />;
};
