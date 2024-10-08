import dynamic from 'next/dynamic'
import { Footer } from "@/components/footer";

const ClientSideThemeProvider = dynamic(() => import('@/components/theme-provider').then(mod => mod.ThemeProvider), {
  ssr: false
})

const AiTextEditor = dynamic(() => import('@/components/ai-text-editor').then(mod => mod.AiTextEditor), {
  ssr: false
})

export default function Home() {
  return (
    <ClientSideThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="container mx-auto p-8 sm:p-20">
            <AiTextEditor />
          </div>
        </main>
        <Footer />
      </div>
    </ClientSideThemeProvider>
  );
}
