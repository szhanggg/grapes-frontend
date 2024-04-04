import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./LoginForm";

const LoginWrapper = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grapes</CardTitle>
        <CardDescription>Grade Viewer</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter>
        <p>
          Use at your own risk. I am not liable for any shit that ends up
          happening to you. This site does not use the official api, as its broke, but instead
          is a mirror of the StudentVue app. Funky stuff might happen so again don't get mad at me if something weird happens.
          <br />
          For questions contact me on Discord: srzhang
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginWrapper;
