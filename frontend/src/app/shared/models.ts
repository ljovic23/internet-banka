export interface User { id: string; email: string; fullName: string; role: 'USER' | 'ADMIN'; }
export interface Account { id: string; iban: string; balance: string; }
export interface Transaction { id: string; amount: string; type: string; counterpartyIban?: string; description?: string; createdAt: string; }
