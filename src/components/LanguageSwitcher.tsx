"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";
import { setClientLocale, type Locale, SUPPORTED_LOCALES } from "../lib/locale";

const localeNames = {
  vi: "Tiếng Việt",
  en: "English",
};

const localeFlags = {
  vi: "🇻🇳",
  en: "🇺🇸",
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      handleClose();
      return;
    }

    startTransition(() => {
      setClientLocale(newLocale);
      // Reload the page to apply the new locale
      window.location.reload();
    });
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        startIcon={<LanguageIcon sx={{ color: "text.primary" }} />}
        disabled={isPending}
        sx={{
          color: "text.primary",
          textTransform: "none",
          "&.Mui-disabled": {
            color: "text.secondary",
            opacity: 0.8,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography component="span" sx={{ fontSize: "1.2em" }}>
            {localeFlags[locale]}
          </Typography>
          <Typography
            component="span"
            variant="body2"
            sx={{ color: "text.primary" }}
          >
            {localeNames[locale]}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {SUPPORTED_LOCALES.map((supportedLocale) => (
          <MenuItem
            key={supportedLocale}
            onClick={() => handleLocaleChange(supportedLocale)}
            selected={supportedLocale === locale}
            disabled={isPending}
          >
            <ListItemIcon
              sx={{
                fontSize: "1.2em",
                minWidth: "auto",
                mr: 1,
                ...(supportedLocale === locale && { color: "text.primary" }),
              }}
            >
              {localeFlags[supportedLocale]}
            </ListItemIcon>
            <ListItemText>{localeNames[supportedLocale]}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
