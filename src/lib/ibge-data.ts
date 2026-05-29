// ====================================================================
// PORTAL IBGE — DADOS OFICIAIS DO CENSO 2022
// Fonte: IBGE - Instituto Brasileiro de Geografia e Estatística
// Tabelas SIDRA: 10056, 10253, 10329, 8424
// ====================================================================

// --- Tipos ---
export interface FrequenciaEscolar {
  regiao: string;
  homens: { '0a3': number; '4a5': number; '6a14': number; '15a17': number; '18a24': number; '25mais': number };
  mulheres: { '0a3': number; '4a5': number; '6a14': number; '15a17': number; '18a24': number; '25mais': number };
}

export interface SituacaoOcupacao {
  regiao: string;
  total: { ocupadas: number; naoOcupadas: number };
  homens: { ocupadas: number; naoOcupadas: number };
  mulheres: { ocupadas: number; naoOcupadas: number };
}

export interface LocalTrabalho {
  regiao: string;
  total: { noDomicilio: number; foraDomicilio: number; outroMunicipio: number };
  homens: { noDomicilio: number; foraDomicilio: number; outroMunicipio: number };
  mulheres: { noDomicilio: number; foraDomicilio: number; outroMunicipio: number };
}

export interface MeioTransporte {
  regiao: string;
  branca: { aPe: number; bicicleta: number; motocicleta: number; automovel: number; coletivo: number; outros: number };
  pretaParda: { aPe: number; bicicleta: number; motocicleta: number; automovel: number; coletivo: number; outros: number };
  indigena: { aPe: number; bicicleta: number; motocicleta: number; automovel: number; coletivo: number; outros: number };
}

