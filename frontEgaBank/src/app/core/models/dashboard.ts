export interface DashboardStats {
  totalClients: number;
  totalDeposits: number;
  dailyVolume: number;
  savingsAccounts: number;
  currentAccounts: number;
  averageBalance: number;
  fluxEvolution: number[];
  depositsEvolution: number[];
  withdrawalsEvolution: number[];
  recentOperations: OperationSummary[];
}

export interface OperationSummary {
  amount: number;
  compteID: number;
  numCompteSource: string;
  numCompteDestination: string;
  dateOperation: string;
}

export interface OperationDto {
  id: number;
  numCompte: string;
  amount: number;
  type: string;
  description: string;
  dateOperation: string;
}
