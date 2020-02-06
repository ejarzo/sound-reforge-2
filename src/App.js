import React, { useState, useEffect, useCallback } from 'react';
import Rita from 'rita';
import Tone from 'tone';
import { useSpeechSynthesis } from 'react-speech-kit';

import './App.css';
import { useFreesound } from './useFreesound';

const player = new Tone.Player({ autostart: true });
player.send('masterOutput');

const masterCompressor = new Tone.Compressor({
  ratio: 16,
  threshold: -30,
  release: 0.25,
  attack: 0.003,
  knee: 30,
});

const masterLimiter = new Tone.Limiter(-3);
const masterReverb = new Tone.Reverb(0.8);
const masterDelay = new Tone.Freeverb();
const masterOutput = new Tone.Gain(0.8).receive('masterOutput');

masterOutput.chain(masterCompressor, masterLimiter, Tone.Master);

function App() {
  const [query, setQuery] = useState('');
  const { soundUrl, imageUrl, tags } = useFreesound(query);
  const phonemes = query && Rita.getPhonemes(query);
  const rhymes = query && Rita.rhymes(query);

  const { speak } = useSpeechSynthesis({
    onEnd: () => {
      console.log('END');
      const rhyme = rhymes[Math.floor(Math.random() * rhymes.length)];
      setQuery(rhyme);
    },
  });

  useEffect(() => {
    if (!soundUrl) return;
    player.load(soundUrl);
  }, [soundUrl]);

  useEffect(() => {
    // speak({ text: query });
    speak({ text: tags.join(', ') });
  }, [tags]);

  const handleClick = () => {
    const rhyme = rhymes[Math.floor(Math.random() * rhymes.length)];
    setQuery(rhyme);
  };

  return (
    <div className="App">
      <div
        style={{
          color: 'white',
          position: 'absolute',
          background: '#111',
          top: 5,
          left: 5,
          padding: 10,
          zIndex: 3,
        }}
      >
        <div>
          <button
            onClick={() => {
              setQuery(Rita.randomWord());
            }}
          >
            Random
          </button>
        </div>
        query: {query}
        <br />
        rhymes: {rhymes && rhymes.join(',')}
        <br />
        tags: {tags && tags.join(',')}
      </div>
      <div
        onClick={handleClick}
        style={{
          color: 'white',
          position: 'absolute',
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '5em',
          zIndex: 2,
        }}
      >
        {phonemes && phonemes.replace(/-/g, '')}
      </div>
      <img
        style={{ display: 'block', height: '100%', width: '100%' }}
        src={imageUrl}
        alt=""
      />
    </div>
  );
}

export default App;
