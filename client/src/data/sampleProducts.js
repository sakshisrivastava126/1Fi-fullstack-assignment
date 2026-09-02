// Temporary data for building the UI only.
// This is replaced by the backend API (GET /api/products) in a later step.

const sampleProducts = [
  {
    slug: 'iphone-17-pro',
    name: 'iPhone 17 Pro',
    description:
      "Apple's flagship with the A19 Pro chip, a titanium frame and a 48MP Pro camera system.",
    variant: '256GB Silver',
    mrp: 134900,
    price: 127400,
    image: '/images/iphone-17-pro.svg',
  },
  {
    slug: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Titanium build, a 200MP camera and a built-in S Pen, powered by Snapdragon 8 Gen 3.',
    variant: '256GB Titanium Black',
    mrp: 129999,
    price: 114999,
    image: '/images/samsung-galaxy-s24-ultra.svg',
  },
  {
    slug: 'oneplus-13',
    name: 'OnePlus 13',
    description:
      'Snapdragon 8 Elite, a 6000mAh battery and 100W fast charging in an aluminium frame.',
    variant: '256GB Midnight Ocean',
    mrp: 69999,
    price: 64999,
    image: '/images/oneplus-13.svg',
  },
]

export default sampleProducts
