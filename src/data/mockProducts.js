// بيانات تجريبية للمنتجات
export const mockProducts = [
  {
    id: "1",
    productName: "طعام كلاب بريميوم",
    category: "food",
    brand: "Royal Canin",
    price: 150,
    rating: 4.5,
    description: "طعام عالي الجودة للكلاب البالغة مع جميع العناصر الغذائية المطلوبة",
    imageUrl: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400",
    inStock: true,
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    productName: "لعبة قطط تفاعلية",
    category: "toys",
    brand: "PetSafe",
    price: 75,
    rating: 4.2,
    description: "لعبة تفاعلية لتسلية القطط وتحفيز نشاطها الذهني",
    imageUrl: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400",
    inStock: true,
    createdAt: "2024-01-02T00:00:00Z"
  },
  {
    id: "3",
    productName: "شامبو للحيوانات الأليفة",
    category: "grooming",
    brand: "FURminator",
    price: 45,
    rating: 4.0,
    description: "شامبو لطيف ومناسب لجميع أنواع الحيوانات الأليفة",
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
    inStock: true,
    createdAt: "2024-01-03T00:00:00Z"
  },
  {
    id: "4",
    productName: "سرير مريح للكلاب",
    category: "accessories",
    brand: "Comfort Pet",
    price: 120,
    rating: 4.7,
    description: "سرير مريح وناعم للكلاب من جميع الأحجام",
    imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
    inStock: true,
    createdAt: "2024-01-04T00:00:00Z"
  },
  {
    id: "5",
    productName: "طعام قطط صحي",
    category: "food",
    brand: "Whiskas",
    price: 85,
    rating: 4.3,
    description: "طعام متوازن وصحي للقطط مع نكهات متنوعة",
    imageUrl: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=400",
    inStock: true,
    createdAt: "2024-01-05T00:00:00Z"
  }
];

// دالة محاكاة API
export const mockApiService = {
  getProducts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 1000); // محاكاة تأخير الشبكة
    });
  },

  getProduct: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p.id === id);
        if (product) {
          resolve(product);
        } else {
          reject(new Error('Product not found'));
        }
      }, 500);
    });
  },

  searchProducts: (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Sanitize input to prevent code injection
        const sanitizedQuery = String(query).replace(/[<>"'&]/g, '');
        const results = mockProducts.filter(product =>
          product.productName.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(sanitizedQuery.toLowerCase())
        );
        resolve(results);
      }, 800);
    });
  }
};