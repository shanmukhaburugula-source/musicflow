
import { Track, Playlist } from './types';

export const COLORS = {
  accent: '#E879F9', // Fuchsia
  secondary: '#22D3EE', // Cyan
  bg: '#050505',
  surface: '#0A0A0B',
  text: '#F4F4F5'
};

export const STATIC_UI_EVENTS: Track[] = [
  { id: "ui-1", title: "Music of the Spheres", artist: "Coldplay", album: "Global Tour", duration: "3:00:00", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745", dateTime: "2025-03-15T20:00", location: "Singapore National Stadium", source: "static", genre: "Rock" },
  { id: "ui-2", title: "The Eras Tour", artist: "Taylor Swift", album: "Eras", duration: "3:15:00", cover: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14", dateTime: "2025-02-10T19:00", location: "Tokyo Dome, Japan", source: "static", genre: "Pop" },
  { id: "ui-3", title: "It's All A Blur", artist: "Drake", album: "For All The Dogs", duration: "2:00:00", cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad", dateTime: "2025-04-05T21:00", location: "Madison Square Garden, New York", source: "static", genre: "Hip Hop" },
  { id: "ui-4", title: "After Hours Till Dawn", artist: "The Weeknd", album: "After Hours", duration: "2:15:00", cover: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b", dateTime: "2025-01-28T20:00", location: "SoFi Stadium, Los Angeles", source: "static", genre: "Synthpop" },
  { id: "ui-5", title: "Mathematics Tour", artist: "Ed Sheeran", album: "Subtract", duration: "2:00:00", cover: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c", dateTime: "2025-03-02T19:00", location: "Wembley Stadium, London", source: "static", genre: "Pop" },
  { id: "ui-6", title: "World Reunion Concert", artist: "BTS", album: "Proof", duration: "2:45:00", cover: "https://images.unsplash.com/photo-1514525253361-bee8718a7439", dateTime: "2025-06-20T18:00", location: "Seoul Olympic Stadium", source: "static", genre: "K-Pop" },
  { id: "ui-7", title: "Live in Vegas", artist: "Adele", album: "30", duration: "1:45:00", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9", dateTime: "2025-02-18T20:00", location: "Caesars Palace, Las Vegas", source: "static", genre: "Soul" },
  { id: "ui-8", title: "If Y’all Weren’t Here", artist: "Post Malone", album: "Austin", duration: "1:50:00", cover: "https://images.unsplash.com/photo-1520127877030-94fa651d0b4f", dateTime: "2025-01-22T20:30", location: "United Center, Chicago", source: "static", genre: "Hip Hop" },
  { id: "ui-9", title: "Loom Tour", artist: "Imagine Dragons", album: "Loom", duration: "1:40:00", cover: "https://images.unsplash.com/photo-1459749411177-042180ce673c", dateTime: "2025-04-12T20:00", location: "Accor Arena, Paris", source: "static", genre: "Rock" },
  { id: "ui-10", title: "Radical Optimism Tour", artist: "Dua Lipa", album: "Radical Optimism", duration: "1:45:00", cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81", dateTime: "2025-05-08T20:00", location: "O2 Arena, London", source: "static", genre: "Pop" },
  { id: "ui-11", title: "Hit Me Hard and Soft", artist: "Billie Eilish", album: "Hard and Soft", duration: "1:55:00", cover: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b", dateTime: "2025-03-25T19:30", location: "Barclays Center, New York", source: "static", genre: "Alt Pop" },
  { id: "ui-12", title: "Utopia Live", artist: "Travis Scott", album: "Utopia", duration: "1:30:00", cover: "https://images.unsplash.com/photo-1549834185-bd9f078a5dfe", dateTime: "2025-02-05T21:00", location: "Crypto.com Arena, Los Angeles", source: "static", genre: "Hip Hop" },
  { id: "ui-13", title: "24K Magic Night", artist: "Bruno Mars", album: "24K Magic", duration: "1:50:00", cover: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c", dateTime: "2025-06-02T20:00", location: "Marina Bay Sands, Singapore", source: "static", genre: "Funk" },
  { id: "ui-14", title: "Soulful Nights", artist: "Arijit Singh", album: "Soul", duration: "3:00:00", cover: "https://images.unsplash.com/photo-1514525253361-bee8718a7439", dateTime: "2025-01-30T19:00", location: "Jio World Garden, Mumbai", source: "static", genre: "Bollywood" },
  { id: "ui-15", title: "Live in Concert", artist: "Anirudh Ravichander", album: "Rockstar", duration: "3:00:00", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745", dateTime: "2025-02-14T18:30", location: "Jawaharlal Nehru Stadium, Chennai", source: "static", genre: "Kollywood" }
];

export const MOCK_ARTISTS = [
  { name: 'Coldplay', bio: 'British rock icons.', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745', profileUrl: '#' },
  { name: 'Taylor Swift', bio: 'Global pop superstar.', image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14', profileUrl: '#' },
  { name: 'Drake', bio: 'Toronto rap titan.', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad', profileUrl: '#' },
  { name: 'BTS', bio: '21st century pop icons.', image: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439', profileUrl: '#' },
  { name: 'Arijit Singh', bio: 'India\'s soulful voice.', image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c', profileUrl: '#' }
];

export const GLOBAL_SONG_DATABASE: Track[] = [
  { id: 'track-1', title: 'Yellow', artist: 'Coldplay', album: 'Parachutes', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745', duration: '4:29', genre: 'Rock', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'track-2', title: 'Cruel Summer', artist: 'Taylor Swift', album: 'Lover', cover: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14', duration: '2:58', genre: 'Pop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'track-3', title: 'Rich Baby Daddy', artist: 'Drake', album: 'For All The Dogs', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad', duration: '5:19', genre: 'Hip Hop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'track-4', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', cover: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b', duration: '3:20', genre: 'Synthpop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 'track-5', title: 'Shape of You', artist: 'Ed Sheeran', album: 'Divide', cover: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c', duration: '3:53', genre: 'Pop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 'track-6', title: 'Dynamite', artist: 'BTS', album: 'BE', cover: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439', duration: '3:19', genre: 'K-Pop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: 'track-7', title: 'Hello', artist: 'Adele', album: '25', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9', duration: '4:55', genre: 'Soul', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: 'track-8', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81', duration: '3:23', genre: 'Pop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 'track-9', title: 'BIRDS OF A FEATHER', artist: 'Billie Eilish', album: 'Hit Me Hard and Soft', cover: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b', duration: '3:30', genre: 'Alt Pop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: 'track-10', title: 'FE!N', artist: 'Travis Scott', album: 'Utopia', cover: 'https://images.unsplash.com/photo-1549834185-bd9f078a5dfe', duration: '3:11', genre: 'Hip Hop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: 'track-11', title: 'Tum Hi Ho', artist: 'Arijit Singh', album: 'Aashiqui 2', cover: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439', duration: '4:22', genre: 'Bollywood', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
  { id: 'track-12', title: 'Vaathi Coming', artist: 'Anirudh Ravichander', album: 'Master', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745', duration: '3:50', genre: 'Kollywood', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Coldplay: Music of the Spheres',
    description: 'The definitive collection for the 2025 Tour.',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
    tracks: GLOBAL_SONG_DATABASE.filter(t => t.artist === 'Coldplay')
  },
  {
    id: 'p2',
    name: 'Swiftie Anthem: Eras Live',
    description: 'Every era, every hit, live from Tokyo.',
    cover: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14',
    tracks: GLOBAL_SONG_DATABASE.filter(t => t.artist === 'Taylor Swift')
  }
];

export const MOCK_TRACKS: Track[] = GLOBAL_SONG_DATABASE;
