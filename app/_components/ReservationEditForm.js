"use client";

import { updateReservation } from "../_lib/actions";
import { useFormStatus } from "react-dom";
import FormButton from "./FormButton";

function ReservationEditForm({ maxCapacity, booking }) {
  const { numGuests, observations, id: bookingId } = booking;

  return (
    <form
      action={updateReservation}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label htmlFor="numGuests">How many guests?</label>
        <select
          name="numGuests"
          id="numGuests"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          required
          defaultValue={numGuests}
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
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultValue={observations}
        />
      </div>

      <input type="hidden" value={bookingId} name="bookingId" />

      <div className="flex justify-end items-center gap-6">
        <FormButton loadingText="Updating...">Update reservation</FormButton>
      </div>
    </form>
  );
}

export default ReservationEditForm;
