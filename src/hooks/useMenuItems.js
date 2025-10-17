import { useState, useEffect, useMemo } from "react";
import { phucLongDrinks, theCoffeHouseDrinks, katinatDrinks } from "@/src/components/sample-drinks";
import MenuItemService from "@/src/services/MenuItemService";

export const useMenuItems = (menuCode) => {
  const [dynamicMenuItems, setDynamicMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      // Only fetch if menuCode is not one of the hardcoded options
      if (menuCode && !["phuclong", "thecoffeehouse", "katinat"].includes(menuCode)) {
        try {
          const items = await MenuItemService.getMenuItems(menuCode);
          setDynamicMenuItems(items || []);
        } catch (err) {
          console.error("Error fetching menu items:", err);
          setDynamicMenuItems([]);
        }
      } else {
        // Reset dynamic items when switching to hardcoded options
        setDynamicMenuItems([]);
      }
    };

    fetchMenuItems();
  }, [menuCode]);

  const drinkOptions = useMemo(() => {
    switch (menuCode) {
      case "phuclong":
        return phucLongDrinks;
      case "thecoffeehouse":
        return theCoffeHouseDrinks;
      case "katinat":
        return katinatDrinks;
      default:
        return dynamicMenuItems;
    }
  }, [menuCode, dynamicMenuItems]);

  return { drinkOptions, isLoading: false }; // You can add loading state if needed
};
