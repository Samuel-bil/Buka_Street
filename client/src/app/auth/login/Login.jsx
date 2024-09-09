import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/components/hooks/useLogin";
import PuffLoader from "react-spinners/PuffLoader";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

import { Label } from "@radix-ui/react-label";

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useLogin(email, password, setLoading);

  return (
    <section className="h-screen flex justify-center items-center">
      <div className=" h-full w-full flex justify-center items-center  ">
        <div className="bg-white w-full md:w-[500px]  rounded-md px-5 py-7">
          <Link to="/">
            <div className="flex justify-center items-center">
              <img src="/buka-logo.png" width="200" height="200" />
            </div>
          </Link>
          <h2 className="text-[1.7rem] font-semibold my-6 text-[#1E1E1E] text-center">
            Log In
          </h2>
          <p className="text-[#32CD32] text-[1.5rem] mb-12 text-center">
            Welcome back!
          </p>
          <form className="flex flex-col gap-4">
            <div>
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between  items-center gap-3 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm flex items-center gap-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Checkbox id="terms1" />
                Remember me
              </label>
              <div>
                <Link href="#" className="text-primary font-semibold text-sm">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full  bg-primary "
              >
                {loading ? <PuffLoader size={25} color={"#fff"} /> : "Login"}
              </Button>
            </div>
            <div className="flex gap-3 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Don&apos;t have an account?{"  "}
                <Link to="/register" className="text-primary font-semibold">
                  Sign Up
                </Link>{" "}
              </label>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
