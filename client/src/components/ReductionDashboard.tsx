import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { REDUCTION_TIPS } from '../constants';
import { log } from '../utils/logger';

interface ReductionDashboardProps {
  uid: string;
}

interface DBLogData {
  carKm?: number;
  flightKm?: number;
  beefMeals?: number;
  electricityKwh?: number;
  totalCo2?: number;
}

/**
 * Weekly emissions reduction dashboard with personalized tips.
 * @param props - ReductionDashboardProps
 * @returns JSX reduction dashboard element.
 */
export const ReductionDashboard: React.FC<ReductionDashboardProps> = ({ uid }) => {
  const [totalThisWeek, setTotalThisWeek] = useState<number>(0);
  const [percentChange, setPercentChange] = useState<number>(0);
  const [topCategory, setTopCategory] = useState<string>('general');
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    const fetchEmissionsAnalysis = async () => {
      try {
        const q = query(
          collection(db, 'users', uid, 'logs'),
          orderBy('date', 'desc'),
          limit(14)
        );
        const snapshot = await getDocs(q);
        const docsData: DBLogData[] = [];
        snapshot.forEach((snap) => {
          docsData.push(snap.data() as DBLogData);
        });

        // Split into this week (first 7) and last week (remaining 7)
        const thisWeekLogs = docsData.slice(0, 7);
        const lastWeekLogs = docsData.slice(7, 14);

        const thisWeekSum = thisWeekLogs.reduce((acc, curr) => acc + (curr.totalCo2 || 0), 0);
        const lastWeekSum = lastWeekLogs.reduce((acc, curr) => acc + (curr.totalCo2 || 0), 0);

        setTotalThisWeek(thisWeekSum);

        if (lastWeekSum > 0) {
          const change = ((thisWeekSum - lastWeekSum) / lastWeekSum) * 100;
          setPercentChange(change);
        } else {
          setPercentChange(0);
        }

        // Aggregate categories to find the top contributor
        const totals = {
          transport: 0,
          food: 0,
          energy: 0,
          shopping: 0
        };

        thisWeekLogs.forEach((logItem) => {
          totals.transport += ((logItem.carKm || 0) * 0.17) + ((logItem.flightKm || 0) * 0.25);
          totals.food += (logItem.beefMeals || 0) * 7.2;
          totals.energy += (logItem.electricityKwh || 0) * 0.82;
        });

        let highestCat = 'general';
        let maxVal = -1;
        Object.entries(totals).forEach(([cat, val]) => {
          if (val > maxVal && val > 0) {
            maxVal = val;
            highestCat = cat;
          }
        });

        setTopCategory(highestCat);
        setTips(REDUCTION_TIPS[highestCat] || REDUCTION_TIPS.energy);
      } catch (err) {
        log('Error analysis for reduction dashboard:', err);
      }
    };

    if (uid) {
      fetchEmissionsAnalysis();
    }
  }, [uid]);

  return (
    <section role="region" aria-label="Emissions Reduction Dashboard" className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Carbon Reduction Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Emissions This Week</h3>
          <p className="text-2xl font-extrabold text-blue-900 mt-1">{totalThisWeek.toFixed(2)} kg CO₂</p>
        </div>

        <div className="p-4 bg-green-50 border border-green-100 rounded-md">
          <h3 className="text-xs font-bold text-green-900 uppercase tracking-wider">Weekly Shift</h3>
          <p className={`text-2xl font-extrabold mt-1 ${percentChange > 0 ? 'text-red-600' : 'text-green-800'}`}>
            {percentChange === 0 ? 'Stable' : `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`}
          </p>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
          <h3 className="text-xs font-bold text-yellow-950 uppercase tracking-wider">Top Driver</h3>
          <p className="text-2xl font-extrabold text-yellow-950 mt-1 capitalize">{topCategory}</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Custom Mitigation Plan</h3>
        <ul className="space-y-2">
          {tips.slice(0, 3).map((tip, index) => (
            <li key={index} className="flex gap-2 text-sm text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
