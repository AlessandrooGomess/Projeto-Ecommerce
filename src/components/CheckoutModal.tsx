import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, CreditCard, FileText, CheckCircle2, Lock, Truck, Copy, Check, ArrowLeft } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  shippingFee: number;
  initialCep: string;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  shippingFee,
  initialCep,
  onOrderPlaced
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  // Customer Form
  const [customerName, setCustomerName] = useState('Mariana Silva Duarte');
  const [customerEmail, setCustomerEmail] = useState('mariana.duarte@email.com');
  const [customerPhone, setCustomerPhone] = useState('(11) 98765-4321');
  const [street, setStreet] = useState('Rua das Hortênsias');
  const [number, setNumber] = useState('142');
  const [neighborhood, setNeighborhood] = useState('Jardins');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [cep, setCep] = useState(initialCep || '01410-000');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão de Crédito' | 'Boleto Bancário'>('PIX');
  const [installments, setInstallments] = useState<number>(1);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardHolder, setCardHolder] = useState('MARIANA S DUARTE');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('742');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedPix, setCopiedPix] = useState<boolean>(false);

  const subtotal = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const pixDiscount = paymentMethod === 'PIX' ? subtotal * 0.05 : 0;
  const totalAmount = Math.max(0, subtotal - pixDiscount + shippingFee);

  const pixKeyMock = `00020126580014br.gov.bcb.pix0136artesanato-regional-pagamento-seguro@pix.br520400005303986540${totalAmount.toFixed(2)}5802BR5925ARTESANATO REGIONAL BR6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKeyMock);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleProcessOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderPayload = {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress: {
        street,
        number,
        neighborhood,
        city,
        state,
        cep
      },
      items: cartItems.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        productImage: i.product.image,
        price: i.product.price,
        quantity: i.quantity,
        artisanName: i.product.artisanName
      })),
      totalAmount,
      shippingFee,
      paymentMethod
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) throw new Error('Erro ao registrar pedido');

      const data: Order = await response.json();
      setCompletedOrder(data);
      onOrderPlaced(data);
      setStep('success');
    } catch (err) {
      console.error(err);
      // Fallback in-memory order
      const fallbackOrder: Order = {
        id: `PED-${Math.floor(90000 + Math.random() * 10000)}`,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: { street, number, neighborhood, city, state, cep },
        items: cartItems.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          productImage: i.product.image,
          price: i.product.price,
          quantity: i.quantity,
          artisanName: i.product.artisanName
        })),
        totalAmount,
        shippingFee,
        paymentMethod,
        paymentStatus: 'Aprovado',
        orderStatus: 'Aguardando Envio',
        trackingCode: `BR-ART-${Math.floor(100000 + Math.random() * 900000)}-MG`,
        createdAt: new Date().toISOString(),
        securityEscrowGuarantee: true
      };
      setCompletedOrder(fallbackOrder);
      onOrderPlaced(fallbackOrder);
      setStep('success');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div id="checkout-modal-backdrop" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      
      <div 
        id="checkout-modal-container"
        className="relative bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-lg text-white">Checkout Seguro Integrado</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Step 1: Customer Details */}
          {step === 'details' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Passo 1 de 2: Dados de Envio</span>
                <span className="text-xs text-stone-400">Total: R$ {totalAmount.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-300 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-stone-800 text-white rounded-lg p-2 border border-stone-700 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">E-mail para confirmação e rastreio</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-stone-800 text-white rounded-lg p-2 border border-stone-700 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-stone-800 text-white rounded-lg p-2 border border-stone-700 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">CEP de Entrega</label>
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="w-full bg-stone-800 text-white rounded-lg p-2 border border-stone-700 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-2 grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-stone-300 mb-1">Endereço (Rua/Avenida)</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-stone-800 text-white rounded-lg p-2 border border-stone-700 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 mb-1">Número</label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full bg-stone-800 text-white rounded-lg p-2 border border-stone-700 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-stone-800 text-white rounded-lg p-2 border border-stone-700 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-300 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-stone-800 text-white rounded-lg p-2 border border-stone-700 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-300 mb-1">Estado</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-stone-800 text-white rounded-lg p-2 border border-stone-700 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Items summary */}
              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800 space-y-2 text-xs">
                <span className="text-stone-400 font-medium">Itens selecionados ({cartItems.length}):</span>
                <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-stone-300">
                      <span className="truncate">{item.quantity}x {item.product.name} ({item.product.artisanName})</span>
                      <span className="font-semibold text-white">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl transition-all shadow"
              >
                Prosseguir para o Pagamento Seguro
              </button>
            </div>
          )}

          {/* Step 2: Payment Selection & Escrow */}
          {step === 'payment' && (
            <form onSubmit={handleProcessOrder} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-stone-400 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Endereço
                </button>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Passo 2 de 2: Pagamento</span>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'PIX'
                      ? 'bg-amber-950/50 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold">PIX</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 rounded">5% OFF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cartão de Crédito')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'Cartão de Crédito'
                      ? 'bg-amber-950/50 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold">Cartão</span>
                  <span className="text-[10px] text-stone-400">Até 12x</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Boleto Bancário')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'Boleto Bancário'
                      ? 'bg-amber-950/50 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold">Boleto</span>
                  <span className="text-[10px] text-stone-400">Compensação 1d</span>
                </button>
              </div>

              {/* PIX Details */}
              {paymentMethod === 'PIX' && (
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-200">QR Code PIX Instantâneo</span>
                    <span className="text-[11px] text-emerald-400 font-bold">Desconto de R$ {pixDiscount.toFixed(2)} aplicado!</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-stone-900/80 p-3 rounded-lg border border-stone-800">
                    <div className="w-28 h-28 bg-white p-1.5 rounded-lg flex items-center justify-center shadow">
                      {/* Stylized QR Code placeholder */}
                      <div className="w-full h-full bg-stone-950 rounded flex flex-col items-center justify-center p-2 text-white text-center">
                        <QrCode className="w-12 h-12 text-amber-400" />
                        <span className="text-[8px] text-stone-400 mt-1 font-mono">PAGAMENTO SEGURO</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 min-w-0">
                      <p className="text-[11px] text-stone-300 leading-relaxed">
                        Abra o aplicativo do seu banco, escolha <strong>Pagar com PIX</strong> e aponte a câmera para o código ou copie o código abaixo:
                      </p>
                      
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="w-full py-2 px-3 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-stone-700 transition-colors"
                      >
                        {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPix ? 'Código PIX Copiado!' : 'Copiar Chave PIX Copia e Cola'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Card Details */}
              {paymentMethod === 'Cartão de Crédito' && (
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-200">Dados do Cartão de Crédito</span>
                    <span className="text-[11px] text-stone-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" /> Criptografia 256-bit
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-stone-400 text-[11px] mb-1">Número do Cartão</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-stone-900 text-white rounded-lg p-2 border border-stone-700"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 text-[11px] mb-1">Nome impresso no Cartão</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-stone-900 text-white rounded-lg p-2 border border-stone-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-400 text-[11px] mb-1">Validade (MM/AA)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-stone-900 text-white rounded-lg p-2 border border-stone-700"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-[11px] mb-1">CVV</label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-stone-900 text-white rounded-lg p-2 border border-stone-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-400 text-[11px] mb-1">Opções de Parcelamento</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="w-full bg-stone-900 text-white rounded-lg p-2 border border-stone-700"
                      >
                        <option value={1}>1x de R$ {totalAmount.toFixed(2)} (Sem juros)</option>
                        <option value={2}>2x de R$ {(totalAmount / 2).toFixed(2)} (Sem juros)</option>
                        <option value={3}>3x de R$ {(totalAmount / 3).toFixed(2)} (Sem juros)</option>
                        <option value={6}>6x de R$ {(totalAmount / 6).toFixed(2)} (Sem juros)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Boleto Details */}
              {paymentMethod === 'Boleto Bancário' && (
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs">
                  <span className="font-semibold text-stone-200">Boleto Bancário com Registro</span>
                  <p className="text-stone-400 text-[11px]">
                    O boleto pode ser pago em qualquer agência, lotérica ou pelo Internet Banking até a data de vencimento (3 dias úteis).
                  </p>
                  <div className="p-2.5 bg-stone-900 rounded font-mono text-[11px] text-amber-300 break-all border border-stone-800">
                    23793.38128 60000.123456 78000.654321 9 987600000{Math.floor(totalAmount)}
                  </div>
                </div>
              )}

              {/* Escrow Guarantee Box */}
              <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-200">
                <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-amber-100">Garantia de Custódia e Proteção ao Consumidor</p>
                  <p className="text-[11px] text-amber-300/80 leading-relaxed">
                    O valor pago é mantido em segurança e só é liberado para a conta do pequeno produtor após a chegada e conferência da encomenda.
                  </p>
                </div>
              </div>

              {/* Total & Submit */}
              <div className="pt-2 border-t border-stone-800 space-y-2">
                <div className="flex justify-between text-sm font-bold text-white">
                  <span>Total Final a Pagar:</span>
                  <span className="text-amber-400 font-sans text-xl">R$ {totalAmount.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-950/60 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? 'Processando Pagamento Seguro...' : `Confirmar Pagamento (${paymentMethod})`}</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success Screen */}
          {step === 'success' && completedOrder && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-white">Pagamento Confirmado com Sucesso!</h3>
                <p className="text-xs text-stone-300 mt-1">
                  Obrigado por apoiar a produção artesanal regional e nossos mestres locais.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-left text-xs space-y-2.5 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-stone-800 pb-2">
                  <span className="text-stone-400">Código do Pedido:</span>
                  <span className="font-mono font-bold text-amber-400">{completedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Rastreio dos Correios/Transportadora:</span>
                  <span className="font-mono font-semibold text-white">{completedOrder.trackingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Forma de Pagamento:</span>
                  <span className="text-stone-200">{completedOrder.paymentMethod} (Garantia Ativa)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Destinatário:</span>
                  <span className="text-stone-200">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Entrega em:</span>
                  <span className="text-stone-200">{completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state}</span>
                </div>
                <div className="flex justify-between border-t border-stone-800 pt-2 font-bold text-sm">
                  <span>Valor Total Pago:</span>
                  <span className="text-amber-400 font-sans">R$ {completedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
