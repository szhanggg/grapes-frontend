import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import Footer from "./Footer";

const LoginWrapper = () => {
  return (
    <Card className="w-[28rem]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>MCPS Grade Viewer</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <Footer />
    </Card>
  );
};

export default LoginWrapper;
