// components/WireGlowWaves.tsx
export default function WireGlowWaves() {
  return (
    <div className="wire-waves">
      {/* Static fog base */}
      <div className="static-fog"></div>
      
      {/* Glowing wire lines */}
      <div className="wire-line wire-1"></div>
      <div className="wire-line wire-2"></div>
      <div className="wire-line wire-3"></div>
      <div className="wire-line wire-4"></div>
      <div className="wire-line wire-5"></div>
      
      {/* Moving fog waves */}
      <div className="fog-layer fog-1"></div>
      <div className="fog-layer fog-2"></div>
      <div className="fog-layer fog-3"></div>
    </div>
  );
}