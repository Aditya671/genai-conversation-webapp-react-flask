import React from "react";

const SpeechToTextFilledSVG: React.FC = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <style>{`
    .mic {
      animation: pulse 1.2s infinite ease-in-out;
      transform-origin: center;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.7; }
      50% { transform: scale(1.15); opacity: 1; }
    }

    .line1, .line2, .line3 {
      animation: typeBlink 1.5s steps(1, start) infinite;
    }
    .line2 { animation-delay: 0.2s; }
    .line3 { animation-delay: 0.4s; }

    @keyframes typeBlink {
      0%, 49% { opacity: 0; }
      50%, 100% { opacity: 1; }
    }
  `}</style>

        <g className="mic">
            <rect x="6" y="12" width="6" height="16" rx="3" fill="#000" />
            <rect x="7" y="28" width="4" height="2" rx="1" fill="#000" />
            <rect x="5" y="30" width="8" height="2" rx="1" fill="#000" />
        </g>

        <path d="M15 10 h24 a2 2 0 0 1 2 2 v14 a2 2 0 0 1 -2 2 h-18 l-6 4v-4 h-0.5 a1.5 1.5 0 0 1 -1.5 -1.5 v-14 a1.5 1.5 0 0 1 1.5 -1.5 z" fill="none" stroke="#000" strokeWidth="2" />

        <line className="line1" x1="18" y1="16" x2="34" y2="16" stroke="#000" strokeWidth="2" />
        <line className="line2" x1="18" y1="20" x2="32" y2="20" stroke="#000" strokeWidth="2" />
        <line className="line3" x1="18" y1="24" x2="30" y2="24" stroke="#000" strokeWidth="2" />
    </svg>
);

export default SpeechToTextFilledSVG;
