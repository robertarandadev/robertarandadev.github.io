/* ==========================================================
   EDITA AQUÍ TU INFORMACIÓN
   Todo el portfolio se genera a partir de este archivo.
   ========================================================== */
window.PORTFOLIO = {
  name: "Robert Aranda",
  role: "Desarrollador de Software",
  location: "Perú",
  available: true,
  email: "robertdantearandabarboza@gmail.com",
  whatsapp: "51931638493", // tu número con código de país, sin + ni espacios. Ej: "51999999999"
  social: {
    linkedin: "",
    instagram: "",
    facebook: "",
  },

  // Titular principal (la 2ª línea sale con degradado azul)
  headline: ["Páginas web que", "hacen crecer", "tu negocio."],
  intro:
    "Soy Robert Aranda, Desarrollador de Software. Creo páginas web modernas, rápidas y fáciles de usar que transmiten confianza y convierten visitas en clientes.",

  // Sección "Sobre mí"
  photo: "img/robert.webp",
  about: [
    "Soy Desarrollador de Software de profesión: estudié la carrera y hoy pongo todo ese conocimiento al servicio de tu negocio. Ayudo a empresas y emprendedores a tener una presencia profesional en internet que les traiga clientes de verdad.",
    "Trabajo de forma cercana: me involucro en tu negocio, te explico todo sin tecnicismos y cuido cada detalle hasta que tu web quede como la imaginaste.",
  ],
  aboutPoints: ["Diseño y desarrollo en una sola persona", "Comunicación directa por WhatsApp", "Entregas claras y a tiempo"],

  services: [
    { icon: "web", title: "Páginas web para empresas", text: "Una web profesional que transmite confianza y muestra lo mejor de tu negocio." },
    { icon: "shop", title: "Tiendas y catálogos online", text: "Muestra tus productos y recibe pedidos o cotizaciones las 24 horas del día." },
    { icon: "system", title: "Sistemas a medida", text: "Herramientas web que ordenan tu negocio: clientes, productos, pedidos y reportes." },
    { icon: "search", title: "Aparece en Google", text: "Preparo tu web para que te encuentren las personas que ya buscan lo que vendes." },
    { icon: "phone", title: "Perfecta en celulares", text: "La mayoría de tus clientes te visita desde el celular. Tu web se verá impecable." },
    { icon: "support", title: "Soporte y mantenimiento", text: "Me encargo de que tu web siga rápida, segura y al día. Tú enfócate en vender." },
  ],

  benefits: [
    { icon: "bolt", title: "Carga en segundos", text: "Una web lenta pierde clientes. Las mías cargan rápido incluso con datos móviles." },
    { icon: "chat", title: "WhatsApp a un clic", text: "Tus clientes te escriben directo desde la web, sin formularios complicados." },
    { icon: "shield", title: "Segura y confiable", text: "Certificado de seguridad (candado) y buenas prácticas para proteger tu web." },
    { icon: "hand", title: "Trato directo conmigo", text: "Sin intermediarios: hablas con quien diseña y construye tu web." },
  ],
  stats: [
    { value: 2, suffix: "", label: "Empresas con su web en línea" },
    { value: 100, suffix: "%", label: "Adaptadas a celulares" },
    { value: 24, suffix: "/7", label: "Tu negocio abierto en internet" },
  ],

  /* PROYECTOS
     - image: captura de escritorio · mobileImage: captura de móvil
     - embed: true si la web se puede mostrar en vivo dentro del portfolio */
  projects: [
    {
      title: "Hydromenn",
      type: "Web corporativa + catálogo de productos",
      description:
        "Hydromenn vende martillos hidráulicos para minería y construcción en todo el Perú. Les creé una web que presenta su catálogo, genera confianza con testimonios de clientes y facilita pedir cotizaciones.",
      features: ["Catálogo de productos", "Carrito de cotizaciones", "Botón de WhatsApp", "Blog y testimonios", "Sedes en Lima y Arequipa"],
      accent: "#3b82f6",
      image: "img/hydromenn.jpg",
      mobileImage: "img/hydromenn-movil.jpg",
      url: "https://www.hydromenn.com",
      embed: false,
    },
    {
      title: "Carpintería SBA",
      type: "Tienda online de muebles",
      description:
        "Carpintería SBA fabrica muebles a medida en Lima. Su web muestra sus trabajos por ambientes y permite que cada cliente consulte por WhatsApp el mueble que le interesa.",
      features: ["Catálogo por ambientes", "Consultas por WhatsApp", "Fotos de alta calidad", "Rápida en celulares"],
      accent: "#38bdf8",
      image: "img/carpinteriasba.jpg",
      mobileImage: "img/carpinteriasba-movil.jpg",
      url: "https://carpinteriasba.com",
      embed: true,
    },
  ],

  process: [
    { title: "Conversamos", text: "Me cuentas sobre tu negocio, tus clientes y lo que necesitas. Te doy una propuesta clara, sin letra pequeña." },
    { title: "Diseñamos", text: "Preparo el diseño de tu web con tus colores y tu marca. Lo revisas y lo ajustamos hasta que te encante." },
    { title: "Construimos", text: "Doy vida al diseño: tu web queda rápida, segura y perfecta en computadoras y celulares." },
    { title: "¡Lanzamos!", text: "Tu web sale a internet y empieza a atraer clientes. Y sigo contigo para lo que necesites." },
  ],
};
