"use client";
import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();
const initialState = { from: undefined, to: undefined };

export default function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  //   const resetRange = () => setRange(initialState);
  return (
    <ReservationContext.Provider value={{ range, setRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

// export function useReservation() {
//   const context = useContext(ReservationContext);
//   if (context === undefined)
//     throw new Error("Context was used outside provider.");
//   return context;
// }

export function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error("ReservationContext was used outside provider.");
  console.log(context);
  return context;
}
// export default { ReservationProvider, useReservation};
