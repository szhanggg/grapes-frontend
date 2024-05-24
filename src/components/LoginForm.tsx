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

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
  remember: z.boolean(),
});

export function LoginForm() {
  const { setName, setLoggedIn, cookies, setCookies, backendUrl, version } =
    useContext(DataContext);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const login = async (data: z.infer<typeof formSchema>) => {
    var datcopy = JSON.parse(JSON.stringify(data));
    datcopy["cookies"] = cookies;
    if(datcopy.remember === false) {
      // Delete the session cookies
      datcopy["cookies"] = {
        "ASP.NET_SessionId": "",
        "PVUE": "",
        "EES_PVUE": "",
      };
    }
    const res = await fetch(`${backendUrl}/login?v=${version}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datcopy),
    });

    const rData = await res.json().catch(() => {
      throw new Error("Error occured while logging in.");
    });

    if ("cookies" in rData) {
      setCookies(rData["cookies"]);
      for (const [key, value] of Object.entries(rData["cookies"])) {
        Cookies.set(key, value as string);
      }
    }

    if ("error" in rData) {
      throw new Error(rData["error"]);
    }

    if (!res.ok) {
      throw new Error(rData["Error occured while logging in."]);
    }

    return rData;
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (loading) return;
    setLoading(true);
    login(data)
      .then((rData) => {
        setName(rData["name"]);
        setLoggedIn(true);
        if (data.remember) {
          Cookies.set("remember", "true");
          Cookies.set("username", data.username);
          Cookies.set("password", data.password);
        } else {
          Cookies.set("remember", "false");
          Cookies.remove("username");
          Cookies.remove("password");
        }
        navigate("/dashboard");
      })
      .catch((e) => {
        console.log(e);
        setLoginError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  useEffect(() => {
    const aspnetsession = Cookies.get("ASP.NET_SessionId");
    const pvue = Cookies.get("PVUE");
    const ees = Cookies.get("EES_PVUE");
    const remember = Cookies.get("remember");
    const username = Cookies.get("username");
    const password = Cookies.get("password");

    if (aspnetsession && pvue && ees) {
      setCookies({
        "ASP.NET_SessionId": aspnetsession,
        PVUE: pvue,
        EES_PVUE: ees,
        remember,
        username: username || "",
        password: password || "",
      });
    }
  }, []);

  useEffect(() => {
    if (
      "ASP.NET_SessionId" in cookies &&
      "PVUE" in cookies &&
      "EES_PVUE" in cookies &&
      "remember" in cookies &&
      "username" in cookies &&
      "password" in cookies
    ) {
      if (cookies["remember"] === "true") {
        onSubmit({
          username: cookies["username"],
          password: cookies["password"],
          remember: true,
        });
      }
    }
  }, [cookies]);

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
          {loading && (
            <Icons.spinner className="animate-spin ml-2"></Icons.spinner>
          )}
        </Button>
        <FormMessage>{loginError}</FormMessage>
      </form>
    </Form>
  );
}
