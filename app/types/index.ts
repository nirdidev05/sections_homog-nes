export interface AnalysisCenter {
  id: string;
  name: string;
  type: 'primary' | 'auxiliary';
  description?: string;
  unitOfMeasure?: string;
}

export interface IndirectCost {
  id: string;
  description: string;
  amount: number;
  date: string;
  allocations: CostAllocation[];
}

export interface CostAllocation {
  centerId: string;
  percentage: number;
}

export interface CostDistribution {
  centerId: string;
  costs: {
    costId: string;
    amount: number;
  }[];
  totalAmount: number;
}