import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_ARTISANS, INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_ORDERS } from './src/data/initialData';
import { Product, Review, Order } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data storage initialized from seed data
let products: Product[] = [...INITIAL_PRODUCTS];
let artisans = [...INITIAL_ARTISANS];
let reviews: Review[] = [...INITIAL_REVIEWS];
let orders: Order[] = [...INITIAL_ORDERS];

// Initialize Google Gen AI client safely
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Products API
app.get('/api/products', (req: Request, res: Response) => {
  const { region, category, search, minRating } = req.query;
  let filtered = [...products];

  if (region && typeof region === 'string' && region !== 'Todas') {
    filtered = filtered.filter(p => p.location.region === region || p.location.state === region);
  }

  if (category && typeof category === 'string' && category !== 'Todas') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.artisanName.toLowerCase().includes(q) ||
      p.location.city.toLowerCase().includes(q) ||
      p.location.state.toLowerCase().includes(q)
    );
  }

  if (minRating && !isNaN(Number(minRating))) {
    filtered = filtered.filter(p => p.rating >= Number(minRating));
  }

  res.json(filtered);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  res.json(product);
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: req.body.name || 'Nova Peça Artesanal',
    description: req.body.description || '',
    category: req.body.category || 'Cerâmica & Barro',
    price: Number(req.body.price) || 0,
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
    image: req.body.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    galleryImages: req.body.galleryImages || [req.body.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'],
    stock: Number(req.body.stock) || 1,
    artisanId: req.body.artisanId || 'art-1',
    artisanName: req.body.artisanName || 'Artesão Local',
    location: req.body.location || { city: 'São Paulo', state: 'SP', region: 'Sudeste' },
    dimensions: req.body.dimensions || 'Peça Única',
    materials: Array.isArray(req.body.materials) ? req.body.materials : ['Materiais Naturais'],
    productionDays: Number(req.body.productionDays) || 3,
    rating: 5.0,
    reviewCount: 0,
    featured: req.body.featured || false,
    sustainableTag: req.body.sustainableTag || 'Feito à Mão',
    createdAt: new Date().toISOString()
  };

  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// Update stock or price for inventory management
app.patch('/api/products/:id/stock', (req: Request, res: Response) => {
  const { id } = req.params;
  const { stock, price } = req.body;
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  if (stock !== undefined) {
    products[productIndex].stock = Math.max(0, Number(stock));
  }
  if (price !== undefined) {
    products[productIndex].price = Math.max(0, Number(price));
  }

  res.json(products[productIndex]);
});

// Delete product
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== id);
  res.json({ success: true, message: 'Produto removido com sucesso' });
});

// Artisans API
app.get('/api/artisans', (req: Request, res: Response) => {
  res.json(artisans);
});

// Reviews API
app.get('/api/reviews/:productId', (req: Request, res: Response) => {
  const { productId } = req.params;
  const productReviews = reviews.filter(r => r.productId === productId);
  res.json(productReviews);
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { productId, userName, userCity, rating, comment } = req.body;

  if (!productId || !userName || !comment) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId,
    userName,
    userCity: userCity || 'Brasil',
    rating: Number(rating) || 5,
    comment,
    date: new Date().toLocaleDateString('pt-BR'),
    verifiedPurchase: true
  };

  reviews.unshift(newReview);

  // Recalculate product rating
  const prod = products.find(p => p.id === productId);
  if (prod) {
    const prodReviews = reviews.filter(r => r.productId === productId);
    const avg = prodReviews.reduce((acc, r) => acc + r.rating, 0) / prodReviews.length;
    prod.rating = Number(avg.toFixed(1));
    prod.reviewCount = prodReviews.length;
  }

  res.status(201).json(newReview);
});

