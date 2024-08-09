"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
//Goal: data mutation

//just like API endpoints to let the client talk to the server

//so users need to be authenticated and inputs assumed unsafe

//server actions only be executed on the server, but can be called from the client

//in order to update UI, revalidate the data cache

//each server action has its own url that reaches the client

//but itself stays on the server so it's [safe] to use secretAPI keys and connect to databases

// They require a running web server

///******* use cases *******///
//1. typically handle form submissions, no matter the form is in a server/client compo

//2. event handlers
//3. useEffect
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";

export async function createReservation(bookingData, formData) {
  // console.log(formData);
  const session = await auth();
  if (!session) throw new Error("Please log in first.");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  // console.log("new booking", newBooking);

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function updateReservation(formData) {
  //1.authentication
  const session = await auth();
  if (!session) throw new Error("Please log in first.");

  //2.get form data
  const bookingId = Number(formData.get("bookingId"));
  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations")?.slice(0, 1000);

  //3. check if the booking is made by the guest
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((b) => b.id);
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to edit this booking.");

  // 4.updata
  const updatedData = { numGuests, observations };
  const { error } = await supabase
    .from("bookings")
    .update(updatedData)
    .eq("id", bookingId)
    .select()
    .single();
  if (error) {
    throw new Error("Booking could not be updated");
  }
  // 5.go back
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect("/account/reservations");
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("Please log in first.");

  //check if the booking is made by the guest
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((b) => b.id);
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking.");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }
  //used to test optimistic UI
  // await new Promise((res) => setTimeout(res, 3000));
  // throw new Error();
  revalidatePath("/account/reservations");
}

export async function updateGuest(formData) {
  const session = await auth();
  //Don't use try-catch block in server actions
  //but throw errors to be caught in the closest error boundary
  if (!session) throw new Error("Please log in first.");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  //validate data
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid ID.");

  const updatedData = { nationalID, nationality, countryFlag };
  const { error } = await supabase
    .from("guests")
    .update(updatedData)
    .eq("id", session.user.guestId)
    .select()
    .single();

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
