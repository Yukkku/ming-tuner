import { For, type Signal } from "solid-js";

const fftSizes = [32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];

export default (prop: { tracks: MediaStreamTrack[], usingTrack: Signal<MediaStreamTrack | null>, fftSize: Signal<number> }) => {
  const [usingTrack, setUsingTrack] = prop.usingTrack;
  const [fftSize, setFftSize] = prop.fftSize;
  return <div>
    <label>Mic: <select value={usingTrack()?.id ?? 'off'} onChange={e => setUsingTrack(prop.tracks.find(x => x.id === e.target.value)!)}>
      <option value="off">OFF</option>
      <For each={prop.tracks}>{v => (<option value={v.id}>{v.label}</option>)}</For>
    </select></label>
    <label>FFT Size: <select value={fftSize()} onChange={e => setFftSize(Number(e.target.value))}>
      <For each={fftSizes}>{v => (<option value={v}>{v}</option>)}</For>
    </select></label>
  </div>;
};
