import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const StatisticsPanel = () => {
  // TODO: Replace with actual data
  const stats = {
    totalRecords: 50,
    averageRating: 4.2,
    topArtist: 'The Beatles',
  };

  const genreData = [
    { name: 'Rock', value: 20 },
    { name: 'Pop', value: 15 },
    { name: 'Jazz', value: 10 },
    { name: 'Classical', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collection Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Total Records</p>
            <p className="text-2xl font-bold">{stats.totalRecords}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Average Rating</p>
            <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Top Artist</p>
            <p className="text-2xl font-bold">{stats.topArtist}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Genres</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center mt-2">
              {genreData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center mr-4">
                  <div className="w-3 h-3 mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsPanel;