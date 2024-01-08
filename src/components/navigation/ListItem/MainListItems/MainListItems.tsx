import { auth, db } from '@/firebase/config';
import { getUserByUid } from '@/lib/DAO/userDAO';
import {
  COLLECTION_NAME,
  PERMISSION_ROUTES,
  PermissionCode,
  permissionToCodeMap as permissionEnumToCodeMap,
  permissionRouteMap,
} from '@/lib/constants';
import useGrantedPermissions from '@/lib/hooks/useGrantedPermissions';
import Contact, { contactConverter } from '@/models/contact';
import User from '@/models/user';
import {
  BungalowRounded,
  ChatRounded,
  Check,
  ContactsRounded,
  DiscountRounded,
  HolidayVillageRounded,
  LocalShippingRounded,
  Security,
  UnarchiveRounded,
} from '@mui/icons-material';
import { default as BarChartIcon } from '@mui/icons-material/BarChart';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import { default as PeopleIcon } from '@mui/icons-material/People';
import { default as ShoppingCartIcon } from '@mui/icons-material/ShoppingCart';
import { Badge, SxProps, Typography, useTheme } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { collection, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

//#region Constants

const PATH = '/manager/';

//#endregion

//#endregion

const MainListItemIcon: React.FC<{
  permissionCode: PermissionCode;
  sx: SxProps;
}> = ({ permissionCode, sx }) => {
  switch (permissionCode) {
    case PermissionCode.KHO1:
      return <Inventory2RoundedIcon sx={sx} />;
    case PermissionCode.KHO2:
      return <Inventory2RoundedIcon sx={sx} />;
    case PermissionCode.GH:
      return <LocalShippingRounded sx={sx} />;
    case PermissionCode.KH:
      return <PeopleIcon sx={sx} />;
    case PermissionCode.KM:
      return <DiscountRounded sx={sx} />;
    case PermissionCode.BC:
      return <BarChartIcon sx={sx} />;
    case PermissionCode.LH:
      return <ContactsRounded sx={sx} />;
    case PermissionCode.FB:
      return <ChatRounded sx={sx} />;
    case PermissionCode.PQ:
      return <Security sx={sx} />;
    case PermissionCode.DH:
      return <ShoppingCartIcon sx={sx} />;
    case PermissionCode.CN1:
      return <HolidayVillageRounded sx={sx} />;
    case PermissionCode.CN2:
      return <BungalowRounded sx={sx} />;
    default:
      return <UnarchiveRounded sx={sx} />;
  }
};

type ListItemProps = {
  label: string;
  code: PermissionCode;
  open: boolean;
  isActive: boolean;
  onClick?: () => void;
  iconSxProps: SxProps;
  typographySxProps: SxProps;
};

const ListItem: React.FC<ListItemProps> = ({
  label,
  code,
  open,
  isActive,
  onClick,
  iconSxProps,
  typographySxProps,
}) => {
  const handleClick = React.useCallback(() => {
    onClick && onClick();
  }, [onClick]);

  return (
    <ListItemButton
      sx={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'space-between' : 'center',
      }}
      onClick={handleClick}
    >
      <ListItemIcon
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
        }}
      >
        <MainListItemIcon permissionCode={code} sx={iconSxProps} />
      </ListItemIcon>
      {open && (
        <>
          <ListItemText
            primary={
              <Typography variant="body1" sx={typographySxProps}>
                {label}
              </Typography>
            }
          />
          {isActive && <Check color="secondary" />}
        </>
      )}
    </ListItemButton>
  );
};

type GrantedListItemProps = {
  visible: boolean;
} & ListItemProps;

const GrantedListItem: React.FC<GrantedListItemProps> = ({
  visible,
  ...props
}) => {
  return <>{visible && <ListItem {...props} />}</>;
};

