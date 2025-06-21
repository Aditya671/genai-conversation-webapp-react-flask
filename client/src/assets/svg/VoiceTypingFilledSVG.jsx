export const VoiceTypingFilledSVG = () => (
    <svg width="50" height="50" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        {/* <circle cx="60" cy="60" r="55" stroke="black" stroke-width="3" fill="none"/> */}
        <style>
            {`
            .bar {
            transform-origin: bottom;
            animation: bounce 1.2s infinite ease-in-out;
            }
            .bar2 { animation-delay: 0.2s; }
            .bar3 { animation-delay: 0.4s; }
            .bar4 { animation-delay: 0.6s; }
            .bar5 { animation-delay: 0.8s; }

            @keyframes bounce {
            0%, 100% {
                transform: scaleY(1);
            }
            50% {
                transform: scaleY(1.3);
            }
            }
        `}
        </style>
        <rect className="bar bar1" x="20" y="35" rx="8" ry="8" width="10" height="20" fill="#cacaca" />
        <rect className="bar bar2" x="35" y="25" rx="8" ry="8" width="10" height="40" fill="#cacaca" />
        <rect className="bar bar3" x="50" y="15" rx="8" ry="8" width="10" height="60" fill="#cacaca" />
        <rect className="bar bar4" x="65" y="25" rx="8" ry="8" width="10" height="40" fill="#cacaca" />
        <rect className="bar bar5" x="80" y="35" rx="8" ry="8" width="10" height="20" fill="#cacaca" />
    </svg>

)
