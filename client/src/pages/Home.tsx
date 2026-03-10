import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Zap, Smile, ShoppingCart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

/**
 * Premium Cat Care Landing Page
 * Design: Minimalism Meets Warmth
 * Color Palette: Terracota, Verde Salvia, Crema, Oro
 * Typography: Playfair Display (H1), Poppins (H2/H3), Inter (Body)
 */

export default function Home() {
  const [clicks, setClicks] = useState<Record<string, number>>({});
  
  // Fetch click statistics
  const { data: clickStats } = trpc.clicks.getStats.useQuery();
  const trackClickMutation = trpc.clicks.trackClick.useMutation();

  useEffect(() => {
    if (clickStats) {
      const statsMap: Record<string, number> = {};
      clickStats.forEach(stat => {
        statsMap[stat.productId] = stat.clickCount;
      });
      setClicks(statsMap);
    }
  }, [clickStats]);

  const handleProductClick = async (productId: string, url: string) => {
    // Track the click
    await trackClickMutation.mutateAsync({
      productId,
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    });
    
    // Open the link
    window.open(url, '_blank');
  };

  const primaryProducts = [
    {
      id: "minino-plus",
      name: "Minino Plus Premium",
      description: "Alimento seco adulto sabor carne, pollo y pavo",
      price: "$147",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663415513737/MKUwxAAcpBpJ4Q2GeXLbv9/cat-hero-premium-7tsVgDBAMZgKcHtw4LuZm6.webp",
      link: "https://meli.la/1yVveux",
      badge: "Más vendido"
    },
    {
      id: "purina-excellent",
      name: "Purina Excellent Urinary",
      description: "Croquetas sabor pollo y arroz 7.5kg",
      price: "$996",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663415513737/MKUwxAAcpBpJ4Q2GeXLbv9/cat-wellness-QNc5F2UsoDkJxJAA63ViZv.webp",
      link: "https://meli.la/2VPSm4Z",
      badge: "Salud Urinaria"
    },
    {
      id: "nupec-felino",
      name: "Nupec Felino Adulto",
      description: "Nutrición especializada pollo, salmón y arroz",
      price: "$736",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663415513737/MKUwxAAcpBpJ4Q2GeXLbv9/cat-product-showcase-GFmwNroXS4254WLzpPgnhS.webp",
      link: "https://meli.la/2CYbzzM",
      badge: "Premium"
    }
  ];

  const secondaryProducts = [
    {
      id: "kit-momovida",
      name: "Kit Momovida",
      description: "Láser y plumas interactivas",
      price: "$98",
      link: "https://meli.la/1yqcwQD"
    },
    {
      id: "puntero-laser",
      name: "Puntero Láser 7 en 1",
      description: "USB recargable con 7 funciones",
      price: "$127",
      link: "https://meli.la/1zhCZHd"
    },
    {
      id: "juguete-elevacion",
      name: "Juguete Elevación Automática",
      description: "Con cuerda elástica interactiva",
      price: "$187",
      link: "https://meli.la/12BYrFh"
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Nutrición Premium",
      description: "Ingredientes de alta calidad seleccionados para la salud óptima de tu felino"
    },
    {
      icon: Zap,
      title: "Energía y Vitalidad",
      description: "Fórmulas balanceadas que mantienen a tu gato activo y saludable"
    },
    {
      icon: Smile,
      title: "Diversión Garantizada",
      description: "Juguetes interactivos que estimulan el instinto natural de caza"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            🐱 Cat Paradise
          </div>
          <div className="flex gap-6">
            <a href="#productos" className="text-foreground hover:text-primary transition">Productos</a>
            <a href="#beneficios" className="text-foreground hover:text-primary transition">Beneficios</a>
            <a href="#juguetes" className="text-foreground hover:text-primary transition">Juguetes</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                La Mejor <span className="text-primary">Nutrición</span> para tu Felino
              </h1>
              <p className="text-lg text-muted-foreground">
                Productos premium seleccionados especialmente para la salud, energía y diversión de tu gato. Desde alimentos nutritivos hasta juguetes interactivos.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Productos <ShoppingCart className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Conocer Más
              </Button>
            </div>
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Clientes Satisfechos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">Calidad Garantizada</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 lg:h-full">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663415513737/MKUwxAAcpBpJ4Q2GeXLbv9/cat-hero-premium-7tsVgDBAMZgKcHtw4LuZm6.webp"
              alt="Gato feliz comiendo"
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section id="productos" className="py-20 bg-white">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              Productos <span className="text-primary">Destacados</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Selecciona los mejores alimentos premium para tu felino, recomendados por expertos en nutrición felina
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {primaryProducts.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-primary">{product.price}</span>
                      <span className="text-xs text-muted-foreground">
                        {clicks[product.id] || 0} clics
                      </span>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => handleProductClick(product.id, product.link)}
                    >
                      Comprar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="py-20 bg-gradient-to-b from-background to-white">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              ¿Por Qué Elegirnos?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nos comprometemos con la salud y felicidad de tu mascota
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index}
                  className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:border-primary"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Juguetes Interactivos */}
      <section id="juguetes" className="py-20 bg-white">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              Juguetes <span className="text-secondary">Interactivos</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mantén a tu felino entretenido y estimulado con nuestros juguetes de calidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {secondaryProducts.map((product) => (
              <Card 
                key={product.id}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:border-secondary"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-primary">{product.price}</span>
                      <span className="text-xs text-muted-foreground">
                        {clicks[product.id] || 0} clics
                      </span>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-secondary text-secondary hover:bg-secondary/10"
                      onClick={() => handleProductClick(product.id, product.link)}
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              ¿Listo para Cuidar a tu Felino?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestra completa selección de productos premium en Mercado Libre
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => handleProductClick("minino-plus", "https://meli.la/1yVveux")}
            >
              Comprar Ahora
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Contactar
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Cat Paradise</h4>
              <p className="text-sm opacity-75">Nutrición y diversión premium para tu felino</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Productos</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><a href="#productos" className="hover:opacity-100 transition">Alimentos</a></li>
                <li><a href="#juguetes" className="hover:opacity-100 transition">Juguetes</a></li>
                <li><a href="#beneficios" className="hover:opacity-100 transition">Beneficios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Comprar</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><a href="https://meli.la/1yVveux" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition">Mercado Libre</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <p className="text-sm opacity-75">Disponible en Mercado Libre</p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-75">
            <p>&copy; 2026 Cat Paradise. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
