import './Home.css';
import '../styles/global.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Rabzan Trading Company | شركة ربزان التجارية',
  description:
    'Your strategic partner in import, export, and integrated logistics services.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
