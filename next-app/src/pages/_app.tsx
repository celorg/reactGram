import '@/styles/globals.css'
import type { AppProps } from 'next/app';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout/Layout';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <AuthProvider>
      <Navbar />
      <Layout>
        <Component {...pageProps} />
        <ToastContainer autoClose={4000} />
      </Layout>
      <Footer />
    </AuthProvider>
  )
}
