import React from "react";

const TextToSpeechFilledSVG: React.FC = () => (
    <svg width="18" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <style>{`
        .wave {
            fill: none;
            stroke: black;
            stroke-width: 1.5;
            animation: ringPulse 1.4s ease-in-out infinite;
            transform-origin: center;
            }
            .wave2 {
            animation-delay: 0.2s;
            }
            .wave3 {
            animation-delay: 0.4s;
            }
            @keyframes ringPulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.15); }
            }
        `}</style>
        <rect x="3" y="4" width="16" height="24" rx="2" ry="2" fill="none" stroke="#000" strokeWidth="2"/>
        <line x1="5" y1="8" x2="17" y2="8" stroke="#000" strokeWidth="1.2"/>
        <line x1="5" y1="12" x2="17" y2="12" stroke="#000" strokeWidth="1.2"/>
        <line x1="5" y1="16" x2="17" y2="16" stroke="#000" strokeWidth="1.2"/>
        <line x1="5" y1="20" x2="13" y2="20" stroke="#000" strokeWidth="1.2"/>
        <polygon points="20,14 20,22 25,18" fill="black"/>
        <path className="wave" d="M26 13 C28 18, 28 18, 26 23" />
        <path className="wave wave2" d="M27.5 12 C30.5 18, 30.5 18, 27.5 24" />
        <path className="wave wave3" d="M29 11 C33 18, 33 18, 29 25" />
    </svg>
);

export default TextToSpeechFilledSVG;
