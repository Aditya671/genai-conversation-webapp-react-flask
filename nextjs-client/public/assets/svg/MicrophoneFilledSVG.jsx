export const MicrophoneFilledSVG = () => (
    <svg width="25" height="25" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
         <style>
        {`.mic-body {
        transform-origin: center;
        animation: pulse 1s infinite ease-in-out;
        }

        @keyframes pulse {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.3); }
        }`}
    </style>
        <path className="mic-body" d="M12 14c1.66 0 3-1.34 3-3V5a3 3 0 1 0-6 0v6c0 1.66 1.34 3 3 3z" fill="#cacaca" />
        <path d="M7 11a5 5 0 0 0 10 0h1.5a6.5 6.5 0 0 1-13 0H7z" fill="#cacaca" />
        <rect x="10" y="17.5" width="4" height="1.5" rx="0.75" fill="#cacaca" />
        <rect x="8" y="19.5" width="8" height="1.5" rx="0.75" fill="#cacaca" />
    </svg>
)