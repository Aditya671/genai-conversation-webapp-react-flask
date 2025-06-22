import React, { useState, useRef } from 'react';

const VoiceTypingIcon = () => {
  const [transcript, setTranscript] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const stopAll = () => {
    recognitionRef.current?.stop();
    mediaRecorderRef.current?.stop();
    setListening(false);
  };

  const handleIconClick = async () => {
    if (listening) {
      stopAll();
      console.log('Stopped listening', transcript);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start audio recording
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = e => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioURL(URL.createObjectURL(audioBlob));
      };

      mediaRecorderRef.current.start();

      // Setup speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = event => {
        setTranscript(event.results[0][0].transcript);
        console.log('Transcript:', event.results[0][0].transcript);
      };

      recognition.onspeechend = () => {
        // No voice input for 5s, auto stop
        stopAll();
      };

      recognition.onerror = err => {
        console.error('Speech recognition error:', err);
        stopAll();
      };

      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const Icon = () => (
    <svg onClick={handleIconClick} width="50" height="50" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
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
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.3); }
          }
        `}
      </style>
      <rect className="bar bar1" x="20" y="35" rx="8" ry="8" width="10" height="20" fill="#cacaca" />
      <rect className="bar bar2" x="35" y="25" rx="8" ry="8" width="10" height="40" fill="#cacaca" />
      <rect className="bar bar3" x="50" y="15" rx="8" ry="8" width="10" height="60" fill="#cacaca" />
      <rect className="bar bar4" x="65" y="25" rx="8" ry="8" width="10" height="40" fill="#cacaca" />
      <rect className="bar bar5" x="80" y="35" rx="8" ry="8" width="10" height="20" fill="#cacaca" />
    </svg>
  );

  return (
    <div style={{ textAlign: 'center' }}>
      <Icon />
      {listening && <p>Listening...</p>}
      {transcript && (
        <div>
          <p><strong>Transcript:</strong> {transcript}</p>
          {audioURL && (
            <audio controls src={audioURL}>
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceTypingIcon;
