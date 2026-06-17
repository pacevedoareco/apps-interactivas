import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  agregarItemAlCarrito,
  checkoutCarrito,
  eliminarItemCarrito,
  modificarItemCarrito,
  obtenerCarrito,
  vaciarCarritoAPI,
} from "../../services/carritoService";

const initialState = {
  carrito: null,
  items: [],
  totalItems: 0,
  totalPrecio: 0,
  cargando: false,
  error: null,
};

function aplicarCarritoEnEstado(state, carrito) {
  state.carrito = carrito;
  state.items = carrito?.items ?? [];
  state.totalPrecio = carrito?.total ?? 0;
  state.totalItems = state.items.reduce((acc, item) => acc + item.cantidad, 0);
}

export const cargarCarrito = createAsyncThunk(
  "carrito/cargarCarrito",
  async (_, { rejectWithValue }) => {
    try {
      return await obtenerCarrito();
    } catch (error) {
      return rejectWithValue(error.message || "No se pudo obtener el carrito");
    }
  }
);

export const agregarAlCarritoThunk = createAsyncThunk(
  "carrito/agregarAlCarrito",
  async ({ productoId, cantidad }, { rejectWithValue }) => {
    try {
      return await agregarItemAlCarrito(productoId, cantidad);
    } catch (error) {
      return rejectWithValue(error.message || "No se pudo agregar el producto al carrito");
    }
  }
);

export const cambiarCantidadThunk = createAsyncThunk(
  "carrito/cambiarCantidad",
  async ({ itemId, cantidad }, { rejectWithValue }) => {
    try {
      if (cantidad < 1) {
        return await eliminarItemCarrito(itemId);
      }

      return await modificarItemCarrito(itemId, cantidad);
    } catch (error) {
      return rejectWithValue(error.message || "No se pudo modificar la cantidad");
    }
  }
);

export const eliminarDelCarritoThunk = createAsyncThunk(
  "carrito/eliminarDelCarrito",
  async (itemId, { rejectWithValue }) => {
    try {
      return await eliminarItemCarrito(itemId);
    } catch (error) {
      return rejectWithValue(error.message || "No se pudo eliminar el item");
    }
  }
);

export const vaciarCarritoThunk = createAsyncThunk(
  "carrito/vaciarCarrito",
  async (_, { rejectWithValue }) => {
    try {
      await vaciarCarritoAPI();
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "No se pudo vaciar el carrito");
    }
  }
);

export const checkoutThunk = createAsyncThunk(
  "carrito/checkout",
  async (_, { rejectWithValue }) => {
    try {
      return await checkoutCarrito();
    } catch (error) {
      if (error.errores?.length) {
        return rejectWithValue({
          message: error.message || "Stock insuficiente",
          errores: error.errores,
        });
      }

      return rejectWithValue({
        message: error.message || "No se pudo completar el checkout",
        errores: [],
      });
    }
  }
);

const carritoSlice = createSlice({
  name: "carrito",
  initialState,
  reducers: {
    resetearCarrito: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarCarrito.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(cargarCarrito.fulfilled, (state, action) => {
        state.cargando = false;
        aplicarCarritoEnEstado(state, action.payload);
      })
      .addCase(cargarCarrito.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload || "No se pudo obtener el carrito";
        aplicarCarritoEnEstado(state, null);
      })
      .addCase(agregarAlCarritoThunk.fulfilled, (state, action) => {
        state.error = null;
        aplicarCarritoEnEstado(state, action.payload);
      })
      .addCase(agregarAlCarritoThunk.rejected, (state, action) => {
        state.error = action.payload || "No se pudo agregar el producto al carrito";
      })
      .addCase(cambiarCantidadThunk.fulfilled, (state, action) => {
        state.error = null;
        aplicarCarritoEnEstado(state, action.payload);
      })
      .addCase(cambiarCantidadThunk.rejected, (state, action) => {
        state.error = action.payload || "No se pudo modificar la cantidad";
      })
      .addCase(eliminarDelCarritoThunk.fulfilled, (state, action) => {
        state.error = null;
        aplicarCarritoEnEstado(state, action.payload);
      })
      .addCase(eliminarDelCarritoThunk.rejected, (state, action) => {
        state.error = action.payload || "No se pudo eliminar el item";
      })
      .addCase(vaciarCarritoThunk.fulfilled, (state) => {
        state.error = null;
        aplicarCarritoEnEstado(state, state.carrito ? { ...state.carrito, items: [], total: 0 } : null);
      })
      .addCase(vaciarCarritoThunk.rejected, (state, action) => {
        state.error = action.payload || "No se pudo vaciar el carrito";
      })
      .addCase(checkoutThunk.fulfilled, (state) => {
        state.error = null;
        aplicarCarritoEnEstado(state, state.carrito ? { ...state.carrito, items: [], total: 0 } : null);
      })
      .addCase(checkoutThunk.rejected, (state, action) => {
        state.error = action.payload?.message || "No se pudo completar el checkout";
      });
  },
});

export const { resetearCarrito } = carritoSlice.actions;

export default carritoSlice.reducer;
