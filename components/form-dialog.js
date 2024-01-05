import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { createOrderItems } from "../services/OrderItemService";
import { Autocomplete, Box, InputLabel, MenuItem, Select } from "@mui/material";

export const phucLongDrinks = [
  { label: "Hồng Trà Caramel Dừa Đá Xay", year: 1994 },
  { label: "Hồng Trà Sữa Caramel", year: 1972 },
  { label: "Trà Ô Long Dừa Caramel", year: 1974 },
  { label: "Nhãn Đá Xay", year: 2008 },
  { label: "Trà Ô Long Mãng Cầu", year: 1957 },
  { label: "Hồng Trà Chanh", year: 1994 },
  {
    label: "Trà Sữa Matcha",
    year: 2003,
  },
  { label: "Hồng Trà Đào Sữa", year: 1966 },
  { label: "Chanh Đá Xay", year: 1999 },
  {
    label: "Matcha Đá Xay",
    year: 2001,
  },
  { label: "Oreo Cà Phê Sữa Đá Xay", year: 1994 },
  { label: "Cà Phê Đá Xay", year: 1972 },
  { label: "Trà Sữa Berry Berry", year: 1974 },
  { label: "Trà Đào Đá Xay", year: 2008 },
  { label: "Sữa Chua Phúc Bồn Tử Đác Cam", year: 1957 },
  { label: "Sữa Chua Xoài Đác Thơm", year: 1993 },
  { label: "Cappuccino", year: 1994 },
  {
    label: "Hồng Trà Đác Cam Đá Xay",
    year: 2003,
  },
  { label: "Hoa Tuyết Berry Berry", year: 1966 },
  { label: "Latte", year: 1999 },
  {
    label: "Phin Sữa Đá",
    year: 2001,
  },
  { label: "Phin Đen Đá", year: 1966 },
  { label: "Trà Lài Đác Thơm", year: 1999 },
  {
    label: "Trà Nhãn Sen",
    year: 2001,
  },
  { label: "Trà Vải Lài", year: 1994 },
  { label: "Lucky Tea", year: 1972 },
  { label: "Hồng Trà Sữa", year: 1974 },
  { label: "Vanilla Latte", year: 2008 },
  { label: "Hồng Trà Đào", year: 1957 },
  { label: "Trà Sữa Phúc Long", year: 1993 },
  { label: "Trà Ô Long Dâu", year: 1994 },
  {
    label: "Trà Ô Long Sữa",
    year: 2003,
  },
];

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
  };

  const handleDrinkChange = (evt, newValue) => {
    setDrink(newValue?.label);
  };

  const handleSizeChange = (evt) => {
    setSize(evt.target.value);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    await createOrderItems({
      orderCode,
      name,
      drink,
      size,
    });
    await rFunc();
    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
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
            sx={{ width: 400 }}
            onChange={handleNameChange}
          />
          <Box sx={{ height: 10 }}></Box>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={phucLongDrinks}
            sx={{ width: 400 }}
            onChange={handleDrinkChange}
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
          <Button onClick={handleSubmit} type="submit">
            Thêm dô
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
