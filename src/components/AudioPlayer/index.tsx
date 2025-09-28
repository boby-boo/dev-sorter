
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectIsSoundOn } from "../../features/selectors";
import music from "../../assets/audio/song.mp3";

const AudioPlayer = () => {
  const isSoundOn = useSelector(selectIsSoundOn);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { 
  if (isSoundOn) {
    audioRef.current = new Audio(music);
    audioRef.current.loop = true; 
    audioRef.current.volume = 0.5; 
    audioRef.current.play()
  } else {
    audioRef?.current?.pause();
  }
}, [isSoundOn]);

  return null; 
};

export default AudioPlayer;
