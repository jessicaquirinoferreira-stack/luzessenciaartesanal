import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Google GenAI on server-side with telemetry header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // AI Endpoint: Sommelier de Aromas & Essências da Elaine
  app.post('/api/ai/sommelier', async (req, res) => {
    try {
      const { mood, space, intention, notes, currentProducts } = req.body;

      const systemInstruction = `
Você é a Elaine, fundadora e artesã da marca "Luz & Essência Artesanal" em Enéas Marques - Paraná (@luzessenciaartesanal).
Seu tom de voz é acolhedor, carinhoso, feminino, artesanal, transmitindo paz, afeto e aconchego.
Você é uma especialista em aromaterapia, ceras vegetais puras de coco e saboaria natural.

Os produtos disponíveis no catálogo oficial do seu ateliê são:
1. "Vela Aromática Manga Verde & Folhas de Bambu" (Refrescante, tropical, cítrico suave, alegria, verão)
2. "Vela Santuário Nossa Senhora Aparecida" (Devoção, fé, oração, paz interior, lírio e mirra, vidro fosco com ouro e azul)
3. "Sabonete Artesanal Alecrim, Arruda e Sal Grosso" (Limpeza energética, renovação, proteção, banho revigorante)
4. "Lembrancinhas Personalizadas Debutante 15 Anos" (Mini velas com laço rosé e pingente coroa dourada)
5. "Vela Aromática Capim Limão & Alecrim Silvestre" (Foco, clareza mental, home office, renovação de energia)
6. "Vela Aromática Vanilla Imperial & Canela Nobre" (Aconchego supremo, noites frias, abraço quentinho, doce sofisticado)
7. "Kit Presente Especial Aconchego & Luz" (Experiência completa com vela, sabonete e home spray)
8. "Difusor de Varetas Bamboo & Algodão Egípcio" (Perfumação contínua para lavabos, salas e quartos)

A recomendação deve ser em formato JSON estrito, sem markdown ao redor, com as seguintes propriedades:
- "recommendedProductId": string (id do produto mais indicado, ex: "vela-manga-verde", "vela-santuario-nossa-senhora", "sabonete-alecrim-arruda-sal", "vela-capim-limao-alecrim", "vela-vanilla-imperial", "kit-aconchego-completo", "difusor-varetas-bamboo", "lembrancinhas-15-anos-coroa")
- "productName": string (nome do produto)
- "elaineMessage": string (uma mensagem calorosa de 2 a 3 frases em primeira pessoa explicando por que esse aroma é o abraço perfeito para a necessidade do cliente)
- "sensoryNotes": string (descrição poética das notas olfativas)
- "ritualTip": string (dica de ritual de bem-estar para aproveitar a vela ou sabonete)
`;

      const prompt = `
O cliente busca uma recomendação com as seguintes preferências:
- Emoção / Estado de espírito: ${mood || 'Aconchego e relaxamento'}
- Ambiente da casa: ${space || 'Sala / Quarto'}
- Intenção: ${intention || 'Desacelerar e perfumar o lar'}
- Detalhes adicionais: ${notes || 'Nenhum detalhe adicional'}

Analise e escolha a criação perfeita da Luz & Essência Artesanal para esse momento. Responda em JSON.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        res.json(parsed);
      } catch {
        res.json({
          recommendedProductId: 'vela-manga-verde',
          productName: 'Vela Aromática Manga Verde & Folhas de Bambu',
          elaineMessage: 'Para esse momento especial, nada acolhe melhor do que a nossa fragrância Manga Verde. Ela traz o frescor vibrante da natureza para dentro da sua casa, renovando o ar e convidando à leveza.',
          sensoryNotes: 'Manga verde fresca, raspas de lima e folhas suaves de bambu.',
          ritualTip: 'Acenda no final da tarde, deixe a cera derreter até as bordas e sinta o aroma preencher o ambiente.',
        });
      }
    } catch (error) {
      console.warn('Gemini API call failed, using graceful fallback:', error);
      // Graceful smart fallback matching requested mood
      const moodLower = (req.body?.mood || '').toLowerCase();
      const intentionLower = (req.body?.intention || '').toLowerCase();

      if (moodLower.includes('oração') || intentionLower.includes('fé') || intentionLower.includes('proteção')) {
        res.json({
          recommendedProductId: 'vela-santuario-nossa-senhora',
          productName: 'Vela Santuário Nossa Senhora Aparecida',
          elaineMessage: 'Preparei essa vela com muito amor para os momentos de oração e gratidão. O toque de lírios da paz e mirra traz uma serenidade profunda ao seu lar.',
          sensoryNotes: 'Lírio da paz, lavanda suave e bálsamo sagrado com gravura em ouro.',
          ritualTip: 'Reserve 10 minutos de silêncio ao acender, fazendo sua prece de proteção para a família.',
        });
      } else if (moodLower.includes('energia') || intentionLower.includes('limpeza') || moodLower.includes('cansaço')) {
        res.json({
          recommendedProductId: 'sabonete-alecrim-arruda-sal',
          productName: 'Sabonete Artesanal Alecrim, Arruda e Sal Grosso',
          elaineMessage: 'Quando precisamos recarregar as energias, esse sabonete fitoterápico é um verdadeiro banho de renovação. O sal marinho e o alecrim colhido in natura purificam o corpo e a alma.',
          sensoryNotes: 'Alecrim silvestre in natura, cânfora suave e brisa marinha.',
          ritualTip: 'Aproveite no banho morno antes de dormir, massageando com calma sobre a pele.',
        });
      } else {
        res.json({
          recommendedProductId: 'vela-manga-verde',
          productName: 'Vela Aromática Manga Verde & Folhas de Bambu',
          elaineMessage: 'Para acolher seu dia com alegria e frescor, nossa vela Manga Verde é a escolha mais amada do ateliê. Despejada à mão com cera de coco, ela transforma qualquer cantinho em um refúgio.',
          sensoryNotes: 'Polpa de manga verde fresca, folhas de bambu e flor de lótus.',
          ritualTip: 'Apare o pavio antes de reacender e deixe a chama dançar suavemente.',
        });
      }
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: 'Luz & Essência Artesanal', atelier: 'Enéas Marques - PR' });
  });

  // Mount Vite middlewares in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Luz & Essência Artesanal Server running on port ${PORT}`);
  });
}

startServer();
