import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/components/providers/auth-provider';

interface RouteAnalyticsData {
  route: string;
  userId?: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
}

export function useRouteAnalytics() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Track route changes
    const routeData: RouteAnalyticsData = {
      route: location.pathname,
      userId: user?.id,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    // Log route change
    console.info('Route change:', routeData);

    // Store analytics data (in production, this would go to an analytics service)
    try {
      const existingAnalytics = localStorage.getItem('route_analytics');
      const analytics = existingAnalytics ? JSON.parse(existingAnalytics) : [];
      analytics.push(routeData);
      
      // Keep only last 50 route changes
      if (analytics.length > 50) {
        analytics.splice(0, analytics.length - 50);
      }
      
      localStorage.setItem('route_analytics', JSON.stringify(analytics));
    } catch (error) {
      console.warn('Failed to store route analytics:', error);
    }

    // Track performance metrics
    if ('performance' in window && 'getEntriesByType' in performance) {
      setTimeout(() => {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          const entry = navigationEntries[0];
          const loadTime = entry.loadEventEnd - entry.loadEventStart;
          
          console.info('Route load time:', {
            route: location.pathname,
            loadTime: Math.round(loadTime),
            domContentLoaded: Math.round(entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart)
          });
        }
      }, 100);
    }
  }, [location.pathname, user?.id]);

  return {
    currentRoute: location.pathname,
    trackEvent: (eventName: string, data?: Record<string, any>) => {
      const eventData = {
        event: eventName,
        route: location.pathname,
        userId: user?.id,
        timestamp: new Date().toISOString(),
        data
      };
      
      console.info('Route event:', eventData);
      
      try {
        const existingEvents = localStorage.getItem('route_events');
        const events = existingEvents ? JSON.parse(existingEvents) : [];
        events.push(eventData);
        
        // Keep only last 25 events
        if (events.length > 25) {
          events.splice(0, events.length - 25);
        }
        
        localStorage.setItem('route_events', JSON.stringify(events));
      } catch (error) {
        console.warn('Failed to store route event:', error);
      }
    }
  };
}
