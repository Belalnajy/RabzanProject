import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

/**
 * Seed script — Run with: npx ts-node src/seeds/seed.ts
 * Creates: Permissions → Roles → Admin User → Workflow Stages → Currencies → Default Settings
 */

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'rabzan_user',
  password: 'Rabzan@2026!Secure',
  database: 'rabzan_db',
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('📦 Connected to database. Starting seed...\n');

  // ========== 1. PERMISSIONS (granular, matching frontend expectations) ==========
  const permRepo = AppDataSource.getRepository('Permission');
  const permissions = [
    { key: 'view_dashboard', name: 'عرض لوحة التحكم', nameEn: 'View Dashboard' },
    { key: 'view_orders', name: 'عرض الطلبات', nameEn: 'View Orders' },
    { key: 'manage_orders', name: 'إدارة الطلبات', nameEn: 'Manage Orders' },
    { key: 'view_products', name: 'عرض المنتجات', nameEn: 'View Products' },
    { key: 'manage_products', name: 'إدارة المنتجات', nameEn: 'Manage Products' },
    { key: 'view_categories', name: 'عرض التصنيفات', nameEn: 'View Categories' },
    { key: 'manage_categories', name: 'إدارة التصنيفات', nameEn: 'Manage Categories' },
    { key: 'view_customers', name: 'عرض العملاء', nameEn: 'View Customers' },
    { key: 'manage_customers', name: 'إدارة العملاء', nameEn: 'Manage Customers' },
    { key: 'view_finance', name: 'عرض المالية', nameEn: 'View Finance' },
    { key: 'manage_finance', name: 'إدارة المالية', nameEn: 'Manage Finance' },
    { key: 'view_reports', name: 'عرض التقارير', nameEn: 'View Reports' },
    { key: 'manage_users', name: 'إدارة المستخدمين', nameEn: 'Manage Users' },
    { key: 'manage_roles', name: 'إدارة الأدوار', nameEn: 'Manage Roles' },
    { key: 'manage_settings', name: 'إدارة الإعدادات', nameEn: 'Manage Settings' },
  ];

  const savedPerms = [];
  for (const perm of permissions) {
    const exists = await permRepo.findOneBy({ key: perm.key });
    if (!exists) {
      savedPerms.push(await permRepo.save(permRepo.create(perm)));
      console.log(`  ✅ Permission: ${perm.key}`);
    } else {
      await permRepo.update(exists.id, { name: perm.name, nameEn: perm.nameEn });
      savedPerms.push({ ...exists, ...perm });
      console.log(`  🔄 Permission updated: ${perm.key}`);
    }
  }

  // ========== 2. ROLES ==========
  const roleRepo = AppDataSource.getRepository('Role');
  const allKeys = permissions.map((p) => p.key);
  const rolesData = [
    {
      name: 'مسؤول',
      nameEn: 'Super Admin',
      description: 'صلاحيات كاملة على النظام',
      permKeys: allKeys,
    },
    {
      name: 'عمليات',
      nameEn: 'Operations',
      description: 'إدارة الطلبات والمنتجات والعملاء',
      permKeys: [
        'view_dashboard',
        'view_orders', 'manage_orders',
        'view_products',
        'view_categories',
        'view_customers', 'manage_customers',
        'view_reports',
      ],
    },
    {
      name: 'محاسب',
      nameEn: 'Accountant',
      description: 'إدارة الشؤون المالية والتقارير',
      permKeys: [
        'view_dashboard',
        'view_finance', 'manage_finance',
        'view_customers',
        'view_reports',
      ],
    },
  ];

  const savedRoles: Record<string, any> = {};
  for (const roleData of rolesData) {
    const rolePerms = savedPerms.filter((p) => roleData.permKeys.includes(p.key));
    let role = await roleRepo.findOne({ where: { name: roleData.name }, relations: ['permissions'] });
    if (!role) {
      role = await roleRepo.save(
        roleRepo.create({
          name: roleData.name,
          nameEn: roleData.nameEn,
          description: roleData.description,
          permissions: rolePerms,
        }),
      );
      console.log(`  ✅ Role: ${roleData.name} (${roleData.nameEn})`);
    } else {
      role.description = roleData.description;
      role.nameEn = roleData.nameEn;
      role.permissions = rolePerms;
      role = await roleRepo.save(role);
      console.log(`  🔄 Role updated: ${roleData.name} (${rolePerms.length} perms)`);
    }
    savedRoles[roleData.nameEn] = role;
  }

  // Clean up obsolete permission keys (after roles re-mapped to new ones)
  const validKeys = permissions.map((p) => p.key);
  const deleteResult = await permRepo
    .createQueryBuilder()
    .delete()
    .where('key NOT IN (:...keys)', { keys: validKeys })
    .execute();
  if (deleteResult.affected) {
    console.log(`  🗑️  Removed ${deleteResult.affected} obsolete permission(s)`);
  }

  // ========== 3. ADMIN USER ==========
  const userRepo = AppDataSource.getRepository('User');
  const adminExists = await userRepo.findOneBy({ email: 'admin@rabzan.com' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin@2026', 12);
    await userRepo.save(
      userRepo.create({
        fullName: 'مدير النظام',
        email: 'admin@rabzan.com',
        username: 'admin',
        password: hashedPassword,
        phone: '0501234567',
        status: 'active',
        role: savedRoles['Super Admin'],
      }),
    );
    console.log(`  ✅ Admin user: admin@rabzan.com / Admin@2026`);
  } else {
    console.log(`  ⏭️  Admin user exists`);
  }

  // ========== 4. WORKFLOW STAGES ==========
  const stageRepo = AppDataSource.getRepository('WorkflowStage');

  // Remove old stages that no longer match the workflow
  await stageRepo.createQueryBuilder()
    .delete()
    .where('title NOT IN (:...titles)', {
      titles: ['عرض السعر', 'التعميد', 'وصول الحوالة', 'التصنيع', 'تشييك', 'شحن', 'سابر', 'وصول الشحنة', 'استلام العمولة', 'إغلاق'],
    })
    .execute();

  const stages = [
    { title: 'عرض السعر', sortOrder: 1, isMandatory: true, needsConfirmation: false },
    { title: 'التعميد', sortOrder: 2, isMandatory: true, needsConfirmation: true },
    { title: 'وصول الحوالة', sortOrder: 3, isMandatory: true, needsConfirmation: true },
    { title: 'التصنيع', sortOrder: 4, isMandatory: true, needsConfirmation: false },
    { title: 'تشييك', sortOrder: 5, isMandatory: true, needsConfirmation: true },
    { title: 'شحن', sortOrder: 6, isMandatory: true, needsConfirmation: false },
    { title: 'سابر', sortOrder: 7, isMandatory: true, needsConfirmation: true },
    { title: 'وصول الشحنة', sortOrder: 8, isMandatory: true, needsConfirmation: false },
    { title: 'استلام العمولة', sortOrder: 9, isMandatory: true, needsConfirmation: true },
    { title: 'إغلاق', sortOrder: 10, isMandatory: true, needsConfirmation: false },
  ];

  for (const stage of stages) {
    const exists = await stageRepo.findOneBy({ title: stage.title });
    if (!exists) {
      await stageRepo.save(stageRepo.create(stage));
      console.log(`  ✅ Stage: ${stage.title}`);
    } else {
      // Update sortOrder in case it changed
      await stageRepo.update(exists.id, { sortOrder: stage.sortOrder, needsConfirmation: stage.needsConfirmation });
      console.log(`  🔄 Stage updated: ${stage.title}`);
    }
  }

  // ========== 5. CURRENCIES ==========
  const currRepo = AppDataSource.getRepository('Currency');
  const currencies = [
    { code: 'EGP', name: 'جنيه مصري', exchangeRate: 1.0, isDefault: true },
    { code: 'USD', name: 'دولار أمريكي', exchangeRate: 0.02, isDefault: false },
    { code: 'SAR', name: 'ريال سعودي', exchangeRate: 0.076, isDefault: false },
    { code: 'AED', name: 'درهم إماراتي', exchangeRate: 0.074, isDefault: false },
    { code: 'EUR', name: 'يورو', exchangeRate: 0.018, isDefault: false },
  ];

  for (const curr of currencies) {
    const exists = await currRepo.findOneBy({ code: curr.code });
    if (!exists) {
      await currRepo.save(currRepo.create(curr));
      console.log(`  ✅ Currency: ${curr.code} - ${curr.name}`);
    } else {
      console.log(`  ⏭️  Currency exists: ${curr.code}`);
    }
  }

// ========== 6. CUSTOMERS ==========
  const customerRepo = AppDataSource.getRepository('Customer');
  const customersData = [
    { displayId: 'CLI-00123', name: 'أحمد محمد علي', phone: '+20 100 123 4567', country: 'Egypt', status: 'active' },
    { displayId: 'CLI-00124', name: 'فاطمة أحمد', phone: '+971 50 234 5678', country: 'UAE', status: 'active' },
    { displayId: 'CLI-00125', name: 'خالد سعيد', phone: '+966 55 345 6789', country: 'Saudi Arabia', status: 'active' },
  ];

  const savedCustomers: Record<string, any> = {};
  for (const cust of customersData) {
    let customer = await customerRepo.findOneBy({ displayId: cust.displayId });
    if (!customer) {
      customer = await customerRepo.save(customerRepo.create(cust));
      console.log(`  ✅ Customer: ${cust.name}`);
    } else {
      console.log(`  ⏭️  Customer exists: ${cust.name}`);
    }
    savedCustomers[cust.displayId] = customer;
  }

  // ========== 7. CATEGORIES ==========
  const categoryRepo = AppDataSource.getRepository('Category');
  const categoriesData = [
    { nameAr: 'معدات مغاسل مركزية', nameEn: 'Central Laundry Equipment' },
    { nameAr: 'معدات معالجة أغذية', nameEn: 'Food Processing Equipment' },
    { nameAr: 'معدات تجهيز طباعة', nameEn: 'Print Finishing Equipment' },
    { nameAr: 'طباعة واسعة النطاق', nameEn: 'Wide Format Printing' },
  ];

  const savedCategories: Record<string, any> = {};
  for (const cat of categoriesData) {
    let category = await categoryRepo.findOneBy({ nameAr: cat.nameAr });
    if (!category) {
      category = await categoryRepo.save(categoryRepo.create(cat));
      console.log(`  ✅ Category: ${cat.nameAr}`);
    } else {
      console.log(`  ⏭️  Category exists: ${cat.nameAr}`);
    }
    savedCategories[cat.nameAr] = category;
  }

  // ========== 8. PRODUCTS (matching frontend ar.json exactly) ==========
  const productRepo = AppDataSource.getRepository('Product');
  const productsData = [
    // معدات مغاسل مركزية (Central Laundry Equipment) — items 1-9
    { displayId: 'PROD-00001', name: '25KG Fully Auto Washer Extractor (High Spin)', nameAr: 'غسالة أوتوماتيكية بالكامل 25 كجم (عصر عالي)', model: 'SWE25S', defaultPrice: 4830.00, commissionRate: 5.0, status: 'active', image: '/25KG Fully Auto Washer Extractor (High Spin).png', categoryId: savedCategories['معدات مغاسل مركزية'].id, longDescription: 'غسالة أوتوماتيكية بالكامل سعة 25 كجم بسرعة عصر عالية، مصممة للاستخدام في المغاسل التجارية والفندقية. تتميز بهيكل من الفولاذ المقاوم للصدأ وبرامج غسيل متعددة.', features: ['قطع كهربائية من شنايدر الفرنسية (France Schneider electric parts)', 'لوحة تحكم كمبيوتر Punp (China top brand Punp computer controller)', 'رولمان بلي FZB (China Top brand FZB bearings)', 'حوض داخلي وخارجي ستانلس ستيل 304'], specs: { 'Weight': '25KG', 'Dimensions': '1100*1150*1280mm', 'Motor': '3KW', 'Voltage': '380V, 60HZ, 3 Phases' } },
    { displayId: 'PROD-00002', name: '50KG Fully Auto Washer Extractor (High Spin)', nameAr: 'غسالة أوتوماتيكية بالكامل 50 كجم (عصر عالي)', model: 'XGQ-50', defaultPrice: 8740.00, commissionRate: 5.0, status: 'active', image: '/50KG Fully Auto Washer Extractor (High Spin).png', categoryId: savedCategories['معدات مغاسل مركزية'].id, longDescription: 'غسالة أوتوماتيكية بالكامل سعة 50 كجم للمهام الشاقة، مثالية للمغاسل المركزية والمستشفيات.', features: ['قطع كهربائية من شنايدر الفرنسية', 'لوحة تحكم كمبيوتر Punp', 'رولمان بلي FZB', 'حوض داخلي وخارجي ستانلس ستيل 304'], specs: { 'Weight': '50KG', 'Dimensions': '1350*1400*1550mm', 'Motor': '5.5KW', 'Voltage': '380V, 60HZ, 3 Phases' } },
    { displayId: 'PROD-00003', name: '100KG Fully Auto Washer Extractor (High Spin)', nameAr: 'غسالة أوتوماتيكية بالكامل 100 كجم (عصر عالي)', model: 'XGQ-100', defaultPrice: 11040.00, commissionRate: 5.0, status: 'active', image: '/100KG Fully Auto Washer Extractor (High Spin).png', categoryId: savedCategories['معدات مغاسل مركزية'].id, longDescription: 'غسالة أوتوماتيكية بالكامل سعة 100 كجم صناعية، مصممة للمغاسل المركزية الكبيرة.', features: ['قطع كهربائية من شنايدر الفرنسية', 'لوحة تحكم كمبيوتر Punp', 'رولمان بلي FZB'], specs: { 'Weight': '100KG', 'Dimensions': '1600*1700*1850mm', 'Motor': '7.5KW', 'Voltage': '380V, 60HZ, 3 Phases' } },
    { displayId: 'PROD-00004', name: '25KG Fully Auto Tumble Dryer', nameAr: 'نشافة ملابس أوتوماتيكية 25 كجم', model: 'STD-25', defaultPrice: 2760.00, commissionRate: 5.0, status: 'active', image: '/25KG Fully Auto Tumble Dryer.png', categoryId: savedCategories['معدات مغاسل مركزية'].id, longDescription: 'نشافة ملابس أوتوماتيكية بالكامل سعة 25 كجم، مناسبة للمغاسل التجارية الصغيرة والمتوسطة.', features: ['قطع كهربائية من شنايدر الفرنسية', 'لوحة تحكم كمبيوتر Punp', 'رولمان بلي FZB'], specs: { 'Weight': '350KG', 'Dimensions': '1200*1250*1850mm', 'Motor': '1.1KW', 'Voltage': '380V, 60HZ, 3 Phases', 'Country of Origin': 'الصين' } },
    { displayId: 'PROD-00005', name: '50KG Fully Auto Tumble Dryer', nameAr: 'نشافة ملابس أوتوماتيكية 50 كجم', model: 'HG-50', defaultPrice: 4025.00, commissionRate: 5.0, status: 'active', image: '/50KG Fully Auto Tumble Dryer.png', categoryId: savedCategories['معدات مغاسل مركزية'].id, longDescription: 'نشافة ملابس على نطاق صناعي بسعة 50 كجم، مثالية للمغاسل التجارية ذات الحجم الكبير.', features: ['قطع كهربائية من شنايدر الفرنسية', 'لوحة تحكم كمبيوتر Punp', 'رولمان بلي FZB'], specs: { 'Weight': '600KG', 'Dimensions': '1400*1550*2100mm', 'Motor': '1.5KW', 'Voltage': '380V, 60HZ, 3 Phases' } },
    { displayId: 'PROD-00006', name: '100KG Fully Auto Tumble Dryer', nameAr: 'نشافة ملابس أوتوماتيكية 100 كجم', model: 'HG-100', defaultPrice: 4830.00, commissionRate: 5.0, status: 'active', image: '/100KG Fully Auto Tumble Dryer.png', categoryId: savedCategories['معدات مغاسل مركزية'].id, longDescription: 'نشافة ملابس على نطاق صناعي بسعة 100 كجم، مثالية للمغاسل التجارية ذات الحجم الكبير وقطاع الضيافة.', features: ['قطع كهربائية من شنايدر الفرنسية', 'لوحة تحكم كمبيوتر Punp', 'رولمان بلي FZB'], specs: { 'Weight': '1100KG', 'Dimensions': '1620*1950*2550mm', 'Motor': '2.2KW', 'Voltage': '380V, 60HZ, 3 Phases', 'Country of Origin': 'الصين' } },
    { displayId: 'PROD-00007', name: '1 Roller 3300mm Flatwork Ironer (Electric)', nameAr: 'كاوية مسطحة 1 أسطوانة 3300 مم (تسخين كهربائي)', model: 'YPI-3300', defaultPrice: 5980.00, commissionRate: 5.0, status: 'active', image: '/1 Roller 3300mm Flatwork Ironer (Electric heated).png', categoryId: savedCategories['معدات مغاسل مركزية'].id, longDescription: 'كاوية مسطحة أسطوانة واحدة بطول 3300 مم بتسخين كهربائي، توفر كياً عالي الجودة للشراشف والمفارش في المغاسل والفنادق.', features: ['أسطوانة عالية الجودة من الفولاذ', 'تسخين كهربائي فعال', 'نظام تحكم دقيق في الحرارة', 'سرعة كي قابلة للتعديل'], specs: { 'Weight': '850KG', 'Dimensions': '4100*1200*1400mm', 'Motor': '1.5KW', 'Voltage': '380V, 60HZ, 3 Phases' } },
    { displayId: 'PROD-00008', name: '2 Rollers 3300mm Flatwork Ironer (Steam)', nameAr: 'كاوية مسطحة 2 أسطوانة 3300 مم (تسخين بالبخار)', model: 'YPII-3300', defaultPrice: 11270.00, commissionRate: 5.0, status: 'active', image: '/2 Rollers 3300mm Flatwork Ironer (Steam heating).png', categoryId: savedCategories['معدات مغاسل مركزية'].id, longDescription: 'كاوية مسطحة أسطوانتين بطول 3300 مم تعمل بالبخار، مثالية للمهام الشاقة وتوفر سرعة كي مضاعفة.', features: ['أسطوانتان للكي السريع', 'تسخين بالبخار لتقليل التكلفة', 'نظام تحكم متطور', 'هيكل قوي من الفولاذ المقاوم للصدأ'], specs: { 'Weight': '1500KG', 'Dimensions': '4100*1800*1400mm', 'Motor': '2.2KW', 'Voltage': '380V, 60HZ, 3 Phases' } },
    { displayId: 'PROD-00009', name: '4 Lanes 3300mm Fast Speed Bedsheets Folder', nameAr: 'ماكينة طي الشراشف 4 مسارات 3300 مم سرعة عالية', model: 'ZD-3300-4', defaultPrice: 15180.00, commissionRate: 5.0, status: 'active', image: '/4 Lanes 3300mm Fast Speed Bedsheets Folder.png', categoryId: savedCategories['معدات مغاسل مركزية'].id, longDescription: 'ماكينة طي شراشف احترافية ذات 4 مسارات بسرعة عالية، تتكامل بسلاسة مع الكاويات المسطحة لأتمتة عملية الكي والطي بالكامل.', features: ['4 مسارات لطي متعدد القطع', 'سرعة عالية قابلة للتوافق مع الكاوية', 'شاشة لمس للتحكم', 'دقة طي عالية بفضل مستشعرات ضوئية'], specs: { 'Weight': '1200KG', 'Dimensions': '4200*2800*1750mm', 'Motor': '1.5KW', 'Voltage': '380V, 60HZ, 3 Phases' } },

    // معدات معالجة أغذية (Food Processing Equipment) — items 10-14
    { displayId: 'PROD-00010', name: 'Meat Slicer (RBZ-DR350)', nameAr: 'ماكينة تقطيع اللحم (موديل: RBZ-DR350)', model: 'RBZ-DR350', defaultPrice: 7754.00, commissionRate: 8.0, status: 'active', image: '/Disposable Meat Slicer (RBZ-DR350).png', categoryId: savedCategories['معدات معالجة أغذية'].id, longDescription: 'ماكينة تقطيع اللحوم الطازجة والمجمدة بدقة عالية، مناسبة لمصانع اللحوم والمطابخ المركزية.', features: ['شفرات حادة من الفولاذ المقاوم للصدأ', 'سماكة تقطيع قابلة للتعديل', 'آمنة وسهلة التنظيف', 'محرك قوي للتشغيل المستمر'], specs: { 'Weight': '150KG', 'Dimensions': '800*700*900mm', 'Motor': '1.5KW', 'Voltage': '220V/380V' } },
    { displayId: 'PROD-00011', name: 'Hair Stick Peeling Machine (RBZ-MG1800)', nameAr: 'ماكينة تقشير Hair Stick (موديل: RBZ-MG1800)', model: 'RBZ-MG1800', defaultPrice: 4425.00, commissionRate: 8.0, status: 'active', image: '/Hair Stick Peeling Machine (Model: RBZ -MG1800).png', categoryId: savedCategories['معدات معالجة أغذية'].id, longDescription: 'ماكينة متطورة لتقشير الخضروات والجذور بكفاءة عالية، مما يوفر الوقت والجهد في عمليات التحضير الغذائي.', features: ['أسطوانات تقشير قوية', 'توفير استهلاك المياه', 'هيكل كامل من الستانلس ستيل', 'معدل تقشير عالي بأقل هدر'], specs: { 'Weight': '280KG', 'Dimensions': '2100*850*1050mm', 'Motor': '2.2KW', 'Voltage': '380V, 50HZ' } },
    { displayId: 'PROD-00012', name: 'Meat Pie Machine (RBZ-MB100)', nameAr: 'ماكينة فطائر/أقراص اللحم (موديل: RBZ-MB100)', model: 'RBZ-MB100', defaultPrice: 4440.00, commissionRate: 8.0, status: 'active', image: '/Meat Pie Machine (Model: RBZ -MB100).png', categoryId: savedCategories['معدات معالجة أغذية'].id, longDescription: 'ماكينة أوتوماتيكية لتشكيل أقراص البرجر وفطائر اللحم بأحجام وأوزان متساوية.', features: ['قوالب تشكيل متعددة المقاسات', 'تشغيل أوتوماتيكي سريع', 'مكونات تلامس الطعام من مواد آمنة', 'سهولة الفك والتنظيف'], specs: { 'Weight': '100KG', 'Dimensions': '850*600*1400mm', 'Motor': '0.55KW', 'Voltage': '220V/380V' } },
    { displayId: 'PROD-00013', name: 'Bubble Ozone Cleaning Machine (RBZ-QX2200)', nameAr: 'ماكينة غسيل فقاعات وأوزون (موديل: RBZ-QX2200)', model: 'RBZ-QX2200', defaultPrice: 3199.00, commissionRate: 8.0, status: 'active', image: '/Bubble Ozone Cleaning Machine (Model: RBZ -QX2200).png', categoryId: savedCategories['معدات معالجة أغذية'].id, longDescription: 'نظام غسيل متطور يعتمد على تقنية الفقاعات والأوزون لتنظيف وتعقيم الفواكه والخضروات بفعالية وتخليصها من المبيدات.', features: ['تعقيم بالأوزون', 'نظام غسيل فقاعي لطيف على المنتجات', 'مضخة مياه قوية', 'فلتر لتنقية المياه وإعادة تدويرها'], specs: { 'Weight': '200KG', 'Dimensions': '2200*900*1300mm', 'Motor': '3.0KW', 'Voltage': '380V, 50HZ' } },
    { displayId: 'PROD-00014', name: 'Frozen Meat Cutting Machine (RBZ-SR120S)', nameAr: 'ماكينة تقطيع اللحم المجمد (موديل: RBZ-SR120S)', model: 'RBZ-SR120S', defaultPrice: 4033.00, commissionRate: 8.0, status: 'active', image: '/Frozen Meat Cutting Machine (Model: RBZ -SR120S).png', categoryId: savedCategories['معدات معالجة أغذية'].id, longDescription: 'ماكينة تقطيع اللحوم المجمدة إلى مكعبات أو شرائح دون الحاجة لإذابة الثلج، مصممة للمصانع والمجازر.', features: ['تقطيع اللحم المجمد حتى -18 درجة', 'شفرات ألمانية الصنع', 'نظام هيدروليكي للضغط', 'هيكل متين للاستخدام الشاق'], specs: { 'Weight': '400KG', 'Dimensions': '1350*800*1100mm', 'Motor': '3.5KW', 'Voltage': '380V, 50HZ' } },

    // معدات تجهيز طباعة (Print Finishing Equipment) — items 15, 17
    { displayId: 'PROD-00015', name: 'Cold Laminator (RBZ 1700-B5)', nameAr: 'ماكينة ترقيق باردة (موديل: RBZ 1700-B5)', model: 'RBZ 1700-B5', defaultPrice: 1426.00, commissionRate: 10.0, status: 'active', image: '/Cold Laminator (Model: RBZ 1700-B5).png', categoryId: savedCategories['معدات تجهيز طباعة'].id, longDescription: 'ماكينة ترقيق (تغليف) باردة مقاس 1.7 متر، مصممة لحماية المطبوعات من الخدوش والأشعة فوق البنفسجية وإطالة عمرها.', features: ['أسطوانات سيليكون عالية الجودة', 'نظام تحكم في الضغط والهواء', 'تشغيل هادئ ومستقر', 'مناسبة لمختلف أنواع المطبوعات'], specs: { 'Weight': '200KG', 'Dimensions': '2150*650*1200mm', 'Width': '1700mm', 'Voltage': '110V/220V' } },
    { displayId: 'PROD-00017', name: 'Roll Laminator (1.7m) – RBZ-1700S', nameAr: 'ماكينة ترقيق رول (1.7 م) – موديل: RBZ-1700S', model: 'RBZ-1700S', defaultPrice: 1628.00, commissionRate: 10.0, status: 'active', image: '/Roll Laminator (1.7m) – Model: RBZ -1700S.png', categoryId: savedCategories['معدات تجهيز طباعة'].id, longDescription: 'ماكينة ترقيق حرارية وباردة احترافية مقاس 1.7 متر، توفر نتائج تغليف ممتازة لشركات الدعاية والإعلان.', features: ['تسخين سريع لأسطوانات التغليف', 'شاشة عرض رقمية', 'التحكم في سرعة التغليف', 'دواسة قدم للتشغيل السهل'], specs: { 'Weight': '230KG', 'Dimensions': '2200*700*1250mm', 'Width': '1700mm', 'Voltage': '220V' } },

    // طباعة واسعة النطاق (Wide Format Printing) — items 16, 18
    { displayId: 'PROD-00016', name: 'Eco Solvent Printer (RBZ-1800)', nameAr: 'طابعة إيكو سولفنت (موديل: RBZ-1800)', model: 'RBZ-1800', defaultPrice: 12077.00, commissionRate: 10.0, status: 'active', image: '/Eco Solvent Printer MODEL : RBZ-1800.png', categoryId: savedCategories['طباعة واسعة النطاق'].id, longDescription: 'طابعة إيكو سولفنت مقاس 1.8 متر بجودة طباعة فائقة الدقة، مثالية للملصقات، اللوحات الإعلانية، وتغليف السيارات.', features: ['رؤوس طباعة إبسون الأصلية (Epson Printheads)', 'نظام تسخين وتجفيف متكامل', 'محركات سيرفو عالية الدقة', 'نظام إمداد حبر مستمر'], specs: { 'Weight': '280KG', 'Dimensions': '2800*900*1300mm', 'Width': '1800mm', 'Voltage': '220V' } },
    { displayId: 'PROD-00018', name: 'Cutting Plotter (1.6m) – RBZ-GH1660', nameAr: 'ماكينة قص فينيل (1.6 م) – موديل: RBZ-GH1660', model: 'RBZ-GH1660', defaultPrice: 964.00, commissionRate: 10.0, status: 'active', image: '/Cutting Plotter (1.6m) – Model: RBZ -GH1660.png', categoryId: savedCategories['طباعة واسعة النطاق'].id, longDescription: 'ماكينة قص فينيل بلوتر عرض 1.6 متر مع نظام كاميرا CCD لقص الحواف بدقة عالية، مناسبة لمطابع الاستيكرات.', features: ['نظام كاميرا CCD لقراءة العلامات', 'قوة ضغط عالية لقص المواد السميكة', 'محركات متدرجة دقيقة', 'دعم برامج التصميم المتعددة (CorelDraw, Illustrator)'], specs: { 'Weight': '65KG', 'Dimensions': '1950*350*450mm', 'Width': '1600mm', 'Voltage': '110V/220V' } },
  ];

  for (const prod of productsData) {
    const exists = await productRepo.findOneBy({ displayId: prod.displayId });
    if (!exists) {
      await productRepo.save(productRepo.create(prod));
      console.log(`  ✅ Product: ${prod.name}`);
    } else {
      await productRepo.update(exists.id, {
        name: prod.name,
        nameAr: prod.nameAr,
        model: prod.model,
        defaultPrice: prod.defaultPrice,
        commissionRate: prod.commissionRate,
        categoryId: prod.categoryId,
        image: prod.image,
        ...(prod.longDescription && { longDescription: prod.longDescription }),
        ...(prod.features && { features: prod.features }),
        ...(prod.specs && { specs: prod.specs }),
      });
      console.log(`  🔄 Product updated: ${prod.name} → $${prod.defaultPrice}`);
    }
  }

  // ========== 9. DEFAULT SETTINGS ==========
  const settingRepo = AppDataSource.getRepository('Setting');
  const settings = [
    { key: 'system_name', value: 'نظام إدارة العمولات', group: 'general' },
    { key: 'company_name', value: 'شركة رابزان التجارية', group: 'general' },
    { key: 'default_language', value: 'ar', group: 'general' },
    { key: 'timezone', value: 'Africa/Cairo', group: 'general' },
    { key: 'date_format', value: 'DD/MM/YYYY', group: 'general' },
    { key: 'default_commission', value: '10', group: 'financial' },
    { key: 'allow_commission_override', value: 'true', group: 'financial' },
    { key: 'credit_limit_enabled', value: 'false', group: 'financial' },
    { key: 'payment_terms', value: '30', group: 'financial' },
    { key: 'delay_alert_days', value: '30', group: 'financial' },
    { key: 'dark_mode', value: 'false', group: 'preferences' },
    { key: 'auto_logout_minutes', value: '30', group: 'preferences' },
    { key: 'audit_log_enabled', value: 'true', group: 'preferences' },
  ];

  for (const setting of settings) {
    const exists = await settingRepo.findOneBy({ key: setting.key });
    if (!exists) {
      await settingRepo.save(settingRepo.create(setting));
      console.log(`  ✅ Setting: ${setting.key}`);
    } else {
      console.log(`  ⏭️  Setting exists: ${setting.key}`);
    }
  }

  console.log('\n🎉 Seed completed successfully!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
