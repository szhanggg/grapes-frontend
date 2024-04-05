import { CardFooter } from "./ui/card";

export const Footer = () => {
  return (
    <CardFooter className="flex flex-col items-start">
      <p>Sometimes servers are slow and logins take a while.</p>
      <p>
        For questions contact <b>srzhang</b> on Discord.
      </p>
    </CardFooter>
  );
};

export default Footer;
