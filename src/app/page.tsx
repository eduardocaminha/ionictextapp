import { AiTextEditor } from '@/components/ai-text-editor'
import { ThemeProvider } from '@/components/theme-provider'

// Página inicial do aplicativo
export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="container mx-auto p-8 sm:p-20">
            <AiTextEditor />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
