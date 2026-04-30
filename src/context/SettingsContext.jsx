import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'DJAIRINDIA PVT LTD',
    logo: '/logo.png',
    contactEmail: 'support@djairindia.com',
    supportNumber: '+91 1234567890',
    address: 'Bengaluru, Karnataka, India',
    maintenance: {
      enabled: false,
      pages: []
    },
    aboutHeroTitle: 'About DJAIRINDIA PVT LTD',
    aboutHeroDescription: 'Transforming agriculture careers and entrepreneurship through innovation and community.',
    aboutMission: 'Empower farmers and youth with jobs and startup opportunities through tech-enabled solutions.',
    aboutVision: 'Build India’s largest agri ecosystem where every farmer has access to global markets and capital.',
    aboutMainDescription: 'Founded in 2024, DJAIRINDIA PVT LTD has quickly grown into a hub for agricultural excellence. We believe that by providing the right resources, we can solve some of the world\'s most pressing food security challenges.',
    team: []
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await api.get('/api/settings');
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to load site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
