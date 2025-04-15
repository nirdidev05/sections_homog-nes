import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CostProvider } from './context/CostContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Méthode des Sections Homogènes',
  description: 'Outil pédagogique pour la comptabilité analytique',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <CostProvider>{children}</CostProvider>
      </body>
    </html>
  );
}