/**
 * Strict character sanitation utility processing malicious injection signatures.
 * @param input - Raw text string from client field.
 * @returns string Cleaned safe textual data.
 */
export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};

/**
 * Calculates metric weight formulas for transportation footprints.
 * @param miles - Distance numerical representation.
 * @returns number Calculated carbon footprint metrics.
 */
export const calculateTransportEmissions = (miles: number): number => {
  const CO2_PER_MILE = 0.404;
  return miles * CO2_PER_MILE;
};
