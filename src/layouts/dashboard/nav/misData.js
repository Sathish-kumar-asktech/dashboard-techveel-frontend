// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const misData = [
  {
    title: 'Enquiries',
    path: '/dashboard/mis/enquiry_report',
    icon: icon('enquiry'),
  },
  {
    title: 'Admissions',
    path: '/dashboard/mis/admission_report',
    icon: icon('admission'),
  },
  {
    title: 'Payments',
    path: '/dashboard/mis/payments_report',
    icon: icon('payment'),
  }
];

export default misData;
