import { configureStore } from "@reduxjs/toolkit";
import sidebarExpandedReducer from "../slices/siderbarExpandedSlice";
// import speakerReducer from "../slices/speakerSlice";
// import ordersReducer from "../slices/ordersSlice"
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "@reduxjs/toolkit";

// Configure persist options
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["speaker", "orders"], // only speaker will be persisted
};

// Combine reducers
const rootReducer = combineReducers({
  sidebarExpanded: sidebarExpandedReducer,
  // speaker: speakerReducer,
  // orders: ordersReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Infer types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
