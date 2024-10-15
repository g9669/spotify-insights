
# Spotify Insights

A web application that interacts with the Spotify Web API to display personalized music insights, including users' top tracks, artists, and genres over various time ranges.

## Features

- Securely authenticate users using Spotify's OAuth 2.0 Authorization Code Flow with PKCE, without exposing sensitive credentials
- Display users' top artists, tracks, and genres, providing personalized music insights
- View insights over different time ranges: Last 4 Weeks, Last 6 Months, and All Time
- Use Recharts to display top genres in a bar chart for data visualization
- Implement client-side caching to improve performance when switching between time ranges
- Allow users to securely log out of their Spotify account from the application

## Getting Started

### Spotify Developer Setup

1. **Create a Spotify Developer Account**:
   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/) and log in with your Spotify account.

2. **Create a New Application**:
   - Click on "Create an App".
   - Fill in the required details (App name, description).

3. **Set Redirect URIs**:
   - In your app settings, add `http://localhost:3000/callback` to the list of Redirect URIs.

4. **Note your Client ID**:
   - You'll need your Client ID for the application's configuration.

### Installation

1. Clone the repository
    ```
    git clone https://github.com/g9669/spotify-insights.git
    cd spotify-insights
   ```
2. Install dependencies
    ```
    npm install
    ```
3. Configure environment variables

    Create a `.env` file in the root directory
    
    Add your Spotify Client ID to the `.env` file
    ```
    REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
    ```

4. Running the application
    ```
    npm start
    ```

## Built With
- React
- TypeScript
- Material-UI (MUI)
- Recharts
- Axios
- Spotify Web API 
