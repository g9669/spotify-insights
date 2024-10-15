import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getAccessToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const storedState = localStorage.getItem('spotify_auth_state');
      const codeVerifier = localStorage.getItem('code_verifier') || '';

      if (state === null || state !== storedState) {
        alert('State mismatch');
      } else {
        localStorage.removeItem('spotify_auth_state');

        const body = new URLSearchParams({
          client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
          grant_type: 'authorization_code',
          code: code || '',
          redirect_uri: 'http://localhost:3000/callback',
          code_verifier: codeVerifier,
        });

        try {
          const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            body,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );

          localStorage.setItem('access_token', response.data.access_token);
          navigate('/dashboard');
        } catch (error) {
          console.error('Error fetching access token', error);
        }
      }
    };

    getAccessToken();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
