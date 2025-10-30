import { useState, useMemo } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Autocomplete,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material";
import OrderItemService from "@/src/services/OrderItemService";

export default function FormEditDialog(props) {
  console.log("🔧 FormEditDialog props:", {
    open: props.open,
    item: props.item,
  });

  const [name, setName] = useState(props.item.name);
  const [drink, setDrink] = useState(props.item.drink);
  const [size, setSize] = useState(props.item.size);
  const [note, setNote] = useState(props.item.note);
  const [error, setError] = useState("");
  const drinkOptions = props.drinkOptions || [];

  // Use props.open instead of internal state
  const open = props.open || false;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Find the current drink object from options
  const currentDrinkOption = useMemo(() => {
    if (drinkOptions == undefined || drinkOptions.length === 0) return null;
    return drinkOptions.find((option) => option.itemName === drink) || null;
  }, [drinkOptions, drink]);

  const handleClose = () => {
    setError(""); // Clear errors when closing
    if (props.onClose) {
      props.onClose();
    }
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

  const handleNoteChange = (evt) => {
    setNote(evt.target.value);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError(""); // Clear any previous errors

    console.log("🔄 FormEditDialog: Submitting with data:", {
      name,
      drink,
      size,
      note,
      itemId: props.item.id,
      orderCode: props.item.orderCode,
    });

    let orderItem = {
      id: props.item.id,
      orderCode: props.item.orderCode,
      name: name,
      drink: drink,
      size: size,
      note: note,
    };

    try {
      await OrderItemService.updateOrderItems(orderItem);

      console.log("✅ FormEditDialog: Item updated successfully");

      // Call refresh function which will also emit socket events
      console.log("check typeof rFunc:", typeof props.rFunc);
      if (typeof props.rFunc === "function") {
        console.log("FormEditDialog: Calling refresh function after update");
        await props.rFunc(props.item.id, orderItem);
      }

      handleClose(); // Close dialog on success
    } catch (error) {
      console.error("❌ Failed to update order item:", error);
      console.error("Error details:", error.message || error);
      setError("Vui lòng điền đầy đủ thông tin và thử lại!!");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth={isMobile ? false : "sm"}
      fullWidth
      PaperProps={{
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
        Cập nhật nước của bạn!
      </DialogTitle>
      <DialogContent
        sx={{
          padding: isMobile ? "8px 16px" : "20px 24px",
        }}
      >
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Cho xin cái tên"
          type="string"
          fullWidth
          variant="outlined"
          defaultValue={name}
          onChange={handleNameChange}
          sx={{
            marginBottom: 2,
            "& .MuiInputLabel-root": {
              fontSize: isMobile ? "0.875rem" : "1rem",
            },
            "& .MuiInput-root": {
              fontSize: isMobile ? "0.875rem" : "1rem",
            },
          }}
        />

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={drinkOptions}
          getOptionLabel={(option) => option.itemName || ""}
          fullWidth
          onChange={handleDrinkChange}
          value={currentDrinkOption}
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
          <MenuItem value="S" sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
            S
          </MenuItem>
          <MenuItem value="M" sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
            M
          </MenuItem>
          <MenuItem value="L" sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
            L
          </MenuItem>
        </Select>
        <InputLabel
          id="demo-simple-select-label"
          sx={{
            fontSize: isMobile ? "0.875rem" : "1rem",
            marginBottom: 1,
          }}
        >
          Note
        </InputLabel>
        <TextField
          autoFocus
          margin="dense"
          id="note"
          label="Note"
          type="string"
          fullWidth
          variant="outlined"
          value={note}
          onChange={handleNoteChange}
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
          variant="contained"
          fullWidth={isMobile}
          sx={{
            fontSize: isMobile ? "0.875rem" : "0.875rem",
            minHeight: isMobile ? "44px" : "36px",
          }}
        >
          Cập nhật
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
  );
}
