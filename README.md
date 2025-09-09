# 🐾 Petut App - تطبيق العناية بالحيوانات الأليفة

تطبيق شامل للعناية بالحيوانات الأليفة يوفر خدمات متنوعة للمالكين والأطباء البيطريين.

## ✨ المميزات الرئيسية

### للمستخدمين العاديين
- 🛒 متجر المنتجات والإكسسوارات
- 🏥 حجز المواعيد مع الأطباء البيطريين
- 📱 نظام الإشعارات
- ❤️ قائمة المفضلات
- 🤖 تحديد سلالة الحيوان بالذكاء الاصطناعي
- 💬 نظام الدردشة والمجتمع
- 📍 خريطة العيادات القريبة

### للأطباء البيطريين
- 📅 إدارة المواعيد والجدول الزمني
- 👥 إدارة العملاء
- 🏥 إدارة معلومات العيادة
- 📊 تقارير وإحصائيات

### للإدارة
- 👨💼 إدارة المستخدمين والأطباء
- 🏪 إدارة المتجر والمنتجات
- 📈 لوحة تحكم شاملة
- 🎫 نظام الدعم الفني

## 🚀 التشغيل السريع

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

## 🔧 التكوين

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

## 🛡️ الأمان

تم إصلاح العديد من المشاكل الأمنية:
- ✅ إصلاح Code Injection
- ✅ إصلاح Hardcoded Credentials
- ✅ إضافة فحوصات التفويض
- ✅ إصلاح Log Injection
- ✅ تحديث المكتبات الآمنة

للمزيد من التفاصيل، راجع ملف [SECURITY_FIXES.md](./SECURITY_FIXES.md)

## 🔧 إصلاح الثغرات

لإصلاح الثغرات الأمنية تلقائياً:
```bash
./fix-vulnerabilities.bat
```

## 📱 التقنيات المستخدمة

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Maps**: Leaflet
- **UI Components**: Flowbite, React Bootstrap
- **AI**: TeachableMachine
- **Notifications**: OneSignal

## 📁 هيكل المشروع

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

## 🚀 النشر

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

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

للحصول على الدعم:
- 📧 البريد الإلكتروني: support@petut.com
- 💬 Discord: [رابط الخادم]
- 📱 WhatsApp: [رقم الهاتف]

## 🙏 شكر خاص

- فريق التطوير في ITI
- مجتمع React العربي
- جميع المساهمين في المشروع

---

**ملاحظة**: هذا المشروع تم تطويره كجزء من برنامج ITI للتدريب على تطوير التطبيقات متعددة المنصات.