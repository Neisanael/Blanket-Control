"use client";

import React, { useState } from "react";
import GradientSlider from "@/components/GradientSlider"; // sesuaikan path
import Image from "next/image";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface GaugeProps {
  label: string;
  value: number;
  max: number;
}

const Gauge: React.FC<GaugeProps> = ({ label, value, max }) => {
  const angle = Math.min((value / max) * 180, 180);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-14">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <path
              d="M10 100 A90 90 0 0 1 190 100"
              fill="none"
              stroke="gray"
              strokeWidth="20"
            />
            <path
              d="M10 100 A90 90 0 0 1 190 100"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="18"
            />
            <defs>
              <linearGradient id="grad">
                <stop offset="0%" stopColor="green" />
                <stop offset="50%" stopColor="yellow" />
                <stop offset="100%" stopColor="red" />
              </linearGradient>
            </defs>
            <line
              x1="100"
              y1="100"
              x2={100 + 80 * Math.cos((Math.PI * (180 - angle)) / 180)}
              y2={100 - 80 * Math.sin((Math.PI * (180 - angle)) / 180)}
              stroke="black"
              strokeWidth="4"
            />
          </svg>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white font-bold">
          {value}°C
        </div>
      </div>
      <p className="mt-1 text-center text-sm">{label}</p>
    </div>
  );
};

const chartData = {
  labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
  datasets: [
    {
      label: "Blanket Average Temperature (°C)",
      data: [30, 35, 37, 38, 38.5, 39, 39.5, 40],
      borderColor: "#3B82F6",
      backgroundColor: "rgba(59,130,246,0.2)",
      tension: 0.4,
    },
    {
      label: "Body Temperature (°C)",
      data: [36, 36, 36, 36, 36, 36, 36, 36],
      borderColor: "#F97316",
      backgroundColor: "rgba(249,115,22,0.2)",
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 30,
      max: 45,
      title: {
        display: true,
        text: "Temperature (°C)",
      },
    },
    x: {
      title: {
        display: true,
        text: "Time (every 5 minutes)",
      },
    },
  },
};

export default function Home() {
  const [windPosition, setWindPosition] = useState(50);
  const [firePosition, setFirePosition] = useState(50);

  const [isOn, setIsOn] = useState(true);

  const handleToggle = () => {
    setIsOn((prev) => !prev);
  };

  const getBlowerSpeed = (value: number) => {
    if (value < 34) return "LOW";
    if (value < 67) return "MEDIUM";
    return "HIGH";
  };

  return (
    <div className="min-h-screen bg-red-900 text-white font-sans p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-lg font-bold">Status:</p>
          <p className="text-xl">Kendali dan Monitoring Aplikasi</p>
          <p className="text-xl">Monitoring Web</p>
          <p className="text-xl">Monitoring Alat</p>
        </div>
        <div className="flex items-center justify-center mt-2">
          <button
            onClick={handleToggle}
            className={`flex items-center justify-between w-24 px-3 py-1 rounded-full transition-colors duration-300 ${
              isOn ? "bg-gray-800" : "bg-gray-800"
            }`}
          >
            {isOn ? (
              <>
                <span className="text-white font-semibold">ON</span>
                <div className="w-4 h-4 bg-green-500 rounded-full" />
              </>
            ) : (
              <>
                <div className="w-4 h-4 bg-red-600 rounded-full" />
                <span className="text-white font-semibold">OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      <h1 className="text-center text-3xl font-bold mb-8">Blanket warmer 01</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KENDALI */}
        <div className="bg-red-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">KENDALI</h2>
          <div className="mb-8">
            <p className="text-lg">Kecepatan Blower:</p>
            <GradientSlider
              icon="/wind.png"
              value={windPosition}
              setValue={setWindPosition}
              gradient="lightblue, dodgerblue"
              labelFunc={(val) =>
                val >= 66 ? "HIGH" : val >= 33 ? "MEDIUM" : "LOW"
              }
            />
          </div>
          <div>
            <p className="text-lg">Suhu Setpoint Selimut</p>
            <GradientSlider
              icon="/fire.png"
              value={firePosition}
              setValue={setFirePosition}
              gradient="orange, red"
              min={36}
              max={40}
              unit="°C"
            />
          </div>
        </div>

        {/* MONITORING */}
        <div className="bg-red-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">MONITORING</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Gauge label="Suhu Rata-Rata Selimut" value={37} max={60} />
            <Gauge label="Suhu Pemanas" value={50} max={60} />
            <Gauge label="Suhu Tubuh" value={36} max={60} />
          </div>

          <div>
            <p className="text-center text-sm mb-2">
              {getBlowerSpeed(windPosition)} SPEED, BLANKET SETPOINT {firePosition}°C
            </p>
            <div className="bg-white h-60 rounded-md p-4">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
