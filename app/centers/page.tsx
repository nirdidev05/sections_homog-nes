"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Folder, ArrowRight, Home } from "lucide-react";
import Link from 'next/link';

export default function ProjectsPage() {
  const [isLoaded, setIsLoaded] = useState(true);

  // Exemple de données - à remplacer par des données dynamiques
  const projects = [
    {
      id_: "PRJ-2025-002", 
      name: "ALFA",
      description: "Analyse détaillée des coûts de revient du nouveau produit X par méthode des sections homogènes.",
      lastUpdated: "08/04/2025"
    },
    {
      id: "PRJ-2025-003",
      name: "Budget Prévisionnel 2026",
      description: "Préparation du budget prévisionnel pour l'année fiscale 2026 avec méthode des sections homogènes.",
      lastUpdated: "12/04/2025"
    },
    {
      id: "PRJ-2025-004",
      name: "Étude Rentabilité Produit X",
      description: "Analyse détaillée des coûts de revient du nouveau produit X par méthode des sections homogènes.",
      lastUpdated: "08/04/2025"
    },
    {
      id: "PRJ-2025-005",
      name: "Réorganisation Sections Auxiliaires",
      description: "Projet d'optimisation des sections auxiliaires pour améliorer l'allocation des coûts indirects.",
      lastUpdated: "03/04/2025"
    }
  ];

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

            {projects.length === 0 ? (
              <Button 
                className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] hover:from-[#6B9080] hover:to-[#718EBF] text-white shadow-md transition-all duration-300"
                size="lg"
                asChild
              >
                <Link href="/formulaire">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Créer mon premier projet
                </Link>
              </Button>
            ) : (
              <Button 
                className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] hover:from-[#6B9080] hover:to-[#718EBF] text-white shadow-md transition-all duration-300"
                size="lg"
                asChild
              >
                <Link href="/formulaire">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Nouveau projet
                </Link>
              </Button>
            )}
          </div>

          <div className="mt-8">
            {projects.map((project) => (
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
                      <CardDescription>Dernière modification: {project.lastUpdated}</CardDescription>
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

          {/* Affichage si aucun projet */}
          {projects.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-4 text-[#6B9080]/50">
                <Folder className="mx-auto h-16 w-16" />
              </div>
              <h3 className="text-xl font-medium text-[#232323] mb-2">Aucun projet</h3>
              <p className="text-[#6B9080] mb-6">Vous n'avez pas encore créé de projet d'analyse</p>
              <Button 
                className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] hover:from-[#6B9080] hover:to-[#718EBF] text-white"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Créer mon premier projet
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
