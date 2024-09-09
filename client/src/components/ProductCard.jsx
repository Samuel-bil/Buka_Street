import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { PoundSterling } from "lucide-react";

export const ProductCard = ({ item }) => {
  return (
    <div key={item?._id}>
      <Link to={`/kitchen/${item?.cuisine_owner?._id}`} className="block">
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
  );
};
