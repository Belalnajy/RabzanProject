export const COMPANY_NAME = 'شركة ربزان التجارية';

export const NAV_LINKS = [
  { name: 'nav.home', path: '/' },
  { name: 'nav.about', path: '/about' },
  { name: 'nav.services', path: '/services' },
  { name: 'nav.products', path: '/products' },
  { name: 'nav.howItWorks', path: '/how-it-works' },
  { name: 'nav.portfolio', path: '/portfolio' },
  { name: 'nav.contact', path: '/contact' },
];

export const SERVICES = [
  {
    id: 'sourcing',
    title: 'services.sourcing.title',
    description: 'services.sourcing.description',
    icon: 'search-check',
  },
  {
    id: 'inspection',
    title: 'services.inspection.title',
    description: 'services.inspection.description',
    icon: 'clipboard-check',
  },
  {
    id: 'logistics',
    title: 'services.logistics.title',
    description: 'services.logistics.description',
    icon: 'ship',
  },
  {
    id: 'customs',
    title: 'services.customs.title',
    description: 'services.customs.description',
    icon: 'file-text',
  },
  {
    id: 'consulting',
    title: 'services.consulting.title',
    description: 'services.consulting.description',
    icon: 'briefcase',
  },
];

export const PROCESS_STEPS = [
  {
    id: 1,
    title: 'process.step1.title',
    description: 'process.step1.description',
  },
  {
    id: 2,
    title: 'process.step2.title',
    description: 'process.step2.description',
  },
  {
    id: 3,
    title: 'process.step3.title',
    description: 'process.step3.description',
  },
  {
    id: 4,
    title: 'process.step4.title',
    description: 'process.step4.description',
  },
  {
    id: 5,
    title: 'process.step5.title',
    description: 'process.step5.description',
  },
];

export const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: 'portfolio.project1.title',
    category: 'portfolio.project1.category',
    image:
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400&q=80',
    description: 'portfolio.project1.description',
  },
  {
    id: 2,
    title: 'portfolio.project2.title',
    category: 'portfolio.project2.category',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
    description: 'portfolio.project2.description',
  },
  {
    id: 3,
    title: 'portfolio.project3.title',
    category: 'portfolio.project3.category',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
    description: 'portfolio.project3.description',
  },
];

/** خدمات تجارية (كروت + زر اطلب الخدمة → الفورم) */
export const COMMERCIAL_SERVICES = [
  {
    id: 'shipping-clearance',
    title: 'services.commercial.shipping_clearance.title',
    description: 'services.commercial.shipping_clearance.description',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'factory-visit',
    title: 'services.commercial.factory_visit.title',
    description: 'services.commercial.factory_visit.description',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sourcing',
    title: 'services.commercial.sourcing.title',
    description: 'services.commercial.sourcing.description',
    image:
      'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
  },
];

/** مقالات وأخبار (كروت صورة + عنوان + مقتطف + زر جميع المقالات) */
export const ARTICLES = [
  {
    id: 1,
    title: 'articles.1.title',
    snippet: 'articles.1.snippet',
    image:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'articles.2.title',
    snippet: 'articles.2.snippet',
    image:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'articles.3.title',
    snippet: 'articles.3.snippet',
    image:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
  },
];

