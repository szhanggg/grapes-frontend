import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import Footer from "./Footer";

const LoginWrapper = () => {
  return (
    <Card className="w-[28rem]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <Footer />
    </Card>
  );
};

export default LoginWrapper;
