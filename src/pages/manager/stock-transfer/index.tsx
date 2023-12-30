import CreateBatchImport from '@/components/StockTransfer/CreateImport';
import { CanNotAccess } from '@/components/cannotAccess/CanNotAccess';
import { auth } from '@/firebase/config';
import { getBranchByManager } from '@/lib/DAO/branchDAO';
import { getUserByUid } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
import Branch from '@/models/branch';
import User from '@/models/user';
import { Tab, Tabs } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { PropsWithChildren, useEffect, useState } from 'react';

export default function BatchTransfer() {
  //#region Tabs

  const [tab, setTab] = useState(0);

  //#endregion
  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();

  //#endregion
  //#region Client Authorization & Branch Data

  const [branch, setBranch] = useState<Branch | null>(null);
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
    async function fetchData() {
      if (!userData) {
        return;
      }
      getBranchByManager(userData).then((branch) => {
        if (branch) {
          setBranch(branch);
        }
      });
    }

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
            <CreateBatchImport branchId={branch?.id} userData={userData} />
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
