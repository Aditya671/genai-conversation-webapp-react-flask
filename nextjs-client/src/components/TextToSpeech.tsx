import { useState, useEffect, CSSProperties } from "react";
import { Button } from "antd";
import VolumeFullFilledSVG from '../assets/svg/VolumneFullFilledSVG';

interface TextToSpeechProps {
  text: string;
  style?: CSSProperties;
}

const TextToSpeech = ({ text, style }: TextToSpeechProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    setUtterance(u);
    return () => {
      synth.cancel();
    };
  }, [text]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;
    if (isPaused) {
      synth.resume();
    } else if (utterance) {
      synth.speak(utterance);
    }
    setIsPaused(false);
  };

  return (
    <Button style={style} onClick={handlePlay} icon={<VolumeFullFilledSVG />} />
  );
};

export default TextToSpeech;
