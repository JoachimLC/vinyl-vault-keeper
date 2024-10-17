import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';

const StatisticsPanel = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/statistics', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token
          },
        });
        console.log('Statistics fetched:', response.data);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  if (!stats) {
    return <p>Loading statistics...</p>;
  }

  const genreData = stats.genreData.map(genre => ({
    name: genre.genre,
    value: genre._count.genre,
  }));

  const decadeData = stats.decadeData.map(decade => {
    const decadeLabel = `${Math.floor(decade.year / 10) * 10}s`;
    return {
      name: decadeLabel,
      count: decade._count.year,
    };
  });

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
