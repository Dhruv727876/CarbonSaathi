import React, { useState, useEffect } from 'react';
import { db, doc, setDoc } from '../firebase';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { EMISSION_FACTORS } from '../constants';
import { log } from '../utils/logger';

interface FootprintTrackerProps {
  uid: string;
}

interface LogEntry {
  date: string;
  totalCo2: number;
}

export const FootprintTracker: React.FC<FootprintTrackerProps> = ({ uid }) => {
  const [carKm, setCarKm] = useState<number>(0);
  const [flightKm, setFlightKm] = useState<number>(0);
  const [beefMeals, setBeefMeals] = useState<number>(0);
  const [electricityKwh, setElectricityKwh] = useState<number>(0);
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<string>('');

  const fetchHistory = useCallback(async () => {
    try {
      const q = query(
        collection(db, 'users', uid, 'logs'),
        orderBy('date', 'desc'),
        limit(7)
      );
      const querySnapshot = await getDocs(q);
      const entries: LogEntry[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        entries.push({
          date: docSnap.id,
          totalCo2: data.totalCo2 || 0
        });
      });
      setHistory(entries.reverse());
    } catch (err) {
      log('Error fetching footprint logs:', err);
    }
  }, [uid]);

  useEffect(() => {
    if (uid) {
      fetchHistory();
    }
  }, [uid, fetchHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');

    const total = 
      (carKm * EMISSION_FACTORS.car_km) +
      (flightKm * EMISSION_FACTORS.flight_km) +
      (beefMeals * EMISSION_FACTORS.beef_meal) +
      (electricityKwh * EMISSION_FACTORS.electricity_kwh);

    const dateStr = new Date().toISOString().split('T')[0];

    try {
      const docRef = doc(db, 'users', uid, 'logs', dateStr);
      await setDoc(docRef, {
        carKm,
        flightKm,
        beefMeals,
        electricityKwh,
        totalCo2: total,
        timestamp: Date.now()
      }, { merge: true });

      setStatus('Successfully saved footprint!');
      fetchHistory();
    } catch (err) {
      log('Error saving footprint log:', err);
      setStatus('Failed to save log.');
    }
  };

  return (
    <section role="region" aria-label="Carbon Footprint Tracker" className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Footprint Input</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="border border-gray-300 p-4 rounded-md">
          <legend className="px-2 font-semibold text-gray-700">Daily Consumption Metrics</legend>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="car-km" className="block text-sm font-medium text-gray-700 mb-1">Car commuted (km)</label>
              <input
                id="car-km"
                type="number"
                min="0"
                value={carKm}
                onChange={(e) => setCarKm(parseFloat(e.target.value) || 0)}
                aria-label="Car transit commute in kilometers"
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 text-gray-900"
              />
            </div>
            
            <div>
              <label htmlFor="flight-km" className="block text-sm font-medium text-gray-700 mb-1">Flight traveled (km)</label>
              <input
                id="flight-km"
                type="number"
                min="0"
                value={flightKm}
                onChange={(e) => setFlightKm(parseFloat(e.target.value) || 0)}
                aria-label="Flight travel distance in kilometers"
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="beef-meals" className="block text-sm font-medium text-gray-700 mb-1">High-impact meals consumed</label>
              <input
                id="beef-meals"
                type="number"
                min="0"
                value={beefMeals}
                onChange={(e) => setBeefMeals(parseInt(e.target.value) || 0)}
                aria-label="Count of high carbon meals"
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="electricity-kwh" className="block text-sm font-medium text-gray-700 mb-1">Electricity consumed (kWh)</label>
              <input
                id="electricity-kwh"
                type="number"
                min="0"
                value={electricityKwh}
                onChange={(e) => setElectricityKwh(parseFloat(e.target.value) || 0)}
                aria-label="Electricity usage in kilowatt-hours"
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 text-gray-900"
              />
            </div>
          </div>
        </fieldset>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="h-11 px-6 bg-green-700 text-white rounded-md font-semibold hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            Log Entry
          </button>
          {status && <span className="text-sm font-medium text-gray-600" role="status">{status}</span>}
        </div>
      </form>

      {/* Historical chart rendering using simple responsive inline SVG */}
      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="text-md font-bold text-gray-900 mb-3">7-Day Emissions History (kg CO₂)</h3>
          <div className="border border-gray-200 p-4 rounded-md bg-gray-50 flex items-end justify-between h-48 pt-8">
            {history.map((entry, index) => {
              const maxVal = Math.max(...history.map(h => h.totalCo2), 1);
              const heightPct = (entry.totalCo2 / maxVal) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1 gap-2">
                  <span className="text-xs font-semibold text-gray-700">{entry.totalCo2.toFixed(1)}</span>
                  <div className="w-8 bg-green-600 rounded-t-sm transition-all" style={{ height: `${heightPct}px`, minHeight: '4px' }}></div>
                  <span className="text-[10px] text-gray-500">{entry.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
