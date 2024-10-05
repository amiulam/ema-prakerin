import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "./form";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <Card className="w-[400px]">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-x-1.5">
          <Image
            src="/logo-ipsum.svg"
            alt="the-logo"
            height={50}
            width={50}
            className="size-7"
          />{" "}
          <p>Sign Up</p>
        </CardTitle>
        <CardDescription>Sign up to start using the app</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  );
}
