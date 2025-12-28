
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
  genre?: string;
  fullDescription?: string;
  audioUrl?: string;
  organizer?: {
    name: string;
    avatar: string;
    bio: string;
  };
  location?: string;
  dateTime?: string;
  // New Fields for Visibility and Source
  isPublic?: boolean;
  source?: 'static' | 'firestore';
  // Existing Fields
  ticketPrice?: string;
  time?: string;
  artistId?: string;
  artistEmail?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  tracks: Track[];
  isFeatured?: boolean;
}

export enum ViewType {
  HOME = 'HOME',
  EXPLORE = 'EXPLORE',
  PLAYLISTS = 'PLAYLISTS',
  FAVORITES = 'FAVORITES',
  SEARCH = 'SEARCH',
  PLAYLIST_DETAIL = 'PLAYLIST_DETAIL',
  CREATE_EVENT = 'CREATE_EVENT',
  PROFILE = 'PROFILE'
}

export interface ArtistProfile {
  uid: string;
  name: string;
  email: string;
  profilePhoto?: string;
  createdAt: any;
}
