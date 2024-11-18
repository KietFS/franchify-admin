import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import {
  BuildingStorefrontIcon,
  ChartBarSquareIcon,
  CubeIcon,
  DocumentIcon,
  InboxStackIcon,
  TagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import UserMenu from '../UserMenu';
import { Link, useRouteMatch } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../redux';
import { useDispatch } from 'react-redux';
import { setOpenSideBar } from '../../redux/slices/auth';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 300;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface ISideBarProps {
  content: any;
  title: string;
}

export default function MainLayout(props: ISideBarProps) {
  const theme = useTheme();
  const { path } = useRouteMatch();
  const { user } = useAuth();

  const { content, title } = props;
  const { openSideBar: open } = useAppSelector((state: IRootState) => state.auth);

  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    dispatch(setOpenSideBar(true));
  };

  const handleDrawerClose = () => {
    dispatch(setOpenSideBar(false));
  };

  const adminRoutes = [
    {
      id: '1',
      name: 'Tổng quan',
      to: '/home',
      activeIcon: <ChartBarSquareIcon className="h-6 w-6 font-semibold text-gray-500" />,
      icon: <ChartBarSquareIcon className="h-6 w-6 text-gray-500" />,
    },
    {
      id: '2',
      name: 'Quản lý người dùng',
      to: '/user-management',
      activeIcon: <UserCircleIcon className="h-6 w-6 font-semibold text-gray-500" />,
      icon: <UserCircleIcon className="h-6 w-6 text-gray-500" />,
    },
    {
      id: '3',
      name: 'Quản lý danh mục',
      to: '/category-management',
      activeIcon: <TagIcon className="h-6 w-6 font-semibold text-gray-500" />,
      icon: <TagIcon className="h-6 w-6 text-gray-500" />,
    },
    {
      id: '4',
      name: 'Quản lý sản phẩm',
      to: '/products-management',
      activeIcon: <InboxStackIcon className="h-6 w-6 font-semibold text-gray-500" />,
      icon: <InboxStackIcon className="h-6 w-6 text-gray-500" />,
    },
    {
      id: '5',
      name: 'Quản lý cửa hàng',
      to: '/store-management',
      activeIcon: <BuildingStorefrontIcon className="h-6 w-6 font-semibold text-gray-500" />,
      icon: <BuildingStorefrontIcon className="h-6 w-6 text-gray-500" />,
    },
    {
      id: '6',
      name: 'Quản lý thương hiệu',
      to: '/tenant-management',
      activeIcon: <CubeIcon className="h-6 w-6 font-semibold text-gray-500" />,
      icon: <CubeIcon className="h-6 w-6 text-gray-500" />,
    },
  ];

  const mangerRoutes = [
    {
      id: '1',
      name: 'Quản lý doanh thu',
      to: '/home',
      activeIcon: <ChartBarSquareIcon className="h-6 w-6 font-semibold text-gray-500" />,
      icon: <ChartBarSquareIcon className="h-6 w-6 text-gray-500" />,
    },
    {
      id: '2',
      name: 'Quản lý người dùng',
      to: '/user-management',
      activeIcon: <UserCircleIcon className="h-6 w-6 font-semibold text-gray-500" />,
      icon: <UserCircleIcon className="h-6 w-6 text-gray-500" />,
    },
    {
      id: '4',
      name: 'Quản lý sản phẩm',
      to: '/products-management',
      activeIcon: <InboxStackIcon className="h-6 w-6 font-semibold text-gray-500" />,
      icon: <InboxStackIcon className="h-6 w-6 text-gray-500" />,
    },
    {
      id: '5',
      name: 'Quản lý đơn hàng',
      to: '/orders-management',
      activeIcon: <DocumentIcon className="h-6 w-6 font-semibold text-gray-500" />,
      icon: <DocumentIcon className="h-6 w-6 text-gray-500" />,
    },
  ];

  console.log('user', user);

  const routes = user?.role == 'admin' ? adminRoutes : mangerRoutes;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={true} sx={{ backgroundColor: '#4b5563' }}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={true}>
        <DrawerHeader sx={{ pl: 4 }} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p className="w-1/3 cursor-pointer text-center text-2xl font-bold text-gray-500 laptop:w-fit">
            Market Floor
          </p>
        </DrawerHeader>
        <Divider />
        <List>
          {routes.map((route, index) => (
            <Link to={route.to}>
              <ListItem key={route.id} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    mb: 2,
                    justifyContent: 'initial',
                    px: 4,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 3,
                      color: path == route.to ? 'primary' : 'black',
                    }}
                    color={path == route.to ? 'blue' : 'black'}
                  >
                    {path == route.to ? route.activeIcon : route.icon}
                  </ListItemIcon>
                  <p
                    className={`text-sm ${
                      path == route.to ? 'font-semibold text-gray-500' : 'text-gray-500'
                    }`}
                  >
                    {route.name}
                  </p>
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {content}
      </Box>
    </Box>
  );
}
