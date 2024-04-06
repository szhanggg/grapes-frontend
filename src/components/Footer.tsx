import { CardFooter } from "./ui/card";

export const Footer = () => {
  return (
    <CardFooter className="flex flex-col items-start">
      <p>
        Just upgraded servers so logins should be faster under heavy traffic
        now.
      </p>
      <p>
        For questions contact <b>srzhang</b> on Discord.
      </p>
    </CardFooter>
  );
};

export default Footer;
