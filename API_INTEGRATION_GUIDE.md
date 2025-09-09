# دليل ربط API الخاص بك

## الخطوات السريعة

### 1. إعداد رابط API
أنشئ ملف `.env` في المجلد الرئيسي:
```
REACT_APP_API_URL=https://your-api-domain.com/api
```

### 2. هيكل API المطلوب
يجب أن يكون API الخاص بك يدعم:

```
GET /products - جلب جميع المنتجات
GET /products/:id - جلب منتج واحد
GET /products/search?q=query - البحث في المنتجات
GET /products/category/:category - المنتجات حسب الفئة
```

### 3. شكل البيانات المتوقع
```json
{
  "products": [
    {
      "id": "1",
      "productName": "اسم المنتج",
      "category": "food",
      "brand": "العلامة التجارية",
      "price": 100,
      "rating": 4.5,
      "description": "وصف المنتج",
      "imageUrl": "رابط الصورة",
      "inStock": true
    }
  ]
}
```

### 4. إضافة Authentication (اختياري)
إذا كان API يحتاج مصادقة، أضف في `apiService.js`:
```javascript
const token = localStorage.getItem('authToken');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

## الاستخدام الحالي

### بدون API (البيانات التجريبية)
التطبيق يستخدم حالياً بيانات تجريبية من `src/data/mockProducts.js`

### مع API الخاص بك
1. أضف رابط API في `.env`
2. تأكد من أن API يعيد البيانات بالشكل المطلوب
3. أعد تشغيل التطبيق

## اختبار API

استخدم مكون `FirebaseTest` (تم تغيير اسمه لـ `ApiTest`) لاختبار الاتصال:
- يظهر في صفحة الكتالوج
- يعرض حالة الاتصال والأخطاء
- يمكن إعادة المحاولة

## مثال على API بسيط (Node.js/Express)

```javascript
app.get('/api/products', (req, res) => {
  res.json({
    products: [
      {
        id: "1",
        productName: "منتج تجريبي",
        category: "food",
        brand: "علامة تجارية",
        price: 100,
        rating: 4.5,
        description: "وصف المنتج",
        imageUrl: "https://example.com/image.jpg",
        inStock: true
      }
    ]
  });
});
```

## نصائح مهمة

1. **CORS**: تأكد من إعداد CORS في API الخاص بك
2. **HTTPS**: استخدم HTTPS في الإنتاج
3. **Rate Limiting**: أضف حدود للطلبات
4. **Error Handling**: تأكد من إرجاع أخطاء واضحة
5. **Caching**: استخدم caching لتحسين الأداء