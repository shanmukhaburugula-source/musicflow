
import { Track, Playlist } from './types';

export const COLORS = {
  accent: '#E879F9', // Fuchsia
  secondary: '#22D3EE', // Cyan
  bg: '#050505',
  surface: '#0A0A0B',
  text: '#F4F4F5'
};

export interface ArtistProfile {
  name: string;
  bio: string;
  image: string;
  profileUrl: string;
}

export const MOCK_ARTISTS: ArtistProfile[] = [
  {
    name: 'SZA',
    bio: 'Solána Imani Rowe, known professionally as SZA, is an American R&B singer-songwriter known for her genre-blurring sound and introspective lyrics.',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1200',
    profileUrl: 'https://www.szasolana.com/'
  },
  {
    name: 'Taylor Swift',
    bio: 'One of the most influential singer-songwriters of her generation, Taylor Swift is known for her narrative songwriting and record-breaking global tours.',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1200',
    profileUrl: 'https://www.taylorswift.com/'
  },
  {
    name: 'Coldplay',
    bio: 'The iconic British rock band formed in London, recognized worldwide for their anthemic sound and spectacular live stadium performances.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200',
    profileUrl: 'https://www.coldplay.com/'
  },
  {
    name: 'Ed Sheeran',
    bio: 'An English singer-songwriter and musician who has sold more than 150 million records worldwide, making him one of the world\'s best-selling music artists.',
    image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&q=80&w=1200',
    profileUrl: 'https://www.edsheeran.com/'
  },
  {
    name: 'The Weeknd',
    bio: 'Abel Makkonen Tesfaye, known as The Weeknd, is a Canadian singer-songwriter and actor known for his sonic versatility and dark lyricism.',
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=1200',
    profileUrl: 'https://www.theweeknd.com/'
  },
  {
    name: 'Dua Lipa',
    bio: 'A British-Albanian singer and songwriter known for her signature mezzo-soprano vocal range and disco-influenced pop sound.',
    image: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&q=80&w=1200',
    profileUrl: 'https://www.dualipa.com/'
  }
];

export const MOCK_TRACKS: Track[] = [
  { 
    id: 'sza-sos', 
    title: 'Kill Bill', 
    artist: 'SZA', 
    album: 'SOS', 
    cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1200', 
    duration: '2:33', 
    genre: 'R&B',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    fullDescription: 'I might kill my ex, not the best idea. SZA brings her chart-topping R&B sensation to the live stage.',
    location: 'Rod Laver Arena, Melbourne',
    dateTime: '2025-01-10T20:00'
  },
  { 
    id: 'taylor-cruel', 
    title: 'Cruel Summer', 
    artist: 'Taylor Swift', 
    album: 'Lover', 
    cover: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1200', 
    duration: '2:58', 
    genre: 'Pop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    fullDescription: 'The anthem of a generation. Fever dream high in the quiet of the night.',
    location: 'Wembley Stadium, London',
    dateTime: '2024-08-15T19:00'
  },
  { 
    id: 'coldplay-yellow', 
    title: 'Yellow', 
    artist: 'Coldplay', 
    album: 'Parachutes', 
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200', 
    duration: '4:29', 
    genre: 'Rock',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    fullDescription: 'Look at the stars, look how they shine for you.',
    location: 'Estádio do Morumbi, São Paulo',
    dateTime: '2024-10-12T20:00'
  },
  { 
    id: 'ed-perfect', 
    title: 'Perfect', 
    artist: 'Ed Sheeran', 
    album: '÷', 
    cover: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&q=80&w=1200', 
    duration: '4:23', 
    genre: 'Pop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    location: 'Suncorp Stadium, Brisbane',
    dateTime: '2024-11-04T19:00'
  },
  { 
    id: 'weeknd-blinding', 
    title: 'Blinding Lights', 
    artist: 'The Weeknd', 
    album: 'After Hours', 
    cover: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=1200', 
    duration: '3:20', 
    genre: 'Synthpop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    location: 'Stade de France, Paris',
    dateTime: '2024-12-02T21:00'
  },
  { 
    id: 'dua-levitating', 
    title: 'Levitating', 
    artist: 'Dua Lipa', 
    album: 'Future Nostalgia', 
    cover: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&q=80&w=1200', 
    duration: '3:23', 
    genre: 'Pop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    location: 'The O2 Arena, London',
    dateTime: '2024-12-18T20:30'
  },
  { 
    id: 'harry-styles', 
    title: 'As It Was', 
    artist: 'Harry Styles', 
    album: 'Harry\'s House', 
    cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800', 
    duration: '2:47', 
    genre: 'Pop Rock',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
  },
  { 
    id: 'billie-birds', 
    title: 'BIRDS OF A FEATHER', 
    artist: 'Billie Eilish', 
    album: 'HIT ME HARD AND SOFT', 
    cover: 'https://images.unsplash.com/photo-1520127877030-94fa651d0b4f?auto=format&fit=crop&q=80&w=800', 
    duration: '3:30', 
    genre: 'Alt Pop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
  },
  { 
    id: 'drake-rich', 
    title: 'Rich Baby Daddy', 
    artist: 'Drake', 
    album: 'For All The Dogs', 
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800', 
    duration: '5:19', 
    genre: 'Hip Hop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3'
  },
  { 
    id: 'kendrick-not-like-us', 
    title: 'Not Like Us', 
    artist: 'Kendrick Lamar', 
    album: 'Single', 
    cover: 'https://images.unsplash.com/photo-1549834185-bd9f078a5dfe?auto=format&fit=crop&q=80&w=800', 
    duration: '4:34', 
    genre: 'Hip Hop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3'
  },
  { 
    id: 'bad-bunny-monaco', 
    title: 'MONACO', 
    artist: 'Bad Bunny', 
    album: 'nadie sabe lo que va a pasar mañana', 
    cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800', 
    duration: '4:27', 
    genre: 'Reggaeton',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3'
  },
  { 
    id: 'fred-again-adore-u', 
    title: 'adore u', 
    artist: 'Fred again..', 
    album: 'Single', 
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800', 
    duration: '3:40', 
    genre: 'Electronic',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3'
  },
  { 
    id: 'mitski-my-love', 
    title: 'My Love Mine All Mine', 
    artist: 'Mitski', 
    album: 'The Land Is Inhospitable', 
    cover: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&q=80&w=800', 
    duration: '2:18', 
    genre: 'Indie',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3'
  },
  { 
    id: 'tate-mcrea-greedy', 
    title: 'greedy', 
    artist: 'Tate McRae', 
    album: 'THINK LATER', 
    cover: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&q=80&w=800', 
    duration: '2:11', 
    genre: 'Pop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3'
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'SZA: The SOS Experience',
    description: 'The definitive collection for the SOS Tour. From "Kill Bill" to "Snooze".',
    cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800',
    tracks: MOCK_TRACKS.filter(t => t.artist === 'SZA'),
    isFeatured: true
  },
  {
    id: 'p2',
    name: 'Taylor Swift: Eras Live',
    description: 'Relive the magic of the tour of the century. Every era, every hit.',
    cover: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=800',
    tracks: MOCK_TRACKS.filter(t => t.artist === 'Taylor Swift'),
    isFeatured: true
  }
];
