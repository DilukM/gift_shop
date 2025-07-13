import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { CartService } from "../../features/cart/application/services/CartService.js";

const CartContext = createContext();

// Cart reducer for state management
const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        cart: action.payload.cart,
        summary: action.payload.summary,
        loading: false,
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

const initialState = {
  cart: null,
  summary: null,
  loading: true,
  error: null,
};

/**
 * Cart Context Provider using Clean Architecture
 */
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [cartService] = useState(() => new CartService());

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Set up cart change listener
  useEffect(() => {
    const handleCartChange = (event) => {
      console.log("Cart change event received:", event);
      loadCart();
    };

    console.log("Setting up cart change listener");
    cartService.addCartChangeListener(handleCartChange);

    return () => {
      console.log("Removing cart change listener");
      cartService.removeCartChangeListener(handleCartChange);
    };
  }, [cartService]);

  /**
   * Load cart from service
   */
  const loadCart = async () => {
    try {
      console.log("Loading cart...");
      dispatch({ type: "SET_LOADING", payload: true });
      const result = await cartService.getCart();
      console.log("Cart loaded from service:", result);
      dispatch({
        type: "SET_CART",
        payload: {
          cart: result.cart,
          summary: result.summary,
        },
      });
      console.log("Cart state updated");
    } catch (error) {
      console.error("Error loading cart:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load cart" });
    }
  };

  /**
   * Add item to cart
   * @param {Product} product Product to add
   * @param {number} quantity Quantity to add
   */
  const addToCart = async (product, quantity = 1) => {
    try {
      console.log("CartContext.addToCart called with:", { product, quantity });
      dispatch({ type: "CLEAR_ERROR" });
      const result = await cartService.addItem(product, quantity);
      console.log("CartService.addItem result:", result);

      if (!result.success) {
        console.error("Add to cart failed:", result.error);
        dispatch({ type: "SET_ERROR", payload: result.error });
        return false;
      }

      console.log("Item added successfully to cart");
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to add item to cart" });
      return false;
    }
  };

  /**
   * Remove item from cart
   * @param {string} productId Product ID to remove
   */
  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: "CLEAR_ERROR" });
      const result = await cartService.removeItem(productId);

      if (!result.success) {
        dispatch({ type: "SET_ERROR", payload: result.error });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to remove item from cart",
      });
      return false;
    }
  };

  /**
   * Update item quantity
   * @param {string} productId Product ID
   * @param {number} quantity New quantity
   */
  const updateQuantity = async (productId, quantity) => {
    try {
      dispatch({ type: "CLEAR_ERROR" });
      const result = await cartService.updateQuantity(productId, quantity);

      if (!result.success) {
        dispatch({ type: "SET_ERROR", payload: result.error });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating quantity:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to update quantity" });
      return false;
    }
  };

  /**
   * Clear entire cart
   */
  const clearCart = async () => {
    try {
      dispatch({ type: "CLEAR_ERROR" });
      const result = await cartService.clearCart();

      if (!result.success) {
        dispatch({ type: "SET_ERROR", payload: result.error });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to clear cart" });
      return false;
    }
  };

  /**
   * Process checkout
   * @param {Object} checkoutData Checkout form data
   */
  const processCheckout = async (checkoutData) => {
    try {
      dispatch({ type: "CLEAR_ERROR" });
      dispatch({ type: "SET_LOADING", payload: true });

      const result = await cartService.processCheckout(checkoutData);

      dispatch({ type: "SET_LOADING", payload: false });

      if (!result.success) {
        dispatch({ type: "SET_ERROR", payload: result.errors.join(", ") });
        return { success: false, errors: result.errors };
      }

      return result;
    } catch (error) {
      console.error("Error processing checkout:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to process checkout" });
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, errors: ["An unexpected error occurred"] };
    }
  };

  /**
   * Validate cart for checkout
   */
  const validateCart = async () => {
    try {
      return await cartService.validateCart();
    } catch (error) {
      console.error("Error validating cart:", error);
      return { isValid: false, errors: ["Failed to validate cart"] };
    }
  };

  /**
   * Check if product is in cart
   * @param {string} productId Product ID
   */
  const isInCart = (productId) => {
    if (!state.cart) return false;
    return state.cart.items.some((item) => item.id === productId);
  };

  /**
   * Get item quantity in cart
   * @param {string} productId Product ID
   */
  const getItemQuantity = (productId) => {
    if (!state.cart) return 0;
    const item = state.cart.items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const contextValue = {
    // State
    cart: state.cart,
    summary: state.summary,
    loading: state.loading,
    error: state.error,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    processCheckout,
    validateCart,
    loadCart,
    clearError,

    // Computed values
    isInCart,
    getItemQuantity,

    // Getters
    totalItems: state.summary?.totalItems || 0,
    totalPrice: state.summary?.totalPrice || 0,
    isEmpty: state.summary?.isEmpty ?? true,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

/**
 * Hook to use cart context
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartContext };
