"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Info, Package, DollarSign, Layers } from "lucide-react";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from 'next/link';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Data from the JSON file, adapted to the required structure
const projectsData = [
  {
    projet: { id: "PRJ-2025-003", nom: "dfs" },
    charges_indirectes: {
      total_fixe: 240000, // Sum of fixed charges (Loyer: 100000, Entretien: 20000, Salaires: 80000, Amortissements: 40000)
      total_variable: 80000, // Sum of variable charges (Électricité: 50000, Eau et lubrifiants: 30000)
      total: 320000, // Total of fixed + variable
      repartition_primaire_fixe: [
        {
          nature: "Loyer",
          repartition: [
            { section: "Atelier 1", montant: 40 }, // Example percentages (adjust based on actual allocation logic)
            { section: "Atelier 2", montant: 30 },
            { section: "Magasin", montant: 20 },
            { section: "Administration", montant: 10 }
          ]
        },
        {
          nature: "Entretien",
          repartition: [
            { section: "Atelier 1", montant: 50 },
            { section: "Atelier 2", montant: 30 },
            { section: "Magasin", montant: 10 },
            { section: "Administration", montant: 10 }
          ]
        },
        {
          nature: "Salaires indirects",
          repartition: [
            { section: "Atelier 1", montant: 30 },
            { section: "Atelier 2", montant: 30 },
            { section: "Magasin", montant: 20 },
            { section: "Administration", montant: 20 }
          ]
        },
        {
          nature: "Amortissements",
          repartition: [
            { section: "Atelier 1", montant: 50 },
            { section: "Atelier 2", montant: 40 },
            { section: "Magasin", montant: 5 },
            { section: "Administration", montant: 5 }
          ]
        }
      ],
      repartition_primaire_variable: [
        {
          nature: "Électricité",
          repartition: [
            { section: "Atelier 1", montant: 50 },
            { section: "Atelier 2", montant: 30 },
            { section: "Magasin", montant: 10 },
            { section: "Administration", montant: 10 }
          ]
        },
        {
          nature: "Eau et lubrifiants",
          repartition: [
            { section: "Atelier 1", montant: 40 },
            { section: "Atelier 2", montant: 40 },
            { section: "Magasin", montant: 10 },
            { section: "Administration", montant: 10 }
          ]
        }
      ],
      repartition_secondaire_fixe: [
        {
          centre: "Magasin",
          repartition: [
            { section: "Atelier 1", montant: 70 }, // From repartitions_secondaire (id: 29)
            { section: "Atelier 2", montant: 30 }  // From repartitions_secondaire (id: 30)
          ]
        },
        {
          centre: "Administration",
          repartition: [
            { section: "Atelier 1", montant: 50 }, // From repartitions_secondaire (id: 31)
            { section: "Atelier 2", montant: 50 }  // From repartitions_secondaire (id: 32)
          ]
        }
      ],
      repartition_secondaire_variable: [
        {
          centre: "Magasin",
          repartition: [
            { section: "Atelier 1", montant: 70 }, // From repartitions_secondaire (id: 29)
            { section: "Atelier 2", montant: 30 }  // From repartitions_secondaire (id: 30)
          ]
        },
        {
          centre: "Administration",
          repartition: [
            { section: "Atelier 1", montant: 50 }, // From repartitions_secondaire (id: 31)
            { section: "Atelier 2", montant: 50 }  // From repartitions_secondaire (id: 32)
          ]
        }
      ]
    },
    couts_unitaires_sections: [
      {
        nom: "Atelier 1",
        quantite: 2500, // From unites_oeuvre (id: 15)
        total_fixe: 141800, // From sections (id: 33)
        total_variable: 44600, // From sections (id: 33)
        total: 186400, // total_fixe + total_variable
        cout_unitaire_fixe: 56.72, // From unites_oeuvre (id: 15)
        cout_unitaire_variable: 17.84, // From unites_oeuvre (id: 15)
        cout_unitaire_total: 74.56, // From unites_oeuvre (id: 15)
        unite: "Heure machine"
      },
      {
        nom: "Atelier 2",
        quantite: 2000, // From unites_oeuvre (id: 16)
        total_fixe: 98200, // From sections (id: 34)
        total_variable: 35400, // From sections (id: 34)
        total: 133600, // total_fixe + total_variable
        cout_unitaire_fixe: 49.10, // From unites_oeuvre (id: 16)
        cout_unitaire_variable: 17.70, // From unites_oeuvre (id: 16)
        cout_unitaire_total: 66.80, // From unites_oeuvre (id: 16)
        unite: "Heure de travail"
      }
    ],
    couts_unitaires_produits: [
      {
        nom: "Produit X",
        cout_unitaire_fixe: 162.54, // From produits (id: 17)
        cout_unitaire_variable: 53.38, // From produits (id: 17)
        cout_unitaire_total: 215.92, // From produits (id: 17)
        unite: "Unité",
        consommation: [
          { nom: "Atelier 1", quantite: 1 }, // Example (adjust based on actual data)
          { nom: "Atelier 2", quantite: 2 }
        ]
      },
      {
        nom: "Produit Y",
        cout_unitaire_fixe: 154.92, // From produits (id: 18)
        cout_unitaire_variable: 53.24, // From produits (id: 18)
        cout_unitaire_total: 208.16, // From produits (id: 18)
        unite: "Unité",
        consommation: [
          { nom: "Atelier 1", quantite: 2 }, // Example (adjust based on actual data)
          { nom: "Atelier 2", quantite: 1 }
        ]
      }
    ]
  },
  {
    projet: { id: "PRJ-2025-010", nom: "Gamma" },
    charges_indirectes: {
      total_fixe: 240000, // Same as project 9
      total_variable: 80000, // Same as project 9
      total: 320000, // Same as project 9
      repartition_primaire_fixe: [
        {
          nature: "Loyer",
          repartition: [
            { section: "Atelier 1", montant: 40 },
            { section: "Atelier 2", montant: 30 },
            { section: "Magasin", montant: 20 },
            { section: "Administration", montant: 10 }
          ]
        },
        {
          nature: "Entretien",
          repartition: [
            { section: "Atelier 1", montant: 50 },
            { section: "Atelier 2", montant: 30 },
            { section: "Magasin", montant: 10 },
            { section: "Administration", montant: 10 }
          ]
        },
        {
          nature: "Salaires indirects",
          repartition: [
            { section: "Atelier 1", montant: 30 },
            { section: "Atelier 2", montant: 30 },
            { section: "Magasin", montant: 20 },
            { section: "Administration", montant: 20 }
          ]
        },
        {
          nature: "Amortissements",
          repartition: [
            { section: "Atelier 1", montant: 50 },
            { section: "Atelier 2", montant: 40 },
            { section: "Magasin", montant: 5 },
            { section: "Administration", montant: 5 }
          ]
        }
      ],
      repartition_primaire_variable: [
        {
          nature: "Électricité",
          repartition: [
            { section: "Atelier 1", montant: 50 },
            { section: "Atelier 2", montant: 30 },
            { section: "Magasin", montant: 10 },
            { section: "Administration", montant: 10 }
          ]
        },
        {
          nature: "Eau et lubrifiants",
          repartition: [
            { section: "Atelier 1", montant: 40 },
            { section: "Atelier 2", montant: 40 },
            { section: "Magasin", montant: 10 },
            { section: "Administration", montant: 10 }
          ]
        }
      ],
      repartition_secondaire_fixe: [
        {
          centre: "Magasin",
          repartition: [
            { section: "Atelier 1", montant: 70 }, // From repartitions_secondaire (id: 33)
            { section: "Atelier 2", montant: 30 }  // From repartitions_secondaire (id: 34)
          ]
        },
        {
          centre: "Administration",
          repartition: [
            { section: "Atelier 1", montant: 50 }, // From repartitions_secondaire (id: 35)
            { section: "Atelier 2", montant: 50 }  // From repartitions_secondaire (id: 36)
          ]
        }
      ],
      repartition_secondaire_variable: [
        {
          centre: "Magasin",
          repartition: [
            { section: "Atelier 1", montant: 70 }, // From repartitions_secondaire (id: 33)
            { section: "Atelier 2", montant: 30 }  // From repartitions_secondaire (id: 34)
          ]
        },
        {
          centre: "Administration",
          repartition: [
            { section: "Atelier 1", montant: 50 }, // From repartitions_secondaire (id: 35)
            { section: "Atelier 2", montant: 50 }  // From repartitions_secondaire (id: 36)
          ]
        }
      ]
    },
    couts_unitaires_sections: [
      {
        nom: "Atelier 1",
        quantite: 2500, // From unites_oeuvre (id: 17)
        total_fixe: 141800, // From sections (id: 37)
        total_variable: 44600, // From sections (id: 37)
        total: 186400, // total_fixe + total_variable
        cout_unitaire_fixe: 56.72, // From unites_oeuvre (id: 17)
        cout_unitaire_variable: 17.84, // From unites_oeuvre (id: 17)
        cout_unitaire_total: 74.56, // From unites_oeuvre (id: 17)
        unite: "Heure machine"
      },
      {
        nom: "Atelier 2",
        quantite: 2000, // From unites_oeuvre (id: 18)
        total_fixe: 98200, // From sections (id: 38)
        total_variable: 35400, // From sections (id: 38)
        total: 133600, // total_fixe + total_variable
        cout_unitaire_fixe: 49.10, // From unites_oeuvre (id: 18)
        cout_unitaire_variable: 17.70, // From unites_oeuvre (id: 18)
        cout_unitaire_total: 66.80, // From unites_oeuvre (id: 18)
        unite: "Heure de travail"
      }
    ],
    couts_unitaires_produits: [
      {
        nom: "Produit X",
        cout_unitaire_fixe: 162.54, // From produits (id: 19)
        cout_unitaire_variable: 53.38, // From produits (id: 19)
        cout_unitaire_total: 215.92, // From produits (id: 19)
        unite: "Unité",
        consommation: [
          { nom: "Atelier 1", quantite: 1 }, // Example (adjust based on actual data)
          { nom: "Atelier 2", quantite: 2 }
        ]
      },
      {
        nom: "Produit Y",
        cout_unitaire_fixe: 154.92, // From produits (id: 20)
        cout_unitaire_variable: 53.24, // From produits (id: 20)
        cout_unitaire_total: 208.16, // From produits (id: 20)
        unite: "Unité",
        consommation: [
          { nom: "Atelier 1", quantite: 2 }, // Example (adjust based on actual data)
          { nom: "Atelier 2", quantite: 1 }
        ]
      }
    ]
  }
];

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [chargeTypeFilter, setChargeTypeFilter] = useState('all');
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  const [projectData, setProjectData] = useState(null);

  // Find the project based on the ID
  useEffect(() => {
    const foundProject = projectsData.find(project => project.projet.id === projectId);
    if (foundProject) {
      setProjectData(foundProject);
    }
    setTimeout(() => {
      setIsLoaded(true);
    }, 200);
  }, [projectId]);

  // Handle case where no project is found
  if (!projectData && isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#DFEAF2] to-white flex items-center justify-center">
        <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm p-6">
          <CardContent>
            <h2 className="text-2xl font-semibold text-[#232323]">Pas de projet avec ces coûts</h2>
            <Link href="/centers">
              <Button variant="ghost" className="mt-4 text-[#718EBF] hover:bg-[#718EBF]/10">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste des projets
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state
  if (!projectData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#DFEAF2] to-white flex items-center justify-center">
        <p className="text-[#232323]">Chargement...</p>
      </div>
    );
  }

  // Filter charges based on selected type
  const filteredCharges = chargeTypeFilter === 'all'
    ? [...projectData.charges_indirectes.repartition_primaire_fixe, ...projectData.charges_indirectes.repartition_primaire_variable]
    : chargeTypeFilter === 'Fixe'
      ? projectData.charges_indirectes.repartition_primaire_fixe
      : projectData.charges_indirectes.repartition_primaire_variable;

  // Data for the charges pie chart
  const chargesPieData = {
    labels: filteredCharges.map(charge => charge.nature),
    datasets: [{
      data: filteredCharges.map(charge => charge.repartition.reduce((sum, r) => sum + r.montant, 0)),
      backgroundColor: ['#718EBF', '#6B9080', '#EC4899', '#10B981', '#F59E0B'],
      borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
      borderWidth: 2,
    }],
  };

  // Data for the fixed/variable pie chart
  const fixedVariableData = {
    labels: ['Coûts Fixes', 'Coûts Variables'],
    datasets: [{
      data: [
        projectData.charges_indirectes.total_fixe,
        projectData.charges_indirectes.total_variable
      ],
      backgroundColor: ['#718EBF', '#6B9080'],
      borderColor: ['#ffffff', '#ffffff'],
      borderWidth: 2,
    }],
  };

  // Data for the section unit costs bar chart
  const unitCostsData = {
    labels: projectData.couts_unitaires_sections.map(section => section.nom),
    datasets: [
      {
        label: 'Coût Unitaire Fixe',
        data: projectData.couts_unitaires_sections.map(section => section.cout_unitaire_fixe),
        backgroundColor: '#718EBF',
      },
      {
        label: 'Coût Unitaire Variable',
        data: projectData.couts_unitaires_sections.map(section => section.cout_unitaire_variable),
        backgroundColor: '#6B9080',
      }
    ],
  };

  // Data for the product costs bar chart
  const productCostsData = {
    labels: projectData.couts_unitaires_produits.map(product => product.nom),
    datasets: [
      {
        label: 'Coût Unitaire Fixe',
        data: projectData.couts_unitaires_produits.map(product => product.cout_unitaire_fixe),
        backgroundColor: '#718EBF',
      },
      {
        label: 'Coût Unitaire Variable',
        data: projectData.couts_unitaires_produits.map(product => product.cout_unitaire_variable),
        backgroundColor: '#6B9080',
      }
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#DFEAF2] to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] text-white py-6 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Méthode des Sections Homogènes</h1>
            <p className="text-sm">Projet {projectData.projet.nom} • ID: {projectData.projet.id}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/20">
              <Download className="mr-2 h-4 w-4" /> Exporter
            </Button>
            <Link href="/centers">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#718EBF]/10 to-[#6B9080]/10 rounded-t-lg">
            <CardTitle className="text-[#232323] text-2xl">Tableau de bord du projet</CardTitle>
            <CardDescription className="text-[#232323]/70">
              Analyse des coûts pour {projectData.projet.nom} • ID: {projectData.projet.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-[#DFEAF2]">
                <TabsTrigger value="overview" className="text-xs md:text-sm">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="charges" className="text-xs md:text-sm">Charges</TabsTrigger>
                <TabsTrigger value="sections" className="text-xs md:text-sm">Sections</TabsTrigger>
                <TabsTrigger value="products" className="text-xs md:text-sm">Produits</TabsTrigger>
                <TabsTrigger value="repartition_secondaire" className="text-xs md:text-sm">Rép. Secondaire</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#232323] flex items-center">
                      <Info className="mr-2 h-5 w-5 text-[#718EBF]" />
                      Informations du projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-[#232323]/70">ID du projet</h3>
                        <p className="text-lg font-semibold text-[#232323]">{projectData.projet.id}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#232323]/70">Nom du projet</h3>
                        <p className="text-lg font-semibold text-[#232323]">{projectData.projet.nom}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                    <CardContent>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-[#232323]/70">Total Coûts Fixes</p>
                          <h3 className="text-2xl font-bold text-[#718EBF]">{projectData.charges_indirectes.total_fixe.toLocaleString()} €</h3>
                        </div>
                        <div className="bg-[#718EBF]/10 p-3 rounded-full">
                          <DollarSign className="text-[#718EBF]" size={24} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                    <CardContent>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-[#232323]/70">Total Coûts Variables</p>
                          <h3 className="text-2xl font-bold text-[#6B9080]">{projectData.charges_indirectes.total_variable.toLocaleString()} €</h3>
                        </div>
                        <div className="bg-[#6B9080]/10 p-3 rounded-full">
                          <DollarSign className="text-[#6B9080]" size={24} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                    <CardContent>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-[#232323]/70">Coût Total</p>
                          <h3 className="text-2xl font-bold text-[#232323]">{projectData.charges_indirectes.total.toLocaleString()} €</h3>
                        </div>
                        <div className="bg-[#232323]/10 p-3 rounded-full">
                          <DollarSign className="text-[#232323]" size={24} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-[#232323]">Répartition Fixe/Variable</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full h-64">
                        <Pie 
                          data={fixedVariableData} 
                          options={{ 
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'bottom' } } 
                          }} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-[#232323]">Répartition des charges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full h-64">
                        <Pie
                          data={chargesPieData}
                          options={{ 
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'bottom' } } 
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Charges Tab */}
              <TabsContent value="charges" className="space-y-6">
                <Card className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#232323] flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-[#718EBF]" />
                      Charges indirectes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-[#232323]/70 mb-2">Filtrer par type</h3>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => setChargeTypeFilter('all')}
                          variant={chargeTypeFilter === 'all' ? 'default' : 'outline'}
                          className={`bg-[#6B9080] hover:bg-[#6B9080]/90 ${chargeTypeFilter !== 'all' ? 'border-[#718EBF]/30 text-[#232323]' : ''}`}
                        >
                          Tous
                        </Button>
                        <Button 
                          onClick={() => setChargeTypeFilter('Fixe')}
                          variant={chargeTypeFilter === 'Fixe' ? 'default' : 'outline'}
                          className={`bg-[#6B9080] hover:bg-[#6B9080]/90 ${chargeTypeFilter !== 'Fixe' ? 'border-[#718EBF]/30 text-[#232323]' : ''}`}
                        >
                          Fixes
                        </Button>
                        <Button 
                          onClick={() => setChargeTypeFilter('Variable')}
                          variant={chargeTypeFilter === 'Variable' ? 'default' : 'outline'}
                          className={`bg-[#6B9080] hover:bg-[#6B9080]/90 ${chargeTypeFilter !== 'Variable' ? 'border-[#718EBF]/30 text-[#232323]' : ''}`}
                        >
                          Variables
                        </Button>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-md border border-[#DFEAF2]">
                      <table className="min-w-full divide-y divide-[#DFEAF2]">
                        <thead className="bg-[#DFEAF2]">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#232323]/70 uppercase">Nature</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#232323]/70 uppercase">Type</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Montant Total (%)</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#DFEAF2]">
                          {filteredCharges.map((charge, index) => (
                            <tr key={index} className="hover:bg-[#DFEAF2]/50">
                              <td className="px-6 py-4 text-sm font-medium text-[#232323]">{charge.nature}</td>
                              <td className="px-6 py-4 text-sm text-[#232323]/70">
                                <span className={`inline-flex px-3 py-0.5 rounded-full text-xs font-medium ${
                                  chargeTypeFilter === 'Fixe' ? 'bg-[#718EBF]/20 text-[#718EBF]' : chargeTypeFilter === 'Variable' ? 'bg-[#6B9080]/20 text-[#6B9080]' : 'bg-[#232323]/20 text-[#232323]'
                                }`}>
                                  {chargeTypeFilter === 'all' ? (index < projectData.charges_indirectes.repartition_primaire_fixe.length ? 'Fixe' : 'Variable') : chargeTypeFilter}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-[#232323]/70 text-right">{charge.repartition.reduce((sum, r) => sum + r.montant, 0)}%</td>
                            </tr>
                          ))}
                          <tr className="bg-[#DFEAF2]">
                            <td className="px-6 py-4 text-sm font-bold text-[#232323]">Total</td>
                            <td className="px-6 py-4"></td>
                            <td className="px-6 py-4 text-sm font-bold text-[#232323] text-right">
                              {filteredCharges.reduce((sum, charge) => sum + charge.repartition.reduce((s, r) => s + r.montant, 0), 0)}%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-[#232323] mb-4">Répartition graphique</h3>
                      <div className="h-72">
                        <Pie
                          data={chargesPieData}
                          options={{ 
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'right' } } 
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sections Tab */}
              <TabsContent value="sections" className="space-y-6">
                <Card className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#232323] flex items-center">
                      <Layers className="mr-2 h-5 w-5 text-[#718EBF]" />
                      Sections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto rounded-md border border-[#DFEAF2] mb-6">
                      <table className="min-w-full divide-y divide-[#DFEAF2]">
                        <thead className="bg-[#DFEAF2]">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#232323]/70 uppercase">Nom</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Quantité</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Coût unitaire fixe</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Coût unitaire variable</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Coût unitaire total</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Unité</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#DFEAF2]">
                          {projectData.couts_unitaires_sections.map((section, index) => (
                            <tr key={index} className="hover:bg-[#DFEAF2]/50">
                              <td className="px-6 py-4 text-sm font-medium text-[#232323]">{section.nom}</td>
                              <td className="px-6 py-4 text-sm text-[#232323]/70 text-right">{section.quantite.toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm text-[#232323]/70 text-right">{section.cout_unitaire_fixe.toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm text-[#232323]/70 text-right">{section.cout_unitaire_variable.toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm font-medium text-[#232323] text-right">{section.cout_unitaire_total.toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm text-[#232323]/70 text-right">{section.unite}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-[#232323] mb-4">Coûts unitaires par section</h3>
                      <div className="h-72">
                        <Bar
                          data={unitCostsData}
                          options={{ 
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'top' } },
                            scales: { y: { beginAtZero: true } }
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6">
                <Card className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#232323] flex items-center">
                      <Package className="mr-2 h-5 w-5 text-[#718EBF]" />
                      Produits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto rounded-md border border-[#DFEAF2] mb-6">
                      <table className="min-w-full divide-y divide-[#DFEAF2]">
                        <thead className="bg-[#DFEAF2]">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#232323]/70 uppercase">Nom</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Coût unitaire fixe</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Coût unitaire variable</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Coût unitaire total</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Unité</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#DFEAF2]">
                          {projectData.couts_unitaires_produits.map((produit, index) => (
                            <tr key={index} className="hover:bg-[#DFEAF2]/50">
                              <td className="px-6 py-4 text-sm font-medium text-[#232323]">{produit.nom}</td>
                              <td className="px-6 py-4 text-sm text-[#232323]/70 text-right">{produit.cout_unitaire_fixe.toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm text-[#232323]/70 text-right">{produit.cout_unitaire_variable.toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm font-medium text-[#232323] text-right">{produit.cout_unitaire_total.toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm text-[#232323]/70 text-right">{produit.unite}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-[#232323] mb-4">Consommation par produit</h3>
                      <div className="overflow-x-auto rounded-md border border-[#DFEAF2]">
                        <table className="min-w-full divide-y divide-[#DFEAF2]">
                          <thead className="bg-[#DFEAF2]">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#232323]/70 uppercase">Produit</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#232323]/70 uppercase">Section</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Quantité</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-[#DFEAF2]">
                            {projectData.couts_unitaires_produits.map((produit, index) =>
                              produit.consommation.map((conso, consoIndex) => (
                                <tr key={`${index}-${consoIndex}`} className="hover:bg-[#DFEAF2]/50">
                                  <td className="px-6 py-4 text-sm font-medium text-[#232323]">{produit.nom}</td>
                                  <td className="px-6 py-4 text-sm text-[#232323]/70">{conso.nom}</td>
                                  <td className="px-6 py-4 text-sm text-[#232323]/70 text-right">{conso.quantite.toLocaleString()}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-[#232323] mb-4">Coûts unitaires par produit</h3>
                      <div className="h-72">
                        <Bar
                          data={productCostsData}
                          options={{ 
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'top' } },
                            scales: { y: { beginAtZero: true } }
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Répartition Secondaire Tab */}
              <TabsContent value="repartition_secondaire" className="space-y-6">
                <Card className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#232323] flex items-center">
                      <Layers className="mr-2 h-5 w-5 text-[#718EBF]" />
                      Répartition secondaire
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-[#232323] mb-4">Répartition Fixe</h3>
                      <div className="overflow-x-auto rounded-md border border-[#DFEAF2]">
                        <table className="min-w-full divide-y divide-[#DFEAF2]">
                          <thead className="bg-[#DFEAF2]">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#232323]/70 uppercase">Centre</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#232323]/70 uppercase">Section</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Montant (%)</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-[#DFEAF2]">
                            {projectData.charges_indirectes.repartition_secondaire_fixe.map((centre, index) =>
                              centre.repartition.map((repartition, repIndex) => (
                                <tr key={`${index}-${repIndex}`} className="hover:bg-[#DFEAF2]/50">
                                  <td className="px-6 py-4 text-sm font-medium text-[#232323]">{centre.centre}</td>
                                  <td className="px-6 py-4 text-sm text-[#232323]/70">{repartition.section}</td>
                                  <td className="px-6 py-4 text-sm text-[#232323]/70 text-right">{repartition.montant}%</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#232323] mb-4">Répartition Variable</h3>
                      <div className="overflow-x-auto rounded-md border border-[#DFEAF2]">
                        <table className="min-w-full divide-y divide-[#DFEAF2]">
                          <thead className="bg-[#DFEAF2]">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#232323]/70 uppercase">Centre</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#232323]/70 uppercase">Section</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-[#232323]/70 uppercase">Montant (%)</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-[#DFEAF2]">
                            {projectData.charges_indirectes.repartition_secondaire_variable.map((centre, index) =>
                              centre.repartition.map((repartition, repIndex) => (
                                <tr key={`${index}-${repIndex}`} className="hover:bg-[#DFEAF2]/50">
                                  <td className="px-6 py-4 text-sm font-medium text-[#232323]">{centre.centre}</td>
                                  <td className="px-6 py-4 text-sm text-[#232323]/70">{repartition.section}</td>
                                  <td className="px-6 py-4 text-sm text-[#232323]/70 text-right">{repartition.montant}%</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-[#232323] text-white py-8 mt-20">
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