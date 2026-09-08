const businessPhone = "918382801930"; // Set to Prince Mishra's number for testing

const products = [
  {
    id: "p1",
    name: "Statuario Venato",
    collection: "Marble Elegance",
    category: "Floor Tiles",
    material: "Marble Look",
    finish: "Glossy",
    size: "800x1600mm",
    color: "White",
    colorHex: "#F5F5F5",
    rooms: ["Living Room", "Bedroom", "Commercial"],
    image: "images/tile_marble.jpg",
    benefits: [
      "Premium imported marble look",
      "High gloss finish reflects light and makes rooms look larger",
      "Stain and scratch resistant surface",
      "Seamless large format minimizes grout lines"
    ]
  },
  {
    id: "p2",
    name: "Oakwood Warm",
    collection: "Nature's Touch",
    category: "Floor Tiles",
    material: "Wooden Look",
    finish: "Matt",
    size: "200x1200mm",
    color: "Brown",
    colorHex: "#8B5A2B",
    rooms: ["Bedroom", "Living Room", "Balcony"],
    image: "images/tile_wood.jpg",
    benefits: [
      "Natural timber texture and warmth",
      "100% waterproof unlike real wood",
      "Anti-termite and fire resistant",
      "Perfect for creating cozy bedroom atmospheres"
    ]
  },
  {
    id: "p3",
    name: "Slate Grey Raw",
    collection: "Urban Concrete",
    category: "Floor Tiles",
    material: "Stone Look",
    finish: "Matt",
    size: "600x1200mm",
    color: "Grey",
    colorHex: "#808080",
    rooms: ["Bathroom", "Kitchen", "Outdoor"],
    image: "images/tile_stone.jpg",
    benefits: [
      "Natural stone texture with slight undulation",
      "Anti-skid property ideal for wet areas",
      "Industrial, modern aesthetic",
      "Extremely durable for heavy foot traffic"
    ]
  },
  {
    id: "p4",
    name: "Pure Snow White",
    collection: "Minimalist Core",
    category: "Wall Tiles",
    material: "Ceramic",
    finish: "Glossy",
    size: "300x600mm",
    color: "White",
    colorHex: "#FFFFFF",
    rooms: ["Bathroom", "Kitchen"],
    image: "images/tile_glossy.jpg",
    benefits: [
      "Ultra-high gloss mirror-like finish",
      "Easy to clean kitchen grease and bathroom soap",
      "Timeless pure white brightens any small space",
      "Precision rectified edges for seamless joining"
    ]
  },
  {
    id: "p5",
    name: "Charcoal Depth",
    collection: "Midnight Series",
    category: "Floor Tiles",
    material: "Stone Look",
    finish: "Matt",
    size: "600x1200mm",
    color: "Black",
    colorHex: "#2F4F4F",
    rooms: ["Living Room", "Bathroom", "Commercial"],
    image: "images/tile_dark.jpg",
    benefits: [
      "Deep charcoal tone adds sophisticated drama",
      "Subtle concrete texture",
      "Hides dirt effectively",
      "Pairs beautifully with warm lighting and brass fixtures"
    ]
  },
  {
    id: "p6",
    name: "Calacatta Gold",
    collection: "Marble Elegance",
    category: "Floor Tiles",
    material: "Marble Look",
    finish: "Glossy",
    size: "800x1600mm",
    color: "White",
    colorHex: "#FDF5E6",
    rooms: ["Living Room", "Commercial"],
    image: "images/hero.jpg",
    benefits: [
      "Classic white base with luxurious gold veining",
      "Creates an incredibly premium, expensive look",
      "Large format for grand spaces",
      "Highly polished surface"
    ]
  }
];

// Extracted filter options
const filterOptions = {
  category: [...new Set(products.map(p => p.category))],
  room: [...new Set(products.flatMap(p => p.rooms))],
  finish: [...new Set(products.map(p => p.finish))],
  color: [...new Set(products.map(p => ({ name: p.color, hex: p.colorHex })))].filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i)
};
