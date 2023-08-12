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
    title: 'Admission',
    path: '/dashboard/admission',
    icon: icon('admission'),
  },
  {
    title: 'Direct Admission',
    path: '/dashboard/newadmission',
    icon: icon('admission'),
  },
];

export default FormsList;
