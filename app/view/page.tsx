"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Info, Package, DollarSign, Users, PieChart, List, Settings } from "lucide-react";
import Link from 'next/link';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pie, Bar, Column } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import * as Select from '@radix-ui/react-select';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const projectsData = [
    {
      id: "PRJ-2025-002",
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
  
  // Données JSON statiques (inchangées)
  const projectDetailsData: Record<string, any> = {
    "PRJ-2025-002": {
      "projet": {
        "id": "PRJ-2025-002",
        "nom": "ALFA",
        "description": "Analyse détaillée des coûts de revient du nouveau produit X par méthode des sections homogènes.",
        "lastUpdated": "08/04/2025"
      },
      "produits": [
        { "nom": "Produit A" },
        { "nom": "Produit B" }
      ],
      "charges_indirectes": [
        { "nature": "Loyer", "montant": 120000 },
        { "nature": "Électricité", "montant": 60000 },
        { "nature": "Entretien", "montant": 30000 },
        { "nature": "Salaires indirects", "montant": 90000 },
        { "nature": "Amortissements", "montant": 45000 }
      ],
      "sections": [
        { "nom": "Atelier A", "type": "primaire" },
        { "nom": "Atelier B", "type": "primaire" },
        { "nom": "Entrepôt", "type": "secondaire" },
        { "nom": "Administration", "type": "secondaire" }
      ],
      "repartition_primaire": [
        {
          "nature": "Loyer",
          "repartition": [
            { "section": "Atelier A", "pourcentage": 40 },
            { "section": "Atelier B", "pourcentage": 30 },
            { "section": "Entrepôt", "pourcentage": 20 },
            { "section": "Administration", "pourcentage": 10 }
          ]
        },
        {
          "nature": "Électricité",
          "repartition": [
            { "section": "Atelier A", "pourcentage": 50 },
            { "section": "Atelier B", "pourcentage": 30 },
            { "section": "Entrepôt", "pourcentage": 10 },
            { "section": "Administration", "pourcentage": 10 }
          ]
        },
        {
          "nature": "Entretien",
          "repartition": [
            { "section": "Atelier A", "pourcentage": 30 },
            { "section": "Atelier B", "pourcentage": 40 },
            { "section": "Entrepôt", "pourcentage": 20 },
            { "section": "Administration", "pourcentage": 10 }
          ]
        },
        {
          "nature": "Salaires indirects",
          "repartition": [
            { "section": "Atelier A", "pourcentage": 35 },
            { "section": "Atelier B", "pourcentage": 35 },
            { "section": "Entrepôt", "pourcentage": 15 },
            { "section": "Administration", "pourcentage": 15 }
          ]
        },
        {
          "nature": "Amortissements",
          "repartition": [
            { "section": "Atelier A", "pourcentage": 40 },
            { "section": "Atelier B", "pourcentage": 30 },
            { "section": "Entrepôt", "pourcentage": 20 },
            { "section": "Administration", "pourcentage": 10 }
          ]
        }
      ],
      "repartition_secondaire": [
        {
          "centre": "Entrepôt",
          "repartition": [
            { "section": "Atelier A", "pourcentage": 60 },
            { "section": "Atelier B", "pourcentage": 40 }
          ]
        },
        {
          "centre": "Administration",
          "repartition": [
            { "section": "Atelier A", "pourcentage": 50 },
            { "section": "Atelier B", "pourcentage": 50 }
          ]
        }
      ],
      "unites_oeuvre": [
        {
          "section": "Atelier A",
          "unite": "Heure machine",
          "quantite": 2000
        },
        {
          "section": "Atelier B",
          "unite": "Heure de main-d'œuvre",
          "quantite": 1500
        }
      ],
      "consommation_produits": [
        {
          "produit": "Produit A",
          "consommation": [
            { "section": "Atelier A", "quantite": 1 },
            { "section": "Atelier B", "quantite": 2 }
          ]
        },
        {
          "produit": "Produit B",
          "consommation": [
            { "section": "Atelier A", "quantite": 2 },
            { "section": "Atelier B", "quantite": 1 }
          ]
        }
      ]
    },
    "PRJ-2025-003": {
      "projet": {
        "id": "PRJ-2025-003",
        "nom": "Budget Prévisionnel 2026",
        "description": "Préparation du budget prévisionnel pour l'année fiscale 2026 avec méthode des sections homogènes.",
        "lastUpdated": "12/04/2025"
      },
      "produits": [
        { "nom": "Service A" },
        { "nom": "Service B" },
        { "nom": "Service C" }
      ],
      "charges_indirectes": [
        { "nature": "Loyer", "montant": 150000 },
        { "nature": "Électricité", "montant": 75000 },
        { "nature": "Salaires indirects", "montant": 120000 }
      ],
      "sections": [
        { "nom": "Direction", "type": "secondaire" },
        { "nom": "Production", "type": "primaire" },
        { "nom": "Commercial", "type": "primaire" }
      ],
      "repartition_primaire": [],
      "repartition_secondaire": [],
      "unites_oeuvre": [],
      "consommation_produits": []
    },
    "PRJ-2025-004": {
      "projet": {
        "id": "PRJ-2025-004",
        "nom": "Étude Rentabilité Produit X",
        "description": "Analyse détaillée des coûts de revient du nouveau produit X par méthode des sections homogènes.",
        "lastUpdated": "08/04/2025"
      },
      "produits": [
        { "nom": "Produit X1" },
        { "nom": "Produit X2" }
      ],
      "charges_indirectes": [
        { "nature": "Loyer", "montant": 100000 },
        { "nature": "Maintenance", "montant": 40000 }
      ],
      "sections": [
        { "nom": "Atelier X", "type": "primaire" },
        { "nom": "Logistique", "type": "secondaire" }
      ],
      "repartition_primaire": [],
      "repartition_secondaire": [],
      "unites_oeuvre": [],
      "consommation_produits": []
    },
    "PRJ-2025-005": {
      "projet": {
        "id": "PRJ-2025-005",
        "nom": "Réorganisation Sections Auxiliaires",
        "description": "Projet d'optimisation des sections auxiliaires pour améliorer l'allocation des coûts indirects.",
        "lastUpdated": "03/04/2025"
      },
      "produits": [
        { "nom": "Service Auxiliaire A" },
        { "nom": "Service Auxiliaire B" }
      ],
      "charges_indirectes": [
        { "nature": "Consulting", "montant": 80000 },
        { "nature": "Formation", "montant": 50000 }
      ],
      "sections": [
        { "nom": "Support", "type": "secondaire" },
        { "nom": "Production", "type": "primaire" }
      ],
      "repartition_primaire": [],
      "repartition_secondaire": [],
      "unites_oeuvre": [],
      "consommation_produits": []
    }
  };

export default function ProjectView() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productFilter, setProductFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [chargeFilter, setChargeFilter] = useState('all');
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('id') || '';

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const projectDetails = projectDetailsData[projectId];
  const projectBasic = !projectDetails && projectsData.find((p) => p.id === projectId);

  // Filter data based on selections
  const filteredCharges = projectDetails?.charges_indirectes?.filter((charge: any) =>
    chargeFilter === 'all' || charge.nature === chargeFilter
  ) || [];

  const filteredSections = projectDetails?.sections?.filter((section: any) =>
    sectionFilter === 'all' || section.nom === sectionFilter
  ) || [];

  const filteredProducts = projectDetails?.produits?.filter((product: any) =>
    productFilter === 'all' || product.nom === productFilter
  ) || [];

  // Pie Chart Data for Indirect Costs
  const pieChartData = {
    labels: filteredCharges.map((charge: any) => charge.nature),
    datasets: [{
      data: filteredCharges.map((charge: any) => charge.montant),
      backgroundColor: ['#718EBF', '#6B9080', '#A4C3B2', '#CCE3DE', '#EAF4F4'],
      hoverBackgroundColor: ['#6B9080', '#718EBF', '#A4C3B2', '#CCE3DE', '#EAF4F4'],
    }],
  };

  // Bar Chart Data for Unit Costs (assuming unit costs derived from units of work)
  const barChartData = {
    labels: filteredSections.map((section: any) => section.nom),
    datasets: [{
      label: 'Unit Cost (€)',
      data: filteredSections.map((section: any) => {
        const unit = projectDetails?.unites_oeuvre?.find((u: any) => u.section === section.nom);
        return unit ? (unit.quantite ? 1000 / unit.quantite : 0) : 0; // Example calculation
      }),
      backgroundColor: '#718EBF',
      borderColor: '#6B9080',
      borderWidth: 1,
    }],
  };

  // Column Chart Data for Product Costs
  const columnChartData = {
    labels: filteredProducts.map((product: any) => product.nom),
    datasets: [{
      label: 'Total Cost (€)',
      data: filteredProducts.map((product: any) => {
        const conso = projectDetails?.consommation_produits?.find((c: any) => c.produit === product.nom);
        return conso ? conso.consommation.reduce((sum: number, c: any) => sum + c.quantite * 100, 0) : 0; // Example
      }),
      backgroundColor: '#6B9080',
      borderColor: '#718EBF',
      borderWidth: 1,
    }],
  };

  // Export to PDF (updated to include charts)
  const exportToPDF = (data: any) => {
    setIsLoading(true);
    const doc = new jsPDF();
    const margin = 10;
    let y = 20;

    doc.setFontSize(18);
    doc.setTextColor('#232323');
    doc.text(`Project Report: ${data.projet.nom}`, margin, y);
    y += 10;

    // General Information
    doc.setFontSize(12);
    autoTable(doc, {
      startY: y,
      head: [['Field', 'Value']],
      body: [
        ['ID', data.projet.id],
        ['Name', data.projet.nom],
        ['Description', data.projet.description],
        ['Last Updated', data.projet.lastUpdated],
      ],
      theme: 'striped',
      headStyles: { fillColor: '#718EBF', textColor: '#FFFFFF' },
      bodyStyles: { textColor: '#232323' },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Add Charts (Placeholder text for charts in PDF)
    doc.setFontSize(14);
    doc.text('Charts Placeholder (Indirect Costs, Unit Costs, Product Costs)', margin, y);
    y += 10;

    // Rest of the export logic (products, indirect costs, etc.) remains the same
    // ... (Include existing export logic for products, sections, etc.)

    setTimeout(() => {
      doc.save(`${data.projet.id}_report.pdf`);
      setIsLoading(false);
    }, 1500);
  };

  // Export to CSV (updated to include filtered data)
  const exportToCSV = (data: any) => {
    setIsLoading(true);
    const csvData: any[] = [
      ['Project Information'],
      ['ID', data.projet.id],
      ['Name', data.projet.nom],
      ['Description', data.projet.description],
      ['Last Updated', data.projet.lastUpdated],
      [],
      ['Filtered Indirect Costs'],
      ['Nature', 'Amount (€)'],
      ...filteredCharges.map((c: any) => [c.nature, c.montant]),
      [],
      ['Filtered Sections'],
      ['Name', 'Type'],
      ...filteredSections.map((s: any) => [s.nom, s.type]),
      [],
      ['Filtered Products'],
      ...filteredProducts.map((p: any) => [p.nom]),
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.projet.id}_filtered_data.csv`;
    setTimeout(() => {
      a.click();
      URL.revokeObjectURL(url);
      setIsLoading(false);
    }, 1500);
  };

  // Loader Component
  const Loader = () => (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="w-12 h-12 border-4 border-t-[#718EBF] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-[#232323]">Processing...</p>
        <p className="text-sm text-[#6B9080]">Preparing your file</p>
      </div>
    </div>
  );

  // Handle project not found
  if (!projectDetails && !projectBasic) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f7f9fc] flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border border-[#718EBF]">
          <CardHeader>
            <CardTitle className="text-center text-[#232323]">Project Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-[#6B9080]">The project with ID "{projectId}" does not exist or is not accessible.</p>
            <Link href="/centers">
              <Button className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] hover:from-[#6B9080] hover:to-[#718EBF] text-white">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Projects
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle basic project info
  if (!projectDetails && projectBasic) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f7f9fc]">
        <header className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] text-white py-6 shadow-md">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold">{projectBasic.name}</h1>
            <Link href="/projects">
              <Button variant="outline" className="text-white border-white hover:bg-[#6B9080]">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Projects
              </Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto py-12 px-4">
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Card className="mb-8 shadow-lg border-t-4 border-[#718EBF]">
              <CardHeader className="flex items-center gap-2">
                <Info className="text-[#718EBF]" />
                <CardTitle className="text-[#232323]"> Informations générales</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div><dt className="font-medium text-[#232323]">ID:</dt><dd className="text-[#6B9080]">{projectBasic.id}</dd></div>
                  <div><dt className="font-medium text-[#232323]">Name:</dt><dd className="text-[#6B9080]">{projectBasic.name}</dd></div>
                  <div><dt className="font-medium text-[#232323]">Description:</dt><dd className="text-[#6B9080]">{projectBasic.description}</dd></div>
                  <div><dt className="font-medium text-[#232323]">Last Updated:</dt><dd className="text-[#6B9080]">{projectBasic.lastUpdated}</dd></div>
                </dl>
                <div className="mt-6 bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <p className="text-yellow-700">Detailed data for this project is not yet available.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const project = projectDetails;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f7f9fc]">
      {isLoading && <Loader />}
      <header className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] text-white py-6 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{project.projet.nom}</h1>
          <div className="flex space-x-3">
            <Button
              onClick={() => exportToPDF(project)}
              className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] hover:from-[#6B9080] hover:to-[#718EBF] text-white"
            >
              <Download className="mr-2 h-5 w-5" /> PDF
            </Button>
            <Button
              onClick={() => exportToCSV(project)}
              className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] hover:from-[#6B9080] hover:to-[#718EBF] text-white"
            >
              <Download className="mr-2 h-5 w-5" /> CSV
            </Button>
            <Link href="/centers">
              <Button variant="outline" className="text-white border-white hover:bg-[#6B9080]">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div>
            <label className="text-[#232323] font-medium">Filter par produit</label>
            <Select.Root value={productFilter} onValueChange={setProductFilter}>
              <Select.Trigger className="inline-flex items-center justify-between rounded-md px-4 py-2 text-sm bg-white border border-[#718EBF] text-[#232323] hover:bg-[#f7f9fc]">
                <Select.Value placeholder="Select a product" />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white rounded-md shadow-lg border border-[#718EBF]">
                  <Select.Viewport>
                    <Select.Item value="all" className="px-4 py-2 hover:bg-[#f7f9fc] text-[#232323]">
                      <Select.ItemText>tous les produits </Select.ItemText>
                    </Select.Item>
                    {project.produits.map((product: any) => (
                      <Select.Item key={product.nom} value={product.nom} className="px-4 py-2 hover:bg-[#f7f9fc] text-[#232323]">
                        <Select.ItemText>{product.nom}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <div>
            <label className="text-[#232323] font-medium">Filter par Section</label>
            <Select.Root value={sectionFilter} onValueChange={setSectionFilter}>
              <Select.Trigger className="inline-flex items-center justify-between rounded-md px-4 py-2 text-sm bg-white border border-[#718EBF] text-[#232323] hover:bg-[#f7f9fc]">
                <Select.Value placeholder="Select a section" />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white rounded-md shadow-lg border border-[#718EBF]">
                  <Select.Viewport>
                    <Select.Item value="all" className="px-4 py-2 hover:bg-[#f7f9fc] text-[#232323]">
                      <Select.ItemText>Tous les Sections</Select.ItemText>
                    </Select.Item>
                    {project.sections.map((section: any) => (
                      <Select.Item key={section.nom} value={section.nom} className="px-4 py-2 hover:bg-[#f7f9fc] text-[#232323]">
                        <Select.ItemText>{section.nom}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <div>
            <label className="text-[#232323] font-medium">Filter par Type de Charge </label>
            <Select.Root value={chargeFilter} onValueChange={setChargeFilter}>
              <Select.Trigger className="inline-flex items-center justify-between rounded-md px-4 py-2 text-sm bg-white border border-[#718EBF] text-[#232323] hover:bg-[#f7f9fc]">
                <Select.Value placeholder="Select a charge type" />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white rounded-md shadow-lg border border-[#718EBF]">
                  <Select.Viewport>
                    <Select.Item value="all" className="px-4 py-2 hover:bg-[#f7f9fc] text-[#232323]">
                      <Select.ItemText>Tous les Charges</Select.ItemText>
                    </Select.Item>
                    {project.charges_indirectes.map((charge: any) => (
                      <Select.Item key={charge.nature} value={charge.nature} className="px-4 py-2 hover:bg-[#f7f9fc] text-[#232323]">
                        <Select.ItemText>{charge.nature}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>

        {/* General Information */}
        <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Card className="mb-8 shadow-lg border-t-4 border-[#718EBF] hover:shadow-xl">
            <CardHeader className="flex items-center gap-2">
              <Info className="text-[#718EBF]" />
              <CardTitle className="text-[#232323]">General Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><dt className="font-medium text-[#232323]">ID:</dt><dd className="text-[#6B9080]">{project.projet.id}</dd></div>
                <div><dt className="font-medium text-[#232323]">NOM:</dt><dd className="text-[#6B9080]">{project.projet.nom}</dd></div>
                <div><dt className="font-medium text-[#232323]">Description:</dt><dd className="text-[#6B9080]">{project.projet.description}</dd></div>
                <div><dt className="font-medium text-[#232323]">Derniere Mise à Jour:</dt><dd className="text-[#6B9080]">{project.projet.lastUpdated}</dd></div>
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className={`transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Card className="mb-8 shadow-lg border-t-4 border-[#6B9080] hover:shadow-xl">
          <CardHeader>
  <CardTitle className="text-[#232323] text-center">Visualisations d'analyse des coûts</CardTitle>
</CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pie Chart: Indirect Costs */}
                <div>
                  <h3 className="text-lg font-semibold text-[#232323] mb-4">Répartition des coûts indirects</h3>
                  {filteredCharges.length > 0 ? (
                    <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                  ) : (
                    <p className="text-[#6B9080]">Aucune donnée disponible pour les filtres sélectionnés..</p>
                  )}
                </div>
                {/* Bar Chart: Unit Costs */}
                <div>
                  <h3 className="text-lg font-semibold text-[#232323] mb-4">Coûts unitaires par section</h3>
                  {filteredSections.length > 0 ? (
                    <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                  ) : (
                    <p className="text-[#6B9080]">Aucune donnée disponible pour les filtres sélectionnés...</p>
                  )}
                </div>
                {/* Column Chart: Product Costs */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-[#232323] mb-4">Coûts totaux par produit</h3>
                  {filteredProducts.length > 0 ? (
                    <Bar data={columnChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                  ) : (
                    <p className="text-[#6B9080]">Aucune donnée disponible pour les filtres sélectionnés...</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Indirect Costs */}
        <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Card className="mb-8 shadow-lg border-t-4 border-[#718EBF] hover:shadow-xl">
            <CardHeader className="flex items-center gap-2">
              <DollarSign className="text-[#718EBF]" />
              <CardTitle className="text-[#232323]">Couts Indirect</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f7f9fc]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#232323] uppercase tracking-wider">Nature</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#232323] uppercase tracking-wider">Montant (€)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCharges.map((charge: any, index: number) => (
                    <tr key={index} className="hover:bg-[#f7f9fc]">
                      <td className="px-6 py-4 whitespace-nowrap text-[#6B9080]">{charge.nature}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-[#6B9080]">{charge.montant.toLocaleString()}</td>
                    </tr>
                  ))}
                  {filteredCharges.length > 0 && (
                    <tr className="bg-[#f7f9fc] font-semibold">
                      <td className="px-6 py-4 whitespace-nowrap text-[#232323]">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-[#232323]">
                        {filteredCharges.reduce((sum: number, charge: any) => sum + charge.montant, 0).toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Sections */}
        <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Card className="mb-8 shadow-lg border-t-4 border-[#6B9080] hover:shadow-xl">
            <CardHeader className="flex items-center gap-2">
              <Users className="text-[#6B9080]" />
              <CardTitle className="text-[#232323]">Les Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f7f9fc]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#232323] uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#232323] uppercase tracking-wider">Type</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSections.map((section: any, index: number) => (
                    <tr key={index} className="hover:bg-[#f7f9fc]">
                      <td className="px-6 py-4 whitespace-nowrap text-[#6B9080]">{section.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            section.type === 'primaire' ? 'bg-[#A4C3B2] text-[#232323]' : 'bg-[#CCE3DE] text-[#232323]'
                          }`}
                        >
                          {section.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Products */}
        <div className={`transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Card className="mb-8 shadow-lg border-t-4 border-[#718EBF] hover:shadow-xl">
            <CardHeader className="flex items-center gap-2">
              <Package className="text-[#718EBF]" />
              <CardTitle className="text-[#232323]">Produits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredProducts.map((product: any, index: number) => (
                  <li key={index} className="text-[#6B9080]">{product.nom}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Primary Distribution */}
        {project.repartition_primaire.length > 0 && (
          <div className={`transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Card className="mb-8 shadow-lg border-t-4 border-[#6B9080] hover:shadow-xl">
              <CardHeader className="flex items-center gap-2">
                <PieChart className="text-[#6B9080]" />
                <CardTitle className="text-[#232323]">Repartition primaire</CardTitle>
              </CardHeader>
              <CardContent>
                {project.repartition_primaire.map((repartition: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h3 className="font-semibold text-lg mb-2 text-[#232323]">{repartition.nature}</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-[#f7f9fc]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#232323] uppercase tracking-wider">Section</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-[#232323] uppercase tracking-wider">Pourcentage (%)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {repartition.repartition.map((rep: any, idx: number) => (
                          <tr key={idx} className="hover:bg-[#f7f9fc]">
                            <td className="px-6 py-4 whitespace-nowrap text-[#6B9080]">{rep.section}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-[#6B9080]">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                <div
                                  className="bg-[#718EBF] h-2.5 rounded-full"
                                  style={{ width: `${rep.pourcentage}%` }}
                                ></div>
                              </div>
                              {rep.pourcentage}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Secondary Distribution */}
        {project.repartition_secondaire.length > 0 && (
          <div className={`transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Card className="mb-8 shadow-lg border-t-4 border-[#718EBF] hover:shadow-xl">
              <CardHeader className="flex items-center gap-2">
                <PieChart className="text-[#718EBF]" />
                <CardTitle className="text-[#232323]">Repartition Seconadaire</CardTitle>
              </CardHeader>
              <CardContent>
                {project.repartition_secondaire.map((repartition: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h3 className="font-semibold text-lg mb-2 text-[#232323]">{repartition.centre}</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-[#f7f9fc]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#232323] uppercase tracking-wider">Section</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-[#232323] uppercase tracking-wider">Pourcentage (%)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {repartition.repartition.map((rep: any, idx: number) => (
                          <tr key={idx} className="hover:bg-[#f7f9fc]">
                            <td className="px-6 py-4 whitespace-nowrap text-[#6B9080]">{rep.section}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-[#6B9080]">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                <div
                                  className="bg-[#6B9080] h-2.5 rounded-full"
                                  style={{ width: `${rep.pourcentage}%` }}
                                ></div>
                              </div>
                              {rep.pourcentage}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Units of Work */}
        {project.unites_oeuvre.length > 0 && (
          <div className={`transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Card className="mb-8 shadow-lg border-t-4 border-[#6B9080] hover:shadow-xl">
              <CardHeader className="flex items-center gap-2">
                <List className="text-[#6B9080]" />
                <CardTitle className="text-[#232323]">Unités de travail</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#f7f9fc]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#232323] uppercase tracking-wider">Section</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#232323] uppercase tracking-wider">Unités</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-[#232323] uppercase tracking-wider">quantité</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {project.unites_oeuvre.map((unite: any, index: number) => (
                      <tr key={index} className="hover:bg-[#f7f9fc]">
                        <td className="px-6 py-4 whitespace-nowrap text-[#6B9080]">{unite.section}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[#6B9080]">{unite.unite}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-[#6B9080]">{unite.quantite.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Product Consumption */}
        {project.consommation_produits.length > 0 && (
          <div className={`transition-all duration-700 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Card className="mb-8 shadow-lg border-t-4 border-[#718EBF] hover:shadow-xl">
              <CardHeader className="flex items-center gap-2">
                <Settings className="text-[#718EBF]" />
                <CardTitle className="text-[#232323]">Consommation de produits</CardTitle>
              </CardHeader>
              <CardContent>
                {project.consommation_produits.map((conso: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h3 className="font-semibold text-lg mb-2 text-[#232323]">{conso.produit}</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-[#f7f9fc]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#232323] uppercase tracking-wider">Section</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-[#232323] uppercase tracking-wider">quantité</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {conso.consommation.map((c: any, idx: number) => (
                          <tr key={idx} className="hover:bg-[#f7f9fc]">
                            <td className="px-6 py-4 whitespace-nowrap text-[#6B9080]">{c.section}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-[#6B9080]">{c.quantite}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-[#232323] text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Analyses MSH</h3>
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