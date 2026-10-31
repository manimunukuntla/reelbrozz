/**
 * Utility formatters for Reels Brozz
 */

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const CITIES = [
  { id: 'delhi', name: 'Delhi NCR', creatorsCount: 1420, avgEtaMinutes: 8, popular: true },
  { id: 'mumbai', name: 'Mumbai', creatorsCount: 1890, avgEtaMinutes: 7, popular: true },
  { id: 'bengaluru', name: 'Bengaluru', creatorsCount: 1650, avgEtaMinutes: 9, popular: true },
  { id: 'hyderabad', name: 'Hyderabad', creatorsCount: 980, avgEtaMinutes: 10, popular: true },
  { id: 'chennai', name: 'Chennai', creatorsCount: 740, avgEtaMinutes: 12, popular: false },
  { id: 'pune', name: 'Pune', creatorsCount: 680, avgEtaMinutes: 10, popular: false },
  { id: 'kolkata', name: 'Kolkata', creatorsCount: 520, avgEtaMinutes: 14, popular: false },
  { id: 'ahmedabad', name: 'Ahmedabad', creatorsCount: 460, avgEtaMinutes: 11, popular: false },
  { id: 'jaipur', name: 'Jaipur', creatorsCount: 390, avgEtaMinutes: 12, popular: false },
  { id: 'chandigarh', name: 'Chandigarh', creatorsCount: 310, avgEtaMinutes: 9, popular: false },
  { id: 'lucknow', name: 'Lucknow', creatorsCount: 280, avgEtaMinutes: 13, popular: false },
  { id: 'kochi', name: 'Kochi', creatorsCount: 240, avgEtaMinutes: 15, popular: false },
];
