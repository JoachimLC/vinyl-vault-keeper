import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Edit, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RecordGrid = () => {
  // TODO: Replace with actual data fetching logic
  const initialRecords = [
    { id: 1, title: 'Album 1', artist: 'Artist 1', year: 2021, genre: 'Rock', rating: 4, cover: 'https://picsum.photos/200' },
    { id: 2, title: 'Album 2', artist: 'Artist 2', year: 2019, genre: 'Pop', rating: 5, cover: 'https://picsum.photos/201' },
    { id: 3, title: 'Album 3', artist: 'Artist 3', year: 2020, genre: 'Jazz', rating: 3, cover: 'https://picsum.photos/202' },
    { id: 4, title: 'Album 4', artist: 'Artist 4', year: 2018, genre: 'Rock', rating: 4, cover: 'https://picsum.photos/203' },
    { id: 5, title: 'Album 5', artist: 'Artist 5', year: 2022, genre: 'Classical', rating: 5, cover: 'https://picsum.photos/204' },
  ];

  const [records, setRecords] = useState(initialRecords);
  const [sortBy, setSortBy] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  const genres = useMemo(() => [...new Set(initialRecords.map(record => record.genre))], [initialRecords]);

  const sortedAndFilteredRecords = useMemo(() => {
    let result = [...records];
    
    if (filterGenre) {
      result = result.filter(record => record.genre === filterGenre);
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'year') {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'genre') {
      result.sort((a, b) => a.genre.localeCompare(b.genre));
    }

    return result;
  }, [records, sortBy, filterGenre]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Sort by Rating</SelectItem>
            <SelectItem value="year">Sort by Year</SelectItem>
            <SelectItem value="genre">Sort by Genre</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterGenre} onValueChange={setFilterGenre}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by genre..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Genres</SelectItem>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFilteredRecords.map((record) => (
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
    </div>
  );
};

export default RecordGrid;