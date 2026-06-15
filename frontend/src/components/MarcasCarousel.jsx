import "./MarcasCarousel.css";

// Marcas de lujo reconocidas, mezcladas con estilos visuales variados (sin patrón)
const marcas = [
  { nombre: "Rolex", estilo: "estilo1" },
  { nombre: "FERRARI", estilo: "estilo4" },
  { nombre: "Gucci", estilo: "estilo2" },
  { nombre: "LOUIS VUITTON", estilo: "estilo6" },
  { nombre: "HERMÈS", estilo: "estilo3" },
  { nombre: "Chanel", estilo: "estilo5" },
  { nombre: "Rolls-Royce", estilo: "estilo1" },
  { nombre: "TIFFANY & CO", estilo: "estilo7" },
  { nombre: "Lamborghini", estilo: "estilo2" },
  { nombre: "Bvlgari", estilo: "estilo4" },
  { nombre: "DIOR", estilo: "estilo3" },
  { nombre: "Patek Philippe", estilo: "estilo6" },
  { nombre: "Dom Pérignon", estilo: "estilo5" },
  { nombre: "FENDI", estilo: "estilo1" },
  { nombre: "Bentley", estilo: "estilo7" },
  { nombre: "Balenciaga", estilo: "estilo2" },
  { nombre: "MONTBLANC", estilo: "estilo4" },
  { nombre: "Versace", estilo: "estilo3" },
  { nombre: "Ferragamo", estilo: "estilo6" },
  { nombre: "CHLOÉ", estilo: "estilo5" },
  { nombre: "Hennessy", estilo: "estilo1" },
  { nombre: "OMEGA", estilo: "estilo7" },
  { nombre: "Prada", estilo: "estilo2" },
  { nombre: "Moët & Chandon", estilo: "estilo4" },
  { nombre: "Hublot", estilo: "estilo3" },
  { nombre: "TOM FORD", estilo: "estilo6" },
  { nombre: "Aston Martin", estilo: "estilo5" },
  { nombre: "Burberry", estilo: "estilo1" },
  { nombre: "PIAGET", estilo: "estilo7" },
  { nombre: "Loro Piana", estilo: "estilo2" },
];

function MarcasCarousel() {
  // Se repite la lista para que el desplazamiento sea continuo (efecto de loop infinito)
  const marcasDuplicadas = [...marcas, ...marcas];

  return (
    <div className="marcas-carousel">
      <p className="marcas-carousel__titulo">Estas firmas confían en nosotros</p>
      <div className="marcas-carousel__pista">
        {marcasDuplicadas.map((marca, index) => (
          <span key={index} className={`marcas-carousel__item marcas-carousel__${marca.estilo}`}>
            {marca.nombre}
          </span>
        ))}
      </div>
    </div>
  );
}

export default MarcasCarousel;