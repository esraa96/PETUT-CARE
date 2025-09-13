# نظام التقييمات الديناميكي - دليل الاستخدام

## نظرة عامة
تم تطوير نظام تقييمات ديناميكي متكامل يعمل مع Firebase لإدارة تقييمات الأطباء بعد انتهاء المواعيد.

## مكونات النظام

### 1. قاعدة البيانات (Firebase Collections)

#### `reviews` Collection
```javascript
{
  doctorId: "doctor_uid",
  clientId: "client_uid", 
  appointmentId: "appointment_id",
  rating: 5, // 1-5 stars
  comment: "تعليق العميل",
  patientName: "اسم المريض",
  createdAt: timestamp,
  approved: true
}
```

#### `notifications` Collection  
```javascript
{
  type: "review_request",
  clientId: "client_uid",
  doctorId: "doctor_uid", 
  appointmentId: "appointment_id",
  scheduledFor: timestamp, // وقت الإرسال المجدول
  sent: false,
  title: "قيم موعدك الأخير",
  message: "كيف كانت تجربتك؟"
}
```

#### `userNotifications` Collection
```javascript
{
  userId: "client_uid",
  type: "review_request", 
  title: "قيم موعدك الأخير",
  message: "يرجى تقييم موعدك مع الدكتور...",
  doctorId: "doctor_uid",
  read: false,
  createdAt: timestamp
}
```

### 2. الخدمات (Services)

#### `reviewNotificationService.js`
- `scheduleReviewNotification()` - جدولة إشعار التقييم
- `sendReviewNotification()` - إرسال الإشعار للعميل  
- `submitReview()` - إرسال التقييم

### 3. المكونات (Components)

#### `RateDoctorModal.jsx`
مودال تقييم الطبيب مع:
- نجوم التقييم (1-5)
- حقل التعليق
- إرسال التقييم لـ Firebase

#### `NotificationBell.jsx` 
جرس الإشعارات مع:
- عرض عدد الإشعارات غير المقروءة
- قائمة منسدلة بالإشعارات
- فتح مودال التقييم عند النقر

#### `DoctorReviewsModal.jsx`
مودال عرض تقييمات الطبيب مع:
- جلب التقييمات من Firebase
- عرض النجوم والتعليقات
- تصميم Tailwind CSS

### 4. الصفحات المحدثة

#### `Reviews.jsx` (Admin Dashboard)
- جلب الأطباء وتقييماتهم من Firebase
- حساب متوسط التقييمات
- عرض عدد التقييمات لكل طبيب
- فلترة وبحث ديناميكي

## كيفية الاستخدام

### 1. عند انتهاء الموعد
```javascript
import { completeAppointment } from '../utils/appointmentHelpers';

// عند انتهاء الموعد
await completeAppointment(appointmentId, appointmentData);
```

### 2. إضافة جرس الإشعارات للتطبيق
```jsx
import NotificationBell from '../components/NotificationBell';

// في الـ Header أو Navbar
<NotificationBell currentUser={currentUser} />
```

### 3. استخدام Hook للإشعارات
```jsx
import { useAppointmentReviews } from '../hooks/useAppointmentReviews';

// في المكون الرئيسي
useAppointmentReviews(currentUser);
```

### 4. معالجة الإشعارات المجدولة
```javascript
import { processPendingReviewNotifications } from '../utils/appointmentHelpers';

// يمكن تشغيلها كل ساعة أو حسب الحاجة
setInterval(processPendingReviewNotifications, 60 * 60 * 1000); // كل ساعة
```

## التدفق الكامل للنظام

1. **حجز الموعد**: العميل يحجز موعد مع الطبيب
2. **انتهاء الموعد**: الطبيب يحدد الموعد كـ "مكتمل"
3. **جدولة الإشعار**: النظام يجدول إشعار تقييم بعد ساعتين
4. **إرسال الإشعار**: بعد ساعتين، يتم إرسال إشعار للعميل
5. **تقييم الطبيب**: العميل يفتح الإشعار ويقيم الطبيب
6. **حفظ التقييم**: التقييم يُحفظ في Firebase
7. **عرض في الداشبورد**: الأدمن يرى التقييمات في صفحة Reviews

## الميزات المتقدمة

### فلترة التقييمات
- حسب أعلى تقييم
- حسب أقل تقييم  
- بحث بالاسم

### إحصائيات ديناميكية
- عدد التقييمات لكل طبيب
- متوسط التقييم
- عرض النجوم

### إدارة الإشعارات
- تتبع الإشعارات المرسلة
- منع الإشعارات المكررة
- إشعارات في الوقت الفعلي

## ملاحظات مهمة

1. **الأمان**: تأكد من إعداد قواعد Firestore Security Rules
2. **الفهرسة**: أضف فهارس مناسبة في Firebase Console
3. **الإشعارات**: يمكن دمج OneSignal للإشعارات الخارجية
4. **الجدولة**: للإنتاج، استخدم Cloud Functions للجدولة التلقائية

## قواعد Firestore المقترحة

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == resource.data.clientId;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.clientId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // User notifications
    match /userNotifications/{notificationId} {
      allow read, update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```