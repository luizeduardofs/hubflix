"use client";

import { Button } from "@/components/ui/button";
import { Bell, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchModal } from "./search-modal";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-red-600">HubFlix</h1>
            <nav className="hidden md:flex space-x-6">
              <a
                href="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Início
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Filmes
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Séries
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Minha Lista
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:bg-white/10"
              aria-label="Buscar filmes"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              aria-label="Notificações"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              aria-label="Perfil do usuário"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
