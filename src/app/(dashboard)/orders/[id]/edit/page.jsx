'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApi, useMutation } from '@/hooks/useApi';
import { customersService } from '@/lib/services/customers.service';
import { productsService } from '@/lib/services/products.service';
import { ordersService } from '@/lib/services/orders.service';
import { ChevronDown, Plus, Upload, X, Info } from 'lucide-react';
import Link from 'next/link';

export default function EditOrderPage() {
  const router = useRouter();
  const { id } = useParams();

  // Data Fetching
  const orderQuery = useApi(() => ordersService.getById(id), [id]);
  const customersQuery = useApi(() => customersService.list({ limit: 100 }), []);
  const productsQuery = useApi(() => productsService.list({ limit: 100 }), []);

  const updateOrderMut = useMutation((data) => ordersService.update(id, data));
  const uploadMut = useMutation((data) => ordersService.uploadAttachment(id, data.file));

  // Form State
  const [form, setForm] = useState({
    customerId: '',
    productId: '',
    unitPrice: '',
    orderType: 'استيراد',
    quantity: '1',
    currency: 'EGP',
    priority: 'عالية',
    commissionRate: '',
    notes: '',
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [formLoaded, setFormLoaded] = useState(false);

  // Populate form from existing order
  useEffect(() => {
    if (orderQuery.data && !formLoaded) {
      const o = orderQuery.data;
      const priorityMap = { urgent: 'عالية', high: 'عالية', medium: 'متوسطة', low: 'منخفضة' };
      const orderTypeMatch = o.notes?.match(/نوع الطلب:\s*(\S+)/);

      setForm({
        customerId: o.customerId || '',
        productId: o.productId || '',
        unitPrice: String(o.unitPrice || ''),
        orderType: orderTypeMatch?.[1] || 'استيراد',
        quantity: String(o.quantity || '1'),
        currency: o.currency || 'EGP',
        priority: priorityMap[o.priority] || 'متوسطة',
        commissionRate: String(o.commissionRate ?? ''),
        notes: (o.notes || '').replace(/نوع الطلب:\s*\S+\s*\|?\s*/, '').trim(),
      });
      setFormLoaded(true);
    }
  }, [orderQuery.data, formLoaded]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  // Calculations for Summary
  const qty = Number(form.quantity) || 0;
  const price = Number(form.unitPrice) || 0;
  const total = qty * price;
  const selectedProduct = productsQuery.data?.data?.find(p => p.id === form.productId);
  const commissionRate = Number(form.commissionRate) || 0;
  const commission = (total * commissionRate) / 100;

  const selectedCustomer = customersQuery.data?.data?.find(c => c.id === form.customerId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.customerId) {
      setError('يرجى اختيار العميل');
      return;
    }
    if (!form.quantity || Number(form.quantity) < 1) {
      setError('يرجى إدخال كمية صحيحة (1 على الأقل)');
      return;
    }
    if (!form.unitPrice || Number(form.unitPrice) <= 0) {
      setError('يرجى إدخال سعر الوحدة');
      return;
    }

    try {
      const priorityMap = { 'عالية': 'high', 'متوسطة': 'medium', 'منخفضة': 'low' };
      await updateOrderMut.mutate({
        customerId: form.customerId,
        productId: form.productId || undefined,
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
        currency: form.currency,
        commissionRate: Number(form.commissionRate) || 0,
        priority: priorityMap[form.priority] || 'medium',
        notes: [
          form.orderType ? `نوع الطلب: ${form.orderType}` : '',
          form.notes || '',
        ].filter(Boolean).join(' | ') || undefined,
      });

      // Upload files if any
      if (files.length > 0) {
        for (const file of files) {
          try {
            await uploadMut.mutate({ file });
          } catch (err) {
            console.warn('فشل رفع أحد الملفات:', err);
          }
        }
      }
      router.push(`/orders/${id}`);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحديث الطلب');
    }
  };

  if (orderQuery.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#B08B3A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-gray-500">جاري تحميل بيانات الطلب...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">تعديل الطلب #{orderQuery.data?.displayId}</h1>
          <p className="text-sm text-gray-500 font-medium">قم بتحديث تفاصيل الطلب</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-[12px] font-bold text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main Form Area */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            
            {/* Section 1: العميل والمنتج */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-200">
              <div className="p-6 pb-2">
                <h2 className="text-[16px] font-black text-[#B08B3A]">العميل والمنتج</h2>
              </div>
              <div className="p-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    اختر العميل <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="customerId"
                      value={form.customerId}
                      onChange={handleChange}
                      className="field-input appearance-none"
                      required
                    >
                      <option value="" disabled>ابحث عن العميل...</option>
                      {customersQuery.data?.data?.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">اختر المنتج</label>
                  <div className="relative">
                    <select
                      name="productId"
                      value={form.productId}
                      onChange={handleChange}
                      className="field-input appearance-none"
                    >
                      <option value="">- اختر منتج -</option>
                      {productsQuery.data?.data?.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">نوع الطلب</label>
                  <div className="relative">
                    <select
                      name="orderType"
                      value={form.orderType}
                      onChange={handleChange}
                      className="field-input appearance-none"
                    >
                      <option value="استيراد">استيراد</option>
                      <option value="تصدير">تصدير</option>
                      <option value="محلي">محلي</option>
                    </select>
                    <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    سعر الوحدة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={form.unitPrice}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="0.00"
                    dir="ltr"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: التسعير */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-200">
              <div className="p-6 pb-2">
                <h2 className="text-[16px] font-black text-[#B08B3A]">التسعير</h2>
              </div>
              <div className="p-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">الكمية <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="0"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">العملة</label>
                  <div className="relative">
                    <select
                      name="currency"
                      value={form.currency}
                      onChange={handleChange}
                      className="field-input appearance-none"
                    >
                      <option value="EGP">جنيه مصري (EGP)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                      <option value="SAR">ريال سعودي (SAR)</option>
                      <option value="CNY">يوان صيني (CNY)</option>
                    </select>
                    <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">نسبة العمولة (%)</label>
                  <input
                    type="number"
                    name="commissionRate"
                    value={form.commissionRate}
                    onChange={handleChange}
                    className="field-input"
                    placeholder="0"
                    dir="ltr"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  {selectedProduct?.commissionRate != null && (
                    <p className="mt-1.5 text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
                      <Info size={12} />
                      نسبة العمولة الافتراضية للمنتج: {selectedProduct.commissionRate}%
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">الأولوية</label>
                  <div className="relative">
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="field-input appearance-none"
                    >
                      <option value="عالية">عالية</option>
                      <option value="متوسطة">متوسطة</option>
                      <option value="منخفضة">منخفضة</option>
                    </select>
                    <ChevronDown size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: ملاحظات */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-200">
              <div className="p-6 pb-2">
                <h2 className="text-[16px] font-black text-[#B08B3A]">ملاحظات</h2>
              </div>
              <div className="p-6 pt-4">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="field-input min-h-[100px] resize-none"
                  placeholder="أي ملاحظات إضافية على الطلب..."
                />
              </div>
            </div>

            {/* Section 4: المرفقات */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-200">
              <div className="p-6 pb-2">
                <h2 className="text-[16px] font-black text-[#B08B3A]">رفع مرفقات جديدة</h2>
              </div>
              <div className="p-6 pt-4">
                <label className="border-2 border-dashed border-[#B08B3A]/30 rounded-[16px] p-8 flex flex-col items-center justify-center bg-[#B08B3A]/5 cursor-pointer hover:bg-[#B08B3A]/10 transition-colors">
                  <Upload className="text-[#B08B3A] mb-4" size={32} />
                  <span className="text-sm font-bold text-[#B08B3A] mb-1">اسحب الملفات هنا أو اضغط للاختيار</span>
                  <span className="text-xs text-gray-500 font-medium">(PDF, DOC, DOCX, XLS, XLSX, JPG, PNG حتى 10MB)</span>
                  <input type="file" multiple className="hidden" onChange={handleFileChange} />
                </label>
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-[12px] border border-gray-100">
                        <span className="text-sm font-bold text-gray-700">{file.name}</span>
                        <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={updateOrderMut.loading}
                className="flex-[2] bg-[#B08B3A] text-white py-4 rounded-[12px] font-bold hover:bg-[#9a7933] transition-colors shadow-sm disabled:opacity-50"
              >
                {updateOrderMut.loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
              <Link href={`/orders/${id}`} className="flex-1 bg-white border border-[#B08B3A] text-[#B08B3A] py-4 rounded-[12px] font-bold hover:bg-amber-50 transition-colors flex items-center justify-center text-center">
                إلغاء
              </Link>
            </div>
          </form>

          {/* Sticky Summary Sidebar */}
          <div className="w-full lg:w-[320px] bg-white rounded-[24px] shadow-sm border border-gray-200 sticky top-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-[16px] font-black text-[#B08B3A]">ملخص الطلب</h2>
            </div>
            <div className="p-6 space-y-5 text-sm">
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="font-bold text-gray-400">العميل:</span>
                <span className="font-black text-gray-900">{selectedCustomer?.name || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="font-bold text-gray-400">المنتج:</span>
                <span className="font-black text-gray-900">{selectedProduct?.name || 'غير محدد'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="font-bold text-gray-400">الكمية × سعر الوحدة:</span>
                <span className="font-black text-gray-900" dir="ltr">{qty} × {price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="font-bold text-gray-400">العملة:</span>
                <span className="font-black text-gray-900">{form.currency}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="font-bold text-gray-400">الأولوية:</span>
                <span className={`px-2 py-1 rounded-[6px] text-[10px] font-bold ${
                  form.priority === 'عالية' ? 'bg-red-50 text-red-600' : 
                  form.priority === 'متوسطة' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                }`}>
                  {form.priority}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="font-bold text-gray-400">نسبة العمولة:</span>
                <span className="font-black text-gray-900" dir="ltr">{commissionRate}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="font-bold text-gray-400">المرحلة الحالية:</span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-200">
                  {orderQuery.data?.currentStage || '—'}
                </span>
              </div>

              <div className="pt-2 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-400">إجمالي البضاعة:</span>
                  <span className="font-black text-gray-900" dir="ltr">{total.toLocaleString()} {form.currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-400">العمولة ({commissionRate}%):</span>
                  <span className="font-black text-green-600" dir="ltr">{commission.toLocaleString()} {form.currency}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                  <span className="font-bold text-gray-400">صافي المورّد:</span>
                  <span className="font-black text-gray-900" dir="ltr">{(total - commission).toLocaleString()} {form.currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-400">المدفوع:</span>
                  <span className="font-black text-blue-600" dir="ltr">{Number(orderQuery.data?.totalPaid || 0).toLocaleString()} {form.currency}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="font-black text-gray-900">المتبقي على العميل:</span>
                  <span className="font-black text-[#B08B3A]" dir="ltr">{Math.max(0, total - Number(orderQuery.data?.totalPaid || 0)).toLocaleString()} {form.currency}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
