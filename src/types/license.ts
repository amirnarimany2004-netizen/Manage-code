import { LicenseTier } from '../crypto/licenseEngine';

export interface GeneratedLicenseRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  deviceId: string;
  tierCode: string;
  tierTitleFa: string;
  tierBadgeColor: string;
  format: '8DIGIT' | '16BLOCK';
  activationCode: string;
  durationId: string;
  durationLabelFa: string;
  createdAt: string; // ISO
  createdAtShamsi: string;
  expiresAt: string; // ISO or "LIFETIME"
  status: 'active' | 'expired' | 'revoked';
  notes?: string;
}

export type ActiveScreen = 'generator' | 'simulator' | 'history' | 'settings';
