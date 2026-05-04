'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowDownRight,
  Box,
  DollarSign,
  Percent,
  AlertTriangle,
  ArrowLeft,
  Archive,
  UserCheck,
  Settings,
  FileText,
  Clock,
  ShieldCheck,
  Wallet,
  Truck,
  Search,
  Package,
  Coins,
  CheckCircle,
  XCircle,
  ClipboardCheck,
} from 'lucide-react';
import Header from '@/components/dashboard/Header';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/DataStates';
import { useApi } from '@/hooks/useApi';
import { dashboardService } from '@/lib/services/dashboard.service';

/* ═══════════════════════════════════════════
   Interactive Dual-Layer Sparkline
   — hover tooltips, guide line, animated dots
   ═══════════════════════════════════════════ */
const DualSparkline = ({
  current = [],
  previous = [],
  currentDates = [],
  previousDates = [],
  primaryColor = '#8ECFC0',
  secondaryColor = '#C9A0DC',
  valuePrefix = '',
  valueSuffix = '',
}) => {
  const W = 200;
  const H = 60;
  const PAD = 6;

  const [hoverIdx, setHoverIdx] = React.useState(null);
  const svgRef = React.useRef(null);

  // Merge both series to get shared max for proper scaling
  const allVals = [...current, ...previous];
  const maxVal = Math.max(...allVals, 1);

  // Convert a data array to SVG points
  const toPoints = (data) => {
    if (!data || data.length < 2) return [];
    const step = (W - PAD * 2) / (data.length - 1);
    return data.map((v, i) => ({
      x: PAD + i * step,
      y: H - PAD - ((v / maxVal) * (H - PAD * 2 - 4)),
    }));
  };

  // Cubic bezier smooth path
  const smoothPath = (pts) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1];
      const c = pts[i];
      const cpx = ((p.x + c.x) / 2).toFixed(1);
      d += ` C ${cpx} ${p.y.toFixed(1)}, ${cpx} ${c.y.toFixed(1)}, ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
    }
    return d;
  };

  // Area = line path + close to bottom
  const areaPath = (pts) => {
    const line = smoothPath(pts);
    if (!line) return '';
    const last = pts[pts.length - 1];
    const first = pts[0];
    return `${line} L ${last.x.toFixed(1)} ${H} L ${first.x.toFixed(1)} ${H} Z`;
  };

  const primaryPts = toPoints(current);
  const secondaryPts = toPoints(previous);

  // Generate unique IDs per instance
  const uid = React.useId().replace(/:/g, '');

  // Mouse handler — find closest data point index
  const handleMouseMove = React.useCallback(
    (e) => {
      if (!svgRef.current || primaryPts.length < 2) return;
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * W;
      let closestIdx = 0;
      let closestDist = Infinity;
      for (let i = 0; i < primaryPts.length; i++) {
        const dist = Math.abs(primaryPts[i].x - mouseX);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      }
      setHoverIdx(closestIdx);
    },
    [primaryPts],
  );

  const handleMouseLeave = React.useCallback(() => setHoverIdx(null), []);

  // Format date for tooltip
  const fmtDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
  };

  const fmtValue = (v) => {
    if (v == null) return '—';
    const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v);
    return `${valuePrefix}${formatted}${valueSuffix}`;
  };

  return (
    <div
      className="mt-3 w-full h-[60px] relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: primaryPts.length >= 2 ? 'crosshair' : 'default' }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`gp-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} stopOpacity={0.45} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id={`gs-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={secondaryColor} stopOpacity={0.4} />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Hover guide line */}
        {hoverIdx !== null && primaryPts[hoverIdx] && (
          <line
            x1={primaryPts[hoverIdx].x}
            y1={0}
            x2={primaryPts[hoverIdx].x}
            y2={H}
            stroke="#94A3B8"
            strokeWidth="0.8"
            strokeDasharray="3 2"
            style={{ transition: 'x1 0.15s, x2 0.15s' }}
          />
        )}

        {/* Secondary (previous period) — rendered first so it appears behind */}
        {secondaryPts.length >= 2 && (
          <>
            <path d={areaPath(secondaryPts)} fill={`url(#gs-${uid})`} />
            <path
              d={smoothPath(secondaryPts)}
              fill="none"
              stroke={secondaryColor}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {secondaryPts.map((pt, i) => (
              <circle
                key={`s-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={hoverIdx === i ? '4' : '2.5'}
                fill="white"
                stroke={secondaryColor}
                strokeWidth="1.5"
                style={{ transition: 'r 0.2s ease' }}
              />
            ))}
          </>
        )}

        {/* Primary (current period) — on top */}
        {primaryPts.length >= 2 && (
          <>
            <path d={areaPath(primaryPts)} fill={`url(#gp-${uid})`} />
            <path
              d={smoothPath(primaryPts)}
              fill="none"
              stroke={primaryColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {primaryPts.map((pt, i) => (
              <circle
                key={`p-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={hoverIdx === i ? '5' : '3'}
                fill={hoverIdx === i ? primaryColor : 'white'}
                stroke={primaryColor}
                strokeWidth="2"
                style={{ transition: 'r 0.2s ease, fill 0.2s ease' }}
              />
            ))}
          </>
        )}

        {/* Fallback: if no data at all, show a flat dashed line */}
        {primaryPts.length < 2 && secondaryPts.length < 2 && (
          <line
            x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2}
            stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="4 4"
          />
        )}
      </svg>

      {/* Tooltip — positioned above the hovered point */}
      {hoverIdx !== null && primaryPts[hoverIdx] && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: `${(primaryPts[hoverIdx].x / W) * 100}%`,
            top: '-8px',
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-[#1E293B] text-white rounded-xl px-3 py-2 text-center shadow-lg whitespace-nowrap"
               style={{ fontSize: '10px', lineHeight: '1.6' }}>
            <div className="flex items-center gap-2 justify-center mb-0.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span className="font-bold">{fmtValue(current[hoverIdx])}</span>
            </div>
            {previous.length > 0 && (
              <div className="flex items-center gap-2 justify-center mb-0.5">
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
                <span className="font-semibold opacity-80">{fmtValue(previous[hoverIdx])}</span>
              </div>
            )}
            <div className="text-[9px] opacity-70 mt-0.5 border-t border-white/20 pt-1">
              {currentDates[hoverIdx] ? fmtDate(currentDates[hoverIdx]) : ''}
            </div>
          </div>
          <div className="w-0 h-0 mx-auto"
               style={{
                 borderLeft: '5px solid transparent',
                 borderRight: '5px solid transparent',
                 borderTop: '5px solid #1E293B',
               }}
          />
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Stat Card (top row: 4 cards)
   ═══════════════════════════════════════════ */
const StatCard = ({
  title, value, icon: Icon, iconColor, iconBg,
  trend, trendUp, trendText,
  sparklineCurrent, sparklinePrevious,
  sparklineCurrentDates, sparklinePreviousDates,
  primaryColor, secondaryColor,
  valuePrefix, valueSuffix,
}) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-visible relative hover:z-20">
    <div className="flex justify-between items-start mb-2">
      <div className="flex flex-col text-right">
        <h3 className="text-[#040814] font-bold text-[13px] mb-5">{title}</h3>
        <p className="text-[28px] font-black text-[#040814]">{value}</p>
      </div>
      <div className="flex flex-col items-end">
        <div
          className="w-11 h-11 rounded-[14px] flex items-center justify-center opacity-90 mb-6"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon size={20} />
        </div>
        {trendText ? (
          <div className={`flex items-center gap-1.5 text-[11px] font-bold ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span className="whitespace-nowrap">{trendText}</span>
          </div>
        ) : trend !== undefined && trend !== null ? (
          <div className={`flex items-center gap-1.5 text-[11px] font-bold ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span className="whitespace-nowrap" dir="ltr">{Math.abs(trend)}%</span>
            <span className="whitespace-nowrap">من الشهر الماضي</span>
          </div>
        ) : null}
      </div>
    </div>
    <DualSparkline
      current={sparklineCurrent}
      previous={sparklinePrevious}
      currentDates={sparklineCurrentDates}
      previousDates={sparklinePreviousDates}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      valuePrefix={valuePrefix}
      valueSuffix={valueSuffix}
    />
  </div>
);

/* ═══════════════════════════════════════════
   Pipeline Card (stage summary row)
   ═══════════════════════════════════════════ */
const PipelineCard = ({ title, value, percentage, icon: Icon, color, bg }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: bg, color: color }}>
      <Icon size={18} />
    </div>
    <h3 className="text-[#040814] font-bold text-[13px] mb-2 whitespace-nowrap">{title}</h3>
    <p className="text-2xl font-black text-[#040814] mb-1">{value}</p>
    <span className="text-gray-500 text-[11px] font-bold">{percentage}%</span>
  </div>
);

/* ─── Stage visuals map ─── */
const STAGE_VISUALS = {
  'عرض السعر':      { icon: FileText,       bg: '#3B82F6' },
  'التعميد':         { icon: ShieldCheck,    bg: '#10B981' },
  'وصول الحوالة':    { icon: Wallet,         bg: '#8B5CF6' },
  'التصنيع':         { icon: Settings,       bg: '#F59E0B' },
  'تشييك':          { icon: ClipboardCheck, bg: '#06B6D4' },
  'شحن':            { icon: Truck,          bg: '#D97706' },
  'سابر':           { icon: Search,         bg: '#EC4899' },
  'وصول الشحنة':    { icon: Package,        bg: '#059669' },
  'استلام العمولة':  { icon: Coins,          bg: '#7C3AED' },
  'إغلاق':          { icon: CheckCircle,    bg: '#64748B' },
  'الطلبات النشطة':  { icon: FileText,       bg: '#3B82F6' },
  'الموافقة':        { icon: CheckCircle,    bg: '#10B981' },
  'الشحن':           { icon: Truck,          bg: '#D97706' },
  'الوصول':          { icon: Package,        bg: '#059669' },
  'إنشاء الطلب':     { icon: FileText,       bg: '#94A3B8' },
  'تأخير الشحن':     { icon: AlertTriangle,  bg: '#EF4444' },
  'مغلق':            { icon: XCircle,        bg: '#EF4444' },
  'استلام الطلب':     { icon: FileText,       bg: '#94A3B8' },
};

/* ─── Stage dot color for recent orders ─── */
const STAGE_DOT_COLOR = {
  'عرض السعر': '#3B82F6',
  'التعميد': '#10B981',
  'وصول الحوالة': '#8B5CF6',
  'التصنيع': '#F59E0B',
  'تشييك': '#06B6D4',
  'شحن': '#D97706',
  'سابر': '#EC4899',
  'وصول الشحنة': '#059669',
  'استلام العمولة': '#7C3AED',
  'إغلاق': '#64748B',
};

/* ─── Formatters ─── */
const formatCurrency = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);

const formatNumber = (n) => new Intl.NumberFormat('ar-EG').format(n || 0);

const formatRelativeTime = (date) => {
  if (!date) return '';
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `قبل ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `قبل ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 604800) return `قبل ${Math.floor(diff / 86400)} يوم`;
  return new Date(date).toLocaleDateString('ar-EG');
};

/* ═══════════════════════════════════════════
   Page
   ═══════════════════════════════════════════ */
export default function DashboardPage() {
  const stats      = useApi(() => dashboardService.getStats(), []);
  const pipeline   = useApi(() => dashboardService.getPipeline(), []);
  const recent     = useApi(() => dashboardService.getRecentOrders(), []);
  const sparklines = useApi(() => dashboardService.getSparklines(), []);

  const sp = sparklines.data || {};

  return (
    <>
      <Header />

      {/* ─── Stats ─── */}
      {stats.loading ? (
        <div className="mb-8"><LoadingState minHeight="200px" /></div>
      ) : stats.error ? (
        <div className="mb-8"><ErrorState error={stats.error} onRetry={stats.refetch} minHeight="200px" /></div>
      ) : stats.data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="الطلبات النشطة"
            value={formatNumber(stats.data.activeOrders.count)}
            icon={Box}
            iconColor="#F59E0B"
            iconBg="#FEF3C7"
            trend={stats.data.activeOrders.trend}
            trendUp={stats.data.activeOrders.trend >= 0}
            sparklineCurrent={sp.orders?.current}
            sparklinePrevious={sp.orders?.previous}
            sparklineCurrentDates={sp.dates?.current}
            sparklinePreviousDates={sp.dates?.previous}
            primaryColor="#8ECFC0"
            secondaryColor="#C9A0DC"
            valueSuffix=" طلب"
          />
          <StatCard
            title="الإيرادات الشهرية"
            value={formatCurrency(stats.data.monthlyRevenue.sum)}
            icon={DollarSign}
            iconColor="#3B82F6"
            iconBg="#DBEAFE"
            trend={stats.data.monthlyRevenue.trend}
            trendUp={stats.data.monthlyRevenue.trend >= 0}
            sparklineCurrent={sp.revenue?.current}
            sparklinePrevious={sp.revenue?.previous}
            sparklineCurrentDates={sp.dates?.current}
            sparklinePreviousDates={sp.dates?.previous}
            primaryColor="#8ECFC0"
            secondaryColor="#C9A0DC"
            valuePrefix="$"
          />
          <StatCard
            title="العمولات المعلقة"
            value={formatCurrency(stats.data.pendingCommissions.sum)}
            icon={Percent}
            iconColor="#10B981"
            iconBg="#D1FAE5"
            sparklineCurrent={sp.commissions?.current}
            sparklinePrevious={sp.commissions?.previous}
            sparklineCurrentDates={sp.dates?.current}
            sparklinePreviousDates={sp.dates?.previous}
            primaryColor="#8ECFC0"
            secondaryColor="#C9A0DC"
            valuePrefix="$"
          />
          <StatCard
            title="الشحنات المتأخرة"
            value={formatNumber(stats.data.delayedShipments.count)}
            icon={AlertTriangle}
            iconColor="#E11D48"
            iconBg="#FFE4E6"
            trendUp={true}
            trendText={
              stats.data.delayedShipments.newCount > 0
                ? `${stats.data.delayedShipments.newCount} شحنات جديدة`
                : null
            }
            sparklineCurrent={sp.delayed?.current}
            sparklinePrevious={sp.delayed?.previous}
            sparklineCurrentDates={sp.dates?.current}
            sparklinePreviousDates={sp.dates?.previous}
            primaryColor="#8ECFC0"
            secondaryColor="#C9A0DC"
            valueSuffix=" شحنة"
          />
        </div>
      )}

      {/* ─── Pipeline ─── */}
      {pipeline.loading ? (
        <div className="mb-8"><LoadingState minHeight="160px" /></div>
      ) : pipeline.error ? (
        <div className="mb-8"><ErrorState error={pipeline.error} onRetry={pipeline.refetch} minHeight="160px" /></div>
      ) : pipeline.data && pipeline.data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {pipeline.data.map((stage) => {
            const visual = STAGE_VISUALS[stage.stage] || { icon: FileText, bg: '#94A3B8' };
            return (
              <PipelineCard
                key={stage.stage}
                title={stage.stage}
                value={formatNumber(stage.count)}
                percentage={stage.percentage}
                icon={visual.icon}
                color="#ffffff"
                bg={visual.bg}
              />
            );
          })}
        </div>
      )}

      {/* ─── Recent Orders ─── */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-black text-[#040814]">آخر الطلبات</h2>
          <Link href="/orders" className="text-[#B08B3A] font-bold text-sm flex items-center gap-1.5 hover:text-[#906c27] transition-colors">
            <ArrowLeft size={16} />
            عرض الكل
          </Link>
        </div>

        {recent.loading ? (
          <LoadingState minHeight="200px" />
        ) : recent.error ? (
          <ErrorState error={recent.error} onRetry={recent.refetch} minHeight="200px" />
        ) : !recent.data || recent.data.length === 0 ? (
          <EmptyState title="لا توجد طلبات حديثة" description="ستظهر أحدث الطلبات هنا فور إضافتها" minHeight="200px" />
        ) : (
          <div className="flex flex-col gap-2">
            {recent.data.map((order) => {
              const dotColor = STAGE_DOT_COLOR[order.currentStage] || '#94A3B8';
              const productName = order.product?.nameAr || order.product?.name || '';
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-4 rounded-xl"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className="w-3.5 h-3.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: dotColor }}
                    />
                    <div>
                      <h4 className="text-[14px] font-bold text-[#040814] mb-1">
                        #{order.displayId}
                      </h4>
                      {productName && (
                        <p className="text-[12px] text-gray-600 font-medium mb-1.5">
                          {productName}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-gray-500 text-[11px] font-bold">
                        {order.customer && (
                          <span className="flex items-center gap-1.5">
                            <UserCheck size={14} />
                            {order.customer.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {formatRelativeTime(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-black text-[#040814]" dir="ltr">
                    {formatCurrency(order.totalPrice)}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
