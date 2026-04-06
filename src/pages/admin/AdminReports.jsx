import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAnalytics, selectAnalytics, selectAdminLoading } from '../../redux/slices/adminSlice';
import './AdminReports.css';

// Chart components (assuming Chart.js is installed)
// import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

const AdminReports = () => {
  const dispatch = useDispatch();
  const analytics = useSelector(selectAnalytics);
  const loading = useSelector(selectAdminLoading);
  const [dateRange, setDateRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    dispatch(getAnalytics({ period: dateRange }));
  }, [dispatch, dateRange]);

  // Mock data for charts when API is not available
  const mockBookingTrends = [
    { month: 'Jan', bookings: 45 },
    { month: 'Feb', bookings: 52 },
    { month: 'Mar', bookings: 48 },
    { month: 'Apr', bookings: 61 },
    { month: 'May', bookings: 55 },
    { month: 'Jun', bookings: 67 }
  ];

  const mockRevenueTrends = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 }
  ];

  const mockServicePopularity = [
    { service: 'Regular House Cleaning', bookings: 120, percentage: 35 },
    { service: 'Deep Cleaning', bookings: 85, percentage: 25 },
    { service: 'Office Cleaning', bookings: 65, percentage: 19 },
    { service: 'Carpet Cleaning', bookings: 45, percentage: 13 },
    { service: 'Kitchen Cleaning', bookings: 25, percentage: 8 }
  ];

  const bookingTrends = analytics.bookingTrends || mockBookingTrends;
  const revenueTrends = analytics.revenueTrends || mockRevenueTrends;
  const servicePopularity = analytics.servicePopularity || mockServicePopularity;

  // eslint-disable-next-line no-unused-vars
  const bookingChartData = {
    labels: bookingTrends.map(item => item.month),
    datasets: [{
      label: 'Bookings',
      data: bookingTrends.map(item => item.bookings),
      backgroundColor: 'rgba(66, 153, 225, 0.6)',
      borderColor: 'rgba(66, 153, 225, 1)',
      borderWidth: 2,
      fill: true
    }]
  };

  // eslint-disable-next-line no-unused-vars
  const revenueChartData = {
    labels: revenueTrends.map(item => item.month),
    datasets: [{
      label: 'Revenue (₹)',
      data: revenueTrends.map(item => item.revenue),
      backgroundColor: 'rgba(72, 187, 120, 0.6)',
      borderColor: 'rgba(72, 187, 120, 1)',
      borderWidth: 2,
      fill: true
    }]
  };

  // eslint-disable-next-line no-unused-vars
  const serviceChartData = {
    labels: servicePopularity.map(item => item.service),
    datasets: [{
      data: servicePopularity.map(item => item.bookings),
      backgroundColor: [
        'rgba(66, 153, 225, 0.8)',
        'rgba(72, 187, 120, 0.8)',
        'rgba(237, 137, 54, 0.8)',
        'rgba(229, 62, 62, 0.8)',
        'rgba(159, 122, 234, 0.8)'
      ],
      borderWidth: 1
    }]
  };

  // eslint-disable-next-line no-unused-vars
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="admin-reports">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <div className="date-range-selector">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>{bookingTrends.reduce((sum, item) => sum + item.bookings, 0)}</h3>
            <p>Total Bookings</p>
            <span className="metric-change positive">+12% from last period</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>₹{revenueTrends.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className="metric-change positive">+8% from last period</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <h3>4.8</h3>
            <p>Average Rating</p>
            <span className="metric-change positive">+0.2 from last period</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>89%</h3>
            <p>Customer Satisfaction</p>
            <span className="metric-change positive">+3% from last period</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Booking Trends</h3>
            <p>Monthly booking volume over time</p>
          </div>
          <div className="chart-container">
            {/* <Line data={bookingChartData} options={chartOptions} /> */}
            <div className="chart-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-icon">📊</div>
                <p>Booking Trends Chart</p>
                <small>Install Chart.js to display interactive charts</small>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue Trends</h3>
            <p>Monthly revenue over time</p>
          </div>
          <div className="chart-container">
            {/* <Bar data={revenueChartData} options={chartOptions} /> */}
            <div className="chart-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-icon">📈</div>
                <p>Revenue Trends Chart</p>
                <small>Install Chart.js to display interactive charts</small>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Service Popularity</h3>
            <p>Most popular services by booking volume</p>
          </div>
          <div className="chart-container">
            {/* <Pie data={serviceChartData} options={{ responsive: true, maintainAspectRatio: false }} /> */}
            <div className="chart-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-icon">🥧</div>
                <p>Service Popularity Chart</p>
                <small>Install Chart.js to display interactive charts</small>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Service Performance</h3>
            <p>Detailed breakdown of service metrics</p>
          </div>
          <div className="service-performance">
            {servicePopularity.map((service, index) => (
              <div key={index} className="service-item">
                <div className="service-info">
                  <span className="service-name">{service.service}</span>
                  <span className="service-bookings">{service.bookings} bookings</span>
                </div>
                <div className="service-bar">
                  <div
                    className="service-bar-fill"
                    style={{ width: `${service.percentage}%` }}
                  ></div>
                </div>
                <span className="service-percentage">{service.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Reports */}
      <div className="reports-section">
        <div className="report-card">
          <h3>Top Performing Services</h3>
          <div className="report-table">
            <div className="report-header">
              <span>Service</span>
              <span>Bookings</span>
              <span>Revenue</span>
              <span>Growth</span>
            </div>
            {servicePopularity.slice(0, 5).map((service, index) => (
              <div key={index} className="report-row">
                <span>{service.service}</span>
                <span>{service.bookings}</span>
                <span>₹{(service.bookings * 1000).toLocaleString()}</span>
                <span className="growth positive">+{Math.floor(Math.random() * 20) + 5}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="report-card">
          <h3>Recent Performance</h3>
          <div className="performance-metrics">
            <div className="metric">
              <span className="metric-label">Conversion Rate</span>
              <span className="metric-value">24.5%</span>
              <span className="metric-change positive">+2.1%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Average Order Value</span>
              <span className="metric-value">₹1,250</span>
              <span className="metric-change positive">+₹150</span>
            </div>
            <div className="metric">
              <span className="metric-label">Repeat Customers</span>
              <span className="metric-value">32%</span>
              <span className="metric-change positive">+5%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Cancellation Rate</span>
              <span className="metric-value">4.2%</span>
              <span className="metric-change negative">-0.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;