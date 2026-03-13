import { useEffect, useRef } from 'react';

/** Generates brown noise via Web Audio API for body-doubling ambience */
function useBrownNoise(enabled: boolean) {
  const audioRef = useRef<{ context: AudioContext; node: AudioNode } | null>(null);

  useEffect(() => {
    if (!enabled) {
      audioRef.current?.context.close();
      audioRef.current = null;
      return;
    }
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const bufferSize = 4096;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }
    const bufferSource = ctx.createBufferSource();
    bufferSource.buffer = buffer;
    bufferSource.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0.15;
    bufferSource.connect(gain);
    gain.connect(ctx.destination);
    bufferSource.start(0);
    audioRef.current = { context: ctx, node: gain };
    return () => {
      bufferSource.stop();
      ctx.close();
      audioRef.current = null;
    };
  }, [enabled]);
}

export function BodyDoubling({ enabled }: { enabled: boolean }) {
  useBrownNoise(enabled);
  return null;
}
