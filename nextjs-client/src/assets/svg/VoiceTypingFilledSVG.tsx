import React from "react";

interface VoiceTypingFilledSVGProps {
    isClicked?: boolean;
}

const VoiceTypingFilledSVG: React.FC<VoiceTypingFilledSVGProps> = ({ isClicked = false }) => (
    <svg
        key={isClicked ? 'clicked' : 'unclicked'}
        width="auto"
        height="auto"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
    >
        <style>
            {`
            .bar {
                transform-origin: bottom;
            }
            .bar.animated {
                animation: bounce 1.2s infinite ease-in-out;
            }
            .bar2.animated { animation-delay: 0.2s; }
            .bar3.animated { animation-delay: 0.4s; }
            .bar4.animated { animation-delay: 0.6s; }
            .bar5.animated { animation-delay: 0.8s; }

            @keyframes bounce {
                0%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(1.3); }
            }
        `}
        </style>
        <rect className={`bar bar1 ${isClicked ? 'animated' : ''}`} x="20" y="35" rx="8" ry="8" width="10" height="20" fill="#cacaca" />
        <rect className={`bar bar2 ${isClicked ? 'animated' : ''}`} x="35" y="25" rx="8" ry="8" width="10" height="40" fill="#cacaca" />
        <rect className={`bar bar3 ${isClicked ? 'animated' : ''}`} x="50" y="15" rx="8" ry="8" width="10" height="60" fill="#cacaca" />
        <rect className={`bar bar4 ${isClicked ? 'animated' : ''}`} x="65" y="25" rx="8" ry="8" width="10" height="40" fill="#cacaca" />
        <rect className={`bar bar5 ${isClicked ? 'animated' : ''}`} x="80" y="35" rx="8" ry="8" width="10" height="20" fill="#cacaca" />
    </svg>
);

export default VoiceTypingFilledSVG;
