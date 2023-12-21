# PWA-VoiceNotes
# تطبيق ويب تقدمي يقوم بتسجيل الملاحظات الصوتية ويعمل بدون إنترنت ويزامن البيانات مع الخادم عند عودة الإنترنت

# الخطوات:
* أولًا: مطلوب تثبيت node js, npm, npx من الرابط https://nodejs.org/en/download واختيار الحزمة المناسبة لنظام التشغيل
* ثانيًا: تنزيل وتثبيت MongoDB من الرابط https://www.mongodb.com/try/download/community
*  اختياريًا: تنزيل MongoDB Compass من الرابط https://www.mongodb.com/try/download/compass ويستخدم لمعاينة قواعد البيانات
* تنزيل الملفات وحفظها داخل مجلد وليكن اسمه VoiceApp
* فتح المجلد باستخدام المحرر VSCode
* فتح Terminal جديدة وتنفيذ الأمر npm install --force
* قد يظهر بعض التحذيرات نتيجة الاختلاف في بعض الإصدارات، تجاهلها
* تنفيذ الأمر npm install -g serve
* الانتقال إلى مجلد الخادم عن طريق cd src/server
* تشغيل الخادم عن طريق node server.mjs
* فتح Terminal جديدة وتنفيذ الأمر npm run build
* تشغيل التطبيق عن طريق serve -s build


