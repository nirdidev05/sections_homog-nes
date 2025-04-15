'use client';

import { useCost } from '../context/CostContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calculator, Plus } from 'lucide-react';

export default function CostsPage() {
  const { state } = useCost();

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Charges Indirectes</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Gérez et visualisez vos charges indirectes
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle Charge
          </Button>
        </div>

        {state.indirectCosts.length === 0 ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Aucune charge indirecte
              </CardTitle>
              <CardDescription>
                Commencez par ajouter une nouvelle charge indirecte
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {state.indirectCosts.map((cost) => (
              <Card key={cost.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    {cost.description}
                  </CardTitle>
                  <CardDescription>
                    Date: {new Date(cost.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {cost.amount.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </p>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Répartition:</h4>
                    <ul className="space-y-1">
                      {cost.allocations.map((allocation) => (
                        <li
                          key={allocation.centerId}
                          className="text-sm text-muted-foreground"
                        >
                          Centre {allocation.centerId}: {allocation.percentage}%
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}