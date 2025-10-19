import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Autocomplete,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import OrderItemService from "@/src/services/OrderItemService";

export default function FormDialog({ orderCode, drinkOptions, rFunc }) {
  const [name, setName] = useState("");
  const [drink, setDrink] = useState("");
  const [size, setSize] = useState("");
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        maxWidth={isMobile ? false : "sm"}
        fullWidth
        slotProps={{
          sx: {
            margin: isMobile ? 0 : 2,
            width: isMobile ? "100%" : "auto",
            height: isMobile ? "100%" : "auto",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: isMobile ? "1.2rem" : "1.5rem",
            padding: isMobile ? "16px" : "24px",
          }}
        >
          Điền thông tin vào nhé!
        </DialogTitle>
        <DialogContent
          sx={{
            padding: isMobile ? "8px 16px" : "20px 24px",
          }}
        >
          <DialogContentText
            sx={{
              fontSize: isMobile ? "0.875rem" : "1rem",
              marginBottom: 2,
            }}
          >
            Sữa mẹ là thức ăn tốt nhất cho sự phát triển của trẻ sơ sinh và trẻ
            nhỏ. And his/her father,...
          </DialogContentText>
          <InputLabel
            id="demo-simple-select-label"
            sx={{
              fontSize: isMobile ? "0.875rem" : "1rem",
              marginBottom: 1,
            }}
          >
            Nhập tên bạn đi nào
          </InputLabel>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Cho xin cái tên"
            type="string"
            fullWidth
            variant="outlined"
            onChange={handleNameChange}
            sx={{
              marginBottom: 2,
              "& .MuiInputLabel-root": {
                fontSize: isMobile ? "0.875rem" : "1rem",
              },
              "& .MuiOutlinedInput-root": {
                fontSize: isMobile ? "0.875rem" : "1rem",
              },
            }}
          />
          <InputLabel
            id="demo-simple-select-label"
            sx={{
              fontSize: isMobile ? "0.875rem" : "1rem",
              marginBottom: 1,
            }}
          >
            Bạn uống món gì
          </InputLabel>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={drinkOptions}
            getOptionLabel={(option) => option.itemName}
            fullWidth
            onChange={handleDrinkChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Bạn uống món gì"
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: isMobile ? "0.875rem" : "1rem",
                  },
                  "& .MuiOutlinedInput-root": {
                    fontSize: isMobile ? "0.875rem" : "1rem",
                  },
                }}
              />
            )}
            sx={{ marginBottom: 2 }}
          />
          <InputLabel
            id="demo-simple-select-label"
            sx={{
              fontSize: isMobile ? "0.875rem" : "1rem",
              marginBottom: 1,
            }}
          >
            Size nước
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={size}
            label="Size nước"
            fullWidth
            onChange={handleSizeChange}
            sx={{
              fontSize: isMobile ? "0.875rem" : "1rem",
              "& .MuiSelect-select": {
                fontSize: isMobile ? "0.875rem" : "1rem",
              },
            }}
          >
            <MenuItem
              value="S"
              sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
            >
              S
            </MenuItem>
            <MenuItem
              value="M"
              sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
            >
              M
            </MenuItem>
            <MenuItem
              value="L"
              sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}
            >
              L
            </MenuItem>
          </Select>
        </DialogContent>
        <DialogActions
          sx={{
            padding: isMobile ? "8px 16px 16px" : "8px 24px 20px",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 1 : 0,
          }}
        >
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            fullWidth={isMobile}
            sx={{
              fontSize: isMobile ? "0.875rem" : "0.875rem",
              minHeight: isMobile ? "44px" : "36px",
            }}
          >
            Thêm dô
          </Button>
          <Button
            onClick={handleClose}
            fullWidth={isMobile}
            sx={{
              fontSize: isMobile ? "0.875rem" : "0.875rem",
              minHeight: isMobile ? "44px" : "36px",
            }}
          >
            Huỷ
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
