import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';

export default function ClientsLoading() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl" />
                    <div className="h-8 w-64 bg-white/5 rounded-lg" />
                </div>
                <div className="h-12 w-56 bg-white/5 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 bg-white/5 border border-white/10 rounded-[2rem]" />
                ))}
            </div>
        </div>
    );
}
