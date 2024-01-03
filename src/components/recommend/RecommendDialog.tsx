import CustomerReference from '@/models/CustomerReference';
import Product, { ProductTableRow } from '@/models/product';
import { Box, Button, Dialog, Slide, Stack, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useRouter } from 'next/router';
import React from 'react';
import useRecommendVariants, {
  RecommendCardType,
} from './useRecommendVariants';
import { RecommendCard } from './RecommendCard';
export const hong = '#FE6B8B';
export const cam = '#FF8E53';
export const gradientReconmend = `linear-gradient(45deg, ${hong} 30%, ${cam} 90%)`;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function RecommendDialog({
  open,
  handleClose,
  customerReferenceData,
}: {
  open: boolean;
  handleClose: () => void;
  customerReferenceData?: CustomerReference;
}) {
  const router = useRouter();

  const displayVariant: RecommendCardType[] = useRecommendVariants(
    customerReferenceData
  );

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      slotProps={{
        backdrop: {
          sx: {
            background: 'rgba(0,0,0,0.7)',
          },
        },
      }}
      PaperProps={{
        sx: {
          bgcolor: 'primary.main',
          borderRadius: '24px',
          minWidth: '900px',
        },
      }}
    >
      <Stack direction={'column'}>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            py: 1,
            background: gradientReconmend,
            color: 'white',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          Sản phẩm dành cho bạn
        </Typography>

        <Stack direction={'column'} spacing={2}>
          <Stack
            direction={'row'}
            sx={{ height: '80dvh', overflow: 'auto', p: 4, py: 2 }}
            flexWrap={'wrap'}
            justifyContent={!customerReferenceData ? 'center' : 'flex-start'}
            alignItems={'stretch'}
          >
            {!customerReferenceData && (
              <Box
                component={'div'}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography
                  variant="body2"
                  textAlign={'center'}
                  fontWeight={'medium'}
                  fontStyle={'italic'}
                  sx={{
                    width: '100%',
                    color: 'grey.700',
                  }}
                >
                  Vui lòng tham gia khảo sát trước!
                </Typography>

                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => router.push('/customer-reference')}
                  sx={{
                    borderRadius: '100px',
                    background: gradientReconmend,
                  }}
                >
                  Tham gia
                </Button>
              </Box>
            )}

            {customerReferenceData && (
              <>
                <Typography
                  variant="body2"
                  textAlign={'center'}
                  fontWeight={'medium'}
                  fontStyle={'italic'}
                  sx={{
                    width: '100%',
                    color: 'grey.700',
                    my: 1,
                  }}
                >
                  H&H gợi ý một số sản phẩm dựa trên khảo sát sở thích của bạn!
                </Typography>

                {displayVariant.map((item, index) => (
                  <Box
                    component={'div'}
                    sx={{
                      width: 'calc(100%/3)',
                      p: 1,
                    }}
                    key={index}
                  >
                    <RecommendCard item={item} />
                  </Box>
                ))}
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default RecommendDialog;