export const MainListItems = ({ open }: { open: boolean }) => {
  //#region Hooks

  const router = useRouter();
  const theme = useTheme();

  const grantedPermissions = useGrantedPermissions();

  const [contacts, cLoading] = useCollectionData<Contact>(
    query(
      collection(db, COLLECTION_NAME.CONTACTS),
      where('isRead', '==', false)
    ).withConverter(contactConverter),
    {
      initialValue: [],
    }
  );

  //#endregion

  //#region UseMemos

  const badgeContact = React.useMemo(() => {
    if (!contacts && cLoading) return;

    return contacts?.length;
  }, [contacts, cLoading]);

  //#endregion

  //#region Callbacks

  const isActive = React.useCallback(
    (route: string) => {
      return router.pathname === `${PATH}${route}`;
    },
    [router.pathname]
  );

  const iconSxProps = React.useCallback(
    (route: string) => {
      const sx = [
        {},
        isActive(route) && {
          color: theme.palette.secondary.main,
        },
      ];

      return sx;
    },
    [isActive, theme.palette.secondary.main]
  );

  const typographySxProps = React.useCallback(
    (route: string) => {
      const sx = [
        { color: theme.palette.text.secondary },
        isActive(route) && {
          color: theme.palette.secondary.main,
          fontWeight: 'bold',
        },
      ];

      return sx;
    },
    [isActive, theme.palette.secondary.main, theme.palette.text.secondary]
  );

  //#endregion

  console.log(grantedPermissions);

  return (
    <React.Fragment>
      {grantedPermissions ? (
        <>
          <GrantedListItem
            label="Kho doanh nghiệp"
            code={PermissionCode.KHO1}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.KHO1) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.KHO1])}
            iconSxProps={iconSxProps('storage')}
            typographySxProps={typographySxProps('storage')}
            open={open}
            isActive={isActive('storage')}
          />

          <GrantedListItem
            label="Chi nhánh"
            code={PermissionCode.CN2}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.CN2) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.CN2])}
            iconSxProps={iconSxProps('branch')}
            typographySxProps={typographySxProps('branch')}
            open={open}
            isActive={isActive('branch')}
          />

          <GrantedListItem
            label="Kho chi nhánh"
            code={PermissionCode.KHO2}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.KHO2) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.KHO2])}
            iconSxProps={iconSxProps('branch-storage')}
            typographySxProps={typographySxProps('branch-storage')}
            open={open}
            isActive={isActive('branch-storage')}
          />

          <GrantedListItem
            label="Đơn hàng"
            code={PermissionCode.DH}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.DH) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.DH])}
            iconSxProps={iconSxProps('orders')}
            typographySxProps={typographySxProps('orders')}
            open={open}
            isActive={isActive('orders')}
          />

          <GrantedListItem
            label="Giao hàng"
            code={PermissionCode.GH}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.GH) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.GH])}
            iconSxProps={iconSxProps('deliveries')}
            typographySxProps={typographySxProps('deliveries')}
            open={open}
            isActive={isActive('deliveries')}
          />

          <GrantedListItem
            label="Lưu thông"
            code={PermissionCode.LT}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.LT) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.LT])}
            iconSxProps={iconSxProps('stock-transfer')}
            typographySxProps={typographySxProps('stock-transfer')}
            open={open}
            isActive={isActive('stock-transfer')}
          />

          <GrantedListItem
            label="Các chi nhánh"
            code={PermissionCode.CN1}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.CN1) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.CN1])}
            iconSxProps={iconSxProps('branches')}
            typographySxProps={typographySxProps('branches')}
            open={open}
            isActive={isActive('branches')}
          />

          <GrantedListItem
            label="Khách hàng"
            code={PermissionCode.KH}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.KH) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.KH])}
            iconSxProps={iconSxProps('customers')}
            typographySxProps={typographySxProps('customers')}
            open={open}
            isActive={isActive('customers')}
          />

          <GrantedListItem
            label="Khuyến mãi"
            code={PermissionCode.KM}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.KM) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.KM])}
            iconSxProps={iconSxProps('sales')}
            typographySxProps={typographySxProps('sales')}
            open={open}
            isActive={isActive('sales')}
          />

          <GrantedListItem
            label="Báo cáo"
            code={PermissionCode.BC}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.BC) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.BC])}
            iconSxProps={iconSxProps('reports')}
            typographySxProps={typographySxProps('reports')}
            open={open}
            isActive={isActive('reports')}
          />

          <GrantedListItem
            label="Liên hệ"
            code={PermissionCode.LH}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.LH) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.LH])}
            iconSxProps={iconSxProps('contacts')}
            typographySxProps={typographySxProps('contacts')}
            open={open}
            isActive={isActive('contacts')}
          />

          <GrantedListItem
            label="Phản hồi"
            code={PermissionCode.FB}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.FB) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.FB])}
            iconSxProps={iconSxProps('feedbacks')}
            typographySxProps={typographySxProps('feedbacks')}
            open={open}
            isActive={isActive('feedbacks')}
          />

          <GrantedListItem
            label="Phân quyền"
            code={PermissionCode.PQ}
            visible={grantedPermissions.includes(
              permissionEnumToCodeMap.get(PermissionCode.PQ) ?? ''
            )}
            onClick={() => router.push(PERMISSION_ROUTES[PermissionCode.PQ])}
            iconSxProps={iconSxProps('authorize')}
            typographySxProps={typographySxProps('authorize')}
            open={open}
            isActive={isActive('authorize')}
          />
        </>
      ) : (
        <p>Lỗi: Không tải được quyền</p>
      )}
    </React.Fragment>
  );
};

export default MainListItems;
