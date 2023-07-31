// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const Master = [
  {
    title: 'State',
    path: '/dashboard/state',
    icon: icon('state'),
  },
  {
    title: 'City',
    path: '/dashboard/city',
    icon: icon('city'),
  },
  {
    title: 'College',
    path: '/dashboard/college',
    icon: icon('college'),
  },
  {
    title: 'Graduation',
    path: '/dashboard/degree',
    icon: icon('degree'),
  },
  {
    title: 'Course Category',
    path: '/dashboard/coursescategory',
    icon: icon('education-bag'),
  },
  {
    title: 'Course',
    path: '/dashboard/courses',
    icon: icon('category'),
  },
  {
    title: 'T&C',
    path: '/dashboard/terms&conditions',
    icon: icon('terms'),
  },
];

export default Master;

