"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Folder, ArrowRight, Home, RefreshCw } from "lucide-react";
import Link from 'next/link';

export default function ProjectsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - ideally should come from environment variable
  // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const API_URL = 'http://127.0.0.1:8000';

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Add credentials and proper headers
      const response = await fetch(`${API_URL}/api/projets/`, {
        method: 'GET',
        credentials: 'include', // Include cookies if needed for authentication
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching projects: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Projects data:", data);
      setProjects(data);
      setIsLoaded(true);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError(err.message || "Network error when connecting to API");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Handle API connection check
  const checkApiConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_URL}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error("API connection check failed:", error);
      return false;
    }
  };

  // Function to handle manual retry with connection check
  const handleRetry = async () => {
    const isConnected = await checkApiConnection();
    if (!isConnected) {
      setError("Unable to connect to the API server. Please ensure the server is running at " + API_URL);
    } else {
      fetchProjects();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f7f9fc]">
      {/* Header */}
      <header 
        className={`bg-gradient-to-r from-[#718EBF] to-[#6B9080] text-white py-6 sticky top-0 z-10 shadow-md transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Folder className="w-6 h-6" />
            <h1 className="text-3xl font-bold">MSH Analytics</h1>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            Accueil
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#232323]">Mes Projets</h1>
              <p className="text-lg text-[#6B9080] max-w-2xl mt-2">
                Gérez vos analyses de comptabilité par la méthode des sections homogènes
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={fetchProjects}
                variant="outline"
                className="border-[#718EBF] text-[#718EBF] hover:bg-[#718EBF]/10"
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>

              <Button 
                className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] hover:from-[#6B9080] hover:to-[#718EBF] text-white shadow-md transition-all duration-300"
                size="lg"
                asChild
              >
                <Link href="/formulaire">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  {projects.length === 0 ? 'Créer mon premier projet' : 'Nouveau projet'}
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-8">
            {/* Loading state */}
            {isLoading && !error && (
              <div className="text-center py-8">
                <RefreshCw className="mx-auto h-8 w-8 text-[#718EBF] animate-spin" />
                <p className="mt-4 text-[#6B9080]">Chargement des projets...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200 p-6">
                <p className="text-red-600 mb-4">Une erreur est survenue lors du chargement des projets.</p>
                <p className="text-red-500 text-sm mb-4">{error}</p>
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
                    <p className="font-medium mb-2">Causes possibles:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Le serveur API n'est pas démarré</li>
                      <li>Problème de CORS (Cross-Origin Resource Sharing)</li>
                      <li>URL incorrecte ou problème de réseau</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={handleRetry}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Réessayer
                  </Button>
                </div>
              </div>
            )}

            {/* Projects list */}
            {!isLoading && !error && projects.map((project) => (
              <Card 
                key={project.id} 
                className="mb-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-[#718EBF]"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#232323]">
                        <Folder className="h-5 w-5 text-[#718EBF]" />
                        {project.name}
                      </CardTitle>
                      <CardDescription>Dernière modification: {project.last_updated}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#6B9080]">
                        {project.description}
                      </p>
                    </CardContent>
                  </div>
                  <div className="pr-6">
                    <Link href={`/view?id=${project.id}`}>
                      <Button
                        variant="ghost"
                        className="hover:bg-[#718EBF]/10 text-[#718EBF] rounded-full p-2"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty state */}
          {!isLoading && !error && projects.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-4 text-[#6B9080]/50">
                <Folder className="mx-auto h-16 w-16" />
              </div>
              <h3 className="text-xl font-medium text-[#232323] mb-2">Aucun projet</h3>
              <p className="text-[#6B9080] mb-6">Vous n'avez pas encore créé de projet d'analyse</p>
              <Button 
                className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] hover:from-[#6B9080] hover:to-[#718EBF] text-white"
                asChild
              >
                <Link href="/formulaire">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Créer mon premier projet
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

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