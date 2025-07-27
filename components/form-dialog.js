import { useState, useMemo } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, Box, InputLabel, MenuItem, Select } from "@mui/material";
import OrderItemService from "../services/OrderItemService";
import { phucLongDrinks, theCoffeHouseDrinks, katinatDrinks } from "./sample-drinks";

export default function FormDialog({ orderCode, menuCode, rFunc }) {
  const [name, setName] = useState("");
  const [drink, setDrink] = useState("");
  const [size, setSize] = useState("");
  const [open, setOpen] = useState(false);

  const drinkOptions = useMemo(() => {
    switch (menuCode) {
      case "phuclong":
        return phucLongDrinks;
      case "thecoffeehouse":
        return theCoffeHouseDrinks;
      case "katinat":
        return katinatDrinks;
      default:
        return []; // fallback nếu không khớp gì
    }
  }, [menuCode]);

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
    await OrderItemService.createOrderItems({
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
            nhỏ. And his/her father,...
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
            options={drinkOptions}
            getOptionLabel={(option) => option.itemName}
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
