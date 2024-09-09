import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRegister } from "@/components/hooks/useRegister";
import PuffLoader from "react-spinners/PuffLoader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Link } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bukaName, setBukaName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const { handleRegister } = useRegister(
    firstName,
    lastName,
    password,
    email,
    setLoading,
    role,
    bukaName
  );

  return (
    <section className="h-screen lflex items-center justify-center   gap-5">
      <div className=" h-full w-full flex justify-center items-center  ">
        <div className="bg-white w-full md:w-[500px]  rounded-md px-5 py-7 ">
          <Link to="/">
            <div className="flex justify-center items-center">
              <img src="/buka-logo.png" width="200" height="200" />
            </div>
          </Link>
          <h2 className="text-[1.7rem] font-semibold my-6 text-center">
            Create An Account
          </h2>

          <form className="flex flex-col gap-4">
            <RadioGroup
              onValueChange={(value) => setRole(value)}
              defaultValue="user"
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="r2" />
                <Label htmlFor="r2">User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buka" id="r3" />
                <Label htmlFor="r3">Buka</Label>
              </div>
            </RadioGroup>
            {role === "user" ? (
              <>
                <div>
                  <label>First Name</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </>
            ) : (
              <div>
                <label>Business Name</label>
                <Input
                  value={bukaName}
                  onChange={(e) => setBukaName(e.target.value)}
                  placeholder="Enter Business name"
                />
              </div>
            )}
            <div>
              <label>Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label>Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <div className="flex gap-3 leading-none">
              <Checkbox id="terms1" />
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                You agree to our{" "}
                <Link href="#" className="text-primary font-semibold">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary font-semibold">
                  Privacy Policy.
                </Link>
              </label>
            </div>
            <div>
              <Button onClick={handleRegister} className="w-full  bg-primary ">
                {loading ? <PuffLoader size={24} color={"#fff"} /> : "Sign Up"}
              </Button>
            </div>
            <div className="flex gap-3 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Already have account?{"  "}
                <Link to="/login" className="text-primary font-semibold">
                  Login
                </Link>{" "}
              </label>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
