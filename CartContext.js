import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './context/AuthContext';

const CartContext = createContext();
const API_BASE = 'http://192.168.18.80:5000';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false); // 👈 Track if cart is loaded

  // 👈 Load cart from DB when user changes (login/logout/app start)
  useEffect(() => {
//     const loadCartFromDB = async () => {
//       if (!user) {
//         setCart([]);
//         setCartLoaded(false);
//         return;
//       }

//       try {
//         const token = await AsyncStorage.getItem('@user_token');
//         const userId = user._id || user.id;

//         const response = await fetch(`${API_BASE}/api/users/${userId}`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         const data = await response.json();

//         if (data.success && data.data.cart) {
//           // Convert DB format to app format
//           // const formattedCart = data.data.cart.map(item => ({
//           //   ...item.product,
//           //   id: item.product._id || item.product.id,
//           //   quantity: item.quantity
//           // }));
//           // setCart(formattedCart);

//             const formattedCart = data.data.cart
//   .filter(item => item.product != null) // 👈 Skip deleted products
//   .map(item => ({
//     ...item.product,
//     id: item.product._id,
//     quantity: item.quantity
//   }));
// setCart(formattedCart);

//         }
//         setCartLoaded(true);
//       } catch (error) {
//         console.log("Error loading cart:", error);
//         setCartLoaded(true);
//       }
//     };


const loadCartFromDB = async () => {
  if (!user) {
    setCart([]);
    return;
  }

  try {
    const token = await AsyncStorage.getItem('@user_token');
    const userId = user._id || user.id;

    const response = await fetch(`${API_BASE}/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();

    if (data.success && data.data.cart) {
      // 👈 MAP THE DATA CORRECTLY
      const formattedCart = data.data.cart
        .filter(item => item.product != null) // Skip deleted products
        .map(item => {
          const p = item.product; 
          return {
            id: p._id,
            name: p.name,
            price: p.price,           // 👈 Ensure price is mapped
            img: p.image,             // 👈 Ensure image is mapped
            type: p.category || 'Plant',
            quantity: item.quantity
          };
        });
      
      setCart(formattedCart);
    }
  } catch (error) {
    console.log("Error loading cart:", error);
  }
};


    loadCartFromDB();
  }, [user]); // Re-runs when user changes

  // 👈 Sync cart to DB
  const syncCartToDB = async (newCart) => {
    if (!user || !cartLoaded) return; // 👈 Don't sync before initial load

    try {
      const token = await AsyncStorage.getItem('@user_token');
      const userId = user._id || user.id;

      const dbCart = newCart.map(item => ({
        product: item.id || item._id,
        quantity: item.quantity
      }));

      await fetch(`${API_BASE}/api/users/${userId}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart: dbCart })
      });
    } catch (error) {
      console.log("Error syncing cart:", error);
    }
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const isExist = prev.find((item) => item.id === product.id);
      if (isExist) return prev.filter((item) => item.id !== product.id);
      return [...prev, product];
    });
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const isExist = prev.find((item) => item.id === product.id);
      let newCart;
      if (isExist) {
        newCart = prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      syncCartToDB(newCart);
      return newCart;
    });
  };

  const increaseQuantity = (id) => {
    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      syncCartToDB(newCart);
      return newCart;
    });
  };

  const decreaseQuantity = (id) => {
    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      syncCartToDB(newCart);
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.id !== id);
      syncCartToDB(newCart);
      return newCart;
    });
  };

  return (
    <CartContext.Provider value={{ 
      wishlist, cart, toggleWishlist, addToCart, 
      increaseQuantity, decreaseQuantity, removeFromCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