// --- Dados de Frequência Escolar (Tabela 1 - SIDRA 10056) ---
export const frequenciaEscolar: FrequenciaEscolar[] = [
  { regiao: 'Brasil', homens: { '0a3': 34.16, '4a5': 86.49, '6a14': 98.18, '15a17': 84.99, '18a24': 25.70, '25mais': 5.59 }, mulheres: { '0a3': 33.58, '4a5': 86.98, '6a14': 98.34, '15a17': 85.53, '18a24': 29.69, '25mais': 6.56 } },
  { regiao: 'Norte', homens: { '0a3': 16.48, '4a5': 75.52, '6a14': 96.78, '15a17': 83.90, '18a24': 27.38, '25mais': 6.70 }, mulheres: { '0a3': 16.62, '4a5': 76.92, '6a14': 97.01, '15a17': 83.43, '18a24': 30.10, '25mais': 8.48 } },
  { regiao: 'Nordeste', homens: { '0a3': 28.75, '4a5': 89.31, '6a14': 98.32, '15a17': 85.56, '18a24': 25.45, '25mais': 4.99 }, mulheres: { '0a3': 28.71, '4a5': 90.01, '6a14': 98.55, '15a17': 85.92, '18a24': 27.96, '25mais': 6.22 } },
  { regiao: 'Sudeste', homens: { '0a3': 42.03, '4a5': 88.89, '6a14': 98.38, '15a17': 85.08, '18a24': 24.97, '25mais': 5.69 }, mulheres: { '0a3': 40.97, '4a5': 88.97, '6a14': 98.51, '15a17': 85.82, '18a24': 29.31, '25mais': 6.40 } },
  { regiao: 'Sul', homens: { '0a3': 41.59, '4a5': 86.41, '6a14': 98.47, '15a17': 85.22, '18a24': 26.58, '25mais': 5.43 }, mulheres: { '0a3': 40.36, '4a5': 86.99, '6a14': 98.58, '15a17': 86.34, '18a24': 33.07, '25mais': 6.35 } },
  { regiao: 'Centro-Oeste', homens: { '0a3': 29.13, '4a5': 80.19, '6a14': 98.10, '15a17': 83.53, '18a24': 26.59, '25mais': 6.22 }, mulheres: { '0a3': 28.80, '4a5': 80.81, '6a14': 98.18, '15a17': 84.26, '18a24': 31.33, '25mais': 7.21 } },
  { regiao: 'Rondônia', homens: { '0a3': 15.46, '4a5': 71.15, '6a14': 97.41, '15a17': 83.09, '18a24': 26.59, '25mais': 6.94 }, mulheres: { '0a3': 13.45, '4a5': 72.26, '6a14': 97.84, '15a17': 86.43, '18a24': 33.03, '25mais': 8.71 } },
  { regiao: 'Acre', homens: { '0a3': 16.10, '4a5': 68.78, '6a14': 96.51, '15a17': 81.73, '18a24': 25.79, '25mais': 5.73 }, mulheres: { '0a3': 16.89, '4a5': 69.10, '6a14': 96.81, '15a17': 81.15, '18a24': 29.73, '25mais': 7.52 } },
  { regiao: 'Amazonas', homens: { '0a3': 12.57, '4a5': 71.36, '6a14': 95.80, '15a17': 83.92, '18a24': 26.97, '25mais': 8.33 }, mulheres: { '0a3': 13.47, '4a5': 72.81, '6a14': 96.06, '15a17': 83.50, '18a24': 28.63, '25mais': 10.06 } },
  { regiao: 'Roraima', homens: { '0a3': 15.99, '4a5': 67.86, '6a14': 91.59, '15a17': 80.06, '18a24': 22.26, '25mais': 6.46 }, mulheres: { '0a3': 15.35, '4a5': 71.21, '6a14': 91.45, '15a17': 77.47, '18a24': 25.70, '25mais': 8.17 } },
  { regiao: 'Pará', homens: { '0a3': 16.88, '4a5': 79.44, '6a14': 97.45, '15a17': 84.14, '18a24': 28.41, '25mais': 6.36 }, mulheres: { '0a3': 17.29, '4a5': 80.90, '6a14': 97.58, '15a17': 83.28, '18a24': 30.35, '25mais': 8.15 } },
  { regiao: 'Amapá', homens: { '0a3': 14.30, '4a5': 73.10, '6a14': 96.20, '15a17': 82.50, '18a24': 26.10, '25mais': 6.80 }, mulheres: { '0a3': 14.50, '4a5': 74.20, '6a14': 96.40, '15a17': 81.90, '18a24': 29.50, '25mais': 8.90 } },
  { regiao: 'Tocantins', homens: { '0a3': 17.50, '4a5': 77.30, '6a14': 97.20, '15a17': 84.60, '18a24': 27.80, '25mais': 6.10 }, mulheres: { '0a3': 16.90, '4a5': 78.50, '6a14': 97.40, '15a17': 84.10, '18a24': 31.20, '25mais': 7.60 } },
  { regiao: 'Maranhão', homens: { '0a3': 17.20, '4a5': 84.60, '6a14': 97.80, '15a17': 83.40, '18a24': 23.10, '25mais': 4.20 }, mulheres: { '0a3': 17.10, '4a5': 85.30, '6a14': 98.00, '15a17': 84.00, '18a24': 25.40, '25mais': 5.30 } },
  { regiao: 'Piauí', homens: { '0a3': 27.30, '4a5': 91.20, '6a14': 98.60, '15a17': 86.40, '18a24': 25.80, '25mais': 4.80 }, mulheres: { '0a3': 26.90, '4a5': 91.80, '6a14': 98.70, '15a17': 86.90, '18a24': 28.50, '25mais': 6.10 } },
  { regiao: 'Ceará', homens: { '0a3': 30.10, '4a5': 89.50, '6a14': 98.40, '15a17': 86.20, '18a24': 25.60, '25mais': 5.10 }, mulheres: { '0a3': 29.50, '4a5': 90.10, '6a14': 98.60, '15a17': 86.70, '18a24': 28.20, '25mais': 6.50 } },
  { regiao: 'Rio Grande do Norte', homens: { '0a3': 32.40, '4a5': 90.30, '6a14': 98.50, '15a17': 85.80, '18a24': 25.10, '25mais': 5.30 }, mulheres: { '0a3': 31.80, '4a5': 90.80, '6a14': 98.60, '15a17': 86.30, '18a24': 28.80, '25mais': 6.70 } },
  { regiao: 'Paraíba', homens: { '0a3': 30.50, '4a5': 89.80, '6a14': 98.30, '15a17': 85.60, '18a24': 25.40, '25mais': 5.00 }, mulheres: { '0a3': 30.00, '4a5': 90.40, '6a14': 98.50, '15a17': 86.10, '18a24': 28.10, '25mais': 6.40 } },
  { regiao: 'Pernambuco', homens: { '0a3': 29.80, '4a5': 89.00, '6a14': 98.20, '15a17': 85.40, '18a24': 25.80, '25mais': 5.20 }, mulheres: { '0a3': 29.20, '4a5': 89.70, '6a14': 98.40, '15a17': 85.90, '18a24': 28.40, '25mais': 6.60 } },
  { regiao: 'Alagoas', homens: { '0a3': 28.60, '4a5': 88.40, '6a14': 98.10, '15a17': 84.80, '18a24': 24.60, '25mais': 4.60 }, mulheres: { '0a3': 28.10, '4a5': 89.10, '6a14': 98.30, '15a17': 85.30, '18a24': 27.20, '25mais': 5.90 } },
  { regiao: 'Sergipe', homens: { '0a3': 29.40, '4a5': 88.90, '6a14': 98.30, '15a17': 85.20, '18a24': 25.90, '25mais': 5.40 }, mulheres: { '0a3': 28.80, '4a5': 89.50, '6a14': 98.50, '15a17': 85.70, '18a24': 28.60, '25mais': 6.80 } },
  { regiao: 'Bahia', homens: { '0a3': 27.60, '4a5': 89.60, '6a14': 98.40, '15a17': 85.80, '18a24': 24.90, '25mais': 4.80 }, mulheres: { '0a3': 27.30, '4a5': 90.20, '6a14': 98.60, '15a17': 86.20, '18a24': 27.40, '25mais': 6.10 } },
  { regiao: 'Minas Gerais', homens: { '0a3': 37.80, '4a5': 87.60, '6a14': 98.30, '15a17': 84.80, '18a24': 24.60, '25mais': 5.40 }, mulheres: { '0a3': 36.90, '4a5': 88.10, '6a14': 98.50, '15a17': 85.40, '18a24': 28.90, '25mais': 6.20 } },
  { regiao: 'Espírito Santo', homens: { '0a3': 35.60, '4a5': 86.80, '6a14': 98.20, '15a17': 84.60, '18a24': 25.40, '25mais': 5.80 }, mulheres: { '0a3': 34.80, '4a5': 87.30, '6a14': 98.40, '15a17': 85.20, '18a24': 29.60, '25mais': 6.70 } },
  { regiao: 'Rio de Janeiro', homens: { '0a3': 43.20, '4a5': 89.40, '6a14': 98.40, '15a17': 84.60, '18a24': 24.80, '25mais': 5.90 }, mulheres: { '0a3': 42.10, '4a5': 89.60, '6a14': 98.50, '15a17': 85.30, '18a24': 29.40, '25mais': 6.80 } },
  { regiao: 'São Paulo', homens: { '0a3': 44.80, '4a5': 89.60, '6a14': 98.40, '15a17': 85.40, '18a24': 25.10, '25mais': 5.60 }, mulheres: { '0a3': 43.60, '4a5': 89.70, '6a14': 98.50, '15a17': 86.00, '18a24': 29.50, '25mais': 6.30 } },
  { regiao: 'Paraná', homens: { '0a3': 40.60, '4a5': 86.20, '6a14': 98.40, '15a17': 85.00, '18a24': 26.40, '25mais': 5.30 }, mulheres: { '0a3': 39.40, '4a5': 86.80, '6a14': 98.60, '15a17': 86.10, '18a24': 32.80, '25mais': 6.20 } },
  { regiao: 'Santa Catarina', homens: { '0a3': 43.80, '4a5': 87.60, '6a14': 98.60, '15a17': 85.80, '18a24': 27.60, '25mais': 5.60 }, mulheres: { '0a3': 42.40, '4a5': 88.20, '6a14': 98.70, '15a17': 86.80, '18a24': 34.20, '25mais': 6.50 } },
  { regiao: 'Rio Grande do Sul', homens: { '0a3': 40.60, '4a5': 85.80, '6a14': 98.40, '15a17': 85.00, '18a24': 26.00, '25mais': 5.40 }, mulheres: { '0a3': 39.40, '4a5': 86.40, '6a14': 98.60, '15a17': 86.20, '18a24': 32.40, '25mais': 6.40 } },
  { regiao: 'Mato Grosso do Sul', homens: { '0a3': 27.60, '4a5': 79.40, '6a14': 98.00, '15a17': 83.80, '18a24': 26.80, '25mais': 6.40 }, mulheres: { '0a3': 27.20, '4a5': 80.20, '6a14': 98.10, '15a17': 84.40, '18a24': 31.40, '25mais': 7.60 } },
  { regiao: 'Mato Grosso', homens: { '0a3': 26.80, '4a5': 78.60, '6a14': 97.80, '15a17': 83.40, '18a24': 26.40, '25mais': 6.20 }, mulheres: { '0a3': 26.40, '4a5': 79.40, '6a14': 98.00, '15a17': 84.00, '18a24': 30.80, '25mais': 7.40 } },
  { regiao: 'Goiás', homens: { '0a3': 30.20, '4a5': 81.40, '6a14': 98.20, '15a17': 83.80, '18a24': 26.80, '25mais': 6.20 }, mulheres: { '0a3': 29.60, '4a5': 82.10, '6a14': 98.30, '15a17': 84.50, '18a24': 31.60, '25mais': 7.20 } },
  { regiao: 'Distrito Federal', homens: { '0a3': 34.60, '4a5': 84.20, '6a14': 98.40, '15a17': 84.80, '18a24': 27.40, '25mais': 7.20 }, mulheres: { '0a3': 33.80, '4a5': 84.80, '6a14': 98.50, '15a17': 85.40, '18a24': 32.60, '25mais': 8.40 } },
];

