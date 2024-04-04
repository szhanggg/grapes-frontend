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
    <Card>
      <CardHeader>
        <CardTitle>Grapes</CardTitle>
        <CardDescription>
          <h2>Grade Viewer</h2>
          <h2>Currently Under Heavy Heavy Development</h2>
          <h2>Please Report Bugs or Suggestions to srzhang on Discord</h2>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <Footer />
    </Card>
  );
};

export default LoginWrapper;
