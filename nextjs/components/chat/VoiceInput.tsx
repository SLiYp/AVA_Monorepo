import { useState, useEffect } from "react";
import { Mic, Send, X } from "lucide-react";

interface VoiceInputProps {
    setVoice: React.Dispatch<React.SetStateAction<boolean>>;
}

const VoiceInput = ({ setVoice }: VoiceInputProps) => {
    const [time, setTime] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
        null
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);
        setTimerInterval(interval);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    const handleStop = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        setVoice(false);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    return (
        <>
            <Mic className="text-black dark:text-white w-4 mx-1 flex-shrink-0" />
            <p className="flex-1 text-black dark:text-white text-sm mx-1">{formatTime(time)}</p>
            <p className="text-black dark:text-white text-sm">Listening...</p>
            <div
                className={`w-8 h-8 mx-1 rounded-full flex flex-shrink-0 items-center justify-center bg-[#F7F4F0] cursor-pointer`}
                onClick={handleStop}
            >
                <X className="text-black w-4" />
            </div>
            <div
                className={`w-8 h-8 mx-1 rounded-full flex flex-shrink-0 items-center justify-center bg-[#F7F4F0] cursor-pointer`}
            >
                <Send className="text-black w-4" />
            </div>
        </>
    );
};

export default VoiceInput;