// Orders & Secure Payment API
app.get('/api/orders', (req: Request, res: Response) => {
  res.json(orders);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const { customerName, customerEmail, customerPhone, shippingAddress, items, totalAmount, shippingFee, paymentMethod } = req.body;

  if (!items || !items.length || !customerName) {
    return res.status(400).json({ error: 'Dados do pedido incompletos' });
  }

  // Generate tracking code
  const states = ['MG', 'PE', 'BA', 'RS', 'CE', 'SP'];
  const randState = states[Math.floor(Math.random() * states.length)];
  const trackingCode = `BR-ART-${Math.floor(100000 + Math.random() * 900000)}-${randState}`;

  const newOrder: Order = {
    id: `PED-${Math.floor(90000 + Math.random() * 10000)}`,
    customerName,
    customerEmail,
    customerPhone: customerPhone || '(11) 99999-9999',
    shippingAddress: shippingAddress || {
      street: 'Rua Principal',
      number: '100',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      cep: '01001-000'
    },
    items,
    totalAmount: Number(totalAmount) || 0,
    shippingFee: Number(shippingFee) || 0,
    paymentMethod: paymentMethod || 'PIX',
    paymentStatus: 'Aprovado',
    orderStatus: 'Aguardando Envio',
    trackingCode,
    createdAt: new Date().toISOString(),
    securityEscrowGuarantee: true
  };

  // Reduce stock
  for (const item of items) {
    const p = products.find(prod => prod.id === item.productId);
    if (p) {
      p.stock = Math.max(0, p.stock - item.quantity);
    }
  }

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { orderStatus } = req.body;
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }

  if (orderStatus) {
    order.orderStatus = orderStatus;
  }

  res.json(order);
});

// Admin stats summary
app.get('/api/stats', (req: Request, res: Response) => {
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalStockItems = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock <= 3).length;

  res.json({
    totalRevenue,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalArtisans: artisans.length,
    totalStockItems,
    lowStockCount,
    averageRating: 4.9
  });
});

