import BranchTable from '@/components/branches/BranchTable/BranchTable';
import EditModal from '@/components/branches/MyModal/EditModal';
import ModalState from '@/components/branches/MyModal/ModalState';
import MyModal from '@/components/branches/MyModal/MyModal';
import { getBranchTableRows, getBranches } from '@/lib/DAO/branchDAO';
import { getUser } from '@/lib/DAO/userDAO';
import { BranchTableRow } from '@/models/branch';
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

const Branches = () => {
  const [branches, setBranches] = useState<BranchTableRow[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setBranches(await getBranchTableRows());
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleBranchDataChange = (value: BranchTableRow) => {
    setBranches(
      branches.map((branch) => (branch.id === value.id ? value : branch))
    );
  };

  //#region  Modal chi tiết
  const [openModalChiTiet, setOpenModalChiTiet] = useState(false);
  const [currentViewBranch, setCurrentViewBranch] =
    useState<BranchTableRow | null>(null);

  const handleOpenModalChiTiet = () => setOpenModalChiTiet(true);
  const handleCloseModalChiTiet = () => setOpenModalChiTiet(false);

  const handleViewBranchModalChiTiet = (value: BranchTableRow) => {
    handleOpenModalChiTiet();
    setCurrentViewBranch(() => value);
  };
  //#endregion

  //#region Modal Edit
  const [openEditModal, setOpenEditModal] = useState(false);
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const [editBranch, setEditBranch] = useState<BranchTableRow | null>(null);

  const handleViewBranchModalEdit = (value: BranchTableRow) => {
    handleOpenEditModal();
    setEditBranch(() => value);
  };

  const handleChangeBranch = (value: BranchTableRow) => {
    setBranches(
      branches.map((branch) => (branch.id === value.id ? value : branch))
    );
  };
  //#endregion

  //#region Modal state
  const [openModalState, setOpenModalState] = useState(false);
  const handleOpenModalState = () => setOpenModalState(true);
  const handleCloseModalState = () => setOpenModalState(false);

  const [branchState, setBranchState] = useState<BranchTableRow | null>(null);

  const handleViewBranchModalState = (feedback: BranchTableRow) => {
    handleOpenModalState();
    setBranchState(() => feedback);
  };
  //#endregion

  return (
    <>
      <Box width={'100%'} sx={{ p: 2, pr: 3, overflow: 'hidden' }}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.common.black }} variant="h4">
              Quản lý chi nhánh
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <BranchTable
              branchData={branches}
              handleViewBranch={handleViewBranchModalChiTiet}
              handleViewBranchModalEdit={handleViewBranchModalEdit}
              handleViewBranchModalState={handleViewBranchModalState}
            />

            {/* Modal chi tiết */}
            <MyModal
              open={openModalChiTiet}
              handleClose={handleCloseModalChiTiet}
              branch={currentViewBranch}
            />

            {/* Modal edit */}
            <EditModal
              open={openEditModal}
              handleClose={handleCloseEditModal}
              branch={editBranch}
              handleChangeBranch={handleChangeBranch}
            />

            {/* Modal state */}
            <ModalState
              open={openModalState}
              handleClose={handleCloseModalState}
              branchState={branchState}
              setBranchState={setBranchState}
              handleBranchDataChange={handleBranchDataChange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default Branches;
