import React from 'react';

export const CardSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="h-48 bg-slate-200 animate-pulse" />
        <div className="p-6">
          <div className="h-6 bg-slate-200 rounded mb-4 animate-pulse w-3/4" />
          <div className="h-4 bg-slate-200 rounded mb-2 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded mb-4 animate-pulse w-1/2" />
          <div className="h-10 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export const CategorySkeleton = () => (
  <div className="w-full py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <div className="h-10 bg-slate-200 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto mb-8 animate-pulse"></div>
      </div>
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-36 h-40 bg-slate-200 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);

export const SliderSkeleton = () => (
  <div className="flex gap-6 overflow-hidden pb-8">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex-shrink-0 w-80">
        <div className="h-48 bg-slate-200 rounded-t-2xl animate-pulse" />
        <div className="bg-white p-6 rounded-b-2xl">
          <div className="h-6 bg-slate-200 rounded mb-3 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded mb-4 animate-pulse" />
          <div className="h-10 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);