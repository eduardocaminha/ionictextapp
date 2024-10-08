"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoonIcon, SunIcon, Copy, Check, AlertTriangle, CheckCircle, InfoIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function AiTextEditor() {
  const [content, setContent] = useState('');
  const [aiResponse, setAiResponse] = useState<{
    formattedText: string;
    comments: string;
    errors: { orthographic: number; conceptual: number };
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    setIsAnalyzed(false);
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Falha na análise do texto');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAiResponse(data.response);
      setIsAnalyzed(true);
    } catch (error) {
      console.error('Erro ao analisar o texto:', error);
      setAiResponse({
        formattedText: "Ocorreu um erro ao analisar o texto. Por favor, tente novamente.",
        comments: "Não foi possível gerar comentários devido a um erro.",
        errors: { orthographic: 0, conceptual: 0 }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setAiResponse(null);
    setIsAnalyzed(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const copyFormattedText = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse.formattedText)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => console.error('Erro ao copiar texto: ', err));
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <div className="fixed top-4 right-4 flex space-x-2">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              onMouseEnter={() => setIsPopoverOpen(true)}
              onMouseLeave={() => setIsPopoverOpen(false)}
            >
              <InfoIcon className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-80" 
            onMouseEnter={() => setIsPopoverOpen(true)}
            onMouseLeave={() => setIsPopoverOpen(false)}
          >
            <h3 className="font-semibold mb-2">Desenvolvedor</h3>
            <div className="flex items-center space-x-4">
              <Image
                src="/images/eduardo-caminha.jpg"
                alt="Eduardo Caminha Nunes"
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">Eduardo Caminha Nunes</p>
                <p className="text-sm text-muted-foreground">Global Medical Leader</p>
                <p className="text-sm text-blue-500 dark:text-blue-400">ecaminha@ionic.health</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <MoonIcon className="h-[1.2rem] w-[1.2rem]" /> : <SunIcon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analizador de documentos IONIC Health</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Cole seu texto e deixe a IA analisá-lo considerando as regulamentações de SaMD</p>
          <Textarea
            className="min-h-[200px]"
            value={content}
            onChange={handleTextChange}
            placeholder="Cole seu texto aqui..."
          />
          <div className="mt-4 flex space-x-2">
            <Button 
              onClick={isAnalyzed ? handleReset : handleSubmit}
              disabled={isAnalyzing}
              className={isAnalyzed ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {isAnalyzing ? 'Analisando...' : isAnalyzed ? 'Analisado' : 'Analisar'}
            </Button>
            {isAnalyzed && (
              <Button onClick={handleReset}>
                Nova Análise
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {aiResponse && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Texto Formatado
                <Button onClick={copyFormattedText} variant="outline" size="sm">
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose dark:prose-invert max-w-none formatted-text" 
                dangerouslySetInnerHTML={{ __html: aiResponse.formattedText }} 
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: aiResponse.comments }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Análise de Erros</CardTitle>
            </CardHeader>
            <CardContent>
              {aiResponse.errors.orthographic + aiResponse.errors.conceptual === 0 ? (
                <Alert variant="default" className="bg-green-50 dark:bg-green-900 border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-700 dark:text-green-300">Excelente!</AlertTitle>
                  <AlertDescription className="text-green-600 dark:text-green-200">
                    Não foram encontrados erros ortográficos ou problemas conceituais no texto.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    <p>Foram encontrados os seguintes problemas:</p>
                    <ul className="list-disc list-inside mt-2">
                      {aiResponse.errors.orthographic > 0 && (
                        <li>Erros ortográficos: {aiResponse.errors.orthographic}</li>
                      )}
                      {aiResponse.errors.conceptual > 0 && (
                        <li>Problemas conceituais: {aiResponse.errors.conceptual}</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}