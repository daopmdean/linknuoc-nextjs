import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { updateOrderItems } from "../services/OrderItemService";
import EditIcon from "@mui/icons-material/Edit";

export default function FormEditDialog(props) {
  const [name, setName] = React.useState(props.item.name);
  const [drink, setDrink] = React.useState(props.item.drink);
  const [size, setSize] = React.useState(props.item.size);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (evt) => {
    setName(evt.target.value);
  };

  const handleDrinkChange = (evt) => {
    setDrink(evt.target.value);
  };

  const handleSizeChange = (evt) => {
    setSize(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    updateOrderItems({
      id: props.item.id,
      order_code: props.item.order_code,
      name: name,
      drink: drink,
      size: size,
    });
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
          <TextField
            autoFocus
            margin="dense"
            id="drink"
            label="Bạn uống món gì"
            type="string"
            fullWidth
            variant="standard"
            defaultValue={drink}
            onChange={handleDrinkChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="size"
            label="Size nước"
            type="string"
            fullWidth
            variant="standard"
            defaultValue={size}
            onChange={handleSizeChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleSubmit}>Thêm dô</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
