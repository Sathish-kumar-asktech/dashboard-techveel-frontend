// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Enquiry',
    path: '/dashboard/enquiry',
    icon: icon('enquiry'),
  },
  {
    title: 'Admission',
    path: '/dashboard/admission',
    icon: icon('admission'),
  },
  {
    title: 'Payment',
    path: '/dashboard/payment',
    icon: icon('payment'),
  },
  {
    title: 'Receipt',
    path: '/dashboard/receipt',
    icon: icon('receipt'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
  
];



export default navConfig;

