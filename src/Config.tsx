import { For, type Signal } from "solid-js";
import styles from "./Config.module.css";

const fftSizes = [32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];

export default (prop: { tracks: MediaStreamTrack[], usingTrack: Signal<MediaStreamTrack | null>, fftSize: Signal<number>, hide: () => unknown }) => {
  const [usingTrack, setUsingTrack] = prop.usingTrack;
  const [fftSize, setFftSize] = prop.fftSize;
  let outer: HTMLDivElement;
  const onClickOuter = (e: MouseEvent) => { if (e.target == outer) prop.hide() };
  return <div class={styles.outer} onClick={onClickOuter} ref={e => outer = e}><div class={styles.inner}>
    <div class={styles.title}>Config</div>
    <label>Mic: <select value={usingTrack()?.id ?? 'off'} onChange={e => setUsingTrack(prop.tracks.find(x => x.id === e.target.value)!)}>
      <option value="off">OFF</option>
      <For each={prop.tracks}>{v => (<option value={v.id}>{v.label}</option>)}</For>
    </select></label>
    <label>FFT Size: <select value={fftSize()} onChange={e => setFftSize(Number(e.target.value))}>
      <For each={fftSizes}>{v => (<option value={v}>{v}</option>)}</For>
    </select></label>
  </div></div>;
};