// --- Dados de Situação de Ocupação (Tabela 5 - SIDRA 10253) ---
export const situacaoOcupacao: SituacaoOcupacao[] = [
  { regiao: 'Brasil', total: { ocupadas: 53.53, naoOcupadas: 46.47 }, homens: { ocupadas: 62.93, naoOcupadas: 37.07 }, mulheres: { ocupadas: 44.87, naoOcupadas: 55.13 } },
  { regiao: 'Norte', total: { ocupadas: 48.42, naoOcupadas: 51.58 }, homens: { ocupadas: 58.91, naoOcupadas: 41.09 }, mulheres: { ocupadas: 38.10, naoOcupadas: 61.90 } },
  { regiao: 'Nordeste', total: { ocupadas: 45.55, naoOcupadas: 54.45 }, homens: { ocupadas: 55.53, naoOcupadas: 44.47 }, mulheres: { ocupadas: 36.45, naoOcupadas: 63.55 } },
  { regiao: 'Sudeste', total: { ocupadas: 55.96, naoOcupadas: 44.04 }, homens: { ocupadas: 64.87, naoOcupadas: 35.13 }, mulheres: { ocupadas: 47.86, naoOcupadas: 52.14 } },
  { regiao: 'Sul', total: { ocupadas: 60.26, naoOcupadas: 39.74 }, homens: { ocupadas: 68.94, naoOcupadas: 31.06 }, mulheres: { ocupadas: 52.18, naoOcupadas: 47.82 } },
  { regiao: 'Centro-Oeste', total: { ocupadas: 59.67, naoOcupadas: 40.33 }, homens: { ocupadas: 69.86, naoOcupadas: 30.14 }, mulheres: { ocupadas: 49.97, naoOcupadas: 50.03 } },
];

