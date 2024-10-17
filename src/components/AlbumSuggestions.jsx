import React, { useState, useEffect } from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Album, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import axios from 'axios';


const AlbumSuggestions = ({ userCollection }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [token, setToken] = useState('');


  console.log('User Collection:', userCollection);
  useEffect(() => {
    // Fetch the Spotify token from the backend
    const fetchSpotifyToken = async () => {
      try {
        const response = await axios.get('http://localhost:5001/spotify-token');
        setToken(response.data.accessToken);
      } catch (error) {
        console.error('Error fetching Spotify token:', error);
      }
    };

    fetchSpotifyToken();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (userCollection && userCollection.length > 0 && token) {
        try {
          const albumTitles = userCollection.map(record => record.title).slice(0, 5); // Limit to 5 albums
          console.log('Album Titles:', albumTitles); // Debugging line

          let allSuggestions = [];

          for (const title of albumTitles) {
            const response = await axios.get('https://api.spotify.com/v1/search', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                q: title,
                type: 'album',
                limit: 2, // Limit suggestions per album
              },
            });

            // Log the entire response to check if Spotify is returning data
            console.log('Spotify Response for title:', title, response.data); // Log the API response

            if (response.data.albums && response.data.albums.items.length > 0) {
              allSuggestions = [...allSuggestions, ...response.data.albums.items];
            } else {
              console.warn(`No albums found for title: ${title}`);
            }
          }

          setSuggestions(allSuggestions);
        } catch (error) {
          console.error('Error fetching album suggestions from Spotify:', error);
        }
      }
    };

    if (token) {
      fetchSuggestions();
    }
  }, [userCollection, token]);

  return (
    <div className="w-full bg-gray-100 py-4 mb-6">
      <div className="container mx-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Album className="mr-2" /> Suggested Albums
        </h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {suggestions.length > 0 ? (
              suggestions.map((album) => (
                <div key={album.id} className="w-[100px] text-center">
                  <img
                    src={album.images[0]?.url}
                    alt={album.name}
                    className="w-[100px] h-[100px] rounded-md object-cover mx-auto"
                  />
                  <p className="mt-2 text-sm truncate">{album.name}</p>
                </div>
              ))
            ) : (
              <p>No suggestions available</p>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="flex justify-end mt-2">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlbumSuggestions;
