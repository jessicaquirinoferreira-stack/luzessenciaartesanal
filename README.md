# ✨ Luz & Essência Artesanal — E-Commerce Premium

E-commerce completo, moderno e sofisticado para a marca de velas aromáticas e sabonetes artesanais **Luz & Essência Artesanal** (@luzessenciaartesanal), fundada pela **Elaine** em **Enéas Marques – Paraná**.

---

## 🌟 Recursos Principais

- **Design Sensorial de Luxo**: Inspirado nas melhores marcas de perfumaria de interiores do Brasil (referência almavelas.com.br), com tipografia nobre (Playfair Display + Plus Jakarta Sans), paleta aconchegante e fotografias reais do ateliê.
- **Catálogo Completo**: Velas aromáticas de cera 100% vegetal de coco, velas de santuário (com acabamentos em ouro e azul profundo), sabonetes feitos à mão (cold process) e kits de presente.
- **Lembrancinhas Personalizadas (15 Anos / Casamentos)**: Simulador de quantidade com orçamentos enviados diretamente ao WhatsApp da Elaine.
- **Cálculo de Frete Correios em Tempo Real**: Integração com a API do ViaCEP com preenchimento automático de endereço ao digitar o CEP e cálculo de PAC, SEDEX e Retirada no Ateliê. Frete grátis automático configurável (acima de R$ 199).
- **Checkout com Geração Automática de WhatsApp**: Ao finalizar a compra, o pedido é salvo no banco de dados e gera um link formatado para `wa.me/5546920027088` com número do pedido, dados do cliente, lista de itens, frete, descontos e chave Pix.
- **Painel Administrativo Completo (/admin)**: Acesso discreto no rodapé ("Área da Elaine / Gestão") contendo:
  - **Dashboard**: Métricas de vendas (dia, semana, mês), pedidos recentes e alertas de estoque baixo.
  - **PDV (Ponto de Venda)**: Interface ágil para registrar vendas presenciais em feiras ou no ateliê com recibo para WhatsApp.
  - **Gestão de Produtos**: Cadastro, edição, controle de estoque e fotos.
  - **Gestão de Pedidos**: Alteração de status (Pendente, Pago, Enviado, etc.), inclusão de código de rastreio dos Correios e reenvio de mensagem.
  - **Cupons de Desconto**: Criação de cupons por porcentagem (%) ou valor fixo (R$) com regras de pedido mínimo e validade.
  - **Orçamentos de 15 Anos**: Gestão de solicitações de lembrancinhas com resposta em 1 clique no WhatsApp.
  - **Configurações do Site**: Edição de mensagens, chave Pix e dados de frete.

---

## 🔑 Como Configurar o Firebase Automaticamente

O projeto já está provisionado e conectado ao Firestore e Firebase Authentication através do arquivo de configuração `firebase-applet-config.json`.

Para rodar em sua conta própria ou produção:
1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Crie um projeto e ative o **Firestore Database** e o **Firebase Authentication** (Provedor Google e/ou E-mail).
3. Cole as chaves em seu arquivo de ambiente ou em `firebase-applet-config.json`:
   ```json
   {
     "projectId": "SEU_PROJECT_ID",
     "appId": "SEU_APP_ID",
     "apiKey": "SUA_API_KEY",
     "authDomain": "SEU_PROJETO.firebaseapp.com",
     "firestoreDatabaseId": "(default)"
   }
   ```

---

## ☁️ Como Configurar o Vercel Blob Storage para Imagens

Para permitir upload de fotos direto pelo painel na Vercel:
1. No painel da sua conta na [Vercel](https://vercel.com/), vá até a aba **Storage**.
2. Clique em **Create Database** e selecione **Blob**.
3. Obtenha o token gerado (`BLOB_READ_WRITE_TOKEN`).
4. Adicione a variável de ambiente no seu projeto na Vercel ou no arquivo `.env`:
   ```env
   BLOB_READ_WRITE_TOKEN="seu_token_aqui"
   ```
5. Todas as imagens salvas através do painel serão distribuídas pela rede CDN ultra-rápida da Vercel.

---

## 👑 Como Acessar como Administrador (Área da Elaine)

1. No rodapé do site, clique no link discreto **"Área da Elaine / Gestão"** (ou acesse `/admin`).
2. Você pode entrar usando sua conta Google (`juniorwebcode@gmail.com`) ou clicar no botão **"Acesso Rápido de Gestão (Ateliê Elaine)"** para acesso imediato aos recursos de gestão e ao PDV.

---

## 🚀 Como Rodar Localmente e Fazer Deploy na Vercel

### Rodando Localmente:
```bash
npm install
npm run dev
```
Acesse `http://localhost:3000`.

### Deploy na Vercel:
1. Conecte o repositório ao seu GitHub.
2. Na Vercel, clique em **Add New Project** e selecione o repositório.
3. Clique em **Deploy**. A Vercel detectará o build automaticamente (`npm run build`).
