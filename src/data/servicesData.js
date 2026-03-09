const servicesData = [
  {
    _id: '1',
    serviceName: 'Home Cleaning',
    slug: 'home-cleaning',
    description: 'Complete home cleaning service including dusting, vacuuming, mopping, and bathroom/kitchen cleaning. Our professional cleaners use eco-friendly products and advanced equipment to ensure your home is spotless and healthy.',
    shortDescription: 'Complete home cleaning service',
    category: 'residential',
    basePrice: 999,
    duration: 180,
    image: '/images/home cleaning.jpg',
    features: [
      'Dusting and wiping all surfaces',
      'Vacuuming and mopping floors',
      'Bathroom and kitchen deep clean',
      'Trash removal and recycling',
      'Eco-friendly cleaning products',
      'Professional equipment usage'
    ],
    isActive: true,
    isFeatured: true
  },
  {
    _id: '2',
    serviceName: 'Bathroom Cleaning',
    slug: 'bathroom-cleaning',
    description: 'Specialized bathroom cleaning including toilet, shower, sink, and tile scrubbing for a hygienic space. We eliminate mold, mildew, and hard water stains to restore your bathroom\'s shine.',
    shortDescription: 'Deep bathroom cleaning',
    category: 'residential',
    basePrice: 599,
    duration: 90,
    image: '/images/bathroom cleaning.webp',
    video: '/videos/bathroom-cleaning.mp4',
    features: [
      'Toilet deep cleaning and disinfection',
      'Shower and tub scrubbing',
      'Sink and faucet polishing',
      'Tile and grout cleaning',
      'Mirror and glass cleaning',
      'Mold and mildew removal'
    ],
    isActive: true,
    isFeatured: true
  },
  {
    _id: '3',
    serviceName: 'Flooring Cleaning',
    slug: 'flooring-cleaning',
    description: 'Professional flooring cleaning and maintenance for all types of floors including hardwood, tile, and laminate. We use specialized techniques to protect and enhance your flooring investment.',
    shortDescription: 'Floor cleaning and polishing',
    category: 'residential',
    basePrice: 799,
    duration: 120,
    image: '/images/new flat acid wash cleaning.jpg',
    features: [
      'Hardwood floor cleaning and polishing',
      'Tile and grout deep cleaning',
      'Laminate floor maintenance',
      'Stain removal and protection',
      'Buffing and waxing services',
      'Floor type assessment'
    ],
    isActive: true,
    isFeatured: true
  },
  {
    _id: '4',
    serviceName: 'Marble Polishing',
    slug: 'marble-polishing',
    description: 'Expert marble polishing and restoration service to restore shine and protect your marble surfaces. Our specialists use professional-grade equipment and techniques for lasting results.',
    shortDescription: 'Marble polishing and restoration',
    category: 'specialty',
    basePrice: 1299,
    duration: 180,
    image: '/images/marble polish.jpg',
    features: [
      'Marble surface polishing',
      'Scratch and stain removal',
      'Sealing and protection',
      'Restoration of natural shine',
      'Professional equipment usage',
      'Maintenance recommendations'
    ],
    isActive: true,
    isFeatured: true
  },
  {
    _id: '5',
    serviceName: 'Deep Cleaning',
    slug: 'deep-cleaning',
    description: 'Thorough deep cleaning service for homes that need intensive cleaning of hard-to-reach areas. Perfect for move-ins, move-outs, or seasonal deep cleans.',
    shortDescription: 'Intensive deep cleaning service',
    category: 'deep_cleaning',
    basePrice: 1499,
    duration: 300,
    image: '/images/carpet cleaning.jpg',
    features: [
      'Behind furniture and appliances',
      'Baseboards and moldings',
      'Light fixtures and ceiling fans',
      'Window sills and tracks',
      'Carpet deep cleaning',
      'Upholstery cleaning'
    ],
    isActive: true,
    isFeatured: false
  },
  {
    _id: '6',
    serviceName: 'Office/Commercial Cleaning',
    slug: 'office-cleaning',
    description: 'Professional commercial cleaning services for offices, shops, and business premises. Maintain a clean, professional environment for your employees and customers.',
    shortDescription: 'Commercial and office cleaning',
    category: 'commercial',
    basePrice: 1999,
    duration: 240,
    image: '/images/office cleaning.webp',
    features: [
      'Workspace and desk cleaning',
      'Common area maintenance',
      'Restroom sanitization',
      'Floor care and maintenance',
      'Trash removal services',
      'Flexible scheduling'
    ],
    isActive: true,
    isFeatured: false
  },
  {
    _id: '7',
    serviceName: 'Facade Cleaning',
    slug: 'facade-cleaning',
    description: 'Professional facade cleaning services to restore the exterior beauty of your building. Our expert team uses safe, effective methods to remove dirt, stains, and pollutants from exterior walls and surfaces.',
    shortDescription: 'Exterior building facade cleaning',
    category: 'specialty',
    basePrice: 1599,
    duration: 240,
    image: '/images/facade cleaning.webp',
    features: [
      'High-pressure washing',
      'Safe chemical treatments',
      'Stain and pollutant removal',
      'Protective sealing options',
      'Professional equipment usage',
      'Building exterior restoration'
    ],
    isActive: true,
    isFeatured: false
  },
  {
    _id: '8',
    serviceName: 'Carpet Cleaning',
    slug: 'carpet-cleaning',
    description: 'Deep carpet cleaning services using advanced equipment and eco-friendly solutions. We remove stains, odors, and allergens to restore your carpets to their original condition.',
    shortDescription: 'Professional carpet cleaning',
    category: 'specialty',
    basePrice: 899,
    duration: 120,
    image: '/images/carpet cleaning.jpg',
    features: [
      'Deep steam cleaning',
      'Stain removal treatment',
      'Odor elimination',
      'Allergen removal',
      'Eco-friendly products',
      'Quick drying process'
    ],
    isActive: true,
    isFeatured: false
  },
  {
    _id: '9',
    serviceName: 'Kitchen Cleaning',
    slug: 'kitchen-cleaning',
    description: 'Comprehensive kitchen cleaning including appliances, cabinets, countertops, and floors. We ensure your kitchen is hygienic, sparkling, and safe for food preparation.',
    shortDescription: 'Complete kitchen sanitization',
    category: 'residential',
    basePrice: 1199,
    duration: 150,
    image: '/images/kitchen cleaning.webp',
    features: [
      'Appliance deep cleaning',
      'Cabinet and countertop polishing',
      'Floor scrubbing and disinfection',
      'Grease and stain removal',
      'Oven and exhaust cleaning',
      'Food safety compliance'
    ],
    isActive: true,
    isFeatured: false
  },
  {
    _id: '10',
    serviceName: 'Terrace Cleaning',
    slug: 'terrace-cleaning',
    description: 'Thorough terrace and rooftop cleaning services to remove debris, stains, and maintain waterproofing. Essential for preventing water damage and maintaining structural integrity.',
    shortDescription: 'Rooftop and terrace maintenance',
    category: 'specialty',
    basePrice: 1399,
    duration: 180,
    image: '/images/terrace cleaning.jpg',
    features: [
      'Debris and leaf removal',
      'Waterproofing inspection',
      'Drain cleaning',
      'Stain treatment',
      'Safety railing cleaning',
      'Structural assessment'
    ],
    isActive: true,
    isFeatured: false
  },
  {
    _id: '11',
    serviceName: 'Balcony Cleaning',
    slug: 'balcony-cleaning',
    description: 'Detailed balcony cleaning including railings, floors, walls, and drainage systems. We ensure your balcony is safe, clean, and ready for outdoor enjoyment.',
    shortDescription: 'Balcony and outdoor space cleaning',
    category: 'residential',
    basePrice: 699,
    duration: 90,
    image: '/images/balcony cleaning.webp',
    features: [
      'Railing and grille cleaning',
      'Floor and wall scrubbing',
      'Drainage system clearing',
      'Rust removal and protection',
      'Weatherproofing check',
      'Safety inspection'
    ],
    isActive: true,
    isFeatured: false
  },
  {
    _id: '12',
    serviceName: 'Sofa Cleaning',
    slug: 'sofa-cleaning',
    description: 'Professional sofa and upholstery cleaning using specialized equipment and solutions. We remove deep-seated dirt, stains, and allergens for a fresh, hygienic seating area.',
    shortDescription: 'Upholstery and sofa deep cleaning',
    category: 'specialty',
    basePrice: 999,
    duration: 120,
    image: '/images/sofa cleaning.webp',
    features: [
      'Deep foam cleaning',
      'Stain removal treatment',
      'Allergen elimination',
      'Odor neutralization',
      'Fabric protection',
      'Color restoration'
    ],
    isActive: true,
    isFeatured: false
  },
  {
    _id: '13',
    serviceName: 'New Flat Cleaning',
    slug: 'new-flat-cleaning',
    description: 'Post-construction cleaning for new flats and apartments. We remove construction dust, debris, and residues to prepare your new home for move-in.',
    shortDescription: 'Post-construction cleaning',
    category: 'specialty',
    basePrice: 1799,
    duration: 300,
    image: '/images/new flat acid wash cleaning.jpg',
    features: [
      'Construction dust removal',
      'Residue and adhesive cleanup',
      'Window and glass cleaning',
      'Floor preparation',
      'Fixture polishing',
      'Air quality improvement'
    ],
    isActive: true,
    isFeatured: false
  },
  {
    _id: '14',
    serviceName: 'Acid Wash',
    slug: 'acid-wash',
    description: 'Specialized acid washing service for concrete and stone surfaces. Safely removes tough stains, efflorescence, and restores the natural appearance of your surfaces.',
    shortDescription: 'Concrete and stone acid washing',
    category: 'specialty',
    basePrice: 1999,
    duration: 240,
    image: '/images/new flat acid wash cleaning.jpg',
    features: [
      'Safe acid treatment',
      'Efflorescence removal',
      'Stain elimination',
      'Surface restoration',
      'Protective sealing',
      'Professional safety measures'
    ],
    isActive: true,
    isFeatured: false
  },
  {
    _id: '15',
    serviceName: 'Grout Cleaning & Filling',
    slug: 'grout-cleaning-filling',
    description: 'Professional grout cleaning and restoration services. We deep clean grout lines and refill damaged areas to restore your tile surfaces to their original beauty.',
    shortDescription: 'Tile grout cleaning and repair',
    category: 'specialty',
    basePrice: 1299,
    duration: 180,
    image: '/images/grouting filling.jpg',
    features: [
      'Deep grout cleaning',
      'Mold and mildew removal',
      'Grout color restoration',
      'Damaged grout repair',
      'Sealing and protection',
      'Tile surface polishing'
    ],
    isActive: true,
    isFeatured: false
  }
];

export default servicesData;