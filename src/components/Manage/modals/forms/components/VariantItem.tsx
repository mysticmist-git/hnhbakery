import { ProductVariant } from '@/lib/models/Product';
import formatPrice from '@/lib/utilities/formatCurrency';
import { Delete, Edit, Remove } from '@mui/icons-material';
import { Button, ListItem, ListItemText, styled } from '@mui/material';
import { useState } from 'react';

type VariantItemProps = {
  variant: ProductVariant;
  onRemove: (variant: ProductVariant) => void;
  onUpdate: (variant: ProductVariant) => void;
};

const RemoveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

function VariantItem(props: VariantItemProps) {
  const { variant, onRemove, onUpdate } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedVariant, setEditedVariant] = useState(variant);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedVariant(variant);
  };

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(editedVariant);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedVariant(variant);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedVariant((prevVariant) => ({ ...prevVariant, [name]: value }));
  };

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
          <ListItemText
            primary={
              <>
                <input
                  type="text"
                  name="material"
                  value={editedVariant.material}
                  onChange={handleInputChange}
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    width: '100%',
                  }}
                />
                <input
                  type="text"
                  name="size"
                  value={editedVariant.size}
                  onChange={handleInputChange}
                  style={{ fontSize: '1rem', width: '100%' }}
                />
              </>
            }
            secondary={
              <input
                type="number"
                name="price"
                value={editedVariant.price}
                onChange={handleInputChange}
                style={{ fontSize: '1rem', width: '100%' }}
              />
            }
          />
          <div>
            <Button
              variant="contained"
              onClick={handleSave}
              style={{ marginRight: '8px' }}
            >
              Save
            </Button>
            <Button variant="contained" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
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
        </>
      )}
    </ListItem>
  );
}

export default VariantItem;
