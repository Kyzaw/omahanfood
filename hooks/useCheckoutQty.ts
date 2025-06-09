import { useEffect, useState } from "react";

export default function useCheckoutQty() {
  const [qty, setQty] = useState(0);

  const calculateQty = () => {
    const data = localStorage.getItem("checkoutItems");
    if (!data) return setQty(0);
    const items = JSON.parse(data);
    const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setQty(total);
  };

  useEffect(() => {
    calculateQty();

    const handleStorageChange = () => calculateQty();
    const handleCustomUpdate = () => calculateQty();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("checkoutUpdated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("checkoutUpdated", handleCustomUpdate);
    };
  }, []);

  return qty;
}
