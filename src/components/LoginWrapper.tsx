import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import { AnnouncementText } from "./AnnouncementText";

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
      <CardFooter>
        <AnnouncementText />
        <div className="mb-8" />
      </CardFooter>
    </Card>
  );
};

export default LoginWrapper;
