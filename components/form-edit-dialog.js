import { useState, useMemo } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import { Autocomplete, Box, InputLabel, MenuItem, Select } from "@mui/material";
import OrderItemService from "@/services/OrderItemService";
import { useMenuItems } from "@/hooks/useMenuItems";

export default function FormEditDialog(props) {
  const [menuCode, setMenuCode] = useState(props.menuCode);
  const [name, setName] = useState(props.item.name);
  const [drink, setDrink] = useState(props.item.drink);
  const [size, setSize] = useState(props.item.size);
  const [open, setOpen] = useState(false);
  const { drinkOptions } = useMenuItems(menuCode);

  // Find the current drink object from options
  const currentDrinkOption = useMemo(() => {
    return drinkOptions.find(option => option.itemName === drink) || null;
  }, [drinkOptions, drink]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (evt) => {
    setName(evt.target.value);
  };

  const handleDrinkChange = (evt, newValue) => {
    setDrink(newValue?.itemName);
  };

  const handleSizeChange = (evt) => {
    setSize(evt.target.value);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    let orderItem = {
      id: props.item.id,
      orderCode: props.item.orderCode,
      name: name,
      drink: drink,
      size: size,
    };
    await OrderItemService.updateOrderItems(orderItem);
    await props.rFunc();
    setOpen(false);
  };

  return (
    <div>
      <EditIcon variant="outlined" onClick={handleClickOpen}></EditIcon>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Cập nhật nước của bạn!</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Cho xin cái tên"
            type="string"
            fullWidth
            variant="standard"
            defaultValue={name}
            onChange={handleNameChange}
          />
          <Box sx={{ height: 10 }}></Box>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={drinkOptions}
            getOptionLabel={(option) => option.itemName || ''}
            sx={{ width: 400 }}
            onChange={handleDrinkChange}
            value={currentDrinkOption}
            renderInput={(params) => (
              <TextField {...params} label="Bạn uống món gì" />
            )}
          />
          <InputLabel id="demo-simple-select-label">Size nước</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={size}
            label="Size nước"
            sx={{ width: 400 }}
            onChange={handleSizeChange}
          >
            <MenuItem value="S">S</MenuItem>
            <MenuItem value="M">M</MenuItem>
            <MenuItem value="L">L</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleSubmit}>Cập nhật</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
