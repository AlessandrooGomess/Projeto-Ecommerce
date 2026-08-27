import React, { useState } from 'react';
import { Package, ShoppingBag, PlusCircle, BarChart3, AlertTriangle, CheckCircle2, Edit3, Trash2, MapPin, Truck, RefreshCw, Layers } from 'lucide-react';
import { Product, Order, Artisan } from '../types';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  artisans: Artisan[];
  onUpdateStock: (productId: string, newStock: number, newPrice?: number) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: (productData: Partial<Product>) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  artisans,
  onUpdateStock,
  onDeleteProduct,
  onAddProduct,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'add_product' | 'metrics'>('orders');

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('Cerâmica & Barro');
  const [newProdPrice, setNewProdPrice] = useState<string>('120.00');
  const [newProdStock, setNewProdStock] = useState<number>(10);
  const [newProdArtisanId, setNewProdArtisanId] = useState<string>(artisans[0]?.id || 'art-1');
  const [newProdCity, setNewProdCity] = useState('Vale do Jequitinhonha');
  const [newProdState, setNewProdState] = useState('MG');
  const [newProdRegion, setNewProdRegion] = useState<Product['location']['region']>('Sudeste');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdMaterials, setNewProdMaterials] = useState('Argila Natural, Pigmento Mineral');
  const [newProdDimensions, setNewProdDimensions] = useState('25cm x 15cm (800g)');
  const [addSuccessMessage, setAddSuccessMessage] = useState(false);

  // Quick edit stock state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const lowStockItems = products.filter(p => p.stock <= 3);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const selectedArtisan = artisans.find(a => a.id === newProdArtisanId);

    const productPayload: Partial<Product> = {
      name: newProdName,
      category: newProdCategory,
      price: parseFloat(newProdPrice) || 99,
      stock: Number(newProdStock) || 1,
      artisanId: newProdArtisanId,
      artisanName: selectedArtisan?.name || 'Artesão Local',
      location: {
        city: newProdCity,
        state: newProdState,
        region: newProdRegion
      },
      image: newProdImage,
      galleryImages: [newProdImage],
      description: newProdDesc || 'Peça artesanal exclusiva produzida com materiais sustentáveis da região.',
      materials: newProdMaterials.split(',').map(m => m.trim()),
      dimensions: newProdDimensions,
      productionDays: 3,
      rating: 5.0,
      reviewCount: 0,
      sustainableTag: 'Produção Local'
    };

    onAddProduct(productPayload);
    setAddSuccessMessage(true);
    setNewProdName('');
    setNewProdDesc('');
    setTimeout(() => setAddSuccessMessage(false), 4000);
  };

  return (
    <div id="admin-panel-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-stone-100">
      
      {/* Admin Title & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <h2 className="font-serif font-bold text-2xl text-white">Painel Administrativo & Gestão do Produtor</h2>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Gerenciamento simplificado de pedidos, níveis de estoque, precificação e cadastro de novas peças.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-stone-900 p-1.5 rounded-xl border border-stone-800 overflow-x-auto text-xs font-semibold">
          <button
            id="admin-tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-white shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pedidos ({orders.length})</span>
          </button>

          <button
            id="admin-tab-inventory"
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-amber-600 text-white shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Estoque & Preços ({products.length})</span>
            {lowStockItems.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
            )}
          </button>

          <button
            id="admin-tab-add"
            onClick={() => setActiveTab('add_product')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'add_product'
                ? 'bg-amber-600 text-white shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Novo Produto</span>
          </button>

          <button
            id="admin-tab-metrics"
            onClick={() => setActiveTab('metrics')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'metrics'
                ? 'bg-amber-600 text-white shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Métricas & Vendas</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Pedidos Recebidos com Pagamento Seguro</h3>
            <span className="text-xs text-stone-400">Total movimentado: <strong className="text-amber-400 font-sans">R$ {totalRevenue.toFixed(2)}</strong></span>
          </div>

          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                id={`order-row-${order.id}`}
                className="bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-800 hover:border-stone-700 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-amber-400">{order.id}</span>
                    <span className="text-xs text-stone-400">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[11px] bg-stone-800 px-2 py-0.5 rounded text-stone-300">
                      {order.paymentMethod}
                    </span>
                  </div>

                  {/* Status selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">Status do Pedido:</span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                      className={`text-xs rounded-lg px-2.5 py-1 font-semibold border ${
                        order.orderStatus === 'Entregue'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : order.orderStatus === 'Enviado'
                          ? 'bg-blue-950 text-blue-300 border-blue-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      <option value="Aguardando Envio">Aguardando Envio</option>
                      <option value="Em Produção/Embalagem">Em Produção/Embalagem</option>
                      <option value="Enviado">Enviado com Rastreio</option>
                      <option value="Entregue">Entregue ao Cliente</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Customer Details */}
                  <div className="space-y-1 bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                    <p className="font-semibold text-stone-200">Cliente:</p>
                    <p className="text-stone-300">{order.customerName}</p>
                    <p className="text-stone-400">{order.customerEmail} • {order.customerPhone}</p>
                    <p className="text-stone-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      <span>{order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.cep})</span>
                    </p>
                  </div>

                  {/* Items list */}
                  <div className="space-y-1 bg-stone-950/60 p-3 rounded-xl border border-stone-800 md:col-span-2">
                    <p className="font-semibold text-stone-200">Itens e Artesãos Responsáveis:</p>
                    <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-stone-300">
                          <span className="truncate">{it.quantity}x {it.productName} (Mestre: {it.artisanName})</span>
                          <span className="font-semibold text-white ml-2">R$ {(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-sm">
                      <span className="text-stone-400">Total do Pedido (c/ frete):</span>
                      <span className="text-amber-400 font-sans">R$ {order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Tracking code & Escrow Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-stone-400">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Código de Rastreamento: <strong className="text-stone-200 font-mono">{order.trackingCode}</strong></span>
                  </div>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Custódia Segura Ativa (Garantia ao Produtor)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & PRICES */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          
          {/* Low stock alert banner */}
          {lowStockItems.length > 0 && (
            <div className="bg-amber-950/40 border border-amber-600/60 p-3.5 rounded-xl flex items-center gap-3 text-xs text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-bold">Alerta de Estoque Crítico:</p>
                <p className="text-[11px] text-amber-300/80">
                  {lowStockItems.length} peças estão com 3 ou menos unidades em estoque. Considere produzir mais lotes com os mestres.
                </p>
              </div>
            </div>
          )}

          {/* Product Inventory Table */}
          <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="p-3.5">Produto & Imagem</th>
                    <th className="p-3.5">Categoria / Região</th>
                    <th className="p-3.5">Mestre Artesão</th>
                    <th className="p-3.5">Preço Unitário</th>
                    <th className="p-3.5">Estoque Atual</th>
                    <th className="p-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-stone-950 border border-stone-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-xs">{product.name}</p>
                          <p className="text-[11px] text-stone-400">★ {product.rating.toFixed(1)} ({product.reviewCount} avaliações)</p>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="block font-medium text-stone-200">{product.category}</span>
                        <span className="text-[10px] text-amber-400">{product.location.city}, {product.location.state}</span>
                      </td>

                      <td className="p-3.5 font-medium text-stone-200">
                        {product.artisanName}
                      </td>

                      <td className="p-3.5 font-sans font-bold text-amber-400">
                        {editingPriceId === product.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              className="w-20 bg-stone-800 text-white rounded p-1 text-xs border border-amber-500"
                            />
                            <button
                              onClick={() => {
                                onUpdateStock(product.id, product.stock, parseFloat(tempPrice));
                                setEditingPriceId(null);
                              }}
                              className="px-1.5 py-1 bg-amber-600 text-white rounded text-[10px]"
                            >
                              Salvar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span>R$ {product.price.toFixed(2)}</span>
                            <button
                              onClick={() => {
                                setEditingPriceId(product.id);
                                setTempPrice(product.price.toString());
                              }}
                              className="text-stone-500 hover:text-stone-300"
                              title="Editar preço"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-stone-800 rounded-lg border border-stone-700">
                            <button
                              onClick={() => onUpdateStock(product.id, Math.max(0, product.stock - 1))}
                              className="px-2 py-0.5 text-stone-300 hover:text-white"
                            >
                              -
                            </button>
                            <span className={`px-2 font-bold ${product.stock <= 3 ? 'text-orange-400' : 'text-white'}`}>
                              {product.stock}
                            </span>
                            <button
                              onClick={() => onUpdateStock(product.id, product.stock + 1)}
                              className="px-2 py-0.5 text-stone-300 hover:text-white"
                            >
                              +
                            </button>
                          </div>
                          {product.stock <= 3 && (
                            <span className="text-[10px] text-orange-400 font-semibold">Baixo</span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onDeleteProduct(product.id)}
                          className="p-1.5 text-stone-500 hover:text-red-400 rounded-lg hover:bg-stone-800 transition-colors"
                          title="Remover produto do catálogo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADD NEW PRODUCT */}
      {activeTab === 'add_product' && (
        <div className="bg-stone-900 p-5 sm:p-7 rounded-2xl border border-stone-800 max-w-3xl mx-auto space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="text-base font-semibold text-white">Cadastrar Nova Peça Artesanal no E-commerce</h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Conecte a produção de novos pequenos produtores à nossa vitrine nacional.
            </p>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-stone-300 mb-1 font-medium">Nome da Peça Artesanal</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Escultura de Barro Tauá - Pássaro da Caatinga"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-stone-800 text-white rounded-lg p-2.5 border border-stone-700 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Categoria</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value as any)}
                  className="w-full bg-stone-800 text-white rounded-lg p-2.5 border border-stone-700"
                >
                  <option value="Cerâmica & Barro">Cerâmica & Barro</option>
                  <option value="Tecelagem & Renda">Tecelagem & Renda</option>
                  <option value="Madeira & Escultura">Madeira & Escultura</option>
                  <option value="Cestas & Fibras">Cestas & Fibras</option>
                  <option value="Biojoias">Biojoias</option>
                  <option value="Gastronomia & Doces">Gastronomia & Doces</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Mestre Artesão / Produtor</label>
                <select
                  value={newProdArtisanId}
                  onChange={(e) => setNewProdArtisanId(e.target.value)}
                  className="w-full bg-stone-800 text-white rounded-lg p-2.5 border border-stone-700"
                >
                  {artisans.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.city}/{a.state})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Preço de Venda (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full bg-stone-800 text-white rounded-lg p-2.5 border border-stone-700"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Quantidade em Estoque</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(Number(e.target.value))}
                  className="w-full bg-stone-800 text-white rounded-lg p-2.5 border border-stone-700"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Cidade de Origem</label>
                <input
                  type="text"
                  value={newProdCity}
                  onChange={(e) => setNewProdCity(e.target.value)}
                  className="w-full bg-stone-800 text-white rounded-lg p-2.5 border border-stone-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">UF</label>
                  <input
                    type="text"
                    value={newProdState}
                    onChange={(e) => setNewProdState(e.target.value)}
                    className="w-full bg-stone-800 text-white rounded-lg p-2.5 border border-stone-700"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Região</label>
                  <select
                    value={newProdRegion}
                    onChange={(e) => setNewProdRegion(e.target.value as any)}
                    className="w-full bg-stone-800 text-white rounded-lg p-2.5 border border-stone-700"
                  >
                    <option value="Sudeste">Sudeste</option>
                    <option value="Nordeste">Nordeste</option>
                    <option value="Sul">Sul</option>
                    <option value="Norte">Norte</option>
                    <option value="Centro-Oeste">Centro-Oeste</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 mb-1 font-medium">URL da Imagem da Peça</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full bg-stone-800 text-white rounded-lg p-2.5 border border-stone-700 font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 mb-1 font-medium">Materiais & Técnica</label>
                <input
                  type="text"
                  value={newProdMaterials}
                  onChange={(e) => setNewProdMaterials(e.target.value)}
                  placeholder="Ex: Argila Grés, Verniz Vegetal, Palha de Milho"
                  className="w-full bg-stone-800 text-white rounded-lg p-2.5 border border-stone-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-300 mb-1 font-medium">Descrição & História da Peça</label>
                <textarea
                  rows={3}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Conte sobre o processo de confecção manual, inspiração regional e cuidados..."
                  className="w-full bg-stone-800 text-white rounded-lg p-2.5 border border-stone-700"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {addSuccessMessage && (
                <span className="text-emerald-400 text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Peça cadastrada e publicada no catálogo!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                Cadastrar Peça na Vitrine
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 4: METRICS & SALES DASHBOARD */}
      {activeTab === 'metrics' && (
        <div className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1">
              <span className="text-xs text-stone-400">Receita Total de Vendas</span>
              <p className="text-2xl font-bold font-sans text-amber-400">R$ {totalRevenue.toFixed(2)}</p>
              <span className="text-[11px] text-emerald-400">100% repassado com garantia</span>
            </div>

            <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1">
              <span className="text-xs text-stone-400">Total de Pedidos</span>
              <p className="text-2xl font-bold font-sans text-white">{orders.length}</p>
              <span className="text-[11px] text-stone-400">Transações protegidas</span>
            </div>

            <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1">
              <span className="text-xs text-stone-400">Mestres Cadastrados</span>
              <p className="text-2xl font-bold font-sans text-white">{artisans.length}</p>
              <span className="text-[11px] text-amber-400">5 regiões representadas</span>
            </div>

            <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1">
              <span className="text-xs text-stone-400">Avaliação Média dos Clientes</span>
              <p className="text-2xl font-bold font-sans text-white">4.9 ★</p>
              <span className="text-[11px] text-emerald-400">99.4% de satisfação positiva</span>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            
            {/* Regional sales distribution */}
            <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-3">
              <h4 className="font-semibold text-white text-sm">Distribuição Regional da Produção</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Sudeste (Vale do Jequitinhonha / Serra da Canastra)</span>
                    <span className="font-semibold text-amber-400">45%</span>
                  </div>
                  <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[45%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Nordeste (Cariri / Sergipe / Bahia)</span>
                    <span className="font-semibold text-amber-400">35%</span>
                  </div>
                  <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[35%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Sul (Serras Gaúchas / Tear Orgânico)</span>
                    <span className="font-semibold text-amber-400">15%</span>
                  </div>
                  <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[15%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Norte & Centro-Oeste</span>
                    <span className="font-semibold text-amber-400">5%</span>
                  </div>
                  <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[5%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform commitment */}
            <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-3">
              <h4 className="font-semibold text-white text-sm">Diretrizes de Impacto Social & Comércio Justo</h4>
              <ul className="space-y-2 text-stone-300 leading-relaxed text-xs list-disc list-inside">
                <li>Zero cobrança de mensalidade para pequenos artesãos e comunidades tradicionais.</li>
                <li>Pagamento em custódia com liberação imediata após comprovação de entrega.</li>
                <li>Preservação de técnicas ancestrais: cerâmica em tauá, renda irlandesa, tear de pedal e entalhe.</li>
                <li>Suporte automatizado para dúvidas de clientes em tempo real no chat com IA.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
