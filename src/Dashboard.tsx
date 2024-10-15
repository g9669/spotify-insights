import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { getUserTopArtists, getUserTopTracks } from './services/spotify';

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
}

interface Track {
  id: string;
  name: string;
  album: {
    images: { url: string }[];
  };
  artists: { name: string }[];
}

interface CachedData {
  [key: string]: {
    artists: Artist[];
    tracks: Track[];
    genres: { genre: string; count: number }[];
  };
}

const Dashboard: React.FC = () => {
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topGenres, setTopGenres] = useState<{ genre: string; count: number }[]>(
    []
  );
  const [timeRange, setTimeRange] = useState<string>('medium_term');
  const [cachedData, setCachedData] = useState<CachedData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (cachedData[timeRange]) {
        // Use cached data
        const { artists, tracks, genres } = cachedData[timeRange];
        setTopArtists(artists);
        setTopTracks(tracks);
        setTopGenres(genres);
      } else {
        setLoading(true);
        try {
          // Fetch data from Spotify API
          const [artistsData, tracksData] = await Promise.all([
            getUserTopArtists(timeRange),
            getUserTopTracks(timeRange),
          ]);

          // Process genres
          const genreCount: { [key: string]: number } = {};

          artistsData.items.forEach((artist) => {
            artist.genres.forEach((genre) => {
              genreCount[genre] = (genreCount[genre] || 0) + 1;
            });
          });

          const genreData = Object.keys(genreCount).map((genre) => ({
            genre,
            count: genreCount[genre],
          }));

          genreData.sort((a, b) => b.count - a.count);

          const topNGenres = genreData.slice(0, 10);

          setTopArtists(artistsData.items);
          setTopTracks(tracksData.items);
          setTopGenres(topNGenres);

          // Cache the data
          setCachedData((prevCache) => ({
            ...prevCache,
            [timeRange]: {
              artists: artistsData.items,
              tracks: tracksData.items,
              genres: topNGenres,
            },
          }));
        } catch (error) {
          console.error('Error fetching data from Spotify API', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [timeRange, cachedData]);

  const COLORS = [
    '#8884d8',
    '#83a6ed',
    '#8dd1e1',
    '#82ca9d',
    '#a4de6c',
    '#d0ed57',
    '#ffc658',
    '#ff8042',
    '#ffbb28',
    '#ff6361',
  ];

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: string
  ) => {
    if (newTimeRange) {
      setTimeRange(newTimeRange);
    }
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'short_term':
        return 'Last 4 Weeks';
      case 'medium_term':
        return 'Last 6 Months';
      case 'long_term':
        return 'All Time';
      default:
        return '';
    }
  };

  const theme = useTheme();

  return (
    <Container style={{ marginTop: '2rem' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        style={{ fontWeight: 'bold', flexGrow: 1 }}
      >
      </Typography>
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </div>
      <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold' }}>
        Spotify Insights
      </Typography>
      <ToggleButtonGroup
        color="primary"
        value={timeRange}
        exclusive
        onChange={handleTimeRangeChange}
        aria-label="Time Range"
        style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}
      >
        <ToggleButton value="short_term">Last 4 Weeks</ToggleButton>
        <ToggleButton value="medium_term">Last 6 Months</ToggleButton>
        <ToggleButton value="long_term">All Time</ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        <Typography variant="h6" align="center">
          Loading...
        </Typography>
      ) : (
        <>
          <Typography variant="h5" gutterBottom style={{ fontWeight: '400' }}>
            Your Top Artists ({getTimeRangeLabel(timeRange)})
          </Typography>
          <Grid container spacing={2}>
            {topArtists.map((artist) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={artist.id}>
                <Card>
                  <CardMedia
                    component="img"
                    image={artist.images[0]?.url}
                    alt={artist.name}
                    style={{ height: 'auto', aspectRatio: '1 / 1' }}
                  />
                  <CardContent style={{ height: '30px' }}>
                    <Typography
                      variant="subtitle1" 
                      align="center"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontWeight: '400'
                      }}
                    >
                      {artist.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom style={{ fontWeight: '400', marginTop: '2rem' }}>
            Your Top Tracks ({getTimeRangeLabel(timeRange)})
          </Typography>
          <Grid container spacing={2}>
            {topTracks.map((track) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={track.id}>
                <Card>
                  <CardMedia
                    component="img"
                    image={track.album.images[0]?.url}
                    alt={track.name}
                    style={{ height: 'auto', aspectRatio: '1 / 1' }}
                  />
                  <CardContent style={{ height: '80px' }}>
                    <Typography
                      variant="subtitle1" 
                      align="center"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontWeight: '400',
                      }}
                    >
                      {track.name}
                    </Typography>
                    <Typography
                      variant="body2" 
                      align="center"
                      color="textSecondary"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        fontWeight: '200'
                      }}
                    >
                      {track.artists.map((artist) => artist.name).join(', ')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom style={{ fontWeight: '400', marginTop: '2rem' }}>
            Your Top Genres ({getTimeRangeLabel(timeRange)})
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={topGenres}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <XAxis
                dataKey="genre"
                tick={{
                  fontSize: 16,
                  fontFamily: theme.typography.fontFamily,
                }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <Bar dataKey="count" fill="#8884d8">
                {topGenres.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
