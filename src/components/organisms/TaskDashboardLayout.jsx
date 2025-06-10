import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const TaskDashboardLayout = ({
    sidebarContent,
    mainHeader,
    mainContent,
    loading,
    error,
    className = '',
    ...props
}) => {
    if (loading) {
        return (
            <div className="h-full flex">
                {/* Sidebar skeleton */}
                <div className="w-80 bg-white border-r border-surface-200 p-6">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-10 bg-surface-200 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-8 bg-surface-200 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main content skeleton */}
                <div className="flex-1 p-6">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="h-6 bg-surface-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
                    <Text as="h3" className="text-lg font-medium text-surface-900 mb-2">Something went wrong</Text>
                    <Text as="p" className="text-surface-600 mb-4">{error}</Text>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-full flex max-w-full overflow-hidden ${className}`} {...props}>
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-surface-200 flex-shrink-0 overflow-y-auto">
                <div className="p-6 space-y-6">
                    {sidebarContent}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 min-w-0">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        {mainHeader}
                    </div>

                    {/* Content */}
                    {mainContent}
                </div>
            </div>
        </div>
    );
};

export default TaskDashboardLayout;