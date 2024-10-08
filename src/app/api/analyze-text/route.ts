import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { content } = await req.json();

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Você é um assistente especializado em análise de texto jurídico e regulatório para SaMD (Software as a Medical Device). Sua tarefa é analisar o texto fornecido, identificar e corrigir erros, e fornecer uma análise detalhada. Formate sua resposta em JSON com as seguintes chaves: 'formattedText' (texto corrigido e formatado em HTML, incluindo tags apropriadas para títulos, parágrafos, listas, etc.), 'comments' (comentários sobre problemas regulatórios e possíveis soluções em HTML), 'errors' (objeto com 'orthographic' e 'conceptual' como números inteiros)."
          },
          {
            role: "user",
            content: `Analise o seguinte texto em termos de conformidade regulatória para SaMD, corrija erros, formate apropriadamente em HTML e forneça o resultado no formato especificado: ${content}`
          }
        ],
      });

      const aiResponseContent = completion.choices[0].message?.content || '{}';
      
      // Tenta extrair o JSON da resposta
      const jsonMatch = aiResponseContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : '{}';
      
      let aiResponse;
      try {
        aiResponse = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Erro ao analisar JSON:', parseError);
        aiResponse = {
          formattedText: "Erro ao processar o texto formatado.",
          comments: "Erro ao processar os comentários.",
          errors: { orthographic: 0, conceptual: 0 }
        };
      }

      return NextResponse.json({ response: aiResponse });
    } catch (error) {
      console.error('Erro ao processar a solicitação:', error);
      return NextResponse.json({ error: 'Ocorreu um erro ao processar a solicitação.' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
  }
}