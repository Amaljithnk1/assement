// _app.js
import '@/styles/globals.css'; // Ensure you have your TailwindCSS imported
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Any client-side setup (e.g., theme initialization)
  }, []);

  return <Component {...pageProps} />;
}
