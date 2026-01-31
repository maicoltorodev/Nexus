import React from 'react';

export default function ProjectsLoading() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl" />
                    <div className="h-8 w-64 bg-white/5 rounded-lg" />
                </div>
                <div className="h-12 w-56 bg-white/5 rounded-full" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2rem] h-[500px]" />
        </div>
    );
}
