'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  BookOpen, 
  ArrowRight, 
  LineChart, 
  ChevronDown,
  BarChart,
  PieChart,
  Calculator,
  ArrowDownRight,
  CheckCircle,
  Info,
  Play,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function Tutorial() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("introduction");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState(null);
  
  // Références pour la navigation par section
  const introRef = useRef(null);
  const basicsRef = useRef(null);
  const stepsRef = useRef(null);
  const exampleRef = useRef(null);
  const advantagesRef = useRef(null);
  
  // Effet d'apparition au chargement et gestion du défilement
  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
        setScrollPosition(window.scrollY);
        
        const scrollY = window.scrollY;
        const offset = 150; // Correction : le '/' a été supprimé
        
        if (introRef.current && scrollY >= introRef.current.offsetTop - offset && 
            scrollY < (basicsRef.current ? basicsRef.current.offsetTop - offset : Infinity)) {
            setActiveSection("introduction");
        } else if (basicsRef.current && scrollY >= basicsRef.current.offsetTop - offset &&
            scrollY < (stepsRef.current ? stepsRef.current.offsetTop - offset : Infinity)) {
            setActiveSection("basics");
        } else if (stepsRef.current && scrollY >= stepsRef.current.offsetTop - offset &&
            scrollY < (exampleRef.current ? exampleRef.current.offsetTop - offset : Infinity)) {
            setActiveSection("steps");
        } else if (exampleRef.current && scrollY >= exampleRef.current.offsetTop - offset &&
            scrollY < (advantagesRef.current ? advantagesRef.current.offsetTop - offset : Infinity)) {
            setActiveSection("example");
        } else if (advantagesRef.current && scrollY >= advantagesRef.current.offsetTop - offset) {
            setActiveSection("advantages");
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);

  // Fonction pour défiler jusqu'à une section
  const scrollToSection = (ref, sectionId) => {
    setActiveSection(sectionId);
    window.scrollTo({
      top: ref.current.offsetTop - 100,
      behavior: 'smooth'
    });
  };
  
  const parallaxOffset = scrollPosition * 0.1;

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
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-16 relative flex flex-col lg:flex-row gap-8">
        {/* Barre latérale de navigation */}
        <aside className="lg:w-1/4 lg:sticky lg:top-28 lg:self-start h-auto">
          <nav className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <h2 className="text-2xl font-bold text-[#232323] mb-6 pb-4 border-b border-gray-100">
              Guide du Tutoriel
            </h2>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => scrollToSection(introRef, "introduction")}
                  className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-all ${activeSection === "introduction" ? 'bg-gradient-to-r from-[#718EBF]/10 to-[#6B9080]/10 text-[#718EBF] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <BookOpen className={`w-5 h-5 mr-2 ${activeSection === "introduction" ? 'text-[#718EBF]' : 'text-[#6B9080]'}`} />
                  Introduction
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection(basicsRef, "basics")}
                  className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-all ${activeSection === "basics" ? 'bg-gradient-to-r from-[#718EBF]/10 to-[#6B9080]/10 text-[#718EBF] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <Info className={`w-5 h-5 mr-2 ${activeSection === "basics" ? 'text-[#718EBF]' : 'text-[#6B9080]'}`} />
                  Notions fondamentales
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection(stepsRef, "steps")}
                  className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-all ${activeSection === "steps" ? 'bg-gradient-to-r from-[#718EBF]/10 to-[#6B9080]/10 text-[#718EBF] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <CheckCircle className={`w-5 h-5 mr-2 ${activeSection === "steps" ? 'text-[#718EBF]' : 'text-[#6B9080]'}`} />
                  Étapes de la méthode
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection(exampleRef, "example")}
                  className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-all ${activeSection === "example" ? 'bg-gradient-to-r from-[#718EBF]/10 to-[#6B9080]/10 text-[#718EBF] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <Calculator className={`w-5 h-5 mr-2 ${activeSection === "example" ? 'text-[#718EBF]' : 'text-[#6B9080]'}`} />
                  Exemple pratique
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection(advantagesRef, "advantages")}
                  className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-all ${activeSection === "advantages" ? 'bg-gradient-to-r from-[#718EBF]/10 to-[#6B9080]/10 text-[#718EBF] font-medium' : 'hover:bg-gray-50'}`}
                >
                  <BarChart className={`w-5 h-5 mr-2 ${activeSection === "advantages" ? 'text-[#718EBF]' : 'text-[#6B9080]'}`} />
                  Avantages et limites
                </button>
              </li>
            </ul>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
  <div className="bg-gradient-to-r from-[#718EBF]/10 to-[#6B9080]/10 rounded-lg p-4">
    <div className="flex items-center mb-2">
      <HelpCircle className="w-5 h-5 text-[#718EBF] mr-2" />
      <h3 className="font-medium text-[#232323]">Besoin d'aide ?</h3>
    </div>
    <p className="text-sm text-[#6B9080] mb-4">Vous avez des questions sur la méthode des sections homogènes ?</p>
    <a href="mailto:s_boukhedimi@esi.dz" className="w-full inline-block">
      <Button
        size="sm"
        className="w-full bg-gradient-to-r from-[#718EBF] to-[#6B9080] hover:from-[#6B9080] hover:to-[#718EBF] text-white transition-all duration-300"
      >
        <span className="flex items-center justify-center">
          Contacter l'assistance
          <ArrowRight className="ml-2 w-4 h-4" />
        </span>
      </Button>
    </a>
  </div>
</div>
          </nav>
        </aside>
        
        {/* Contenu principal */}
        <main className="lg:w-3/4">
          {/* Titre de la page */}
          <div 
            className={`mb-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transform: `translateY(${parallaxOffset}px)` }}
          >
            <div className="flex items-center mb-4">
              <BookOpen className="w-8 h-8 text-[#718EBF] mr-3" />
              <h1 className="text-5xl font-bold text-[#232323] tracking-tight">
                Tutoriel
              </h1>
            </div>
            <p className="text-xl text-[#6B9080] max-w-3xl mb-6">
              Guide complet sur la méthode des sections homogènes en comptabilité analytique
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-[#718EBF] to-[#6B9080] rounded-full"></div>
          </div>

          {/* Section Introduction */}
          <section 
            ref={introRef}
            id="introduction" 
            className={`mb-16 bg-white rounded-xl shadow-lg p-8 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="text-3xl font-bold text-[#232323] mb-6 flex items-center">
              <BookOpen className="w-7 h-7 text-[#718EBF] mr-3" />
              Introduction à la comptabilité analytique
            </h2>
            
            <div className="prose max-w-none text-[#232323]">
              <p className="text-lg mb-4">
                La comptabilité analytique est un outil de gestion essentiel pour les entreprises, permettant d'analyser les coûts et les performances internes. Contrairement à la comptabilité générale qui s'intéresse aux flux externes, la comptabilité analytique se concentre sur les informations internes de l'entreprise.
              </p>
              
              <div className="bg-gradient-to-r from-[#718EBF]/5 to-[#6B9080]/5 p-6 rounded-lg border-l-4 border-[#718EBF] my-6">
                <h3 className="text-xl font-semibold text-[#232323] mb-2">Définition</h3>
                <p>
                  La <strong>comptabilité analytique</strong> est un système d'information qui identifie, mesure, analyse et interprète les informations de coûts pour aider les dirigeants à prendre des décisions éclairées.
                </p>
              </div>
              
              <p className="mb-4">
                Parmi les différentes méthodes de comptabilité analytique, la <strong>méthode des sections homogènes</strong> est l'une des plus utilisées en Europe et particulièrement en France. Elle permet de répartir les charges indirectes entre les différents produits ou services de l'entreprise.
              </p>
              
              <h3 className="text-xl font-semibold text-[#232323] mt-8 mb-4">Objectifs de la méthode des sections homogènes :</h3>
              
              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-white border border-[#718EBF]/20 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-[#718EBF] mb-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Détermination des coûts</span>
                  </div>
                  <p className="text-sm">Calculer avec précision le coût de revient des produits ou services</p>
                </div>
                <div className="bg-white border border-[#718EBF]/20 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-[#718EBF] mb-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Contrôle de gestion</span>
                  </div>
                  <p className="text-sm">Surveiller et contrôler les coûts à travers l'organisation</p>
                </div>
                <div className="bg-white border border-[#718EBF]/20 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-[#718EBF] mb-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Aide à la décision</span>
                  </div>
                  <p className="text-sm">Fournir des informations pour les décisions stratégiques et opérationnelles</p>
                </div>
                <div className="bg-white border border-[#718EBF]/20 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center text-[#718EBF] mb-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Tarification</span>
                  </div>
                  <p className="text-sm">Établir des prix de vente en fonction des coûts réels</p>
                </div>
              </div>
              
              <p>
                Grâce à ce tutoriel, vous découvrirez en détail le fonctionnement de la méthode des sections homogènes, ses principes fondamentaux, ainsi que les étapes pratiques pour la mettre en œuvre dans votre organisation.
              </p>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => scrollToSection(basicsRef, "basics")}
                className="bg-gradient-to-r from-[#6B9080] to-[#718EBF] hover:from-[#718EBF] hover:to-[#6B9080] text-white transition-all duration-300 group"
              >
                <span className="flex items-center">
                  Continuer
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </section>

          {/* Section Notions fondamentales */}
          <section 
            ref={basicsRef}
            id="basics" 
            className={`mb-16 bg-white rounded-xl shadow-lg p-8 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="text-3xl font-bold text-[#232323] mb-6 flex items-center">
              <Info className="w-7 h-7 text-[#718EBF] mr-3" />
              Notions fondamentales
            </h2>
            
            <div className="prose max-w-none text-[#232323]">
              <p className="text-lg mb-6">
                Avant d'aborder la méthode des sections homogènes, il est essentiel de comprendre certains concepts clés de la comptabilité analytique.
              </p>
              
              <h3 className="text-xl font-semibold text-[#232323] mt-8 mb-4">Types de charges</h3>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-gradient-to-br from-white to-[#718EBF]/5 rounded-xl p-6 shadow-sm border border-[#718EBF]/10">
                  <h4 className="text-lg font-semibold text-[#718EBF] mb-3">Charges directes</h4>
                  <p className="mb-3">Les charges directes sont des coûts qui peuvent être directement attribués à un produit ou service spécifique.</p>
                  <div className="text-sm">
                    <p className="flex items-start mb-2">
                      <ArrowDownRight className="w-4 h-4 text-[#718EBF] mr-2 mt-1 flex-shrink-0" />
                      <span>Matières premières utilisées pour un produit spécifique</span>
                    </p>
                    <p className="flex items-start mb-2">
                      <ArrowDownRight className="w-4 h-4 text-[#718EBF] mr-2 mt-1 flex-shrink-0" />
                      <span>Main-d'œuvre directement impliquée dans la production</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-[#6B9080]/5 rounded-xl p-6 shadow-sm border border-[#6B9080]/10">
                  <h4 className="text-lg font-semibold text-[#6B9080] mb-3">Charges indirectes</h4>
                  <p className="mb-3">Les charges indirectes sont des coûts qui ne peuvent pas être directement attribués à un produit ou service spécifique.</p>
                  <div className="text-sm">
                    <p className="flex items-start mb-2">
                      <ArrowDownRight className="w-4 h-4 text-[#6B9080] mr-2 mt-1 flex-shrink-0" />
                      <span>Loyer des bâtiments administratifs</span>
                    </p>
                    <p className="flex items-start mb-2">
                      <ArrowDownRight className="w-4 h-4 text-[#6B9080] mr-2 mt-1 flex-shrink-0" />
                      <span>Frais généraux (électricité, assurances, etc.)</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-[#232323] mt-10 mb-4">Qu'est-ce qu'une section homogène ?</h3>
              
              <div className="bg-gradient-to-r from-[#718EBF]/5 to-[#6B9080]/5 p-6 rounded-lg border-l-4 border-[#6B9080] my-6">
                <p>
                  Une <strong>section homogène</strong> est une division de l'entreprise qui regroupe des activités similaires ou contribuant à une même fonction. Chaque section possède une unité de mesure spécifique appelée <strong>unité d'œuvre</strong> qui permet de quantifier son activité.
                </p>
              </div>
              
              <p className="mb-4">
                Les sections homogènes peuvent être classées en deux catégories principales :
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="relative overflow-hidden rounded-xl bg-white shadow-md border border-[#718EBF]/20 p-6">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#718EBF]/10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
                  <h4 className="text-lg font-semibold text-[#718EBF] mb-3 relative z-10">Sections principales</h4>
                  <p className="relative z-10 mb-3">
                    Directement liées à la production ou à la fourniture de services aux clients. Leurs coûts sont imputés directement aux produits ou services.
                  </p>
                  <div className="relative z-10 text-sm">
                    <p className="mb-1 font-medium">Exemples :</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Atelier de production</li>
                      <li>Département d'assemblage</li>
                      <li>Service après-vente</li>
                    </ul>
                  </div>
                </div>
                
                <div className="relative overflow-hidden rounded-xl bg-white shadow-md border border-[#6B9080]/20 p-6">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#6B9080]/10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
                  <h4 className="text-lg font-semibold text-[#6B9080] mb-3 relative z-10">Sections auxiliaires</h4>
                  <p className="relative z-10 mb-3">
                    Fournissent des services aux autres sections de l'entreprise. Leurs coûts sont répartis entre les sections principales.
                  </p>
                  <div className="relative z-10 text-sm">
                    <p className="mb-1 font-medium">Exemples :</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Service d'entretien</li>
                      <li>Département informatique</li>
                      <li>Ressources humaines</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-[#232323] mt-10 mb-4">Unités d'œuvre</h3>
              
              <p className="mb-4">
                L'<strong>unité d'œuvre</strong> est la mesure de l'activité d'une section. Elle doit être :
              </p>
              
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Représentative de l'activité de la section</li>
                <li>Facile à mesurer</li>
                <li>Corrélée au volume de charges de la section</li>
              </ul>
              
              <div className="overflow-x-auto my-8">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-[#718EBF]/10 to-[#6B9080]/10">
                    <tr>
                      <th className="py-3 px-4 border-b text-left font-semibold text-[#232323]">Section</th>
                      <th className="py-3 px-4 border-b text-left font-semibold text-[#232323]">Exemple d'unité d'œuvre</th>
                      <th className="py-3 px-4 border-b text-left font-semibold text-[#232323]">Justification</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 border-b">Atelier de production</td>
                      <td className="py-3 px-4 border-b">Heure-machine</td>
                      <td className="py-3 px-4 border-b">Reflète l'utilisation des équipements</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 border-b">Entretien</td>
                      <td className="py-3 px-4 border-b">Heure de main-d'œuvre</td>
                      <td className="py-3 px-4 border-b">Mesure le temps consacré à chaque section</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b">Approvisionnement</td>
                      <td className="py-3 px-4 border-b">Nombre de commandes</td>
                      <td className="py-3 px-4 border-b">Reflète l'activité d'achat</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="py-3 px-4 border-b">Distribution</td>
                      <td className="py-3 px-4 border-b">Kilogrammes expédiés</td>
                      <td className="py-3 px-4 border-b">Mesure l'effort de distribution</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => scrollToSection(stepsRef, "steps")}
                className="bg-gradient-to-r from-[#6B9080] to-[#718EBF] hover:from-[#718EBF] hover:to-[#6B9080] text-white transition-all duration-300 group"
              >
                <span className="flex items-center">
                  Continuer
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </section>

          {/* Section Étapes de la méthode */}
          <section 
            ref={stepsRef}
            id="steps" 
            className={`mb-16 bg-white rounded-xl shadow-lg p-8 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="text-3xl font-bold text-[#232323] mb-6 flex items-center">
              <CheckCircle className="w-7 h-7 text-[#718EBF] mr-3" />
              Étapes de la méthode des sections homogènes
            </h2>
            
            <div className="prose max-w-none text-[#232323]">
              <p className="text-lg mb-6">
                La mise en œuvre de la méthode des sections homogènes suit un processus structuré en six étapes clés. Voici comment procéder de façon méthodique :
              </p>
              
              <div className="relative my-12">
                {/* Ligne de temps verticale */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#718EBF] to-[#6B9080] rounded-full"></div>
                
                {/* Étape 1 */}
                <div className="relative pl-20 pb-12">
                  <div className="absolute left-4 flex items-center justify-center w-8 h-8 bg-[#718EBF] text-white rounded-full shadow-lg font-bold">1</div>
                  <h3 className="text-xl font-semibold text-[#718EBF] mb-3">Identification des sections homogènes</h3>
                  <div className="bg-white rounded-lg shadow-sm border border-[#718EBF]/10 p-5">
                    <p className="mb-3">Pour commencer, il est crucial d'identifier les différentes sections homogènes au sein de l'entreprise. Une section homogène est un regroupement d'activités similaires qui contribuent à une fonction spécifique. Ces sections peuvent être :</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                      <li><strong>Sections principales</strong> : directement impliquées dans la production ou la prestation de services aux clients. Exemples : atelier de fabrication, département de montage, service client.</li>
                      <li><strong>Sections auxiliaires</strong> : fournissent des services de support aux autres sections. Exemples : maintenance, informatique, ressources humaines.</li>
                    </ul>
                    <p>L'objectif est de diviser l'entreprise en unités où les coûts peuvent être mesurés et alloués de manière cohérente.</p>
                  </div>
                </div>

                {/* Étape 2 */}
                <div className="relative pl-20 pb-12">
                  <div className="absolute left-4 flex items-center justify-center w-8 h-8 bg-[#718EBF] text-white rounded-full shadow-lg font-bold">2</div>
                  <h3 className="text-xl font-semibold text-[#718EBF] mb-3">Détermination des unités d'œuvre</h3>
                  <div className="bg-white rounded-lg shadow-sm border border-[#718EBF]/10 p-5">
                    <p className="mb-3">Chaque section homogène doit avoir une <strong>unité d'œuvre</strong>, qui est une mesure quantitative de son activité. Cette unité doit être :</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                      <li>Pertinente pour l'activité de la section</li>
                      <li>Facile à quantifier</li>
                      <li>Corrélée avec les charges de la section</li>
                    </ul>
                    <p>Exemples d'unités d'œuvre :</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Pour un atelier de production : heures-machine</li>
                      <li>Pour la maintenance : heures de travail</li>
                      <li>Pour l'approvisionnement : nombre de commandes traitées</li>
                    </ul>
                    <p>Le choix approprié de l'unité d'œuvre est essentiel pour une allocation précise des coûts.</p>
                  </div>
                </div>

                {/* Étape 3 */}
                <div className="relative pl-20 pb-12">
                  <div className="absolute left-4 flex items-center justify-center w-8 h-8 bg-[#718EBF] text-white rounded-full shadow-lg font-bold">3</div>
                  <h3 className="text-xl font-semibold text-[#718EBF] mb-3">Collecte des charges indirectes pour chaque section</h3>
                  <div className="bg-white rounded-lg shadow-sm border border-[#718EBF]/10 p-5">
                    <p className="mb-3">Réunissez toutes les charges indirectes associées à chaque section. Ces charges incluent :</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                      <li>Salaires du personnel de la section</li>
                      <li>Amortissements des équipements</li>
                      <li>Consommables spécifiques à la section</li>
                      <li>Autres frais généraux alloués à la section</li>
                    </ul>
                    <p>Il est important de s'assurer que toutes les charges indirectes sont correctement enregistrées pour chaque section afin d'éviter des distorsions dans l'allocation des coûts.</p>
                  </div>
                </div>

                {/* Étape 4 */}
                <div className="relative pl-20 pb-12">
                  <div className="absolute left-4 flex items-center justify-center w-8 h-8 bg-[#718EBF] text-white rounded-full shadow-lg font-bold">4</div>
                  <h3 className="text-xl font-semibold text-[#718EBF] mb-3">Répartition des charges des sections auxiliaires</h3>
                  <div className="bg-white rounded-lg shadow-sm border border-[#718EBF]/10 p-5">
                    <p className="mb-3">Les sections auxiliaires fournissent des services à d'autres sections, donc leurs charges doivent être réparties. Pour ce faire :</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                      <li>Déterminez la quantité d'unité d'œuvre fournie par chaque section auxiliaire à chaque section bénéficiaire.</li>
                      <li>Calculez le taux de charge par unité d'œuvre pour la section auxiliaire (total des charges / total des unités d'œuvre fournies).</li>
                      <li>Allouez les charges aux sections bénéficiaires en fonction des unités d'œuvre consommées.</li>
                    </ul>
                    <p>Si des sections auxiliaires se fournissent mutuellement des services, une méthode itérative ou un système d'équations peut être nécessaire pour résoudre les interdépendances.</p>
                  </div>
                </div>

                {/* Étape 5 */}
                <div className="relative pl-20 pb-12">
                  <div className="absolute left-4 flex items-center justify-center w-8 h-8 bg-[#718EBF] text-white rounded-full shadow-lg font-bold">5</div>
                  <h3 className="text-xl font-semibold text-[#718EBF] mb-3">Calcul du coût total des sections principales</h3>
                  <div className="bg-white rounded-lg shadow-sm border border-[#718EBF]/10 p-5">
                    <p className="mb-3">Une fois les charges des sections auxiliaires réparties, additionnez pour chaque section principale :</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                      <li>Ses propres charges indirectes</li>
                      <li>Les charges allouées par les sections auxiliaires</li>
                    </ul>
                    <p>Cela donne le coût total de chaque section principale, qui sera ensuite alloué aux produits ou services.</p>
                  </div>
                </div>

                {/* Étape 6 */}
                <div className="relative pl-20 pb-12">
                  <div className="absolute left-4 flex items-center justify-center w-8 h-8 bg-[#718EBF] text-white rounded-full shadow-lg font-bold">6</div>
                  <h3 className="text-xl font-semibold text-[#718EBF] mb-3">Allocation des charges des sections principales aux produits</h3>
                  <div className="bg-white rounded-lg shadow-sm border border-[#718EBF]/10 p-5">
                    <p className="mb-3">Enfin, allouez les coûts des sections principales aux différents produits ou services :</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                      <li>Déterminez la quantité d'unité d'œuvre de chaque section principale utilisée par chaque produit.</li>
                      <li>Calculez le taux de charge par unité d'œuvre pour chaque section principale.</li>
                      <li>Multipliez ce taux par le nombre d'unités d'œuvre consommées par chaque produit pour obtenir le coût alloué.</li>
                    </ul>
                    <p>Ce processus permet de déterminer le coût de revient complet de chaque produit ou service.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => scrollToSection(exampleRef, "example")}
                className="bg-gradient-to-r from-[#6B9080] to-[#718EBF] hover:from-[#718EBF] hover:to-[#6B9080] text-white transition-all duration-300 group"
              >
                <span className="flex items-center">
                  Continuer
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </section>

          {/* Section Exemple pratique */}
          <section 
            ref={exampleRef}
            id="example" 
            className={`mb-16 bg-white rounded-xl shadow-lg p-8 transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="text-3xl font-bold text-[#232323] mb-6 flex items-center">
              <Calculator className="w-7 h-7 text-[#718EBF] mr-3" />
              Exemple pratique
            </h2>
            
            <div className="prose max-w-none text-[#232323]">
              <p className="text-lg mb-6">
                Illustrons la méthode des sections homogènes avec un exemple simple.
              </p>
              
              <h3 className="text-xl font-semibold text-[#232323] mt-8 mb-4">Contexte</h3>
              <p>Une entreprise a les sections suivantes :</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li><strong>Section principale A : Production</strong> (unité d'œuvre : heures-machine)</li>
                <li><strong>Section principale B : Assemblage</strong> (unité d'œuvre : heures de travail)</li>
                <li><strong>Section auxiliaire C : Maintenance</strong> (unité d'œuvre : heures de maintenance)</li>
              </ul>
              <p>Les charges indirectes sont :</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Section A : 10 000 €</li>
                <li>Section B : 8 000 €</li>
                <li>Section C : 5 000 €</li>
              </ul>
              <p>La section C fournit des services de maintenance : 200 heures à la section A et 300 heures à la section B.</p>
              
              <h3 className="text-xl font-semibold text-[#232323] mt-8 mb-4">Étape 1 : Répartition des charges de la section auxiliaire C</h3>
              <p>Calcul du taux de charge par heure de maintenance :</p>
              <p className="bg-gray-100 p-4 rounded-lg my-4">
                Taux = Total des charges de C / Total des heures fournies = 5 000 € / (200 + 300) heures = 5 000 € / 500 heures = 10 €/heure
              </p>
              <p>Allocation à la section A : 200 heures × 10 €/heure = 2 000 €</p>
              <p>Allocation à la section B : 300 heures × 10 €/heure = 3 000 €</p>
              
              <h3 className="text-xl font-semibold text-[#232323] mt-8 mb-4">Étape 2 : Calcul du coût total des sections principales</h3>
              <p>Pour la section A : 10 000 € (charges propres) + 2 000 € (allocation de C) = 12 000 €</p>
              <p>Pour la section B : 8 000 € + 3 000 € = 11 000 €</p>
              
              <h3 className="text-xl font-semibold text-[#232323] mt-8 mb-4">Étape 3 : Allocation aux produits</h3>
              <p>Supposons deux produits : X et Y.</p>
              <p>Utilisation des sections :</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Produit X : 100 heures-machine (A), 50 heures de travail (B)</li>
                <li>Produit Y : 150 heures-machine (A), 100 heures de travail (B)</li>
              </ul>
              <p>Calcul des taux :</p>
              <p className="bg-gray-100 p-4 rounded-lg my-4">
                Taux A = 12 000 € / (100 + 150) heures-machine = 12 000 € / 250 heures = 48 €/heure-machine<br />
                Taux B = 11 000 € / (50 + 100) heures = 11 000 € / 150 heures ≈ 73,33 €/heure
              </p>
              <p>Pour le produit X :</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Coût de A : 100 × 48 = 4 800 €</li>
                <li>Coût de B : 50 × 73,33 ≈ 3 666,67 €</li>
                <li>Total : 4 800 + 3 666,67 ≈ 8 466,67 €</li>
              </ul>
              <p>Pour le produit Y :</p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Coût de A : 150 × 48 = 7 200 €</li>
                <li>Coût de B : 100 × 73,33 ≈ 7 333,33 €</li>
                <li>Total : 7 200 + 7 333,33 ≈ 14 533,33 €</li>
              </ul>
              <p>Ainsi, les coûts indirects alloués sont de 8 466,67 € pour X et 14 533,33 € pour Y.</p>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => scrollToSection(advantagesRef, "advantages")}
                className="bg-gradient-to-r from-[#6B9080] to-[#718EBF] hover:from-[#718EBF] hover:to-[#6B9080] text-white transition-all duration-300 group"
              >
                <span className="flex items-center">
                  Continuer
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </section>

          {/* Section Avantages et limites */}
          <section 
            ref={advantagesRef}
            id="advantages" 
            className={`mb-16 bg-white rounded-xl shadow-lg p-8 transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="text-3xl font-bold text-[#232323] mb-6 flex items-center">
              <BarChart className="w-7 h-7 text-[#718EBF] mr-3" />
              Avantages et limites
            </h2>
            
            <div className="prose max-w-none text-[#232323]">
              <h3 className="text-xl font-semibold text-[#232323] mt-8 mb-4">Avantages</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Permet une répartition détaillée des coûts indirects, facilitant le contrôle des coûts.</li>
                <li>Aide à la prise de décision en matière de tarification en fournissant une meilleure compréhension de la structure des coûts.</li>
                <li>Facilite l'évaluation des performances des différentes sections de l'entreprise.</li>
                <li>Aide à identifier les inefficacités ou les domaines où des réductions de coûts sont possibles.</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-[#232323] mt-8 mb-4">Limites</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Peut être complexe et chronophage à mettre en place et à maintenir.</li>
                <li>Nécessite une collecte de données précise, ce qui peut être difficile.</li>
                <li>Le choix des unités d'œuvre peut être subjectif et ne pas toujours refléter les véritables inducteurs de coûts.</li>
                <li>Peut ne pas capturer toutes les nuances, en particulier dans les entreprises aux opérations diverses ou complexes.</li>
                <li>Les interdépendances entre sections auxiliaires peuvent compliquer le processus d'allocation.</li>
              </ul>
            </div>
          </section>

          {/* Conclusion */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-[#232323] mb-4">Prêt à commencer ?</h2>
            <p className="text-lg text-[#6B9080] mb-8">Appliquez la méthode des sections homogènes dans votre entreprise pour une meilleure gestion des coûts.</p>
            <Button
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
        </main>
      </div>
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
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Accueil</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">info@msh-analytics.fr</p>
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