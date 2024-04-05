import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "./icons";
import DataContext from "@/DataContext";
import { Checkbox } from "./ui/checkbox";
import Cookies from "js-cookie";

const backendURLs = [
  "https://grapes-backend.up.railway.app",
  "https://srzhang.pythonanywhere.com/",
];
const backendURL = backendURLs[Math.floor(Math.random() * backendURLs.length)];
// const backendURL = "https://grapes-backend.up.railway.app";
// const backendURL = "https://srzhang.pythonanywhere.com/";
// const backendURL = "http://localhost:5001";

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
  remember: z.boolean(),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setName, setClassData, setLoggedIn, setOriginalClassData } =
    useContext(DataContext);
  const [loginError, setLoginError] = useState<string | null>(null);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Send a POST request to /login

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      let r = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (r.status === 400) {
        setLoginError("Wrong login details.");
        setIsLoading(false);
        return;
      }

      let data = await r.json();
      setName(data.name);
      setClassData(data.classData);
      setOriginalClassData(data.classData);
      setLoggedIn(true);
      if (values.remember) {
        Cookies.set("username", values.username);
        Cookies.set("password", values.password);
      }
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
      setLoginError(
        "An error occurred while logging in. If you think something is wrong please contact me."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const username = Cookies.get("username");
    const password = Cookies.get("password");

    if (username && password) {
      form.setValue("username", username);
      form.setValue("password", password);
      form.setValue("remember", true);
      form.handleSubmit(onSubmit)();
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-auto">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID</FormLabel>
              <FormControl>
                <Input placeholder="123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="ilovegrapes" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Remember Me</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">
          Login
          {isLoading && (
            <Icons.spinner className="animate-spin ml-2"></Icons.spinner>
          )}
        </Button>
        <FormMessage>{loginError}</FormMessage>
      </form>
    </Form>
  );
}
