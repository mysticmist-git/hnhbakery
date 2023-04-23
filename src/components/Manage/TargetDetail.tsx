import CustomInput from '@/components/CustomInput';
import { CollectionObj } from '@/pages/manager/manage';
import { CrudTarget } from '@/pages/manager/manageTargets';
import { Theme } from '@emotion/react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import React from 'react';

export interface TargetDetailProps {
  sx?: SxProps<Theme>;
  // references: ReferenceDocs[];
  detail: CrudTarget;
  value: any;
  setValue: any;
}

const StyledDiv = styled('div')((props: TargetDetailProps) => props.sx as any);

const TargetDetail = React.forwardRef<HTMLDivElement, TargetDetailProps>(
  function TargetDetail(props, ref) {
    const { sx, ...other } = props;
    return (
      <StyledDiv ref={ref} sx={sx} {...other}>
        <Typography variant="h6">{other.detail.name}</Typography>
        {other.detail.fieldInfos.map((fieldInfo) =>
          fieldInfo.column.field !== 'id'
            ? CustomInput(fieldInfo, other.value, other.setValue)
            : null,
        )}
      </StyledDiv>
    );
  },
);

export default TargetDetail;
