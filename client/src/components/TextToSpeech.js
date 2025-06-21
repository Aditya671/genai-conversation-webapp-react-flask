import { useState, useEffect } from "react";
import { Button } from "antd";
import { VolumeFullFilledSVG } from "../assets/svg/VolumneFullFilledSVG";
const TextToSpeech = ({ text, style }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);
    /* 
        How to use in any other component
        text -> speaks whatever value is passed in this attribute
        style -> takes style as input to plave the component in desired location over parent component
        <TextToSpeech
            text={botMessage?.message}
            style={{ position: 'absolute', top: '-15px', background: 'white', borderRadius: '16px', textAlign: 'center', padding: '5px 10px' }}
        />
    */
   
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
        } else {
            synth.speak(utterance);
        }

        setIsPaused(false);
    };

    return (
        <>
            <Button style={style} onClick={handlePlay} icon={
                <VolumeFullFilledSVG/>
            }></Button>
        </>
    );
};

export default TextToSpeech;