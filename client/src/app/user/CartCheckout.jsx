import { useState } from "react";
import { Button } from "@/components/ui/button";

import { MinusCircle, PlusCircle } from "lucide-react";
import axios from "axios";
import PuffLoader from "react-spinners/PuffLoader";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/CartStore";
import { loadStripe } from "@stripe/stripe-js";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/UserStore";

const endpoint = "https://buka-street.vercel.app/api/orders/";

const CartCheckout = () => {
  // fetching cuisines from cookies
  const token = Cookies.get("user");
  const { details } = useUserStore();
  // fetching user information from cookies
  const [loading, setLoading] = useState(false);
  const { cart, incrementItem, decrementItem } = useCartStore();

  const total = cart?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const makePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Create the order
      const responseBody = await axios.post(
        endpoint + `create`,
        {
          order_items: cart?.map((item) => ({
            cuisine_id: item._id,
            quantity: item.quantity,
            price: item.price,
          })),
          order_total: total,
          order_owner: details?._id,
          order_buka: cart?.[0]?.cuisine_owner?._id,
          order_status: "pending",
          delivery_date: new Date(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderId = responseBody.data._id;

      // Step 2: Initiate the payment
      const response = await axios.post(
        endpoint + `create-checkout-session`,
        { orderId, cart },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { id } = response.data;

      const stripe = await loadStripe(
        "pk_test_51PutKmRoar6ifmou2hZxNAEztJcRpZhmoSGJPZ55WYM2aU7pe36rniKJRCBpEyd4GDMrh01d2RUj3hWpRsbjmCV500Q0jdqjSN"
      );
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId: id });

      if (response?.data) {
        localStorage.removeItem("cart");
      }
      if (result.error) {
        console.error("Stripe Checkout Error:", result.error.message);
      }
    } catch (error) {
      console.log(
        "Payment Error:",
        error.response ? error.response.data : error.message
      );
      console.error("Payment Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <div className="space-y-4">
            {cart?.length <= 0 ? (
              <div className="h-[150px] flex flex-col items-center justify-center">
                <h2 className="text-lg font-bold">Your Cart is Empty</h2>

                <Link to="/cuisine">
                  <Button>Continue Shopping</Button>
                </Link>
              </div>
            ) : (
              cart?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item?.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                      style={{ aspectRatio: "64/64", objectFit: "cover" }}
                    />
                    <div>
                      <h3 className="font-medium">{item.cuisine_name}</h3>
                      <p className="text-muted-foreground">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                      <div className="flex items-center  gap-3">
                        <button
                          disabled={item?.quantity <= 0}
                          onClick={() => decrementItem(item?._id)}
                        >
                          <MinusCircle size={"20"} />
                        </button>
                        <h3 className="text-[1rem] font-bold text-primary">
                          {item?.quantity}
                        </h3>
                        <button onClick={() => incrementItem(item._id)}>
                          <PlusCircle size={"20"} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">Total</p>
            <p className="text-2xl font-bold">${total.toFixed(2)}</p>
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <di>
            <div className=" flex justify-between">
              <p className="font-bold">Full Name</p>{" "}
              <span className="text-primary">
                {details?.first_name + " " + details?.last_name}
              </span>
            </div>
            <div className=" flex justify-between">
              <p className="font-bold">Email</p>{" "}
              <span className="text-primary">{details?.email}</span>
            </div>
            <div className=" flex justify-between">
              <Button className="w-full mt-6" onClick={makePayment}>
                {loading ? <PuffLoader size={25} color={"#fff"} /> : "Checkout"}
              </Button>
            </div>
          </di>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;
