import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  try {
    // Get current date info
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).toISOString();
    const lastMonth = new Date(currentYear, currentMonth - 1, 1).toISOString();
    const firstDayOfLastMonth = new Date(currentYear, currentMonth - 1, 1).toISOString();
    const lastDayOfLastMonth = new Date(currentYear, currentMonth, 0).toISOString();

    // Fetch leads data
    const { data: allLeads, error: leadsError } = await supabase
      .from('leads')
      .select('id, created_at, service_id, services(id, name, main_categories)');

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
    }

    // Fetch services data
    const { data: allServices, error: servicesError } = await supabase
      .from('services')
      .select('id, name, main_categories, published, created_at, price_from, currency');

    if (servicesError) {
      console.error('Error fetching services:', servicesError);
    }

    // Fetch vendors data
    const { data: allVendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('id, name, created_at');

    if (vendorsError) {
      console.error('Error fetching vendors:', vendorsError);
    }

    // Process leads data
    const leads = allLeads || [];
    const services = allServices || [];
    const vendors = allVendors || [];

    // Calculate KPIs
    const totalLeads = leads.length;
    const leadsThisMonth = leads.filter((lead: any) => 
      new Date(lead.created_at) >= new Date(firstDayOfMonth)
    ).length;
    
    const leadsLastMonth = leads.filter((lead: any) => {
      const leadDate = new Date(lead.created_at);
      return leadDate >= new Date(firstDayOfLastMonth) && leadDate <= new Date(lastDayOfLastMonth);
    }).length;

    const leadsGrowth = leadsLastMonth > 0 
      ? ((leadsThisMonth - leadsLastMonth) / leadsLastMonth * 100).toFixed(1)
      : leadsThisMonth > 0 ? '100' : '0';

    const totalServices = services.length;
    const activeServices = services.filter((service: any) => service.published).length;
    const servicesThisMonth = services.filter((service: any) => 
      new Date(service.created_at) >= new Date(firstDayOfMonth)
    ).length;

    const totalVendors = vendors.length;
    const vendorsThisMonth = vendors.filter((vendor: any) => 
      new Date(vendor.created_at) >= new Date(firstDayOfMonth)
    ).length;

    // Calculate average service price
    const servicesWithPrice = services.filter((s: any) => s.price_from && s.price_from > 0);
    const avgServicePrice = servicesWithPrice.length > 0 
      ? servicesWithPrice.reduce((sum: any, s: any) => sum + s.price_from, 0) / servicesWithPrice.length
      : 0;

    // Monthly leads trend (last 6 months)
    const monthlyLeadsTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      const nextMonthDate = new Date(currentYear, currentMonth - i + 1, 1);
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
      
      const monthLeads = leads.filter((lead: any) => {
        const leadDate = new Date(lead.created_at);
        return leadDate >= monthDate && leadDate < nextMonthDate;
      }).length;
      
      monthlyLeadsTrend.push({
        month: monthName,
        leads: monthLeads
      });
    }

    // Top service categories by leads
    const categoryLeads: { [key: string]: number } = {};
    leads.forEach((lead: any) => {
      if (lead.services?.main_categories) {
        lead.services.main_categories.forEach((category: string) => {
          categoryLeads[category] = (categoryLeads[category] || 0) + 1;
        });
      }
    });

    const topCategories = Object.entries(categoryLeads)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([category, count]) => ({ category, leads: count }));

    // Service distribution by category
    const serviceCategoryDistribution: { [key: string]: number } = {};
    services.forEach((service: any) => {
      if (service.main_categories) {
        service.main_categories.forEach((category: string) => {
          serviceCategoryDistribution[category] = (serviceCategoryDistribution[category] || 0) + 1;
        });
      }
    });

    const serviceDistribution = Object.entries(serviceCategoryDistribution)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 8)
      .map(([category, count]) => ({ category, count }));

    // Recent activity (last 10 leads)
    const recentLeads = leads
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map((lead: any) => ({
        id: lead.id,
        created_at: lead.created_at,
        service_name: lead.services?.name || 'Unknown Service'
      }));

    // Alerts
    const alerts = [];
    
    // Alert for services without leads
    const servicesWithoutLeads = services.filter((service: any) => 
      !leads.some((lead: any) => lead.service_id === service.id)
    );
    
    if (servicesWithoutLeads.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Services Without Leads',
        message: `${servicesWithoutLeads.length} services haven't received any leads yet`,
        count: servicesWithoutLeads.length
      });
    }

    // Alert for low lead volume
    if (leadsThisMonth < 5) {
      alerts.push({
        type: 'info',
        title: 'Low Lead Volume',
        message: `Only ${leadsThisMonth} leads received this month`,
        count: leadsThisMonth
      });
    }

    const dashboardData = {
      kpis: {
        totalLeads,
        leadsThisMonth,
        leadsGrowth: parseFloat(leadsGrowth),
        totalServices,
        activeServices,
        servicesThisMonth,
        totalVendors,
        vendorsThisMonth,
        avgServicePrice: Math.round(avgServicePrice)
      },
      charts: {
        monthlyLeadsTrend,
        topCategories,
        serviceDistribution
      },
      recentActivity: recentLeads,
      alerts
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard analytics' },
      { status: 500 }
    );
  }
}
