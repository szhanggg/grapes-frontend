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
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "./icons";
import DataContext from "@/DataContext";

const backendURL = "https://srzhang.pythonanywhere.com/";
// const backendURL = "http://localhost:5001";

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
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

      let data = await r.json();
      setName(data.name);
      setClassData(data.classData);
      setOriginalClassData(data.classData);
      setLoggedIn(true);
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
