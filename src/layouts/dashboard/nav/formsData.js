// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const FormsList = [ 
  {
    title: 'Enquiry',
    path: '/dashboard/enquiry',
    icon: icon('enquiry'),
  },
  {
    title: 'Manage Enquiries',
    path: '/dashboard/manage_enquiry',
    icon: icon('enquiry'),
  },
  {
    title: 'Admission',
    path: '/dashboard/admission',
    icon: icon('admission'),
  },
  {
    title: 'Manage Students',
    path: '/dashboard/manage_admission',
    icon: icon('admission'),
  }, 
];


export default FormsList;

