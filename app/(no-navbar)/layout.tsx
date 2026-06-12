export default function NoNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center font-sans">
      {children}
    </div>
  );
}
