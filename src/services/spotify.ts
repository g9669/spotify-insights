import axios from 'axios';

const getAccessToken = (): string => {
  return localStorage.getItem('access_token') || '';
};

export const getUserTopArtists = async (timeRange: string = 'medium_term') => {
  const token = getAccessToken();
  const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      limit: 30, 
      time_range: timeRange,
    },
  });
  return response.data;
};

export const getUserTopTracks = async (timeRange: string = 'medium_term') => {
  const token = getAccessToken();
  const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      limit: 30, // Changed from 20 to 30
      time_range: timeRange,
    },
  });
  return response.data;
};
