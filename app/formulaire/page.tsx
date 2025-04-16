"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, ArrowLeft, Save, Trash2, AlertCircle } from "lucide-react";
import Link from 'next/link';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreateProject() {
  const [activeTab, setActiveTab] = useState("general");
  const [errors, setErrors] = useState({});
  const [projectData, setProjectData] = useState({
    nom: "",
    description: "",
    produits: [{ nom: "" }],
    charges_indirectes: [{ nature: "", montant: 0, type: "Fix" }],
    sections: [{ nom: "", type: "Primaire" }],
    repartition_primaire: [],
    repartition_secondaire: [],
    unites_oeuvre: [],
    consommation_produits: []
  });

  // Initialiser les tableaux de répartition et unités d'œuvre
  useEffect(() => {
    initializeRepartitionPrimaire();
    initializeUnitesOeuvre();
  }, [projectData.charges_indirectes, projectData.sections]);

  useEffect(() => {
    initializeRepartitionSecondaire();
  }, [projectData.sections]);

  useEffect(() => {
    initializeConsommationProduits();
  }, [projectData.produits, projectData.sections]);

  const initializeRepartitionPrimaire = () => {
    const newRepartition = projectData.charges_indirectes.map(charge => {
      const sectionsPrimaires = projectData.sections.filter(s => s.type === "Primaire");
      const sectionsSecondaires = projectData.sections.filter(s => s.type === "Secondaire");
      const allSections = [...sectionsPrimaires, ...sectionsSecondaires];

      const repartition = {
        nature: charge.nature,
        repartition: allSections.map(section => ({
          section: section.nom,
          pourcentage: 0
        }))
      };

      const existingRepartition = projectData.repartition_primaire.find(
        r => r.nature === charge.nature
      );
      if (existingRepartition) {
        existingRepartition.repartition.forEach(item => {
          const match = repartition.repartition.find(
            r => r.section === item.section
          );
          if (match) {
            match.pourcentage = item.pourcentage;
          }
        });
      }

      return repartition;
    });

    setProjectData(prev => ({ ...prev, repartition_primaire: newRepartition }));
  };

  const initializeRepartitionSecondaire = () => {
    const sectionsSecondaires = projectData.sections.filter(s => s.type === "Secondaire");
    const sectionsPrimaires = projectData.sections.filter(s => s.type === "Primaire");

    const newRepartition = sectionsSecondaires.map(sectionSec => {
      const repartition = {
        centre: sectionSec.nom,
        repartition: sectionsPrimaires.map(sectionPrim => ({
          section: sectionPrim.nom,
          pourcentage: 0
        }))
      };

      const existingRepartition = projectData.repartition_secondaire.find(
        r => r.centre === sectionSec.nom
      );
      if (existingRepartition) {
        existingRepartition.repartition.forEach(item => {
          const match = repartition.repartition.find(
            r => r.section === item.section
          );
          if (match) {
            match.pourcentage = item.pourcentage;
          }
        });
      }

      return repartition;
    });

    setProjectData(prev => ({ ...prev, repartition_secondaire: newRepartition }));
  };

  const initializeUnitesOeuvre = () => {
    const sectionsPrimaires = projectData.sections.filter(s => s.type === "Primaire");
    const newUnites = sectionsPrimaires.map(section => {
      const existingUnite = projectData.unites_oeuvre.find(
        u => u.section === section.nom
      );
      return {
        section: section.nom,
        unite: "unit", // Default unit since unite_oeuvre is removed
        quantite: existingUnite ? existingUnite.quantite : 0
      };
    });

    setProjectData(prev => ({ ...prev, unites_oeuvre: newUnites }));
  };

  const initializeConsommationProduits = () => {
    const sectionsPrimaires = projectData.sections.filter(s => s.type === "Primaire");

    const newConsommation = projectData.produits.map(produit => {
      const consommation = {
        produit: produit.nom,
        consommation: sectionsPrimaires.map(section => ({
          section: section.nom,
          quantite: 0
        }))
      };

      const existingConsommation = projectData.consommation_produits.find(
        c => c.produit === produit.nom
      );
      if (existingConsommation) {
        existingConsommation.consommation.forEach(item => {
          const match = consommation.consommation.find(
            c => c.section === item.section
          );
          if (match) {
            match.quantite = item.quantite;
          }
        });
      }

      return consommation;
    });

    setProjectData(prev => ({ ...prev, consommation_produits: newConsommation }));
  };

  const handleInputChange = (e, index, type) => {
    const { name, value } = e.target;
    let newValue = value;
  
    if (name === "montant") {
      newValue = parseInt(value, 10) || 0;  // Parse montant as integer
    } else if (name === "pourcentage" || name === "quantite") {
      newValue = parseFloat(value) || 0;  // Keep these as float
    }
  
    if (type === "produits" || type === "charges_indirectes" || type === "sections" || type === "unites_oeuvre") {
      const updatedArray = [...projectData[type]];
      updatedArray[index][name] = newValue;
      setProjectData({ ...projectData, [type]: updatedArray });
    } else {
      setProjectData({ ...projectData, [name]: newValue });
    }
  
    if (errors[type] || errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[type];
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleRepartitionPrimaireChange = (chargeIndex, sectionIndex, value) => {
    const updatedRepartition = [...projectData.repartition_primaire];
    updatedRepartition[chargeIndex].repartition[sectionIndex].pourcentage = parseFloat(value) || 0;
    setProjectData({ ...projectData, repartition_primaire: updatedRepartition });

    if (errors.repartition_primaire) {
      const newErrors = { ...errors };
      delete newErrors.repartition_primaire;
      setErrors(newErrors);
    }
  };

  const handleRepartitionSecondaireChange = (sectionSecIndex, sectionPrimIndex, value) => {
    const updatedRepartition = [...projectData.repartition_secondaire];
    updatedRepartition[sectionSecIndex].repartition[sectionPrimIndex].pourcentage = parseFloat(value) || 0;
    setProjectData({ ...projectData, repartition_secondaire: updatedRepartition });

    if (errors.repartition_secondaire) {
      const newErrors = { ...errors };
      delete newErrors.repartition_secondaire;
      setErrors(newErrors);
    }
  };

  const handleConsommationChange = (produitIndex, sectionIndex, value) => {
    const updatedConsommation = [...projectData.consommation_produits];
    updatedConsommation[produitIndex].consommation[sectionIndex].quantite = parseFloat(value) || 0;
    setProjectData({ ...projectData, consommation_produits: updatedConsommation });

    if (errors.consommation_produits) {
      const newErrors = { ...errors };
      delete newErrors.consommation_produits;
      setErrors(newErrors);
    }
  };

  const addItem = (type) => {
    if (type === "produits") {
      setProjectData({
        ...projectData,
        produits: [...projectData.produits, { nom: "" }]
      });
    } else if (type === "charges_indirectes") {
      setProjectData({
        ...projectData,
        charges_indirectes: [...projectData.charges_indirectes, { nature: "", montant: 0, type: "Fix" }]
      });
    } else if (type === "sections") {
      setProjectData({
        ...projectData,
        sections: [...projectData.sections, { nom: "", type: "Primaire" }]
      });
    }
  };

  const removeItem = (type, index) => {
    const updatedArray = [...projectData[type]];
    updatedArray.splice(index, 1);

    if (updatedArray.length === 0) {
      if (type === "produits") {
        updatedArray.push({ nom: "" });
      } else if (type === "charges_indirectes") {
        updatedArray.push({ nature: "", montant: 0 });
      } else if (type === "sections") {
        updatedArray.push({ nom: "", type: "Primaire" });
      }
    }

    setProjectData({ ...projectData, [type]: updatedArray });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation des informations générales
    if (!projectData.nom.trim()) {
      newErrors.nom = "Le nom du projet est requis";
    }

    // Validation des produits
    const produitsValid = projectData.produits.every(p => p.nom.trim() !== "");
    if (!produitsValid) {
      newErrors.produits = "Tous les produits doivent avoir un nom";
    }

    // Validation des charges indirectes
    const chargesValid = projectData.charges_indirectes.every(c => 
      c.nature.trim() !== "" && c.montant > 0 && (c.type === "Fix" || c.type === "Variable")
    );
    if (!chargesValid) {
      newErrors.charges_indirectes = "Toutes les charges doivent avoir une nature, un type et un montant supérieur à 0";
    }
    
    // Validation des sections
    const sectionsValid = projectData.sections.every(s => s.nom.trim() !== "");
    if (!sectionsValid) {
      newErrors.sections = "Toutes les sections doivent avoir un nom";
    }

    // Au moins une section primaire
    const hasPrimary = projectData.sections.some(s => s.type === "Primaire");
    if (!hasPrimary) {
      newErrors.sections_type = "Il doit y avoir au moins une section primaire";
    }

    // Validation des unités d'œuvre
    const unitesValid = projectData.unites_oeuvre.every(u => u.quantite > 0);
    if (!unitesValid) {
      newErrors.unites_oeuvre = "Toutes les unités d'œuvre doivent avoir une quantité supérieure à 0";
    }

    // Validation de la répartition primaire (somme = 100% pour chaque charge)
    projectData.repartition_primaire.forEach((repartition, index) => {
      const sum = repartition.repartition.reduce((acc, r) => acc + r.pourcentage, 0);
      if (Math.abs(sum - 100) > 0.01) {
        if (!newErrors.repartition_primaire) {
          newErrors.repartition_primaire = {};
        }
        newErrors.repartition_primaire[index] = `La somme des pourcentages pour la charge "${repartition.nature}" doit être égale à 100% (actuellement ${sum.toFixed(2)}%)`;
      }
    });

    // Validation de la répartition secondaire (somme = 100% pour chaque section secondaire)
    projectData.repartition_secondaire.forEach((repartition, index) => {
      const sum = repartition.repartition.reduce((acc, r) => acc + r.pourcentage, 0);
      if (repartition.repartition.length > 0 && Math.abs(sum - 100) > 0.01) {
        if (!newErrors.repartition_secondaire) {
          newErrors.repartition_secondaire = {};
        }
        newErrors.repartition_secondaire[index] = `La somme des pourcentages pour la section "${repartition.centre}" doit être égale à 100% (actuellement ${sum.toFixed(2)}%)`;
      }
    });

    // Validation de la consommation des produits
    const consommationValid = projectData.consommation_produits.every(c =>
      c.consommation.every(s => s.quantite >= 0)
    );
    if (!consommationValid) {
      newErrors.consommation_produits = "Les quantités consommées doivent être supérieures ou égales à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      if (errors.nom || errors.description) {
        setActiveTab("general");
      } else if (errors.produits) {
        setActiveTab("produits");
      } else if (errors.charges_indirectes) {
        setActiveTab("charges");
      } else if (errors.sections || errors.sections_type) {
        setActiveTab("sections");
      } else if (errors.repartition_primaire) {
        setActiveTab("repartition_primaire");
      } else if (errors.repartition_secondaire) {
        setActiveTab("repartition_secondaire");
      } else if (errors.unites_oeuvre) {
        setActiveTab("unites_oeuvre");
      } else if (errors.consommation_produits) {
        setActiveTab("consommation");
      }
      return;
    }

    try {
      const projectPayload = {
        projet: {
          nom: projectData.nom,
          description: projectData.description,
          lastUpdated: new Date().toLocaleDateString('fr-FR')
        },
        produits: projectData.produits,
        charges_indirectes: projectData.charges_indirectes,
        sections: projectData.sections,
        repartition_primaire: projectData.repartition_primaire,
        repartition_secondaire: projectData.repartition_secondaire,
        unites_oeuvre: projectData.unites_oeuvre,
        consommation_produits: projectData.consommation_produits
      };

      const response = await fetch('http://127.0.0.1:8000/api/projets/complete/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('Projet créé avec succès:', result);

      alert("Projet créé avec succès!");
      // Optionally redirect after success
      // window.location.href = "/projects";
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setErrors({ ...errors, submit: error.message || "Erreur lors de la création du projet" });
    }
  };

  const calculateTotalRepartitionPrimaire = (chargeIndex) => {
    if (!projectData.repartition_primaire[chargeIndex]) return 0;
    return projectData.repartition_primaire[chargeIndex].repartition.reduce(
      (total, item) => total + item.pourcentage, 0
    );
  };

  const calculateTotalRepartitionSecondaire = (sectionIndex) => {
    if (!projectData.repartition_secondaire[sectionIndex]) return 0;
    return projectData.repartition_secondaire[sectionIndex].repartition.reduce(
      (total, item) => total + item.pourcentage, 0
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#DFEAF2] to-white">
      <header className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] text-white py-6 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Méthode des Sections Homogènes</h1>
          <Link href="/centers">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-[#718EBF]/10 to-[#6B9080]/10 rounded-t-lg">
            <CardTitle className="text-[#232323] text-2xl">Nouveau Projet</CardTitle>
            <CardDescription className="text-[#232323]/70">
              Créer un projet utilisant la méthode des sections homogènes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-8 mb-8 bg-[#DFEAF2]">
                  <TabsTrigger value="general" className="text-xs md:text-sm">Général</TabsTrigger>
                  <TabsTrigger value="produits" className="text-xs md:text-sm">Produits</TabsTrigger>
                  <TabsTrigger value="charges" className="text-xs md:text-sm">Charges</TabsTrigger>
                  <TabsTrigger value="sections" className="text-xs md:text-sm">Sections</TabsTrigger>
                  <TabsTrigger value="unites_oeuvre" className="text-xs md:text-sm">Unités d'œuvre</TabsTrigger>
                  <TabsTrigger value="repartition_primaire" className="text-xs md:text-sm">Rép. Primaire</TabsTrigger>
                  <TabsTrigger value="repartition_secondaire" className="text-xs md:text-sm">Rép. Secondaire</TabsTrigger>
                  <TabsTrigger value="consommation" className="text-xs md:text-sm">Consommation</TabsTrigger>
                </TabsList>

                {/* Informations générales */}
                <TabsContent value="general" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#232323]">Informations générales</h3>
                    <div>
                      <Label htmlFor="nom" className="text-[#232323]">Nom du projet</Label>
                      <Input
                        id="nom"
                        name="nom"
                        value={projectData.nom}
                        onChange={(e) => handleInputChange(e, null, "general")}
                        className={`border-[#718EBF]/30 focus:border-[#718EBF] ${errors.nom ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors.nom && (
                        <p className="mt-1 text-sm text-red-500">{errors.nom}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-[#232323]">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={projectData.description}
                        onChange={(e) => handleInputChange(e, null, "general")}
                        className="border-[#718EBF]/30 focus:border-[#718EBF]"
                        rows={4}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Produits */}
                <TabsContent value="produits" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-[#232323]">Produits</h3>
                      <Button
                        type="button"
                        onClick={() => addItem("produits")}
                        className="bg-[#6B9080] hover:bg-[#6B9080]/90"
                        size="sm"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un produit
                      </Button>
                    </div>

                    {errors.produits && (
                      <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.produits}</AlertDescription>
                      </Alert>
                    )}

                    {projectData.produits.map((produit, index) => (
                      <Card key={index} className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <Label htmlFor={`produit-nom-${index}`} className="text-[#232323]">Nom du produit</Label>
                            <Input
                              id={`produit-nom-${index}`}
                              name="nom"
                              value={produit.nom}
                              onChange={(e) => handleInputChange(e, index, "produits")}
                              className="border-[#718EBF]/30 focus:border-[#718EBF]"
                              required
                            />
                          </div>
                          <div className="flex items-end pb-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeItem("produits", index)}
                              className="text-[#232323] hover:bg-red-50 hover:text-red-600 border-[#718EBF]/30"
                              disabled={projectData.produits.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Charges indirectes */}
                <TabsContent value="charges" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-[#232323]">Charges indirectes</h3>
                      <Button
                        type="button"
                        onClick={() => addItem("charges_indirectes")}
                        className="bg-[#6B9080] hover:bg-[#6B9080]/90"
                        size="sm"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une charge
                      </Button>
                    </div>

                    {errors.charges_indirectes && (
                      <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.charges_indirectes}</AlertDescription>
                      </Alert>
                    )}

                    {projectData.charges_indirectes.map((charge, index) => (
                      <Card key={index} className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <Label htmlFor={`charge-nature-${index}`} className="text-[#232323]">Nature de la charge</Label>
                            <Input
                              id={`charge-nature-${index}`}
                              name="nature"
                              value={charge.nature}
                              onChange={(e) => handleInputChange(e, index, "charges_indirectes")}
                              className="border-[#718EBF]/30 focus:border-[#718EBF]"
                              required
                            />
                          </div>
                          <div className="md:w-1/4">
                            <Label htmlFor={`charge-type-${index}`} className="text-[#232323]">Type</Label>
                            <select
                              id={`charge-type-${index}`}
                              name="type"
                              value={charge.type}
                              onChange={(e) => handleInputChange(e, index, "charges_indirectes")}
                              className="w-full p-2 border border-[#718EBF]/30 focus:border-[#718EBF] rounded"
                            >
                              <option value="Fix">Fix</option>
                              <option value="Variable">Variable</option>
                            </select>
                          </div>
                          <div className="md:w-1/3">
                            <Label htmlFor={`charge-montant-${index}`} className="text-[#232323]">Montant (€)</Label>
                            <Input
                              id={`charge-montant-${index}`}
                              name="montant"
                              type="number"
                              value={charge.montant}
                              onChange={(e) => handleInputChange(e, index, "charges_indirectes")}
                              className="border-[#718EBF]/30 focus:border-[#718EBF]"
                              min="0"
                              step="1"
                              required
                            />
                          </div>
                          <div className="flex items-end pb-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeItem("charges_indirectes", index)}
                              className="text-[#232323] hover:bg-red-50 hover:text-red-600 border-[#718EBF]/30"
                              disabled={projectData.charges_indirectes.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Sections */}
                <TabsContent value="sections" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-[#232323]">Sections</h3>
                      <Button
                        type="button"
                        onClick={() => addItem("sections")}
                        className="bg-[#6B9080] hover:bg-[#6B9080]/90"
                        size="sm"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une section
                      </Button>
                    </div>

                    {(errors.sections || errors.sections_type) && (
                      <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.sections || errors.sections_type}</AlertDescription>
                      </Alert>
                    )}

                    {projectData.sections.map((section, index) => (
                      <Card key={index} className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <Label htmlFor={`section-nom-${index}`} className="text-[#232323]">Nom de la section</Label>
                            <Input
                              id={`section-nom-${index}`}
                              name="nom"
                              value={section.nom}
                              onChange={(e) => handleInputChange(e, index, "sections")}
                              className="border-[#718EBF]/30 focus:border-[#718EBF]"
                              required
                            />
                          </div>
                          <div className="md:w-1/4">
                            <Label htmlFor={`section-type-${index}`} className="text-[#232323]">Type</Label>
                            <select
                              id={`section-type-${index}`}
                              name="type"
                              value={section.type}
                              onChange={(e) => handleInputChange(e, index, "sections")}
                              className="w-full p-2 border border-[#718EBF]/30 focus:border-[#718EBF] rounded"
                            >
                              <option value="Primaire">Primaire</option>
                              <option value="Secondaire">Secondaire</option>
                            </select>
                          </div>
                          <div className="flex items-end pb-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeItem("sections", index)}
                              className="text-[#232323] hover:bg-red-50 hover:text-red-600 border-[#718EBF]/30"
                              disabled={projectData.sections.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Unités d'œuvre */}
                <TabsContent value="unites_oeuvre" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#232323]">Unités d'œuvre</h3>
                    {errors.unites_oeuvre && (
                      <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.unites_oeuvre}</AlertDescription>
                      </Alert>
                    )}
                    {projectData.unites_oeuvre.length === 0 && (
                      <p className="text-[#232323]/70">Aucune section primaire définie. Veuillez ajouter une section primaire dans l'onglet Sections.</p>
                    )}
                    {projectData.unites_oeuvre.map((unite, index) => (
                      <Card key={index} className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <Label htmlFor={`unite-section-${index}`} className="text-[#232323]">Section</Label>
                            <Input
                              id={`unite-section-${index}`}
                              name="section"
                              value={unite.section}
                              className="border-[#718EBF]/30 bg-[#DFEAF2]"
                              onChange={(e) => handleInputChange(e, index, "unites_oeuvre")}
                            />
                          </div>
                          <div className="md:w-1/3">
                            <Label htmlFor={`unite-nom-${index}`} className="text-[#232323]">Unité</Label>
                            <Input
                              id={`unite-nom-${index}`}
                              name="unite"
                              value={unite.unite}
                              className="border-[#718EBF]/30 bg-[#DFEAF2]"
                              onChange={(e) => handleInputChange(e, index, "unites_oeuvre")}
                            />
                          </div>
                          <div className="md:w-1/3">
                            <Label htmlFor={`unite-quantite-${index}`} className="text-[#232323]">Quantité</Label>
                            <Input
                              id={`unite-quantite-${index}`}
                              name="quantite"
                              type="number"
                              value={unite.quantite}
                              onChange={(e) => handleInputChange(e, index, "unites_oeuvre")}
                              className="border-[#718EBF]/30 focus:border-[#718EBF]"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Répartition primaire */}
                <TabsContent value="repartition_primaire" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#232323]">Répartition primaire</h3>
                    {errors.repartition_primaire && Object.keys(errors.repartition_primaire).map((key, idx) => (
                      <Alert key={idx} variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.repartition_primaire[key]}</AlertDescription>
                      </Alert>
                    ))}
                    {projectData.repartition_primaire.map((repartition, chargeIndex) => (
                      <Card key={chargeIndex} className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-md font-medium text-[#232323]">
                              {repartition.nature || "Charge sans nom"}
                            </h4>
                            <span className={`text-sm ${calculateTotalRepartitionPrimaire(chargeIndex) === 100 ? 'text-[#6B9080]' : 'text-red-500'}`}>
                              Total: {calculateTotalRepartitionPrimaire(chargeIndex).toFixed(2)}%
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {repartition.repartition.map((section, sectionIndex) => (
                              <div key={sectionIndex}>
                                <Label htmlFor={`repartition-primaire-${chargeIndex}-${sectionIndex}`} className="text-[#232323]">
                                  {section.section} (%)
                                </Label>
                                <Input
                                  id={`repartition-primaire-${chargeIndex}-${sectionIndex}`}
                                  type="number"
                                  value={section.pourcentage}
                                  onChange={(e) => handleRepartitionPrimaireChange(chargeIndex, sectionIndex, e.target.value)}
                                  className="border-[#718EBF]/30 focus:border-[#718EBF]"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Répartition secondaire */}
                <TabsContent value="repartition_secondaire" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#232323]">Répartition secondaire</h3>
                    {errors.repartition_secondaire && Object.keys(errors.repartition_secondaire).map((key, idx) => (
                      <Alert key={idx} variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.repartition_secondaire[key]}</AlertDescription>
                      </Alert>
                    ))}
                    {projectData.repartition_secondaire.length === 0 && (
                      <p className="text-[#232323]/70">Aucune section secondaire définie. Veuillez ajouter une section secondaire dans l'onglet Sections si nécessaire.</p>
                    )}
                    {projectData.repartition_secondaire.map((repartition, sectionIndex) => (
                      <Card key={sectionIndex} className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-md font-medium text-[#232323]">
                              {repartition.centre}
                            </h4>
                            <span className={`text-sm ${calculateTotalRepartitionSecondaire(sectionIndex) === 100 ? 'text-[#6B9080]' : 'text-red-500'}`}>
                              Total: {calculateTotalRepartitionSecondaire(sectionIndex).toFixed(2)}%
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {repartition.repartition.map((section, sectionPrimIndex) => (
                              <div key={sectionPrimIndex}>
                                <Label htmlFor={`repartition-secondaire-${sectionIndex}-${sectionPrimIndex}`} className="text-[#232323]">
                                  {section.section} (%)
                                </Label>
                                <Input
                                  id={`repartition-secondaire-${sectionIndex}-${sectionPrimIndex}`}
                                  type="number"
                                  value={section.pourcentage}
                                  onChange={(e) => handleRepartitionSecondaireChange(sectionIndex, sectionPrimIndex, e.target.value)}
                                  className="border-[#718EBF]/30 focus:border-[#718EBF]"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Consommation des produits */}
                <TabsContent value="consommation" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#232323]">Consommation des produits</h3>
                    {errors.consommation_produits && (
                      <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.consommation_produits}</AlertDescription>
                      </Alert>
                    )}
                    {projectData.consommation_produits.map((consommation, produitIndex) => (
                      <Card key={produitIndex} className="p-4 bg-white shadow-sm border border-[#DFEAF2]">
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-[#232323]">
                            {consommation.produit || "Produit sans nom"}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {consommation.consommation.map((section, sectionIndex) => (
                              <div key={sectionIndex}>
                                <Label htmlFor={`consommation-${produitIndex}-${sectionIndex}`} className="text-[#232323]">
                                  {section.section} (quantité)
                                </Label>
                                <Input
                                  id={`consommation-${produitIndex}-${sectionIndex}`}
                                  type="number"
                                  value={section.quantite}
                                  onChange={(e) => handleConsommationChange(produitIndex, sectionIndex, e.target.value)}
                                  className="border-[#718EBF]/30 focus:border-[#718EBF]"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#718EBF] to-[#6B9080] hover:from-[#6B9080] hover:to-[#718EBF] text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Créer le projet
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <footer 
        className={`bg-[#232323] text-white py-8 mt-20 transition-all duration-1000 delay-1000`}
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