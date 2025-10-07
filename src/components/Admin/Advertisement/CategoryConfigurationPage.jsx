// CategoryConfigurationPage.jsx
import React, { useState } from 'react';
import { FileText, ImageIcon, Settings, Package } from 'lucide-react';
import Sidebar from '../Sidebar';
import NeoFooter from '../footer';
import OverviewTab from './CategoryTabs/OverviewTab';
import CarouselTab from './CategoryTabs/CarouselTab';
import SpecificationsTab from './CategoryTabs/SpecificationsTab';
import ProductsTab from './CategoryTabs/ProductsTab';

const CategoryConfigurationPage = ({ category, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'carousel', label: 'Hero Carousel', icon: ImageIcon },
    { id: 'specifications', label: 'Specifications', icon: Settings },
    { id: 'products', label: 'Products', icon: Package }
  ];

  const handleCategoryUpdate = (updatedData) => {
    const updatedCategory = { ...category, ...updatedData };
    onUpdate(updatedCategory);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab category={category} />;
      case 'carousel':
        return (
          <CarouselTab
            category={category}
            onUpdate={handleCategoryUpdate}
          />
        );
      case 'specifications':
        return (
          <SpecificationsTab
            category={category}
            onUpdate={handleCategoryUpdate}
          />
        );
      case 'products':
        return (
          <ProductsTab
            category={category}
            onUpdate={handleCategoryUpdate}
          />
        );
      default:
        return <OverviewTab category={category} />;
    }
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50" style={{marginTop:"60px"}}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 space-y-2 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={onBack}
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base self-start"
                >
                  ← Back to Categories
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                  Configure: {category.name}
                </h1>
              </div>
            </div>
            
            {/* Tab Navigation - Mobile: Dropdown, Desktop: Horizontal */}
            <div className="block sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                {tabs.map(tab => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Desktop Tab Navigation */}
            <div className="hidden sm:flex space-x-2 md:space-x-8 border-b overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-3 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-pink-600 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={14} className="md:w-4 md:h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {renderTabContent()}
        </div>
      </div>
      <NeoFooter />
    </>
  );
};

export default CategoryConfigurationPage;