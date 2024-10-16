import React from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Album, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AlbumSuggestions = ({ suggestions }) => {
  // TODO: Replace with actual data fetching logic
  const dummySuggestions = [
    { id: 1, title: 'Suggested Album 1', cover: 'https://picsum.photos/100?random=1' },
    { id: 2, title: 'Suggested Album 2', cover: 'https://picsum.photos/100?random=2' },
    { id: 3, title: 'Suggested Album 3', cover: 'https://picsum.photos/100?random=3' },
    { id: 4, title: 'Suggested Album 4', cover: 'https://picsum.photos/100?random=4' },
    { id: 5, title: 'Suggested Album 5', cover: 'https://picsum.photos/100?random=5' },
    { id: 6, title: 'Suggested Album 6', cover: 'https://picsum.photos/100?random=6' },
  ];

  return (
    <div className="w-full bg-gray-100 py-4 mb-6">
      <div className="container mx-auto">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Album className="mr-2" /> Suggested Albums
        </h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {dummySuggestions.map((album) => (
              <div key={album.id} className="w-[100px] text-center">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-[100px] h-[100px] rounded-md object-cover mx-auto"
                />
                <p className="mt-2 text-sm truncate">{album.title}</p>
              </div>
            ))}
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