import { MyMultiValuePickerInput } from '@/components/Inputs';
import { ProductVariant } from '@/lib/models/Product';
import formatPrice from '@/lib/utilities/formatCurrency';
import { Delete, Edit, Remove } from '@mui/icons-material';
import {
  Button,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  styled,
} from '@mui/material';
import { useState } from 'react';

type VariantItemReferences = {
  sizes: string[];
};

type VariantItemProps = {
  variant: ProductVariant;
  onRemove: (variant: ProductVariant) => void;
  onUpdate: (variant: ProductVariant) => void;
  references: VariantItemReferences;
  readOnly?: boolean;
  disabled?: boolean;
};

const RemoveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const EditableTextField = styled(TextField)({
  width: '100%',
  marginTop: '8px',
});

function VariantItem(props: VariantItemProps) {
  const { variant, onRemove, onUpdate } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedVariant, setEditedVariant] = useState(variant);

  function handleEdit() {
    setIsEditing(true);
    setEditedVariant(variant);
  }

  function handleSave() {
    setIsEditing(false);
    onUpdate(editedVariant);
  }

  function handleCancel() {
    setIsEditing(false);
    setEditedVariant(variant);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setEditedVariant((prevVariant) => ({ ...prevVariant, [name]: value }));
  }

  function handleSizeChange(size: string) {
    if (size)
      setEditedVariant((prevVariant) => ({ ...prevVariant, size: size }));
  }

  return (
    <ListItem
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0',
        padding: '12px 16px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#f8f8f8',
        },
      }}
    >
      {isEditing ? (
        <>
          <Stack spacing={1}>
            <EditableTextField
              label="Vật liệu"
              name="material"
              size="small"
              value={editedVariant.material}
              onChange={handleInputChange}
              sx={{ fontWeight: 'bold' }}
            />
            <ToggleButtonGroup
              onChange={(e, newSize) => handleSizeChange(newSize)}
              exclusive
              value={editedVariant.size}
              aria-label="product-variant-sizes"
            >
              {props.references.sizes.map((size) => (
                <ToggleButton key={size} value={size}>
                  {size}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <EditableTextField
              label="Giá"
              size="small"
              name="price"
              type="number"
              value={editedVariant.price}
              onChange={handleInputChange}
            />
          </Stack>
          <Stack direction="row" spacing={1} marginLeft={2}>
            <Button
              variant="contained"
              onClick={handleSave}
              style={{ marginRight: '8px' }}
            >
              Lưu
            </Button>
            <Button variant="contained" onClick={handleCancel}>
              Hủy
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <ListItemText
            primary={`${variant.material} - ${variant.size}`}
            secondary={formatPrice(variant.price)}
            sx={{
              fontWeight: 'bold',
              fontSize: '1.2rem',
              lineHeight: 1.2,
              marginRight: 'auto',
            }}
          />
          {!props.readOnly && (
            <div>
              <Button
                variant="contained"
                onClick={handleEdit}
                style={{ marginRight: '8px' }}
                startIcon={<Edit />}
              >
                Sửa
              </Button>
              <RemoveButton
                variant="contained"
                onClick={() => onRemove(variant)}
                startIcon={<Delete />}
              >
                Xóa
              </RemoveButton>
            </div>
          )}
        </>
      )}
    </ListItem>
  );
}

export default VariantItem;
