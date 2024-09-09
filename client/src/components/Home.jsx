import { Input } from "@/components/ui/input";
import ProductCarousel from "./ProductCarousel";
import useCuisine from "@/components/hooks/useCuisine";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useState } from "react";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data } = useCuisine();

  const filteredRestaurants = data?.filter(
    (item) =>
      item?.cuisine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.cuisine_owner?.buka_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="w-full h-[450px] relative ">
        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          effect="fade"
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="w-full h-full"
        >
          <SwiperSlide>
            <img
              src="/food-buka.png"
              className="w-full h-[400px] object-cover"
              alt="Food Buka"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/grilled.png"
              className="w-full h-[400px] object-cover"
              alt="grilled Dish"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/restaurant.jpg"
              className="w-full h-[400px] object-cover"
              alt="restaurant Dish"
            />
          </SwiperSlide>
        </Swiper>

        {/* Search Box */}
        <div className="absolute w-full flex text-center justify-center m-auto -bottom-10 left-0 z-10">
          <div className="w-full mx-3 md:w-[400px] shadow-md h-[200px] flex flex-col items-center justify-center rounded-3xl bg-white">
            <h2 className="text-[1.5rem] text-[#000] font-medium">
              Homemade meals made with ingenuity and love
            </h2>

            <span className="text-[0.6rem] py-3  text-[#000] font-medium">
              Find a Meals and Bukas
            </span>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for a meal or buka"
                className="pl-2 sm:w-[300px] md:w-[300px] lg:w-[300px] border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-[0.12rem] top-1/2 transform -translate-y-1/2 text-gray-200 pointer-events-none bg-[#006400] py-[0.4rem] px-2 rounded-md">
                Search
              </span>
            </div>
          </div>
        </div>
      </div>

      <ProductCarousel data={data} header="Popular Meals" />
      {filteredRestaurants.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No restaurants found. Try a different search term.
        </p>
      )}
    </>
  );
};

export default Home;
