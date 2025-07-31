import { createEffect, createSignal, onCleanup } from "solid-js";
import Display from './Display.tsx';
import Config from "./Config.tsx";

export default () => {
  const [tracks, setTracks] = createSignal<MediaStreamTrack[]>([]);
  const [usingTrack, setUsingTrack] = createSignal<MediaStreamTrack | null>(null);
  const [fftSize, setFftSize] = createSignal<number>(32768);
  const [width, setWidth] = createSignal(window.innerWidth);
  const [height, setHeight] = createSignal(window.innerHeight);
  const onResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  window.addEventListener('resize', onResize);
  onCleanup(() => window.removeEventListener('resize', onResize));

  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  analyser.smoothingTimeConstant = 0;
  analyser.fftSize = 32768;
  createEffect(() => {
    analyser.fftSize = fftSize();
  });
  {
    let mediaNode: MediaStreamAudioSourceNode | null = null;
    createEffect(() => {
      if (mediaNode) {
        mediaNode.mediaStream.getAudioTracks()[0].enabled = false;
        mediaNode.disconnect();
      }
      const track = usingTrack();
      if (track) {
        track.enabled = true;
        mediaNode = audioCtx.createMediaStreamSource(new MediaStream([track]));
        mediaNode.connect(analyser);
      }
    });
  }
  (async () => {
    setTracks(await navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => stream.getAudioTracks()).catch(() => []));
    for (const track of tracks()) { track.enabled = false; }
    setUsingTrack(tracks().at(0) ?? null);
  })();
  return (<>
    <Display analyser={analyser} width={width()} height={height() / 2} />
    <Config tracks={tracks()} usingTrack={[usingTrack, setUsingTrack]} fftSize={[fftSize, setFftSize]} />
  </>);
};
