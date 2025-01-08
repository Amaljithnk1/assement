// _app.js
import '@/styles/globals.css'; 
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    
  }, []);

  return <Component {...pageProps} />;
}
