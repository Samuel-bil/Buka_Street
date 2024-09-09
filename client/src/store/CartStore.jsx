import { toast } from "sonner";
import { create } from "zustand";

export const useCartStore = create((set) => ({
  // cart: JSON.parse(localStorage.getItem("cart")) || [],
  cart: [],
  bukaOwner: null,

  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i._id === item._id);
      // Check if the cart is empty or if the item belongs to the same bukaOwner
      if (!state.bukaOwner || state.bukaOwner === item.cuisine_owner._id) {
        if (existingItem) {
          const updatedCart = state.cart.map((i) =>
            i._id === item._id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
          localStorage.setItem("cart", JSON.stringify(updatedCart));
          return { cart: updatedCart };
        }
        // Otherwise, add the item to the cart
        const updatedCart = [...state.cart, item];
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        // Set bukaOwner if it's not already set
        if (!state.bukaOwner) {
          localStorage.setItem("bukaOwner", item.cuisine_owner._id);
        }

        return {
          cart: updatedCart,
          bukaOwner: state.bukaOwner || item.cuisine_owner._id,
        };
      }
      // If bukaOwner doesn't match, do not add the item and alert the user
      toast.info("You can only add items from one Buka at a time.");
      return state;
    }),
  incrementItem: (id) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),
  decrementItem: (id) =>
    set((state) => {
      const updatedCart = state.cart
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  // Clear the cart and reset bukaOwner
  clearCart: () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("bukaOwner");
    return { cart: [], bukaOwner: null };
  },
}));
