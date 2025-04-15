'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { AnalysisCenter, IndirectCost, CostDistribution } from '../types';

interface CostState {
  centers: AnalysisCenter[];
  indirectCosts: IndirectCost[];
  distributions: CostDistribution[];
}

type CostAction =
  | { type: 'ADD_CENTER'; payload: AnalysisCenter }
  | { type: 'UPDATE_CENTER'; payload: AnalysisCenter }
  | { type: 'DELETE_CENTER'; payload: string }
  | { type: 'ADD_COST'; payload: IndirectCost }
  | { type: 'UPDATE_COST'; payload: IndirectCost }
  | { type: 'DELETE_COST'; payload: string }
  | { type: 'UPDATE_DISTRIBUTIONS'; payload: CostDistribution[] };

const initialState: CostState = {
  centers: [],
  indirectCosts: [],
  distributions: [],
};

const CostContext = createContext<{
  state: CostState;
  dispatch: React.Dispatch<CostAction>;
}>({ state: initialState, dispatch: () => null });

function costReducer(state: CostState, action: CostAction): CostState {
  switch (action.type) {
    case 'ADD_CENTER':
      return {
        ...state,
        centers: [...state.centers, action.payload],
      };
    case 'UPDATE_CENTER':
      return {
        ...state,
        centers: state.centers.map((center) =>
          center.id === action.payload.id ? action.payload : center
        ),
      };
    case 'DELETE_CENTER':
      return {
        ...state,
        centers: state.centers.filter((center) => center.id !== action.payload),
      };
    case 'ADD_COST':
      return {
        ...state,
        indirectCosts: [...state.indirectCosts, action.payload],
      };
    case 'UPDATE_COST':
      return {
        ...state,
        indirectCosts: state.indirectCosts.map((cost) =>
          cost.id === action.payload.id ? action.payload : cost
        ),
      };
    case 'DELETE_COST':
      return {
        ...state,
        indirectCosts: state.indirectCosts.filter(
          (cost) => cost.id !== action.payload
        ),
      };
    case 'UPDATE_DISTRIBUTIONS':
      return {
        ...state,
        distributions: action.payload,
      };
    default:
      return state;
  }
}

export function CostProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(costReducer, initialState);

  return (
    <CostContext.Provider value={{ state, dispatch }}>
      {children}
    </CostContext.Provider>
  );
}

export function useCost() {
  const context = useContext(CostContext);
  if (!context) {
    throw new Error('useCost must be used within a CostProvider');
  }
  return context;
}