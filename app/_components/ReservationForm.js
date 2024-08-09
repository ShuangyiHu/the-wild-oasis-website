"use client";
import { differenceInDays } from "date-fns";
import { createReservation } from "../_lib/actions";
import { useReservation } from "./ReservationContext";
import FormButton from "./FormButton";

function ReservationForm({ cabin, user }) {
  const { range, setRange } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;

  const numNights = differenceInDays(range?.to, range?.from);
  const cabinPrice = (regularPrice - discount) * numNights;

  const bookingData = {
    cabinPrice,
    startDate: range?.from,
    endDate: range?.to,
    numNights,
    cabinId: id,
  };

  //bookingData is now the first argument passed into createReservation
  const createReservationWithData = createReservation.bind(null, bookingData);
  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-2 items-center">
          <img
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user.image}
            alt={user.name}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={(formData) => {
          createReservationWithData(formData);
          setRange("");
        }}
        // action={createReservationWithData}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!(range?.from && range?.to) ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <FormButton loadingText="Reserving...">Reserve now</FormButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
