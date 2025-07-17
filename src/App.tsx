import { createSignal, onCleanup, type JSX } from "solid-js";
import Display from './Display.tsx';

export default () => {
  const [display, setDisplay] = createSignal<JSX.Element | null>(null);
  const [width, setWidth] = createSignal(window.innerWidth);
  const [height, setHeight] = createSignal(window.innerHeight);
  const onResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  window.addEventListener('resize', onResize);
  onCleanup(() => window.removeEventListener('resize', onResize));
  (async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.smoothingTimeConstant = 0;
    analyser.fftSize = 32768;
    audioCtx.createMediaStreamSource(mediaStream).connect(analyser);
    await new Promise(r => setTimeout(r, 100));
    setDisplay(() => <Display analyser={analyser} width={width()} height={height()} />);
  })();
  return (<>
    {display()}
  </>);
};
