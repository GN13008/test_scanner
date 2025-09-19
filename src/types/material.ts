export interface Material {
  id: string;
  code: string;
  name: string;
  scannedAt: Date;
}

export interface ScanResult {
  decodedText: string;
  result: {
    text: string;
  };
}