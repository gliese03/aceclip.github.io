export default function Logo({ className = "" }) {
  const brandColor = "#60a5fa"; // Sky blue from the image

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Part */}
      <div className="relative w-9 h-9 flex items-center justify-center">
        {/* The Frame with corners */}
        <div 
          className="absolute inset-1.5 border-2 rounded-sm opacity-90"
          style={{ borderColor: brandColor }}
        ></div>
        
        {/* Corners */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: brandColor }}></div>
        <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: brandColor }}></div>
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: brandColor }}></div>
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: brandColor }}></div>
        
        {/* Center Diamond */}
        <div className="absolute w-3.5 h-3.5 rotate-45 shadow-sm" style={{ backgroundColor: brandColor }}></div>
      </div>
      
      {/* Text Part */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold tracking-tight leading-none" style={{ fontFamily: "'Inter', sans-serif", color: brandColor }}>
          AceClip
        </h1>
        <p className="text-[9px] text-text-muted font-medium tracking-[0.1em] uppercase mt-1">
          AI Interview Shorts
        </p>
      </div>
    </div>
  );
}
