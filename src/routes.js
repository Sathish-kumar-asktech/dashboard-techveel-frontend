import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import City from './ASK/Master/City';
import State from './ASK/Master/State';
import College from './ASK/Master/College';
import Enquiry from './Techveel/Enquiry';
import PaymentUpdateForm from './Techveel/PaymentUpdateForm';
import TermsConditions from './ASK/Master/TermsConditions';
import EducationStream from './ASK/Master/EducationStream';
import CourseCategoryMaster from './ASK/Master/CourseCategory';
import CoursesMaster from './ASK/Master/Courses';
import ManageEnquiriesTable from './Techveel/ManageEnquiries';
import AdmissionForm from './Techveel/Admission';
import ManageAdmissionTable from './Techveel/ManageAdmission';
import ManagePayment from './Techveel/ManagePayment';
import PaymentHistory from './Techveel/PaymentHistory';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'city', element: <City /> },
        { path: 'state', element: <State /> },
        { path: 'college', element: <College /> },  
        { path: 'degree', element: <EducationStream /> }, 
        { path: 'coursescategory', element: <CourseCategoryMaster /> },    
        { path: 'courses', element: <CoursesMaster /> },                 
        { path: 'terms&conditions', element: <TermsConditions /> },                         
        { path: 'enquiry', element: <Enquiry /> },                                
        { path: 'enquiry/:id', element: <Enquiry /> },
        { path: 'admission', element: <AdmissionForm /> },
        { path: 'admission/:id', element: <AdmissionForm /> },
        { path: 'newadmission', element: <AdmissionForm /> },
        { path: 'manage_enquiry', element: <ManageEnquiriesTable /> },        
        { path: 'manage_students', element: <ManageEnquiriesTable /> },               
        { path: 'manage_admission', element: <ManageAdmissionTable /> },            
        { path: 'payment', element: <PaymentUpdateForm /> },                      
        { path: 'payment/:id', element: <PaymentUpdateForm /> },                           
        { path: 'manage_payment', element: <ManagePayment /> },      
        { path: 'manage_paymnt_history/:id', element: <PaymentHistory /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