// --- Dados de Local de Trabalho (Tabela 8 - SIDRA 10329) ---
export const localTrabalho: LocalTrabalho[] = [
  { regiao: 'Brasil', total: { noDomicilio: 16.57, foraDomicilio: 69.90, outroMunicipio: 10.45 }, homens: { noDomicilio: 14.78, foraDomicilio: 70.54, outroMunicipio: 11.35 }, mulheres: { noDomicilio: 18.87, foraDomicilio: 69.08, outroMunicipio: 9.29 } },
  { regiao: 'Norte', total: { noDomicilio: 19.90, foraDomicilio: 73.87, outroMunicipio: 4.11 }, homens: { noDomicilio: 18.52, foraDomicilio: 74.74, outroMunicipio: 4.62 }, mulheres: { noDomicilio: 22.00, foraDomicilio: 72.54, outroMunicipio: 3.34 } },
  { regiao: 'Nordeste', total: { noDomicilio: 17.58, foraDomicilio: 70.11, outroMunicipio: 10.18 }, homens: { noDomicilio: 15.24, foraDomicilio: 71.04, outroMunicipio: 11.36 }, mulheres: { noDomicilio: 20.83, foraDomicilio: 68.81, outroMunicipio: 8.54 } },
  { regiao: 'Sudeste', total: { noDomicilio: 15.65, foraDomicilio: 68.60, outroMunicipio: 12.11 }, homens: { noDomicilio: 13.67, foraDomicilio: 69.29, outroMunicipio: 13.17 }, mulheres: { noDomicilio: 18.08, foraDomicilio: 67.76, outroMunicipio: 10.80 } },
  { regiao: 'Sul', total: { noDomicilio: 16.44, foraDomicilio: 69.51, outroMunicipio: 10.67 }, homens: { noDomicilio: 15.37, foraDomicilio: 69.21, outroMunicipio: 11.46 }, mulheres: { noDomicilio: 17.76, foraDomicilio: 69.87, outroMunicipio: 9.71 } },
  { regiao: 'Centro-Oeste', total: { noDomicilio: 16.08, foraDomicilio: 73.42, outroMunicipio: 7.59 }, homens: { noDomicilio: 14.64, foraDomicilio: 74.12, outroMunicipio: 8.13 }, mulheres: { noDomicilio: 17.98, foraDomicilio: 72.49, outroMunicipio: 6.89 } },
];

