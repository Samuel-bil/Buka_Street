import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { PoundSterling } from "lucide-react";

export default function ProductCarousel({ header, data }) {
  const filteredData = data?.filter((item) => item?.cuisine_owner?.go_live);

  return (
    <div className="w-full mx-auto pt-20 px-10 ">
      <div className="flex justify-between items-center mt-4">
        <h2 className="text-[2rem] mt-3 font-bold pl-4 mb-4">{header}</h2>
      </div>
      {filteredData && filteredData.length > 0 ? (
        <Carousel className="w-full">
          <CarouselContent>
            {filteredData.map((item) => (
              <CarouselItem
                key={item?._id}
                className="basis-1/1 md:basis-1/3 lg:basis-1/4"
              >
                <div>
                  <Link
                    to={`/kitchen/${item?.cuisine_owner?._id}`}
                    className="block"
                  >
                    <Card>
                      <img
                        src={item?.image}
                        alt={item?.title}
                        width={300}
                        height={300}
                        className="aspect-square object-cover rounded-md"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-[1.2rem] text-center">
                          {item?.cuisine_owner?.buka_name}
                        </h3>
                        <p className="font-semibold text-[0.85rem] text-center mb-4">
                          {item?.cuisine_type}
                        </p>
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-semibold text-[1rem]">
                            {item?.cuisine_name}
                          </h3>
                          <div className="text-primary font-semibold flex items-center justify-center">
                            <PoundSterling size={16} />
                            {item?.price}
                          </div>
                        </div>
                        <div className="flex items-center justify-center text-center">
                          <Button>View Meals</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          No meals available at the moment.
        </p>
      )}
    </div>
  );
}
