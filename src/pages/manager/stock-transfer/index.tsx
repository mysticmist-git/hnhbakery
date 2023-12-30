import { CanNotAccess } from '@/components/cannotAccess/CanNotAccess';
import { auth } from '@/firebase/config';
import { getBranchByManager } from '@/lib/DAO/branchDAO';
import { getUserByUid } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
import User from '@/models/user';
import { Box, Button, Grid, Tab, Tabs } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';

export default function StockTransfer() {
  //#region Tabs

  const [tab, setTab] = useState(0);

  //#endregion
  //#region Other service hooks

  const handleSnackbarAlert = useSnackbarService();
  const router = useRouter();

  //#endregion
  //#region Client Authorization

  const [userData, setUserData] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUserData(null);
        return;
      }

      getUserByUid(user.uid)
        .then((user) => setUserData(user ?? null))
        .catch(() => setUserData(null));
    });

    return () => {
      unsubscribe();
    };
  }, [handleSnackbarAlert]);

  const [canBeAccessed, setCanBeAccessed] = useState<boolean | undefined>();
  useEffect(() => {
    async function checkUserAccess(userData: User): Promise<boolean> {
      try {
        const branch = await getBranchByManager(userData);

        if (!branch) {
          setCanBeAccessed(false);
          return false;
        }
        setCanBeAccessed(true);
        return true;
      } catch {
        setCanBeAccessed(false);
        return true;
      }
    }
    async function fetchData() {}

    if (!userData) {
      return;
    }

    checkUserAccess(userData)
      .then((canAccess) => {
        if (canAccess) fetchData();
      })
      .catch((canAccess) => {
        if (canAccess) fetchData();
      });
  }, [userData]);

  //#endregion
  //#region Create new transfer

  const openCreateNewExport = useCallback(
    function () {
      router.push('/manager/stock-transfer/create-export');
    },
    [router]
  );
  const openCreateNewImport = useCallback(
    function () {
      router.push('/manager/stock-transfer/create-import');
    },
    [router]
  );

  //#endregion

  return (
    <>
      {canBeAccessed ? (
        <>
          <Tabs
            centered
            value={tab}
            onChange={(_, value) => setTab(value)}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label="Nhập hàng" />
            <Tab label="Xuất hàng" />
          </Tabs>
          <TabPanel value={tab} index={0}>
            <p>Hello</p>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <p>Hello 2</p>
          </TabPanel>
        </>
      ) : (
        <CanNotAccess />
      )}
    </>
  );
}

function TabPanel({
  children,
  value,
  index,
}: PropsWithChildren<{ value: number; index: number }>) {
  return <>{value === index && children}</>;
}
