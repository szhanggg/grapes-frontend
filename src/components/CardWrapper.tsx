import { Card, CardContent } from "./ui/card";

type CardWrapperProps = {
  className?: string;
  children: React.ReactNode;
  cardClassName?: string;
};

export const CardWrapper = ({
  cardClassName,
  className,
  children,
}: CardWrapperProps) => {
  return (
    <Card className={cardClassName}>
      <CardContent className={"pt-6 " + className}>{children}</CardContent>
    </Card>
  );
};
