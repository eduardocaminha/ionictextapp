export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>&copy; {currentYear} IONIC Health. Todos os direitos reservados.</p>
    </footer>
  );
}