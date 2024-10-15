import React from 'react';
import { generateCodeChallenge, generateRandomString } from './services/auth';
import { Button, Container, Typography } from '@mui/material';

const App: React.FC = () => {
  const handleLogin = async () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = 'http://localhost:3000/callback';
    const scopes = ['user-top-read'].join(' ');
    const state = generateRandomString(16);
    const codeVerifier = generateRandomString(128);

    localStorage.setItem('spotify_auth_state', state);
    localStorage.setItem('code_verifier', codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${encodeURIComponent(
      clientId
    )}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${encodeURIComponent(
      state
    )}&code_challenge_method=S256&code_challenge=${encodeURIComponent(
      codeChallenge
    )}`;

    window.location.href = authUrl;
  };

  return (
    <Container style={{ textAlign: 'center', marginTop: '5rem' }}>
      <Typography variant="h3" gutterBottom>
        Spotify Insights Dashboard
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login with Spotify
      </Button>
    </Container>
  );
};

export default App;
