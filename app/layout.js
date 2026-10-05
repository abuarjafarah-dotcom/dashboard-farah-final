export const metadata = {
  title: 'Farah Dashboard',
  description: 'Mom dashboard with tasks, calendar, and Gmail',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui' }}>
        {children}
      </body>
    </html>
  );
}
