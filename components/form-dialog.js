import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { createOrderItems } from "../services/OrderItemService";

export default function FormDialog({ orderCode, rFunc }) {
  const [name, setName] = useState("");
  const [drink, setDrink] = useState("");
  const [size, setSize] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (evt) => {
    setName(evt.target.value);
    console.log(evt.target.value);
  };

  const handleDrinkChange = (evt) => {
    setDrink(evt.target.value);
    console.log(evt.target.value);
  };

  const handleSizeChange = (evt) => {
    setSize(evt.target.value);
    console.log(evt.target.value);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    await createOrderItems({
      order_code: orderCode,
      name: name,
      drink: drink,
      size: size,
    });
    await rFunc();
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Thêm ly nước coi
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Điền thông tin vào nhé!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sữa mẹ là thức ăn tốt nhất cho sự phát triển của trẻ sơ sinh và trẻ
            nhỏ. Và ba của đứa trẻ,...
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Cho xin cái tên"
            type="string"
            fullWidth
            variant="standard"
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
