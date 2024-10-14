import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Edit, Trash2 } from 'lucide-react';

const RecordGrid = () => {
  // TODO: Replace with actual data fetching logic
  const records = [
    { id: 1, title: 'Album 1', artist: 'Artist 1', year: 2021, genre: 'Rock', rating: 4, cover: 'https://picsum.photos/200' },
    { id: 2, title: 'Album 2', artist: 'Artist 2', year: 2019, genre: 'Pop', rating: 5, cover: 'https://picsum.photos/201' },
    // Add more mock data as needed
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {records.map((record) => (
        <Card key={record.id} className="overflow-hidden transition-shadow hover:shadow-lg">
          <img src={record.cover} alt={record.title} className="w-full h-48 object-cover" />
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">{record.title}</h3>
            <p className="text-sm text-gray-600">{record.artist}</p>
            <p className="text-sm text-gray-500">{record.year} • {record.genre}</p>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < record.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 p-4 flex justify-end space-x-2">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RecordGrid;