/** منتجات مميزة (كروت منتجات + زر شراء عبر واتساب) */
export const PRODUCTS = [
  {
    id: 1,
    name: 'products.items.1.name',
    category: 'products.items.1.category',
    price: 'products.items.1.price',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    description: 'products.items.1.description',
    longDescription: 'products.items.1.long_description',
    features: [
      'products.items.1.features.0',
      'products.items.1.features.1',
      'products.items.1.features.2',
      'products.items.1.features.3',
    ],
    specs: {
      capacity: 'products.items.1.specs.capacity',
      voltage: 'products.items.1.specs.voltage',
      material: 'products.items.1.specs.material',
      weight: 'products.items.1.specs.weight',
      warranty: 'products.items.1.specs.warranty',
    },
  },
  {
    id: 2,
    name: 'products.items.2.name',
    category: 'products.items.2.category',
    price: 'products.items.2.price',
    image:
      'https://images.unsplash.com/photo-1509391366360-fe5bb584850a?auto=format&fit=crop&w=800&q=80',
    description: 'products.items.2.description',
    longDescription: 'products.items.2.long_description',
    features: [
      'products.items.2.features.0',
      'products.items.2.features.1',
      'products.items.2.features.2',
      'products.items.2.features.3',
    ],
    specs: {
      power: 'products.items.2.specs.power',
      cell_type: 'products.items.2.specs.cell_type',
      efficiency: 'products.items.2.specs.efficiency',
      warranty: 'products.items.2.specs.warranty',
      dimensions: 'products.items.2.specs.dimensions',
    },
  },
  {
    id: 3,
    name: 'products.items.3.name',
    category: 'products.items.3.category',
    price: 'products.items.3.price',
    image:
      'https://images.unsplash.com/photo-1620626011761-9963d7b69763?auto=format&fit=crop&w=800&q=80',
    description: 'products.items.3.description',
    longDescription: 'products.items.3.long_description',
    features: [
      'products.items.3.features.0',
      'products.items.3.features.1',
      'products.items.3.features.2',
      'products.items.3.features.3',
    ],
    specs: {
      material: 'products.items.3.specs.material',
      origin: 'products.items.3.specs.origin',
      thickness: 'products.items.3.specs.thickness',
      resistance: 'products.items.3.specs.resistance',
    },
  },
  {
    id: 4,
    name: 'products.items.4.name',
    category: 'products.items.4.category',
    price: 'products.items.4.price',
    image:
      'https://images.unsplash.com/photo-1605600611284-195205ef91b6?auto=format&fit=crop&w=800&q=80',
    description: 'products.items.4.description',
    longDescription: 'products.items.4.long_description',
    features: [
      'products.items.4.features.0',
      'products.items.4.features.1',
      'products.items.4.features.2',
      'products.items.4.features.3',
    ],
    specs: {
      raw_material: 'products.items.4.specs.raw_material',
      thickness: 'products.items.4.specs.thickness',
      transparency: 'products.items.4.specs.transparency',
      durability: 'products.items.4.specs.durability',
    },
  },
  {
    id: 5,
    name: 'products.items.5.name',
    category: 'products.items.5.category',
    price: 'products.items.5.price',
    image:
      'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80',
    description: 'products.items.5.description',
    longDescription: 'products.items.5.long_description',
    features: [
      'products.items.5.features.0',
      'products.items.5.features.1',
      'products.items.5.features.2',
      'products.items.5.features.3',
    ],
    specs: {
      efficiency: 'products.items.5.specs.efficiency',
      protection: 'products.items.5.specs.protection',
      color_temp: 'products.items.5.specs.color_temp',
      beam_angle: 'products.items.5.specs.beam_angle',
    },
  },
  {
    id: 6,
    name: 'products.items.6.name',
    category: 'products.items.6.category',
    price: 'products.items.6.price',
    image:
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
    description: 'products.items.6.description',
    longDescription: 'products.items.6.long_description',
    features: [
      'products.items.6.features.0',
      'products.items.6.features.1',
      'products.items.6.features.2',
      'products.items.6.features.3',
    ],
    specs: {
      brands: 'products.items.6.specs.brands',
      parts_type: 'products.items.6.specs.parts_type',
      warranty: 'products.items.6.specs.warranty',
      delivery: 'products.items.6.specs.delivery',
    },
  },
];

export const CONTACT_INFO = {
  email: 'info@rabzan.com',
  phone: '966537888046',
  address: 'المملكة العربية السعودية، الرياض',
  whatsapp: '966537888046',
  socials: [
    { name: 'contact.socials.linkedin', url: '#', icon: 'linkedin' },
    { name: 'contact.socials.twitter', url: '#', icon: 'twitter' },
    { name: 'contact.socials.instagram', url: '#', icon: 'instagram' },
  ],
};
