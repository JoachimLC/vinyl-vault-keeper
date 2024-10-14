import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#333333] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/collection" className="text-2xl font-bold">VinylVault</Link>
        <div className="flex items-center space-x-4">
          <Link to="/collection" className="hover:text-[#1DB954]">My Collection</Link>
          <Button variant="ghost" size="icon">
            <UserCircle className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <LogOut className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;