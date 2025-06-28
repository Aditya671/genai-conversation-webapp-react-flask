import React from "react";

const VolumeFullFilledSVG: React.FC = () => (
    <svg height="18" id="speaker-volume" viewBox="0 0 32 32" width="24" xmlns="http://www.w3.org/2000/svg">
        <style>
      {`
        #speaker-volume path {
          fill: #000;
        }

        .waves {
          animation: wavePulse 1.2s infinite ease-in-out;
          transform-origin: center;
        }

        .wave2 { animation-delay: 0.2s; }
        .wave3 { animation-delay: 0.4s; }

        @keyframes wavePulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}
    </style>
        <path className="waves wave1" d="M32 16 A16 16 0 0 1 27.5 27.5 L24.5 24.5 A12 12 0 0 0 28 16 A12 12 0 0 0 24.5 7.5 L27.5 4.5 A16 16 0 0 1 32 16" />
    <path className="waves wave2" d="M25 16 A8 8 0 0 1 22 22 L19.5 19.5 A4 4 0 0 0 21 16 A4 4 0 0 0 19.5 12.5 L22 10 A8 8 0 0 1 25 16" />
  
    </svg>
);

export default VolumeFullFilledSVG;