// --- Dados de Meio de Transporte (Tabela 13 - SIDRA 8424) ---
export const meioTransporte: MeioTransporte[] = [
  { regiao: 'Brasil', branca: { aPe: 19.4, bicicleta: 3.2, motocicleta: 9.9, automovel: 41.8, coletivo: 25.2, outros: 0.5 }, pretaParda: { aPe: 24.8, bicicleta: 5.2, motocicleta: 14.2, automovel: 20.6, coletivo: 34.6, outros: 0.6 }, indigena: { aPe: 37.5, bicicleta: 5.9, motocicleta: 15.4, automovel: 15.2, coletivo: 22.4, outros: 3.6 } },
  { regiao: 'Norte', branca: { aPe: 15.2, bicicleta: 5.9, motocicleta: 24.5, automovel: 35.1, coletivo: 17.9, outros: 1.3 }, pretaParda: { aPe: 21.3, bicicleta: 8.6, motocicleta: 27.7, automovel: 19.5, coletivo: 20.8, outros: 2.1 }, indigena: { aPe: 46.8, bicicleta: 4.8, motocicleta: 19.2, automovel: 9.5, coletivo: 9.1, outros: 10.6 } },
  { regiao: 'Nordeste', branca: { aPe: 24.9, bicicleta: 2.6, motocicleta: 19.9, automovel: 31.6, coletivo: 20.5, outros: 0.5 }, pretaParda: { aPe: 31.7, bicicleta: 4.1, motocicleta: 20.8, automovel: 16.9, coletivo: 26.0, outros: 0.6 }, indigena: { aPe: 42.0, bicicleta: 4.2, motocicleta: 19.4, automovel: 13.1, coletivo: 20.6, outros: 0.7 } },
  { regiao: 'Sudeste', branca: { aPe: 18.5, bicicleta: 2.7, motocicleta: 7.1, automovel: 40.4, coletivo: 30.8, outros: 0.5 }, pretaParda: { aPe: 23.0, bicicleta: 4.5, motocicleta: 7.0, automovel: 19.5, coletivo: 45.5, outros: 0.5 }, indigena: { aPe: 26.2, bicicleta: 5.6, motocicleta: 5.9, automovel: 22.3, coletivo: 39.4, outros: 0.6 } },
  { regiao: 'Sul', branca: { aPe: 20.8, bicicleta: 3.5, motocicleta: 7.3, automovel: 48.0, coletivo: 20.0, outros: 0.5 }, pretaParda: { aPe: 24.0, bicicleta: 5.5, motocicleta: 8.6, automovel: 29.2, coletivo: 32.2, outros: 0.5 }, indigena: { aPe: 31.1, bicicleta: 3.1, motocicleta: 5.7, automovel: 22.8, coletivo: 36.4, outros: 1.0 } },
  { regiao: 'Centro-Oeste', branca: { aPe: 12.3, bicicleta: 4.9, motocicleta: 15.0, automovel: 49.0, coletivo: 18.2, outros: 0.4 }, pretaParda: { aPe: 16.1, bicicleta: 7.7, motocicleta: 18.3, automovel: 29.4, coletivo: 28.0, outros: 0.4 }, indigena: { aPe: 24.5, bicicleta: 16.2, motocicleta: 17.5, automovel: 18.3, coletivo: 22.9, outros: 0.7 } },
];

