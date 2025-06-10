import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const SidebarStats = ({ counts, className = '', ...props }) => {
    return (
        <div className={`space-y-3 ${className}`} {...props}>
            <StatCard
                value={counts.total}
                description="Active Tasks"
                iconName="Target"
                className="bg-gradient-to-r from-primary to-secondary text-white"
            />

            <div className="grid grid-cols-2 gap-3">
                <StatCard
                    value={counts.today}
                    description="Due Today"
                    className="bg-info/10 text-info"
                />
                <StatCard
                    value={counts.overdue}
                    description="Overdue"
                    className="bg-accent/10 text-accent"
                />
            </div>
        </div>
    );
};

export default SidebarStats;