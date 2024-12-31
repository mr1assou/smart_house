export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>SmartHome Header</header>
        {children}
        <footer>SmartHome Footer</footer>
      </body>
    </html>
  );
}
