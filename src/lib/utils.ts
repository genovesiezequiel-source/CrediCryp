import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for combining Tailwind classes with logical merging.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = 'USDT') {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ` ${currency}`;
}

export interface UserData {
  nombre: string;
  apellido: string;
  email: string;
  whatsapp: string;
  dni: string;
  documentType?: 'DNI' | 'PASSPORT' | string;
  pais: string;
  codPostal: string;
  limitValue?: number;
}

export interface CreditState {
  montoAprobado: number;
  garantiaRequerida: number;
  isActivated: boolean;
  status: 'pending' | 'approved' | 'active';
}

export interface LiveActivity {
  id: string;
  message: string;
  timestamp: Date;
}

export type AppPhase = 'landing' | 'auth_choice' | 'onboarding' | 'assessment' | 'result' | 'activation' | 'dashboard' | 'kyc';

export type KYCStatus = 'not_started' | 'pending' | 'approved' | 'rejected';

export interface KYCData {
  userId: string;
  fullName: string;
  dob: string;
  documentType: string;
  documentNumber: string;
  documentImageUrl: string;
  documentBackImageUrl: string;
  selfieImageUrl: string;
  status: KYCStatus;
  createdAt: any;
}
