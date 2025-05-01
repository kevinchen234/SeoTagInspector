import { useState } from "react";
import * as React from "react";
import { TabType } from "../types/seo";
import { 
  Tag, 
  Search as GoogleIcon, 
  Facebook, 
  Twitter, 
  Lightbulb 
} from "lucide-react";

interface TabNavigationProps {
  children: React.ReactNode;
  defaultTab?: TabType;
}

export default function TabNavigation({ children, defaultTab = "general" }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  const tabs = [
    { id: "general" as TabType, label: "General Meta Tags", icon: <Tag className="h-4 w-4 mr-1" /> },
    { id: "google" as TabType, label: "Google Preview", icon: <GoogleIcon className="h-4 w-4 mr-1" /> },
    { id: "facebook" as TabType, label: "Facebook Preview", icon: <Facebook className="h-4 w-4 mr-1" /> },
    { id: "twitter" as TabType, label: "Twitter Preview", icon: <Twitter className="h-4 w-4 mr-1" /> },
    { id: "recommendations" as TabType, label: "Recommendations", icon: <Lightbulb className="h-4 w-4 mr-1" /> },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 sm:px-4 py-2.5 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap flex items-center ${
                activeTab === tab.id
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.icon}
              <span className="hidden xs:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-3 sm:p-4 md:p-5">
        {React.Children.map(children, (child, index) => {
          // Assuming the order of children matches the order of tabs
          return (
            <div
              key={tabs[index]?.id || index}
              className={activeTab === tabs[index]?.id ? "" : "hidden"}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}
