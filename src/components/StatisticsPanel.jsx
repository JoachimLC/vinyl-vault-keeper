import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const StatisticsPanel = () => {
  // TODO: Replace with actual data
  const stats = {
    totalRecords: 50,
    averageRating: 4.2,
    topArtist: 'The Beatles',
    totalPlaytime: '2d 5h 30m',
    mostCommonDecade: '1970s',
    newestRecord: 'Album X (2023)',
    oldestRecord: 'Album Y (1956)',
  };

  const genreData = [
    { name: 'Rock', value: 20 },
    { name: 'Pop', value: 15 },
    { name: 'Jazz', value: 10 },
    { name: 'Classical', value: 5 },
  ];

  const decadeData = [
    { name: '1960s', count: 5 },
    { name: '1970s', count: 15 },
    { name: '1980s', count: 10 },
    { name: '1990s', count: 8 },
    { name: '2000s', count: 7 },
    { name: '2010s', count: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Collection Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem title="Total Records" value={stats.totalRecords} />
          <StatItem title="Average Rating" value={stats.averageRating.toFixed(1)} />
          <StatItem title="Top Artist" value={stats.topArtist} />
          <StatItem title="Total Playtime" value={stats.totalPlaytime} />
          <StatItem title="Most Common Decade" value={stats.mostCommonDecade} />
          <StatItem title="Newest Record" value={stats.newestRecord} />
          <StatItem title="Oldest Record" value={stats.oldestRecord} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Genre Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
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
                <Tooltip />
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
          <div>
            <h3 className="text-lg font-semibold mb-4">Records by Decade</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={decadeData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatItem = ({ title, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default StatisticsPanel;