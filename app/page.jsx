'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, BookOpen, ArrowRight, LineChart, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Effet d'apparition au chargement
  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollPosition * 0.2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f7f9fc] overflow-hidden">
      {/* Formes décoratives */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#718EBF] opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6B9080] opacity-10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      
      {/* Header avec animation de fondu */}
      <header 
        className={`bg-gradient-to-r from-[#718EBF] to-[#6B9080] text-white py-6 sticky top-0 z-10 shadow-md transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LineChart className="w-6 h-6" />
            <h1 className="text-3xl font-bold">MSH Analytics</h1>
          </div>
          <nav>
            <ul className="flex gap-6">
              <li><a href="/" className="hover:text-white/80 transition-colors">Accueil</a></li>
              <li><a href="/tutorial" className="hover:text-white/80 transition-colors">Documentation</a></li>
              <li><a href="mailto:s_boukhedimi@esi.dz" className="hover:text-white/80 transition-colors">Contact</a></li>
              </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-16 relative">
        {/* Titre principal avec animation de fondu */}
        <div 
          className={`text-center mb-20 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          <h1 className="text-6xl font-bold mb-8 text-[#232323] tracking-tight">
            Méthode des <span className="text-[#718EBF]">Sections</span> <span className="text-[#6B9080]">Homogènes</span>
          </h1>
          <p className="text-xl text-[#6B9080] max-w-2xl mx-auto mb-8">
            Un outil pédagogique interactif pour comprendre et appliquer la
            méthode des sections homogènes en comptabilité analytique.
          </p>
          <div className="flex justify-center gap-2 animate-bounce mt-16">
            <ChevronDown className="w-6 h-6 text-[#6B9080]" />
            <span className="text-[#6B9080] font-medium">Découvrir</span>
            <ChevronDown className="w-6 h-6 text-[#6B9080]" />
          </div>
        </div>
        
        {/* Cartes avec animations au survol et au chargement */}
        <div 
          className={`grid md:grid-cols-2 gap-12 mb-20 max-w-5xl mx-auto transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <Link 
            href="/centers" 
            className="block transform transition-all duration-500"
            onMouseEnter={() => setHoveredCard('centers')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Card 
              className={`h-full border-none bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group ${hoveredCard === 'centers' ? 'scale-105' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#718EBF]/10 to-[#6B9080]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#718EBF] to-[#6B9080] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              
              <CardHeader className="text-center pb-2 pt-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#718EBF]/10 flex items-center justify-center group-hover:bg-[#718EBF]/20 transition-all duration-500">
                  <BarChart3 className="w-12 h-12 text-[#718EBF] group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardTitle className="text-3xl text-[#232323] font-bold">Centres d'Analyse</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-[#6B9080] px-8 pb-8">
                <p className="text-lg mb-6">Gérez vos centres d'analyse principaux et auxiliaires avec une interface intuitive et interactive</p>
                <div className="flex items-center justify-center text-[#718EBF] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Accéder</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link 
            href="/tutorial" 
            className="block transform transition-all duration-500"
            onMouseEnter={() => setHoveredCard('tutorial')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Card 
              className={`h-full border-none bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group ${hoveredCard === 'tutorial' ? 'scale-105' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#6B9080]/10 to-[#718EBF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#6B9080] to-[#718EBF] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              
              <CardHeader className="text-center pb-2 pt-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#6B9080]/10 flex items-center justify-center group-hover:bg-[#6B9080]/20 transition-all duration-500">
                  <BookOpen className="w-12 h-12 text-[#6B9080] group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardTitle className="text-3xl text-[#232323] font-bold">Tutoriel</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-[#6B9080] px-8 pb-8">
                <p className="text-lg mb-6">Apprenez à utiliser l'application à travers nos guides interactifs et nos exemples pratiques</p>
                <div className="flex items-center justify-center text-[#6B9080] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Découvrir</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        {/* Bouton animé */}
        <div 
          className={`text-center transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#6B9080] to-[#718EBF] hover:from-[#718EBF] hover:to-[#6B9080] text-white text-lg px-10 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
          >
            <Link href="/centers">
              <span className="relative z-10 flex items-center">
                Commencer maintenant
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            </Link>
          </Button>
        </div>
        
        {/* Section statistiques */}
        <div className={`mt-32 grid grid-cols-3 gap-8 max-w-4xl mx-auto text-center transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="p-6">
            <div className="text-4xl font-bold text-[#718EBF] mb-2">98%</div>
            <p className="text-[#6B9080]">Taux de satisfaction</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-[#718EBF] mb-2">5000+</div>
            <p className="text-[#6B9080]">Utilisateurs actifs</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-[#718EBF] mb-2">250+</div>
            <p className="text-[#6B9080]">Tutoriels disponibles</p>
          </div>
        </div>
      </main>
      
      {/* Footer avec animation */}
      <footer 
        className={`bg-[#232323] text-white py-8 mt-20 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">MSH Analytics</h3>
              <p className="text-gray-300">La solution complète pour la comptabilité analytique.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
              <li><a href="/" className="hover:text-white/80 transition-colors">Accueil</a></li>
              <li><a href="/tutorial" className="hover:text-white/80 transition-colors">Documentation</a></li>
              <li><a href="mailto:s_boukhedimi@esi.dz" className="hover:text-white/80 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">s_boukhedimi@esi.dz</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center">
            <p>© 2025 Méthode des Sections Homogènes. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}