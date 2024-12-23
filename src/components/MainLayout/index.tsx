import {CSSObject, styled, Theme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
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
  Cog8ToothIcon,
  CreditCardIcon,
  CubeIcon,
  DocumentIcon,
  EnvelopeIcon,
  InboxStackIcon,
  TagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  BuildingStorefrontIcon as BuildingStorefrontIconSolid,
  ChartBarSquareIcon as ChartBarSquareIconSolid,
  Cog8ToothIcon as Cog8ToothIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  CubeIcon as CubeIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  InboxStackIcon as InboxStackIconSolid,
  TagIcon as TagIconSolid,
  UserCircleIcon as UserCircleIconSolid,
} from '@heroicons/react/24/solid';

import UserMenu from '../UserMenu';
import {Link, useRouteMatch} from 'react-router-dom';
import {useAuth} from '../../hooks/useAuth';
import {useState} from 'react';

const drawerWidth = 270;

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

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
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
})(({theme, open}) => ({
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
    const {path} = useRouteMatch();
    const {user} = useAuth();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const {content, title} = props;

    const adminRoutes = [
        {
            id: '1',
            name: 'Phân tích và báo cáo',
            to: '/home',
            activeIcon: <ChartBarSquareIconSolid className="h-6 w-6 font-semibold text-white"/>,
            icon: <ChartBarSquareIcon className="h-6 w-6 text-white"/>,
        },
        {
            id: '2',
            name: 'Quản lý người dùng',
            to: '/user-management',
            activeIcon: <UserCircleIconSolid className="h-6 w-6 font-semibold text-white"/>,
            icon: <UserCircleIcon className="h-6 w-6 text-white"/>,
        },
        {
            id: '3',
            name: 'Quản lý danh mục',
            to: '/category-management',
            activeIcon: <TagIconSolid className="h-6 w-6 font-semibold text-white"/>,
            icon: <TagIcon className="h-6 w-6 text-white"/>,
        },
        {
            id: '4',
            name: 'Quản lý sản phẩm',
            to: '/products-management',
            activeIcon: <InboxStackIconSolid className="h-6 w-6 font-semibold text-white"/>,
            icon: <InboxStackIcon className="h-6 w-6 text-white"/>,
        },
        {
            id: '5',
            name: 'Quản lý cửa hàng',
            to: '/store-management',
            activeIcon: <BuildingStorefrontIconSolid className="h-6 w-6 font-semibold text-white"/>,
            icon: <BuildingStorefrontIcon className="h-6 w-6 text-white"/>,
        },
        {
            id: '6',
            name: 'Quản lý thương hiệu',
            to: '/tenant-management',
            activeIcon: <CubeIconSolid className="h-6 w-6 font-semibold text-white"/>,
            icon: <CubeIcon className="h-6 w-6 text-white"/>,
        },
        {
            id: '7',
            name: 'Cài đặt',
            to: '#',
            activeIcon: <Cog8ToothIconSolid className="h-6 w-6 font-semibold text-white"/>,
            icon: <Cog8ToothIcon className="h-6 w-6 text-white"/>,
            children: [
                {id: '7-1', name: 'Nội dung hiển thị', to: '/settings/cms-management'},
                {id: '7-2', name: 'Quản lý chi phí', to: '/settings/fee-management'},
                {id: '7-3', name: 'Điểm thưởng và tích lũy', to: '/settings/submenu3'},
            ],
        },
        {
            id: '8',
            name: 'Quản lý thanh toán',
            to: '/payments-management',
            activeIcon: <CreditCardIconSolid className="h-6 w-6 font-semibold text-white"/>,
            icon: <CreditCardIcon className="h-6 w-6 text-white"/>,
        },
        {
            id: '9',
            name: 'Quản lý khuyến mãi',
            to: '/promotions-management',
            activeIcon: <EnvelopeIconSolid className="h-6 w-6 font-semibold text-white"/>,
            icon: <EnvelopeIcon className="h-6 w-6 text-white"/>,
        },
    ];

    const mangerRoutes = [
        {
            id: '1',
            name: 'Quản lý doanh thu',
            to: '/home',
            activeIcon: <ChartBarSquareIcon className="h-6 w-6 font-semibold text-white"/>,
            icon: <ChartBarSquareIcon className="h-6 w-6 text-white"/>,
        },
        {
            id: '2',
            name: 'Quản lý người dùng',
            to: '/user-management',
            activeIcon: <UserCircleIcon className="h-6 w-6 font-bold text-white"/>,
            icon: <UserCircleIcon className="h-6 w-6 text-white"/>,
        },
        {
            id: '4',
            name: 'Quản lý sản phẩm',
            to: '/products-management',
            activeIcon: <InboxStackIcon className="h-6 w-6 font-semibold text-white"/>,
            icon: <InboxStackIcon className="h-6 w-6 text-white"/>,
        },
        {
            id: '5',
            name: 'Quản lý đơn hàng',
            to: '/orders-management',
            activeIcon: <DocumentIcon className="h-6 w-6 font-semibold text-white"/>,
            icon: <DocumentIcon className="h-6 w-6 text-white"/>,
        },
    ];

    const routes = user?.role === 'admin' ? adminRoutes : mangerRoutes;

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar className="shadow-xl" position="fixed" open={true} sx={{backgroundColor: 'white'}}>
                <Toolbar>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <Typography
                            sx={{fontWeight: 'bold', color: '#212631'}}
                            variant="h6"
                            noWrap
                            component="div"
                        >
                            {title}
                        </Typography>
                        <UserMenu/>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                PaperProps={{
                    sx: {
                        backgroundColor: '#212631',
                        width: drawerWidth,
                    },
                }}
                className="shadow-xxl"
                variant="permanent"
                open={true}
            >
                <DrawerHeader sx={{pl: 4}} style={{display: 'flex', justifyContent: 'space-between'}}>
                    <p className="cursor-pointer text-center text-xl font-bold text-white laptop:w-fit">
                        The Coffee House
                    </p>
                </DrawerHeader>
                <Divider sx={{backgroundColor: 'gray'}}/>
                <List>
                    {routes.map((route: any, index) => (
                        <div key={`route-to-${route.to}`}>
                            <ListItem
                                key={route.id}
                                disablePadding
                                sx={{
                                    display: 'block',
                                }}
                            >
                                <Link to={route?.children?.length > 0 ? '#' : route.to}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            mb: 2,
                                            justifyContent: 'initial',
                                            px: 4,
                                            '&:hover': {
                                                background: 'rgb(41.5, 48, 61) !important',
                                            },
                                        }}
                                        onClick={() => {
                                            if (route?.children?.length > 0) {
                                                setSettingsOpen(!settingsOpen);
                                            } else {
                                            }
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: 3,
                                                color: path === route.to ? 'primary' : 'black',
                                            }}
                                            color={path === route.to ? 'blue' : 'black'}
                                        >
                                            {path === route.to ? route.activeIcon : route.icon}
                                        </ListItemIcon>
                                        <p
                                            className={`text-sm ${
                                                path === route.to ? 'font-semibold text-white' : 'text-white'
                                            }`}
                                        >
                                            {route.name}
                                        </p>
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            {route.name === 'Cài đặt' && settingsOpen && (
                                <List component="div" disablePadding>
                                    {route.children.map((child: any) => (
                                        <Link key={`route-to-${child.to}`} to={child.to}>
                                            <ListItem
                                                key={child.id}
                                                disablePadding
                                                sx={{
                                                    display: 'block',
                                                    pl: 4,
                                                }}
                                            >
                                                <ListItemButton
                                                    sx={{
                                                        minHeight: 48,
                                                        mb: 2,
                                                        justifyContent: 'initial',
                                                        px: 4,
                                                        '&:hover': {
                                                            background: 'rgb(41.5, 48, 61) !important',
                                                        },
                                                    }}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 0,
                                                            mr: 3,
                                                            color: path === child.to ? 'primary' : 'black',
                                                        }}
                                                        color={path === child.to ? 'blue' : 'black'}
                                                    >
                                                        {path === child.to ? child.activeIcon : child.icon}
                                                    </ListItemIcon>
                                                    <p
                                                        className={`text-sm ${
                                                            path === child.to ? 'font-semibold text-white' : 'text-white'
                                                        }`}
                                                    >
                                                        {child.name}
                                                    </p>
                                                </ListItemButton>
                                            </ListItem>
                                        </Link>
                                    ))}
                                </List>
                            )}
                        </div>
                    ))}
                </List>
                <Divider/>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <DrawerHeader/>
                {content}
            </Box>
        </Box>
    );
}
