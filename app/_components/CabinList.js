import CabinCard from "@/app/_components/CabinCard";
import { getCabins } from "../_lib/data-service";
import { unstable_noStore } from "next/cache";
async function CabinList({ filter }) {
  //opt out of data cache in one compo makes the whole page dynamic
  // unstable_noStore();
  const cabins = await getCabins();

  if (!cabins.length) return null;

  let filteredCabins;
  if (filter === "all") filteredCabins = cabins;
  else if (filter === "small")
    filteredCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  else if (filter === "medium")
    filteredCabins = cabins.filter(
      (cabin) => cabin.maxCapacity > 3 && cabin.maxCapacity < 8
    );
  else if (filter === "large")
    filteredCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {filteredCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
