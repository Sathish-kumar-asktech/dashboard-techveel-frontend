// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const Payment = [
  
  {
    title: 'Manage Payment',
    path: '/dashboard/manage_payment',
    icon: icon('payment'),
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
];


export default Payment;
