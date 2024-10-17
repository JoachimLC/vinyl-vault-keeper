import axios from 'axios';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const endpoint = isLogin ? 'login' : 'register';

      const response = await axios.post(`http://localhost:5000/${endpoint}`, { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        navigate('/collection');
      } else {
        alert('Registration successful. You can now log in.');
        setIsLogin(true);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Register'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-[#1DB954] hover:bg-[#1ed760]">
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>
          <p className="mt-4 text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#1DB954]"
            >
              {isLogin ? 'Register' : 'Login'}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
