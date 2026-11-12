import React from 'react';
import { ArrowRight, Sparkles, Heart, Shield, Feather, Star, Instagram, MessageCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Particles } from '../components/ui/Particles';
import { ShimmerButton } from '../components/ui/ShimmerButton';
import { AuroraText } from '../components/ui/AuroraText';
import { Marquee } from '../components/ui/Marquee';
import { TiltCard } from '../components/ui/TiltCard';

interface HomeViewProps {
  products: Product[];
  onNavigate: (view: string, params?: any) => void;
  onSelectProduct: (product: Product) => void;
  onOpenSommelier: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  products, 
  onNavigate, 
  onSelectProduct,
  onOpenSommelier,
}) => {
  const featuredProducts = products.filter(p => p.isFeatured && p.isActive).slice(0, 4);

  const categories = [
    {
      id: 'velas-aromaticas',
      title: 'Velas Aromáticas',
      desc: 'Cera 100% de coco & aromas envolventes',
      image: '/images/vela_aromatica_manga_1794485801864.jpg',
    },
    {
      id: 'velas-santuario',
      title: 'Velas de Santuário',
      desc: 'Devoção, fé, proteção e acabamento em ouro',
      image: '/images/vela_santuario_maria_1794485802727.jpg',
    },
    {
      id: 'sabonetes-artesanais',
      title: 'Sabonetes Feitos à Mão',
      desc: 'Alecrim, arruda, sal grosso & hidratação pura',
      image: '/images/sabonete_alecrim_sal_1794485803465.jpg',
    },
    {
      id: 'lembrancinhas',
      title: 'Lembrancinhas 15 Anos',
      desc: 'Mini velas com laço e coroa para celebrações',
      image: '/images/lembrancinhas_festa_1794485803571.jpg',
    },
  ];

  const highlights = [
    { title: 'Feedback', desc: 'Mais de 500 lares perfumados e clientes encantados' },
    { title: 'Pedidos', desc: 'Feitos sob encomenda com carinho manual' },
    { title: 'Produtos', desc: 'Matéria-prima 100% vegetal e livre de toxinas' },
    { title: 'Envios', desc: 'Embalagem protetora e envio ágil para todo o Brasil' },
  ];

  const marqueeItems = [
    '• Cera 100% Vegetal de Coco',
    '• Aromaterapia Artesanal',
    '• Pavios de Puro Algodão',
    '• Feito à Mão em Enéas Marques – PR',
    '• Sem Crueldade Animal',
    '• Saboaria Fitoterápica Cold Process',
    '• Velas de Devoção e Santuário',
    '• Lembrancinhas Personalizadas de 15 Anos',
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* Editorial Storefront Hero with Floating Embers & Shimmering Aurora */}
      <section className="relative overflow-hidden bg-[#FAF7F2] border-b border-[#ECE4D6]">
        {/* Floating Candlelight Embers Particle Canvas */}
        <Particles quantity={40} color="#C5A059" className="opacity-60" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Hero Copy (5 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#AD8942] bg-[#F4EFE6] px-3.5 py-1.5 rounded-full border border-[#ECE4D6] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Ateliê em Enéas Marques – PR</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#1F1913] leading-[1.15] text-balance">
                Aconchego em forma de luz e <AuroraText>perfume artesanal.</AuroraText>
              </h1>

              <p className="text-sm sm:text-base text-[#4A3E31] leading-relaxed max-w-lg">
                Velas aromáticas com cera vegetal pura de coco, sabonetes naturais e peças devocionais criadas com afeto pela Elaine para transformar sua casa em um refúgio de paz.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <ShimmerButton
                  onClick={() => onNavigate('shop')}
                  className="shadow-md"
                >
                  <span>Explorar Coleções</span>
                  <ArrowRight className="w-4 h-4" />
                </ShimmerButton>

                <button
                  onClick={onOpenSommelier}
                  className="px-5 py-3.5 bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#2E251C] rounded-2xl text-xs sm:text-sm font-semibold transition-all border border-[#DDD2BF] flex items-center justify-center gap-2 cursor-pointer shadow-2xs group"
                >
                  <Sparkles className="w-4 h-4 text-[#AD8942] group-hover:rotate-12 transition-transform" />
                  <span>Sommelier de Aromas IA</span>
                </button>
              </div>

              {/* Trust Strip */}
              <div className="pt-4 border-t border-[#ECE4D6] grid grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <p className="font-serif text-lg font-bold text-[#1F1913]">100%</p>
                  <p className="text-[11px] text-[#8E6D2F]">Cera Vegetal</p>
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-[#1F1913]">Cold Process</p>
                  <p className="text-[11px] text-[#8E6D2F]">Sabonetes Puros</p>
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-[#1F1913]">Brasil</p>
                  <p className="text-[11px] text-[#8E6D2F]">Envio Seguro</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Image Showcase (7 cols) with Tilt */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7"
            >
              <TiltCard maxTilt={4} scale={1.01}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#ECE4D6] aspect-[16/10] bg-[#F4EFE6]">
                  <img
                    src="/images/hero_luz_essencia_1794485802025.jpg"
                    alt="Velas artesanais acesas do Ateliê Luz & Essência"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                  
                  {/* Overlay Badges */}
                  <div className="absolute bottom-5 left-5 right-5 text-white flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-widest text-[#D8B772] font-semibold">Feito à Mão</p>
                      <p className="font-serif text-base sm:text-lg">Coleção Assinatura & Santuário</p>
                    </div>
                    <span className="text-xs bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white border border-white/20">
                      Enéas Marques – PR
                    </span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Infinite Sensory Ribbon (Marquee) */}
      <section className="bg-[#2E251C] text-[#FAF7F2] py-3.5 border-y border-[#3E3327] overflow-hidden">
        <Marquee repeat={3}>
          {marqueeItems.map((item, idx) => (
            <span key={idx} className="text-xs tracking-wider uppercase font-medium text-[#D8B772] px-4 whitespace-nowrap">
              {item}
            </span>
          ))}
        </Marquee>
      </section>

      {/* Category Bento Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[#AD8942] font-semibold mb-2">
            Nossos Aromas & Criações
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#1F1913]">
            Encontre a fragrância ideal para cada ambiente
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <TiltCard key={cat.id} maxTilt={6}>
              <div
                onClick={() => {
                  if (cat.id === 'lembrancinhas') {
                    onNavigate('lembrancinhas');
                  } else {
                    onNavigate('shop', { category: cat.id });
                  }
                }}
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-[#F4EFE6] border border-[#ECE4D6] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left text-white space-y-1">
                  <h3 className="font-serif text-xl font-medium tracking-tight text-white group-hover:text-[#D8B772] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#DDD2BF] line-clamp-1">
                    {cat.desc}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs text-[#D8B772] font-semibold">
                    <span>Conhecer</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Sommelier IA Banner Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1F1913] to-[#2E251C] text-white rounded-3xl p-8 sm:p-12 border border-[#3E3327] relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 text-left">
            <div className="lg:col-span-8 space-y-3">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#D8B772] font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-[#D8B772]" />
                <span>Experiência Personalizada de IA</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white">
                Dúvida sobre qual aroma combina com seu momento?
              </h2>
              <p className="text-xs sm:text-sm text-[#DDD2BF] max-w-xl leading-relaxed">
                Nosso Sommelier de Aromas inteligente analisa sua intenção (relaxamento, oração, foco ou presentes de 15 anos) e recomenda a criação artesanal sob medida com bilhete carinhoso da Elaine.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <ShimmerButton
                onClick={onOpenSommelier}
                background="#AD8942"
                className="w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4 text-[#F5D77F]" />
                <span>Iniciar Sommelier de IA</span>
              </ShimmerButton>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.2em] text-[#AD8942] font-semibold mb-2">
              Destaques do Ateliê
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1913]">
              Os mais amados por nossas clientes
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-[#8E6D2F] hover:text-[#1F1913] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Ver todo o catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Story Section: Elaine & Enéas Marques - PR */}
      <section className="bg-[#F4EFE6] border-y border-[#ECE4D6] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Elaine's Portrait */}
            <div className="lg:col-span-5">
              <TiltCard maxTilt={5}>
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#DDD2BF] aspect-[4/3] bg-white">
                  <img
                    src="https://i.postimg.cc/fyxtWjdg/Sem-titulo.jpg"
                    alt="Elaine, fundadora da Luz & Essência Artesanal no seu ateliê"
                    loading="lazy"
                    className="w-full h-full object-contain bg-[#FAF7F2]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#ECE4D6]">
                    <p className="font-serif text-sm font-semibold text-[#1F1913]">Elaine</p>
                    <p className="text-[11px] text-[#8E6D2F]">Fundadora & Artesã • Enéas Marques – PR</p>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#AD8942]">
                <Heart className="w-3.5 h-3.5 fill-[#C5A059]" />
                <span>Nossa Origem & Propósito</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1F1913] leading-tight">
                "Cada vela é um abraço luminoso feito para transformar seu lar."
              </h2>

              <div className="space-y-4 text-sm text-[#4A3E31] leading-relaxed">
                <p>
                  A <strong>Luz & Essência Artesanal</strong> nasceu do desejo de criar momentos de pausa, calma e aconchego em meio à rotina acelerada. Aqui no interior do Paraná, em Enéas Marques, tudo é preparado manualmente: a dosagem de cera vegetal pura, a maceração das ervas para os sabonetes e o acabamento minucioso de cada detalhe em dourado.
                </p>
                <p>
                  Nossas velas não liberam toxinas nem fuligem escura, pois usamos exclusivamente pavios ecológicos e cera de coco. Seja para iluminar sua oração diária com uma vela de santuário, desfrutar de um banho revigorante com alecrim e sal grosso, ou presentear convidados de 15 anos com lembrancinhas inesquecíveis, estamos aqui para levar luz ao seu coração.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-5 py-2.5 bg-[#2E251C] hover:bg-[#1F1913] text-[#FAF7F2] rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Conheça mais sobre nós
                </button>
                <a
                  href="https://instagram.com/luzessenciaartesanal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-[#AD8942] hover:text-[#1F1913] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Siga no Instagram</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Highlights / Destaques do Instagram */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[#AD8942] font-semibold mb-1">
            Transparência & Cuidado
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1913]">
            Destaques do nosso Ateliê
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-3xl border border-[#ECE4D6] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#DDD2BF] flex items-center justify-center text-[#8E6D2F] font-serif font-bold text-sm mb-4">
                  0{i + 1}
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1F1913] mb-2">
                  {h.title}
                </h3>
                <p className="text-xs text-[#4A3E31] leading-relaxed">
                  {h.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F4EFE6] flex items-center gap-1.5 text-[11px] text-[#5F7461]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Garantia de Qualidade</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Favors 15 Anos Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] border border-[#DDD2BF] rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-left">
              <span className="text-xs uppercase tracking-[0.2em] text-[#AD8942] font-semibold">
                Ocasiões Especiais • 15 Anos • Casamentos
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1F1913]">
                Lembrancinhas personalizadas que encantam para sempre
              </h2>
              <p className="text-sm text-[#4A3E31] max-w-xl leading-relaxed">
                Personalizamos cada mini vela com tags exclusivas com o nome da debutante ou noivos, laços de cetim e pingentes de coroa dourada. Peça seu orçamento personalizado direto pelo WhatsApp com a Elaine.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('lembrancinhas')}
                  className="px-6 py-3 bg-[#2E251C] hover:bg-[#1F1913] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Fazer Simulação de Orçamento
                </button>
                <a
                  href="https://wa.me/5546920027088?text=Olá%20Elaine!%20Gostaria%20de%20um%20orçamento%20de%20lembrancinhas%20personalizadas."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#EFE9DF] hover:bg-[#E4DACB] text-[#2E251C] rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Conversar no WhatsApp</span>
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-[#ECE4D6] aspect-square">
                <img
                  src="/images/lembrancinhas_festa_1794485803571.jpg"
                  alt="Lembrancinhas de 15 anos personalizadas com coroa dourada"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
