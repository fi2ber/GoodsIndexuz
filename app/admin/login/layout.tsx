// Отдельный layout для страницы логина без проверки аутентификации
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

