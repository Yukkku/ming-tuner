import { createEffect, createMemo, onCleanup } from "solid-js";

export default (props: { analyser: AnalyserNode, width: number, height: number, A?: number }) => {
  const dataArray = createMemo(() => new Float32Array(props.analyser.frequencyBinCount));
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const draw = () => {
    const analyser = props.analyser;
    const freqB = analyser.context.sampleRate / analyser.fftSize;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const d = dataArray();
    analyser.getFloatFrequencyData(d);
    const ereq = freqB / ((props.A ?? 442) * 2 ** (5 / 24));
    let his = -Infinity;
    for (let i = 1; i < d.length; ++i) if (d[i] > his) his = d[i];
    his = (w / 30) / (10 ** (his / 20));
    for (let i = 0; i < 12; ++i) {
      ctx.fillStyle = '010100101010'[i] === '0' ? 'white' : 'black';
      ctx.strokeStyle = '010100101010'[i] === '0' ? 'black' : 'white';
      ctx.fillRect(i * w / 12, 0, w, h);
      ctx.beginPath();
      ctx.moveTo((i + 0.1) * w / 12, h / 2);
      ctx.lineTo((i + 0.9) * w / 12, h / 2);
      ctx.moveTo((i + 0.3) * w / 12, h * (28.5 - 12 * Math.log2(5)));
      ctx.lineTo((i + 0.7) * w / 12, h * (28.5 - 12 * Math.log2(5)));
      ctx.moveTo((i + 0.3) * w / 12, h * (3.5 - 12 * Math.log2(6 / 5)));
      ctx.lineTo((i + 0.7) * w / 12, h * (3.5 - 12 * Math.log2(6 / 5)));
      ctx.stroke();
    }
    for (let i = 1; i < d.length; ++i) {
      const r = (10 ** (d[i] / 20)) * his;
      const e = (Math.log2(i * ereq) % 1 + 1) % 1 * 12;
      const x = (Math.floor(e) + 0.5) * w / 12;
      const y = h * (1 - e % 1);
      if (r < 0.5) {
        ctx.fillStyle = '010100101010'[Math.floor(e)] === '0' ? 'black' : 'white';
        ctx.beginPath();
        ctx.arc(x, y, r * 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = '010100101010'[Math.floor(e)] === '0' ? 'black' : 'white';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };
  createEffect(() => {
    canvas.width = props.width;
    canvas.height = props.height;
    draw();
  });
  const intervalID = setInterval(draw, 100);
  onCleanup(() => clearInterval(intervalID));
  return canvas;
};
