import { useState, useMemo } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OrderItemService from "../services/OrderItemService";

import { Autocomplete, Box, InputLabel, MenuItem, Select } from "@mui/material";

export const phucLongDrinks = [
  { label: "Silky Bưởi Ô Long Lài", year: 1994 },
  { label: "Lục Trà Sữa Tân Cương Thạch Konjac", year: 1994 },
  { label: "Lục Trà Tân Cương Mận Đỏ", year: 1994 },
  { label: "Trà Bưởi Ô Long Lài", year: 1994 },
  { label: "Trà Sữa Ô Long Lài Thạch Konjac", year: 1994 },

  { label: "Trà Sữa Phúc Long", year: 1993 },
  { label: "Trà Sữa Bá Tước", year: 1993 },
  { label: "Trà Vải Sen", year: 2001 },
  { label: "Trà Nhãn Lài", year: 1994 },
  { label: "Trà Ô Long Dâu", year: 1994 },
  { label: "Trà Sữa Matcha", year: 2003 },

  { label: "Hồng Trà Chanh", year: 1994 },
  { label: "Hồng Trà Đào Sữa", year: 1966 },
  { label: "Hồng Trà Đác Cam Đá Xay", year: 2003 },
  { label: "Hồng Trà Sữa", year: 1974 },
  { label: "Hồng Trà Đào", year: 1957 },

  { label: "Lucky Tea", year: 1972 },
  { label: "Trà Lài Đác Thơm", year: 1999 },
  { label: "Trà Ô Long Dừa Caramel", year: 1974 },
  { label: "Trà Ô Long Sữa", year: 2003 },
  { label: "Trà Ô Long Mãng Cầu", year: 1957 },
  { label: "Cappuccino", year: 1994 },

  { label: "Sữa Chua Phúc Bồn Tử Đác Cam", year: 1957 },
  { label: "Sữa Chua Xoài Đác Thơm", year: 1993 },

  // { label: "Hồng Trà Caramel Dừa Đá Xay", year: 1994 },
  // { label: "Hồng Trà Sữa Caramel", year: 1972 },
  // { label: "Chanh Đá Xay", year: 1999 },
  // { label: "Matcha Đá Xay", year: 2001 },
  // { label: "Oreo Cà Phê Sữa Đá Xay", year: 1994 },
  // { label: "Trà Sữa Berry Berry", year: 1974 },
  // { label: "Trà Đào Đá Xay", year: 2008 },

  // { label: "Hoa Tuyết Berry Berry", year: 1966 },
  // { label: "Latte", year: 1999 },
  // { label: "Phin Sữa Đá", year: 2001 },
  // { label: "Phin Đen Đá", year: 1966 },
  // { label: "Vanilla Latte", year: 2008 },
  // { label: "Nhãn Đá Xay", year: 2008 },
  // { label: "Cà Phê Đá Xay", year: 1972 },
];

