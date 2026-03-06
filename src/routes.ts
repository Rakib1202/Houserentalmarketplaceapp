import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { Homepage } from "./components/pages/Homepage";
import { AboutUsPage } from "./components/pages/AboutUsPage";
import { ContactUsPage } from "./components/pages/ContactUsPage";
import { AdminDashboardPage } from "./components/pages/AdminDashboardPage";
import { PropertyListingsPage } from "./components/pages/PropertyListingsPage";
import { CareerPage } from "./components/pages/CareerPage";
import { JobDetailsPage } from "./components/pages/JobDetailsPage";

// Admin Components
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { PropertyManagement } from "./components/admin/PropertyManagement";
import { PropertyApprovals } from "./components/admin/PropertyApprovals";
import { UserManagement } from "./components/admin/UserManagement";
import { SubscriptionManagement } from "./components/admin/SubscriptionManagement";
import { PaymentManagement } from "./components/admin/PaymentManagement";
import { PhotoApprovalManagement } from "./components/admin/PhotoApprovalManagement";
import { EmployeeEarnings } from "./components/admin/EmployeeEarnings";
import { ReportsComplaints } from "./components/admin/ReportsComplaints";
import { Analytics } from "./components/admin/Analytics";
import { AdminSettings } from "./components/admin/AdminSettings";
import { ActivityLogs } from "./components/admin/ActivityLogs";
import { AdminPropertyUpload } from "./components/admin/AdminPropertyUpload";
import { CRMDashboard } from "./components/admin/CRMDashboard";
import { CMSDashboard } from "./components/admin/CMSDashboard";
import { AdminLogin } from "./components/auth/AdminLogin";
import { JobManagement } from "./components/admin/JobManagement";
import { SEOManagement } from "./components/admin/SEOManagement";
import { MediaLibrary } from "./components/admin/MediaLibrary";
import { ContentAnalytics } from "./components/admin/ContentAnalytics";
import { LiveChatEmployees } from "./components/admin/LiveChatEmployees";

// Support Components
import { LiveChatReplyDashboard } from "./components/support/LiveChatReplyDashboard";

// Auth Components
import { Login } from "./components/auth/Login";
import { Signup } from "./components/auth/Signup";
import { AuthCallback } from "./components/auth/AuthCallback";

// Role Dashboards
import { TenantDashboard } from "./components/tenant/TenantDashboard";
import { OwnerDashboard } from "./components/owner/OwnerDashboard";
import { AgentDashboard } from "./components/agent/AgentDashboard";
import { EmployeeDashboard } from "./components/employee/EmployeeDashboard";

// Property Components
import { PropertySearch } from "./components/tenant/PropertySearch";
import { PropertyDetails } from "./components/property/PropertyDetails";

export const router = createBrowserRouter([
  // Main Site Routes
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Homepage,
      },
      {
        path: "about",
        Component: AboutUsPage,
      },
      {
        path: "contact",
        Component: ContactUsPage,
      },
      {
        path: "properties",
        Component: PropertyListingsPage,
      },
      {
        path: "listings",
        Component: PropertyListingsPage,
      },
      {
        path: "careers",
        Component: CareerPage,
      },
      {
        path: "careers/:id",
        Component: JobDetailsPage,
      },
    ],
  },
  
  // Auth Routes
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/auth/callback",
    Component: AuthCallback,
  },
  
  // Admin Login Route (standalone)
  {
    path: "/admin-login",
    Component: AdminLogin,
  },
  
  // Property Search and Details (standalone)
  {
    path: "/search",
    Component: PropertySearch,
  },
  {
    path: "/property/:id",
    Component: PropertyDetails,
  },
  
  // Role-based Dashboards
  {
    path: "/tenant",
    Component: TenantDashboard,
  },
  {
    path: "/owner",
    Component: OwnerDashboard,
  },
  {
    path: "/agent",
    Component: AgentDashboard,
  },
  {
    path: "/employee",
    Component: EmployeeDashboard,
  },
  
  // Support Dashboard (standalone for support employees)
  {
    path: "/support-dashboard",
    Component: LiveChatReplyDashboard,
  },
  
  // Admin Panel Routes (with sidebar layout)
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: AdminDashboard,
      },
      {
        path: "properties",
        Component: PropertyManagement,
      },
      {
        path: "properties/approvals",
        Component: PropertyApprovals,
      },
      {
        path: "properties/upload",
        Component: AdminPropertyUpload,
      },
      {
        path: "users",
        Component: UserManagement,
      },
      {
        path: "subscriptions",
        Component: SubscriptionManagement,
      },
      {
        path: "payments",
        Component: PaymentManagement,
      },
      {
        path: "photos",
        Component: PhotoApprovalManagement,
      },
      {
        path: "earnings",
        Component: EmployeeEarnings,
      },
      {
        path: "reports",
        Component: ReportsComplaints,
      },
      {
        path: "analytics",
        Component: Analytics,
      },
      {
        path: "crm",
        Component: CRMDashboard,
      },
      {
        path: "cms",
        Component: CMSDashboard,
      },
      {
        path: "logs",
        Component: ActivityLogs,
      },
      {
        path: "settings",
        Component: AdminSettings,
      },
      {
        path: "jobs",
        Component: JobManagement,
      },
      {
        path: "cms/seo",
        Component: SEOManagement,
      },
      {
        path: "cms/media",
        Component: MediaLibrary,
      },
      {
        path: "cms/analytics",
        Component: ContentAnalytics,
      },
      {
        path: "livechat/employees",
        Component: LiveChatEmployees,
      },
      {
        path: "livechat/replies",
        Component: LiveChatReplyDashboard,
      },
    ],
  },
  
  // Standalone Admin Dashboard (alternative route)
  {
    path: "/admin-panel",
    Component: AdminDashboardPage,
  },
]);