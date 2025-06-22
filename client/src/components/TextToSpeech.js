import { useState, useEffect } from "react";
import { Button } from "antd";
import { VolumeFullFilledSVG } from "../assets/svg/VolumneFullFilledSVG";

/**
 * TextToSpeech
 *
 * A small utility component that uses the Web Speech API to read aloud the given text.
 * Useful for accessibility or voice feedback in chatbot messages, tutorials, etc.
 *
 * @param {string} text - The text content to be spoken when the button is clicked.
 * @param {object} style - Optional inline style object for positioning and styling the button.
 *
 * @example
 * <TextToSpeech
 *   text="Hello, this is a spoken message."
 *   style={{
 *     position: 'absolute',
 *     top: '-15px',
 *     background: 'white',
 *     borderRadius: '16px',
 *     textAlign: 'center',
 *     padding: '5px 10px'
 *   }}
 * />
 *
 * @returns {JSX.Element} A button component that plays speech when clicked.
 */

const TextToSpeech = ({ text, style }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);
   
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