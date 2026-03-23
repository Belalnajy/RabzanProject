export const COMPANY_NAME = 'شركة ربزان التجارية';

export const NAV_LINKS = [
  { name: 'nav.home', path: '/' },
  { name: 'nav.services', path: '/services' },
  { name: 'nav.products', path: '/products' },
  { name: 'nav.portfolio', path: '/portfolio' },
  { name: 'nav.howItWorks', path: '/how-it-works' },
  { name: 'nav.about', path: '/about' },
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
    image: '/25KG Fully Auto Washer Extractor (High Spin).png',
    description: 'products.items.1.description',
    longDescription: 'products.items.1.long_description',
    features: [
      'products.items.1.features.0',
      'products.items.1.features.1',
      'products.items.1.features.2',
      'products.items.1.features.3',
      'products.items.1.features.4',
    ],
    specs: {
      washing_capacity: 'products.items.1.specs.washing_capacity',
      drum_volume: 'products.items.1.specs.drum_volume',
      drum_size: 'products.items.1.specs.drum_size',
      material: 'products.items.1.specs.material',
      washing_speed: 'products.items.1.specs.washing_speed',
      high_extraction_speed: 'products.items.1.specs.high_extraction_speed',
      voltage: 'products.items.1.specs.voltage',
      motor_power: 'products.items.1.specs.motor_power',
      electric_heating: 'products.items.1.specs.electric_heating',
      dimension: 'products.items.1.specs.dimension',
      weight: 'products.items.1.specs.weight',
    },
  },
  {
    id: 2,
    name: 'products.items.2.name',
    category: 'products.items.2.category',
    price: 'products.items.2.price',
    image: '/50KG Fully Auto Washer Extractor (High Spin).png',
    description: 'products.items.2.description',
    longDescription: 'products.items.2.long_description',
    features: ['products.items.2.features.0', 'products.items.2.features.1'],
    specs: {
      washing_capacity: 'products.items.2.specs.washing_capacity',
      drum_volume: 'products.items.2.specs.drum_volume',
      drum_size: 'products.items.2.specs.drum_size',
      material: 'products.items.2.specs.material',
      washing_speed: 'products.items.2.specs.washing_speed',
      high_extraction_speed: 'products.items.2.specs.high_extraction_speed',
      voltage: 'products.items.2.specs.voltage',
      motor_power: 'products.items.2.specs.motor_power',
      electric_heating: 'products.items.2.specs.electric_heating',
      dimension: 'products.items.2.specs.dimension',
      weight: 'products.items.2.specs.weight',
    },
  },
  {
    id: 3,
    name: 'products.items.3.name',
    category: 'products.items.3.category',
    price: 'products.items.3.price',
    image: '/100KG Fully Auto Washer Extractor (High Spin).png',
    description: 'products.items.3.description',
    longDescription: 'products.items.3.long_description',
    features: ['products.items.3.features.0', 'products.items.3.features.1'],
    specs: {
      washing_capacity: 'products.items.3.specs.washing_capacity',
      drum_volume: 'products.items.3.specs.drum_volume',
      drum_size: 'products.items.3.specs.drum_size',
      material: 'products.items.3.specs.material',
      washing_speed: 'products.items.3.specs.washing_speed',
      high_extraction_speed: 'products.items.3.specs.high_extraction_speed',
      voltage: 'products.items.3.specs.voltage',
      motor_power: 'products.items.3.specs.motor_power',
      steam_consumption: 'products.items.3.specs.steam_consumption',
      dimension: 'products.items.3.specs.dimension',
      weight: 'products.items.3.specs.weight',
    },
  },
  {
    id: 4,
    name: 'products.items.4.name',
    category: 'products.items.4.category',
    price: 'products.items.4.price',
    image: '/25KG Fully Auto Tumble Dryer.png',
    description: 'products.items.4.description',
    longDescription: 'products.items.4.long_description',
    features: [
      'products.items.4.features.0',
      'products.items.4.features.1',
      'products.items.4.features.2',
    ],
    specs: {
      drying_capacity: 'products.items.4.specs.drying_capacity',
      drum_volume: 'products.items.4.specs.drum_volume',
      drum_size: 'products.items.4.specs.drum_size',
      voltage: 'products.items.4.specs.voltage',
      motor_power: 'products.items.4.specs.motor_power',
      fan_motor_power: 'products.items.4.specs.fan_motor_power',
      electric_heating: 'products.items.4.specs.electric_heating',
      exhaust: 'products.items.4.specs.exhaust',
      dimension: 'products.items.4.specs.dimension',
      weight: 'products.items.4.specs.weight',
    },
  },
  {
    id: 5,
    name: 'products.items.5.name',
    category: 'products.items.5.category',
    price: 'products.items.5.price',
    image: '/50KG Fully Auto Tumble Dryer.png',
    description: 'products.items.5.description',
    longDescription: 'products.items.5.long_description',
    features: [
      'products.items.5.features.0',
      'products.items.5.features.1',
      'products.items.5.features.2',
    ],
    specs: {
      drying_capacity: 'products.items.5.specs.drying_capacity',
      drum_volume: 'products.items.5.specs.drum_volume',
      drum_size: 'products.items.5.specs.drum_size',
      voltage: 'products.items.5.specs.voltage',
      motor_power: 'products.items.5.specs.motor_power',
      fan_motor_power: 'products.items.5.specs.fan_motor_power',
      electric_heating: 'products.items.5.specs.electric_heating',
      drying_time: 'products.items.5.specs.drying_time',
      dimension: 'products.items.5.specs.dimension',
      weight: 'products.items.5.specs.weight',
    },
  },
  {
    id: 6,
    name: 'products.items.6.name',
    category: 'products.items.6.category',
    price: 'products.items.6.price',
    image: '/100KG Fully Auto Tumble Dryer.png',
    description: 'products.items.6.description',
    longDescription: 'products.items.6.long_description',
    features: [
      'products.items.6.features.0',
      'products.items.6.features.1',
      'products.items.6.features.2',
    ],
    specs: {
      drying_capacity: 'products.items.6.specs.drying_capacity',
      drum_volume: 'products.items.6.specs.drum_volume',
      drum_size: 'products.items.6.specs.drum_size',
      voltage: 'products.items.6.specs.voltage',
      motor_power: 'products.items.6.specs.motor_power',
      fan_motor_power: 'products.items.6.specs.fan_motor_power',
      steam_consumption: 'products.items.6.specs.steam_consumption',
      drying_time: 'products.items.6.specs.drying_time',
      dimension: 'products.items.6.specs.dimension',
      weight: 'products.items.6.specs.weight',
    },
  },
  {
    id: 7,
    name: 'products.items.7.name',
    category: 'products.items.7.category',
    price: 'products.items.7.price',
    image: '/1 Roller 3300mm Flatwork Ironer (Electric heated).png',
    description: 'products.items.7.description',
    longDescription: 'products.items.7.long_description',
    features: [
      'products.items.7.features.0',
      'products.items.7.features.1',
      'products.items.7.features.2',
    ],
    specs: {
      length_of_roller: 'products.items.7.specs.length_of_roller',
      number_of_roller: 'products.items.7.specs.number_of_roller',
      cylinder_diameter: 'products.items.7.specs.cylinder_diameter',
      wall_thickness: 'products.items.7.specs.wall_thickness',
      cylinder_material: 'products.items.7.specs.cylinder_material',
      ironing_speed: 'products.items.7.specs.ironing_speed',
      voltage: 'products.items.7.specs.voltage',
      motor_power: 'products.items.7.specs.motor_power',
      electric_heating: 'products.items.7.specs.electric_heating',
      dimension: 'products.items.7.specs.dimension',
      weight: 'products.items.7.specs.weight',
    },
  },
  {
    id: 8,
    name: 'products.items.8.name',
    category: 'products.items.8.category',
    price: 'products.items.8.price',
    image: '/2 Rollers 3300mm Flatwork Ironer (Steam heating).png',
    description: 'products.items.8.description',
    longDescription: 'products.items.8.long_description',
    features: ['products.items.8.features.0', 'products.items.8.features.1'],
    specs: {
      length_of_roller: 'products.items.8.specs.length_of_roller',
      number_of_roller: 'products.items.8.specs.number_of_roller',
      cylinder_diameter: 'products.items.8.specs.cylinder_diameter',
      material: 'products.items.8.specs.material',
      ironing_speed: 'products.items.8.specs.ironing_speed',
      voltage: 'products.items.8.specs.voltage',
      motor_power: 'products.items.8.specs.motor_power',
      steam_consumption: 'products.items.8.specs.steam_consumption',
      dimension: 'products.items.8.specs.dimension',
      weight: 'products.items.8.specs.weight',
    },
  },
  {
    id: 9,
    name: 'products.items.9.name',
    category: 'products.items.9.category',
    price: 'products.items.9.price',
    image: '/4 Lanes 3300mm Fast Speed Bedsheets Folder.png',
    description: 'products.items.9.description',
    longDescription: 'products.items.9.long_description',
    features: [
      'products.items.9.features.0',
      'products.items.9.features.1',
      'products.items.9.features.2',
      'products.items.9.features.3',
    ],
    specs: {
      folding_width: 'products.items.9.specs.folding_width',
      most_folding_levels: 'products.items.9.specs.most_folding_levels',
      inlet_pipe_diameter: 'products.items.9.specs.inlet_pipe_diameter',
      inlet_lowest_pressure: 'products.items.9.specs.inlet_lowest_pressure',
      air_consumption: 'products.items.9.specs.air_consumption',
      voltage: 'products.items.9.specs.voltage',
      motor_power: 'products.items.9.specs.motor_power',
      maximum_folding_speed: 'products.items.9.specs.maximum_folding_speed',
      dimension: 'products.items.9.specs.dimension',
      weight: 'products.items.9.specs.weight',
    },
  },
];

export const CONTACT_INFO = {
  email: 'Sales@rabzan.com',
  phone: '+8618427306347',
  address:
    'Office 601, Sanrong Building No 47.Luyuan Road Yuexiu District, Guangzhou, China',
  whatsapp: '8618427306347',
  socials: [
    { name: 'contact.socials.linkedin', url: '#', icon: 'linkedin' },
    { name: 'contact.socials.twitter', url: '#', icon: 'twitter' },
    { name: 'contact.socials.instagram', url: '#', icon: 'instagram' },
  ],
};
