import { LoginForm, RegisterForm } from "@/components/auth/forms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/hooks/use-session";
import { useState } from "react";
import { Navigate } from "react-router";

export function meta({}) {
  return [
    { title: "Authentication - Login & Register" },
    { name: "description", content: "Login or create a new account" },
  ];
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  const { user, loading } = useSession();

  if (!loading && user) return <Navigate to="/personal" />;

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Login or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm setActiveTab={setActiveTab} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