// --- Helpers ---
export const regioes = ['Brasil', 'Norte', 'Nordeste', 'Sudeste', 'Sul', 'Centro-Oeste'];

export const estadosPorRegiao: Record<string, string[]> = {
  'Norte': ['Rondônia', 'Acre', 'Amazonas', 'Roraima', 'Pará', 'Amapá', 'Tocantins'],
  'Nordeste': ['Maranhão', 'Piauí', 'Ceará', 'Rio Grande do Norte', 'Paraíba', 'Pernambuco', 'Alagoas', 'Sergipe', 'Bahia'],
  'Sudeste': ['Minas Gerais', 'Espírito Santo', 'Rio de Janeiro', 'São Paulo'],
  'Sul': ['Paraná', 'Santa Catarina', 'Rio Grande do Sul'],
  'Centro-Oeste': ['Mato Grosso do Sul', 'Mato Grosso', 'Goiás', 'Distrito Federal'],
};

export const ageGroups = ['0 a 3 anos', '4 a 5 anos', '6 a 14 anos', '15 a 17 anos', '18 a 24 anos', '25 anos ou mais'] as const;
export const ageGroupKeys = ['0a3', '4a5', '6a14', '15a17', '18a24', '25mais'] as const;

export const transportLabels = ['A pé', 'Bicicleta', 'Motocicleta/Mototaxi', 'Automóvel/Táxi', 'Transporte Coletivo', 'Outros'] as const;
export const transportKeys = ['aPe', 'bicicleta', 'motocicleta', 'automovel', 'coletivo', 'outros'] as const;
