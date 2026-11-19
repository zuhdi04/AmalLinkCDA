import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function AppStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();

  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  return (
    <>
      {!online && (
        <div role="status" className="border-b border-beige-dark bg-beige px-5 py-3 text-center text-sm font-medium text-ink">
          You are offline. Fresh program details and registration require an internet connection.
        </div>
      )}
      {needRefresh && (
        <div role="status" className="fixed inset-x-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-md rounded-panel border border-burgundy bg-cream p-4 shadow-dialog sm:bottom-6">
          <p className="font-semibold text-burgundy-dark">A new version of AmalLink CDA is available.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateServiceWorker(true)} className="min-h-11 rounded-lg bg-burgundy px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy-dark active:bg-burgundy-dark">Update</button>
            <button type="button" onClick={() => setNeedRefresh(false)} className="min-h-11 rounded-lg border border-burgundy px-4 py-2 text-sm font-semibold text-burgundy hover:bg-burgundy-light active:bg-beige">Dismiss</button>
          </div>
        </div>
      )}
    </>
  );
}
