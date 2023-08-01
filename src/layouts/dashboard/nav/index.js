import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails, IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlaylistAddCircleIcon from '@mui/icons-material/PlaylistAddCircle';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import BackupTableIcon from '@mui/icons-material/BackupTable';

// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import  Master from './config2';
import FormsList from './formsData';
import Payment from './payment';
import ManageList from './manageList';

// ----------------------------------------------------------------------

const NAV_WIDTH = 250;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      {/* <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box> */}

      <Box sx={{ mb: 5, m: 2.5 }}>
        <Link underline="none">

          <StyledAccount>
            <Avatar src={account.photoURL} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {account.displayName}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account.role}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <Accordion disableGutters   sx={{ borderTop: 'none', borderColor: 'inherit', backgroundColor: 'inherit',  }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ borderTop: 'none' }}
        > <Typography
            sx={{
              color:"#161C24",
              '&.active': {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightBold',
              },
            }}
          ><IconButton aria-label="ExpandMoreIcon" >
            <PlaylistAddCircleIcon/>
          </IconButton>
            Master
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ borderTop: 'none' }}>
          <NavSection data={Master} />
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters  sx={{ borderTop: 'none', borderColor: 'inherit', backgroundColor: 'inherit',  }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ borderTop: 'none' }}
        > <Typography
            sx={{
              color:"#161C24",
              '&.active': {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightBold',
              },
            }}
          ><IconButton aria-label="ExpandMoreIcon" >
            <ChecklistRtlIcon/>
          </IconButton>
            Forms
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ borderTop: 'none' }}>
          <NavSection data={FormsList} />
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters  sx={{ borderTop: 'none', borderColor: 'inherit', backgroundColor: 'inherit',  }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ borderTop: 'none' }}
        > <Typography
            sx={{
              color:"#161C24",
              '&.active': {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightBold',
              },
            }}
          ><IconButton aria-label="ExpandMoreIcon" >
            <BackupTableIcon/>
          </IconButton>
            Manage
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ borderTop: 'none' }}>
          <NavSection data={ManageList} />
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters  sx={{ borderTop: 'none', borderColor: 'inherit', backgroundColor: 'inherit',  }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ borderTop: 'none' }}
        > <Typography
            sx={{
              color:"#161C24",
              '&.active': {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightBold',
              },
            }}
          ><IconButton aria-label="ExpandMoreIcon" >
            <CreditScoreIcon/>
          </IconButton>
            Payment
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ borderTop: 'none' }}>
          <NavSection data={Payment} />
        </AccordionDetails>
      </Accordion>
      
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
