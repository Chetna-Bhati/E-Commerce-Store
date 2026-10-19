import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck, AlertCircle } from 'lucide-react';

export default function OrderTimeline({ status, timeline = [] }) {
  const isCancelled = status === 'CANCELLED';

  const defaultSteps = [
    { status: 'PLACED', label: 'Order Placed', icon: Clock },
    { status: 'PACKED', label: 'Packed & Verified', icon: PackageCheck },
    { status: 'SHIPPED', label: 'Shipped via Express', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 }
  ];

  const orderIndex = defaultSteps.findIndex((s) => s.status === status);

  if (isCancelled) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded flex items-center gap-3 text-xs text-red-800 font-bold">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <span>This order was cancelled. Any online payment will be refunded within 3-5 working days.</span>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E2E0] p-6 rounded">
      <h4 className="font-heading text-xs uppercase tracking-wider text-[#111111] mb-6">
        Order Status & Tracking
      </h4>

      <div className="relative flex items-center justify-between">
        {/* Progress connecting bar */}
        <div className="absolute left-6 right-6 top-4 h-0.5 bg-[#E2E2E0] -z-0">
          <div
            className="h-full bg-[#111111] transition-all duration-500"
            style={{
              width: `${(Math.max(0, orderIndex) / (defaultSteps.length - 1)) * 100}%`
            }}
          />
        </div>

        {defaultSteps.map((step, idx) => {
          const isDone = orderIndex >= idx;
          const isCurrent = orderIndex === idx;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center text-center max-w-[80px]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  isDone
                    ? 'bg-[#111111] text-[#FFFFFF] border-[#111111]'
                    : 'bg-[#FFFFFF] text-[#A3A3A3] border-[#E2E2E0]'
                } ${isCurrent ? 'ring-4 ring-orange-100' : ''}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[11px] font-bold mt-2 leading-tight ${isDone ? 'text-[#111111]' : 'text-[#A3A3A3]'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
