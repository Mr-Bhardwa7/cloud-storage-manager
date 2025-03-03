// app/layout.tsx
export const metadata = {
  title: 'Cloud Storage Management',
  description: 'Unified platform for managing cloud storage accounts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-100 text-gray-900">
        <header className="bg-blue-600 text-white p-4">
          <h1>Cloud Storage Management</h1>
        </header>
        <main className="p-4">{children}</main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          © 2025 Cloud Storage Management
        </footer>
      </body>
    </html>
  );
}
