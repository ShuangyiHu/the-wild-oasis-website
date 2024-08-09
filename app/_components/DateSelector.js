"use client";
import {
  differenceInDays,
  isPast,
  isSameDay,
  isToday,
  isWithinInterval,
} from "date-fns";
import { useReservation } from "@/app/_components/ReservationContext";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function isAlreadyBooked(range, datesArr) {
  return (
    range?.from &&
    range?.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

function DateSelector({ cabin, settings, bookedDates }) {
  const { range, setRange } = useReservation();

  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;

  const numNights = differenceInDays(displayRange?.to, displayRange?.from);
  const { regularPrice, discount } = cabin;
  const cabinPrice = (regularPrice - discount) * numNights;

  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={1}
        onSelect={setRange}
        selected={displayRange}
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(curDate, date))
        }
        modifiersClassNames={{
          today: "bg-green-500 text-accent-900 rounded-full",
          selected: "text-primary-900 bg-accent-500",
          range_start: "bg-accent-700",
          range_end: "bg-accent-700",
        }}
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={() => setRange({ to: undefined, from: undefined })}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
