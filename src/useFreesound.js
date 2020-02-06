import { useState, useEffect } from 'react';
import useSWR from 'swr';

const { REACT_APP_FREESOUND_API_KEY } = process.env;
const BASE_URL = 'https://freesound.org/apiv2';

const fetcher = url => fetch(url).then(r => r.json());

export const useFreesound = query => {
  const [{ soundUrl, imageUrl, tags }, setFreesoundData] = useState({
    soundUrl: '',
    imageUrl: '',
    tags: [],
  });

  const [activeFreesoundId, setActiveFreesoundId] = useState(null);

  // search for sound
  const { data: searchData, error: searchError } = useSWR(
    query
      ? `${BASE_URL}/search/text/?token=${REACT_APP_FREESOUND_API_KEY}&format=json&query=${query}`
      : null,
    fetcher
  );

  console.log('search data', searchData);
  // get sound data
  const { data: soundData, error: soundError } = useSWR(
    activeFreesoundId
      ? `${BASE_URL}/sounds/${activeFreesoundId}/?token=${REACT_APP_FREESOUND_API_KEY}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (searchData && searchData.results && searchData.results.length > 0) {
      const { results } = searchData;
      const { id } = results[Math.floor(Math.random() * results.length)];
      setActiveFreesoundId(id);
    }
  }, [searchData]);

  useEffect(() => {
    if (!soundData) return;
    const {
      images: { spectral_l: imageUrl },
      previews: { 'preview-lq-mp3': soundUrl },
      tags,
    } = soundData;
    setFreesoundData({
      soundUrl,
      imageUrl,
      tags,
    });
  }, [soundData, query]);

  return {
    soundUrl,
    imageUrl,
    searchError,
    soundError,
    tags,
  };
};
