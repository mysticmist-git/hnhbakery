import BranchTable from '@/components/branches/BranchTable/BranchTable';
import EditModal from '@/components/branches/MyModal/EditModal';
import ModalState from '@/components/branches/MyModal/ModalState';
import MyModal from '@/components/branches/MyModal/MyModal';
import MyModalAdd from '@/components/branches/MyModal/MyModalAdd';
import { TableActionButton } from '@/components/buttons';
import { getBranchTableRows, getBranches } from '@/lib/DAO/branchDAO';
import { getUser } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
import Branch, { BranchTableRow } from '@/models/branch';
import { Add, RestartAlt } from '@mui/icons-material';
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

const Branches = () => {
  const [branches, setBranches] = useState<BranchTableRow[]>([]);
  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  const fetchData = useCallback(async () => {
    try {
      setBranches(await getBranchTableRows());
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  console.log(branches);

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

  //#region Modal Add
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [contentAdd, setContentAdd] = useState<Branch | null>(null);
  const handleOpenModalAdd = () => setOpenModalAdd(true);
  const handleCloseModalAdd = () => {
    setOpenModalAdd(false);
    fetchData();
  };

  const handleViewModalAdd = (value: Branch | null) => {
    handleOpenModalAdd();
  };
  //#endregion
  return (
    <>
      <Box
        component={'div'}
        width={'100%'}
        sx={{ p: 2, pr: 3, overflow: 'hidden' }}
      >
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
            <Box
              component={'div'}
              sx={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 1,
              }}
            >
              <TableActionButton
                startIcon={<RestartAlt />}
                onClick={async () => {
                  await fetchData();
                  handleSnackbarAlert('success', 'Tải lại thành công!');
                }}
                sx={{
                  px: 2,
                }}
              >
                Tải lại
              </TableActionButton>

              <TableActionButton
                startIcon={<Add />}
                variant="contained"
                onClick={() => handleViewModalAdd(contentAdd)}
              >
                Thêm
              </TableActionButton>

              {/* Modal thêm*/}
              <MyModalAdd
                open={openModalAdd}
                handleClose={handleCloseModalAdd}
                branch={contentAdd}
              />
            </Box>
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
