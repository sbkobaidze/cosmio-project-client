import { useSession } from "@/hooks/use-session";
import { toast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useSession();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = Object.fromEntries(new FormData(e.currentTarget));

    const { email, password } = {
      email: formData.email as string,
      password: formData.password as string,
    };

    const res = await login(email, password);

    if (res.error) {
      toast({
        description: res.error,
        variant: "destructive",
      });
      setIsLoading(false);
    }

    // Simulate API call
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            className="pl-10"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            className="pl-10"
            required
          />
        </div>
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
};

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useSession();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));

    const { email, password, confirmPassword } = {
      email: formData.email as string,
      password: formData.password as string,
      confirmPassword: formData.confirmPassword as string,
    };

    if (password !== confirmPassword) {
      return toast({
        description: "Passwords do not match",
        variant: "destructive",
      });
    }

    const data = await register(email, password);

    if (data.success) {
      toast({
        description: "Account created successfully",
      });
    } else
      toast({
        description: data.error,
        variant: "destructive",
      });
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="pl-10"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="password"
            name="password"
            minLength={8}
            placeholder="Password"
            className="pl-10"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="password"
            name="confirmPassword"
            minLength={8}
            placeholder="Confirm Password"
            className="pl-10"
            required
          />
        </div>
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
};
