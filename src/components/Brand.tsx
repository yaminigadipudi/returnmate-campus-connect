import logo from "@/assets/iare-logo.png";

interface BrandProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "light" | "dark";
}

const sizeMap = {
  sm: { logo: "h-8 w-8", title: "text-base", sub: "text-[10px]" },
  md: { logo: "h-10 w-10", title: "text-lg", sub: "text-xs" },
  lg: { logo: "h-16 w-16", title: "text-2xl", sub: "text-sm" },
  xl: { logo: "h-24 w-24", title: "text-3xl", sub: "text-sm" },
};

export function Brand({ size = "md", showText = true, variant = "dark" }: BrandProps) {
  const s = sizeMap[size];
  const titleColor = variant === "light" ? "text-white" : "text-foreground";
  const subColor = variant === "light" ? "text-white/70" : "text-muted-foreground";

  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="IARE — Institute of Aeronautical Engineering"
        className={`${s.logo} object-contain drop-shadow-sm`}
      />
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-display font-bold tracking-tight ${s.title} ${titleColor}`}>
            ReturnMate
          </span>
          <span className={`font-medium ${s.sub} ${subColor}`}>
            Lost &amp; Found · IARE
          </span>
        </div>
      )}
    </div>
  );
}
