import Tone from 'tone';

const MASTER_CHANNEL = 'masterOutput';
export const PLAYER = new Tone.Player({ autostart: true });

PLAYER.send(MASTER_CHANNEL);

const masterCompressor = new Tone.Compressor({
  ratio: 16,
  threshold: -30,
  release: 0.25,
  attack: 0.003,
  knee: 30,
});

const masterLimiter = new Tone.Limiter(-3);
// const masterReverb = new Tone.Reverb(0.8);
// const masterDelay = new Tone.Freeverb();
const masterOutput = new Tone.Gain(0.8).receive(MASTER_CHANNEL);

masterOutput.chain(masterCompressor, masterLimiter, Tone.Master);