// Customer Support Chat API (Gemini Powered & Regional Business Context)
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensagem inválida.' });
  }

  const ai = getAIClient();

  // Create prompt context with regional catalog knowledge
  const productCatalogSummary = products.map(p =>
    `- ${p.name} | R$ ${p.price.toFixed(2)} | Categoria: ${p.category} | Artesão: ${p.artisanName} | Origem: ${p.location.city}/${p.location.state} (${p.location.region}) | Estoque: ${p.stock} un`
  ).join('\n');

  const artisanSummary = artisans.map(a =>
    `- ${a.name} (${a.city}/${a.state} - Região ${a.region}): ${a.specialty} (${a.experienceYears} anos de ofício, Selo: ${a.badge || 'Tradicional'})`
  ).join('\n');

  const systemInstruction = `Você é o "Guia do Artesanato Regional", assistente virtual de atendimento ao cliente de uma plataforma de e-commerce que conecta pequenos produtores e artesãos locais a clientes de todo o Brasil.

Suas diretrizes de atendimento são:
1. PRODUTOS LOCAIS: Explique a história, materiais e valor cultural das peças (Cerâmica do Jequitinhonha, Renda Irlandesa de Sergipe, Esculturas em Madeira do Cariri, Queijos e Doces da Canastra, Biojoias da Amazônia/Bahia, Tecelagem Gaúcha).
2. PRAZOS DE ENTREGA POR LOCALIDADE:
   - Região Sudeste: 3 a 5 dias úteis (frete expresso direto das oficinas).
   - Região Sul: 4 a 6 dias úteis.
   - Região Nordeste: 4 a 7 dias úteis.
   - Regiões Norte e Centro-Oeste: 6 a 10 dias úteis.
   - Embalagens: todas as peças frágeis (como cerâmicas e vidros) são enviadas em caixas de alta absorção de impacto com palha natural protetora e plástico bolha reforçado.
3. RASTREIO DE PEDIDOS:
   - Os códigos de rastreio seguem o formato BR-ART-XXXXXX-UF (ex: BR-ART-489210-MG). Podem ser consultados no painel ou diretamente nos Correios e transportadoras parceiras.
4. FORMAS DE PAGAMENTO SEGURO INTEGRADO:
   - PIX: com 5% de desconto e aprovação imediata via QR Code e Chave Copia e Cola.
   - Cartão de Crédito: parcelamento em até 12x sem juros com proteção antifraude 256-bit.
   - Boleto Bancário: compensação em até 1 dia útil com 3 dias para vencimento.
   - Garantia de Custódia: O dinheiro fica protegido em conta garantia e só é liberado para o pequeno produtor após o recebimento e conferência do produto pelo cliente.
5. TOM DE VOZ:
   - Caloroso, prestativo, claro e objetivo. Responda em português brasileiro com formatação legível (tópicos quando conveniente) e concisão (2 a 3 parágrafos curtos).

Catálogo atual de produtos:
${productCatalogSummary}

Mestres Artesãos parceiros:
${artisanSummary}`;

  if (!ai) {
    // Contextual fallback when API key is not yet set
    const lower = message.toLowerCase();
    let fallbackText = "Olá! Sou o Guia do Artesanato Regional. Como posso ajudar com dúvidas sobre produtos, prazos de entrega por região, rastreio ou pagamento seguro?";

    if (lower.includes('prazo') || lower.includes('frete') || lower.includes('entrega') || lower.includes('envio') || lower.includes('regiao') || lower.includes('região') || lower.includes('cep')) {
      fallbackText = "🚚 **Prazos de Entrega por Localidade:**\n• **Sudeste:** 3 a 5 dias úteis\n• **Sul:** 4 a 6 dias úteis\n• **Nordeste:** 4 a 7 dias úteis\n• **Norte / Centro-Oeste:** 6 a 10 dias úteis\n\nTodas as peças de cerâmica e vidro recebem embalagem especial anti-impacto com palha natural protetora.";
    } else if (lower.includes('rastreio') || lower.includes('rastrear') || lower.includes('codigo') || lower.includes('código') || lower.includes('pedido') || lower.includes('onde esta') || lower.includes('onde está')) {
      fallbackText = "📦 **Rastreamento de Pedidos:**\nSeu código de rastreio (padrão *BR-ART-XXXXXX-UF*) é enviado por e-mail assim que a peça sai da oficina do artesão e pode ser acompanhado no painel ou nos Correios.";
    } else if (lower.includes('pagamento') || lower.includes('pix') || lower.includes('cartao') || lower.includes('cartão') || lower.includes('boleto') || lower.includes('parcel') || lower.includes('seguro') || lower.includes('custodia') || lower.includes('custódia') || lower.includes('garantia')) {
      fallbackText = "🔒 **Formas de Pagamento Seguro:**\n• **PIX:** Aprovação imediata com 5% de desconto.\n• **Cartão de Crédito:** Em até 12x sem juros com criptografia 256-bit.\n• **Boleto Bancário:** Vencimento em 3 dias úteis.\n\n🛡️ **Garantia de Custódia:** Seu pagamento fica retido com total segurança e só é liberado para o artesão após a entrega confirmada.";
    } else if (lower.includes('cerâmica') || lower.includes('ceramica') || lower.includes('jequitinhonha') || lower.includes('canastra') || lower.includes('queijo') || lower.includes('renda') || lower.includes('artesao') || lower.includes('artesão') || lower.includes('mestre') || lower.includes('produto') || lower.includes('presente')) {
      fallbackText = "🏺 **Produtos & Mestres Regionais:**\nTrabalhamos com mestres tradicionais certificados:\n• **Dona Maria das Graças:** Cerâmica e bonecas do Vale do Jequitinhonha (MG)\n• **Mestre Expedito:** Esculturas entalhadas em madeira do Cariri (CE)\n• **Dona Josefa:** Renda Irlandesa tradicional de Divina Pastora (SE)\n• **Seu Bento:** Queijos artesanais maturados da Serra da Canastra (MG)";
    }

    return res.json({
      text: fallbackText,
      source: 'local_assistant'
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.6
      }
    });

    const reply = response.text || 'Obrigado por consultar o Artesanato Regional! Nossos mestres e equipe de suporte estão à disposição.';
    res.json({
      text: reply,
      source: 'gemini'
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.json({
      text: `Olá! Sou o Guia do Artesanato Regional. Oferecemos peças autênticas com garantia de entrega para todo o Brasil, frete protegido e pagamento seguro via PIX (com 5% OFF) ou Cartão em até 12x.`,
      source: 'fallback_error'
    });
  }
});

// ---------------- VITE MIDDLEWARE / SPA FALLBACK ----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Artesanato Regional Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
