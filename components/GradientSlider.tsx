"use client";
import React from "react";

interface GradientSliderProps {
  icon: string;              // path ke PNG ikon
  value: number;             // nilai saat ini
  setValue: (val: number) => void; // setter
  gradient: string;          // warna gradien kiri
  min?: number;              // nilai minimum (opsional)
  max?: number;              // nilai maksimum (opsional)
  unit?: string;             // misalnya °C (opsional)
  labelFunc?: (val: number) => string; // custom label
}

const GradientSlider: React.FC<GradientSliderProps> = ({
  icon,
  value,
  setValue,
  gradient,
  min = 0,
  max = 100,
  unit = "",
  labelFunc,
}) => {
  const percent = ((value - min) / (max - min)) * 100;
  const gradientLeft = `${percent}%`;
  const backgroundStyle = `linear-gradient(to right, ${gradient} ${gradientLeft}, #fff ${gradientLeft})`;

  return (
    <div className="w-full relative h-12">
      {/* Nilai / Label di atas slider */}
      <div className="text-white font-bold mb-1">
        {labelFunc ? labelFunc(value) : `${value}${unit}`}
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-3 rounded-full appearance-none bg-transparent"
        style={{ background: backgroundStyle }}
      />

      {/* Thumb Custom */}
      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 40px;
          width: 40px;
          background: url(${icon}) no-repeat center;
          background-size: contain;
          border: none;
          margin-top: -18px;
          cursor: pointer;
        }

        input[type='range']::-moz-range-thumb {
          height: 40px;
          width: 40px;
          background: url(${icon}) no-repeat center;
          background-size: contain;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default GradientSlider;
