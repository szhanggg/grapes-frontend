import { Card, CardContent } from "./ui/card";

type CardWrapperProps = {
  className?: string;
  children: React.ReactNode;
};

export const CardWrapper = ({ className, children }: CardWrapperProps) => {
  return (
    <Card>
      <CardContent className={"pt-6 " + className}>{children}</CardContent>
    </Card>
  );
};
