// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ManageList = [ 
  {
    title: 'Manage Enquiries',
    path: '/dashboard/manage_enquiry',
    icon: icon('enquiry'),
  },
  {
    title: 'Manage Admission',
    path: '/dashboard/manage_admission',
    icon: icon('admission'),
  },  
  {
    title: 'Manage Payments',
    path: '/dashboard/manage_payment',
    icon: icon('payment'),
  },  
];


export default ManageList;

