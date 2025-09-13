# <i class="fas fa-paw"></i> Petut App - تطبيق العناية بالحيوانات الأليفة

تطبيق شامل للعناية بالحيوانات الأليفة يوفر خدمات متنوعة للمالكين والأطباء البيطريين.

## <i class="fas fa-star"></i> المميزات الرئيسية

### للمستخدمين العاديين
- <i class="fas fa-shopping-cart"></i> متجر المنتجات والإكسسوارات
- <i class="fas fa-hospital"></i> حجز المواعيد مع الأطباء البيطريين
- <i class="fas fa-bell"></i> نظام الإشعارات
- <i class="fas fa-heart"></i> قائمة المفضلات
- <i class="fas fa-robot"></i> تحديد سلالة الحيوان بالذكاء الاصطناعي
- <i class="fas fa-comments"></i> نظام الدردشة والمجتمع
- <i class="fas fa-map-marker-alt"></i> خريطة العيادات القريبة

### للأطباء البيطريين
- <i class="fas fa-calendar-alt"></i> إدارة المواعيد والجدول الزمني
- <i class="fas fa-users"></i> إدارة العملاء
- <i class="fas fa-clinic-medical"></i> إدارة معلومات العيادة
- <i class="fas fa-chart-bar"></i> تقارير وإحصائيات

### للإدارة
- <i class="fas fa-user-tie"></i> إدارة المستخدمين والأطباء
- <i class="fas fa-store"></i> إدارة المتجر والمنتجات
- <i class="fas fa-chart-line"></i> لوحة تحكم شاملة
- <i class="fas fa-ticket-alt"></i> نظام الدعم الفني

## <i class="fas fa-rocket"></i> التشغيل السريع

### المتطلبات
- Node.js (الإصدار 16 أو أحدث)
- npm أو yarn

### التثبيت والتشغيل

1. **استنساخ المشروع**
```bash
git clone [repository-url]
cd Petut-App-main
```

2. **تثبيت المكتبات**
```bash
npm install
```

3. **تكوين متغيرات البيئة**
```bash
cp .env.example .env
# قم بتعديل ملف .env وإضافة المفاتيح الصحيحة
```

4. **تشغيل المشروع**
```bash
npm run dev
# أو استخدم الملف المساعد
./start-project.bat
```

## <i class="fas fa-cog"></i> التكوين

### متغيرات البيئة المطلوبة
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Image Upload Service
VITE_IMGBB_API_KEY=your_imgbb_key
```

## <i class="fas fa-shield-alt"></i> الأمان

تم إصلاح العديد من المشاكل الأمنية:
- <i class="fas fa-check-circle"></i> إصلاح Code Injection
- <i class="fas fa-check-circle"></i> إصلاح Hardcoded Credentials
- <i class="fas fa-check-circle"></i> إضافة فحوصات التفويض
- <i class="fas fa-check-circle"></i> إصلاح Log Injection
- <i class="fas fa-check-circle"></i> تحديث المكتبات الآمنة

للمزيد من التفاصيل، راجع ملف [SECURITY_FIXES.md](./SECURITY_FIXES.md)

## <i class="fas fa-tools"></i> إصلاح الثغرات

لإصلاح الثغرات الأمنية تلقائياً:
```bash
./fix-vulnerabilities.bat
```

## <i class="fas fa-mobile-alt"></i> التقنيات المستخدمة

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Maps**: Leaflet
- **UI Components**: Flowbite, React Bootstrap
- **AI**: TeachableMachine
- **Notifications**: OneSignal

## <i class="fas fa-folder-open"></i> هيكل المشروع

```
src/
├── components/          # المكونات القابلة لإعادة الاستخدام
├── pages/              # صفحات التطبيق
├── store/              # إدارة الحالة (Redux)
├── context/            # React Context
├── hooks/              # Custom Hooks
├── services/           # خدمات API
├── utils/              # دوال مساعدة
├── assets/             # الصور والأيقونات
└── styles/             # ملفات التنسيق
```

## <i class="fas fa-cloud-upload-alt"></i> النشر

### Vercel (موصى به)
```bash
npm run build
vercel --prod
```

### Firebase Hosting
```bash
npm run build
firebase deploy
```

## <i class="fas fa-handshake"></i> المساهمة

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## <i class="fas fa-file-contract"></i> الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## <i class="fas fa-phone"></i> الدعم

للحصول على الدعم:
- <i class="fas fa-envelope"></i> البريد الإلكتروني: support@petut.com
- <i class="fab fa-discord"></i> Discord: [رابط الخادم]
- <i class="fab fa-whatsapp"></i> WhatsApp: [رقم الهاتف]

## <i class="fas fa-heart"></i> شكر خاص

- فريق التطوير في ITI
- مجتمع React العربي
- جميع المساهمين في المشروع

---

**ملاحظة**: هذا المشروع تم تطويره كجزء من برنامج ITI للتدريب على تطوير التطبيقات متعددة المنصات.