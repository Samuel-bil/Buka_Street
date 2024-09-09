import useCuisine from "@/components/hooks/useCuisine";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

function Cuisines() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  const { data } = useCuisine();
  const filteredRestaurants = data.filter(
    (item) =>
      item?.cuisine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.cuisine_owner?.buka_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const filteredData = filteredRestaurants?.filter(
    (item) => item?.cuisine_owner?.go_live
  );

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Explore Meals and Buka&apos;s
        </h1>
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center mb-6">
            <Search className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for a meal or buka"
              className="pl-8 sm:w-[300px] md:w-[300px] lg:w-[300px] border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-0 bg-[#006400] text-gray-200 py-[0.4rem] px-2 rounded-r-md">
              Search
            </span>
          </div>
        </div>
        <div>
          {filteredData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-10">
                {filteredData?.slice(0, visibleCount)?.map((item) => (
                  <ProductCard item={item} key={item?._id} />
                ))}
              </div>
              {visibleCount < filteredRestaurants?.length && (
                <div className="text-center mt-6">
                  <Button onClick={handleLoadMore}>Load More</Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 mt-8">
              No meals available at the moment.
            </p>
          )}
        </div>
        {filteredRestaurants.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No restaurants found. Try a different search term.
          </p>
        )}
      </div>
    </div>
  );
}

export default Cuisines;