export const theCoffeHouseDrinks = [
  { label: "Latte Almond", year: null },
  { label: "Latte Caramel", year: null },
  { label: "Latte Hazelnut", year: null },
  { label: "Latte Coconut", year: null },
  { label: "Latte Bạc Xỉu", year: null },
  { label: "Latte Classic", year: null },
  { label: "Americano Nóng", year: null },
  { label: "Cappuccino Nóng", year: null },
  { label: "Cappuccino Đá", year: null },
  { label: "Caramel Macchiato Nóng", year: null },
  { label: "Caramel Macchiato Đá", year: null },
  { label: "Espresso Nóng", year: null },
  { label: "Latte Nóng", year: null },
  { label: "Đường Đen Sữa Đá", year: null },
  { label: "The Coffee House Sữa Đá", year: null },
  { label: "Bạc Xỉu", year: null },
  { label: "Bạc Xỉu Nóng", year: null },
  { label: "Cà Phê Đen Nóng", year: null },
  { label: "Cà Phê Sữa Nóng", year: null },
  { label: "Cà Phê Đen Đá", year: null },
  { label: "Cà Phê Sữa Đá", year: null },
  { label: "A‑Mê Classic", year: null },
  { label: "A‑Mê Đào", year: null },
  { label: "A‑Mê Mơ", year: null },
  { label: "A‑Mê Quất", year: null },
  { label: "A‑Mê Tuyết Đào", year: null },
  { label: "A‑Mê Tuyết Mơ", year: null },
  { label: "A‑Mê Tuyết Quất", year: null },
  { label: "Dâu Phô Mai", year: null },
  { label: "Oolong Tứ Quý Sen (Nóng)", year: null },
  { label: "Oolong Tứ Quý Sen", year: null },
  { label: "Oolong Tứ Quý Dâu Trân Châu", year: null },
  { label: "Oolong Tứ Quý Kim Quất Trân Châu", year: null },
  { label: "Oolong Tứ Quý Vải", year: null },
  { label: "Hi‑Tea Đào Kombucha", year: null },
  { label: "Hi‑Tea Yuzu Kombucha", year: null },
  { label: "Hi‑Tea Yuzu Trân Châu", year: null },
  { label: "Hi‑Tea Vải", year: null },
  { label: "Hi‑Tea Đào", year: null },
  { label: "Trà Sữa Oolong Nướng Sương Sáo", year: null },
  { label: "Trà Sữa Oolong Tứ Quý Sương Sáo", year: null },
  { label: "Hồng Trà Sữa Nóng", year: null },
  { label: "Hồng Trà Sữa Trân Châu", year: null },
  { label: "Trà Đen Macchiato", year: null },
  { label: "Trà Sữa Oolong BLao", year: null },
  { label: "Matcha Latte Tây Bắc (Nóng)", year: null },
  { label: "Frappe Hazelnut", year: null },
  { label: "Frappe Choco Chip", year: null },
  { label: "Frosty Bánh Kem Dâu", year: null },
  { label: "Frosty Trà Xanh", year: null },
  { label: "Frosty Cà Phê Đường Đen", year: null },
  { label: "Mochi Kem Trà Sữa Trân Châu", year: null },
  { label: "Mochi Kem Phúc Bồn Tử", year: null },
  { label: "Mochi Kem Việt Quất", year: null },
  { label: "Mochi Kem Chocolate", year: null },
  { label: "Mochi Kem Matcha", year: null },
  { label: "Mousse Tiramisu", year: null },
  { label: "Mousse Gấu Chocolate", year: null },
  { label: "Butter Croissant", year: null },
  { label: "Choco Croffle", year: null },
  { label: "Pate Chaud", year: null },
  { label: "Cà Phê Đen Đá Hộp (14 gói x 16g)", year: null },
  { label: "Cà Phê Sữa Đá Hòa Tan Túi 25x22G", year: null },
  { label: "Cà Phê Sữa Đá Hòa Tan (10 gói x 22g)", year: null },
  { label: "Cà Phê Rang Xay Original 1 250G", year: null },
];

export const katinatDrinks = [
  // CÀ PHÊ PHIN MÊ
  { label: "Mê Sữa Đá", year: null },
  { label: "Mê Đen Đá", year: null },
  { label: "Mê Xỉu", year: null },
  { label: "Mê Dừa Non", year: null },

  // CÀ PHÊ ESPRESSO
  { label: "Espresso Sữa Đá", year: null },
  { label: "Espresso Đen Đá", year: null },
  { label: "Latte Baba NANA", year: null },
  { label: "Latte Hạt Phỉ", year: null },
  { label: "Latte Nguyên Bản", year: null },
  { label: "Americano", year: null },

  // PHONG VỊ MỚI
  { label: "IKI Matcha Tàu Hũ", year: null },
  { label: "IKI Matcha Latte", year: null },
  { label: "Bơ Già Dừa Non", year: null },
  { label: "Taro Coco", year: null },
  { label: "Dâu Lắc Phô Mai", year: null },
  { label: "Huyền Châu Đường Mật", year: null },
  { label: "Sô-Cô-La Katinat", year: null },

  // TRÀ SỮA ĐẬM VỊ
  { label: "Trà Sữa Chôm Chôm", year: null },
  { label: "Oolong Bảo Lạc", year: null },
  { label: "Trà Sữa Oolong Nướng", year: null },

  // TRÀ TRÁI CÂY
  { label: "Hibi Sơ Ri", year: null },
  { label: "Cốc Cốc Đặc Đắc", year: null },
  { label: "Trà Oolong Dâu Mai Sơn", year: null },
  { label: "Trà Đào Hồng Dài", year: null },
  { label: "Trà Cam Quế Hồng Dài", year: null },
  { label: "Trà Vải", year: null },
  { label: "Trà Hoa Cúc Mật Ong", year: null },
];

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
    setDrink(newValue?.label);
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
