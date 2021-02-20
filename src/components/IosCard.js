import { Caption, Card, Div } from "@vkontakte/vkui";
import React from "react";

export function IosCard({
  leftIcon,
  title,
  rightIcon,
  children,
  className,
  onClick,
}) {
  return (
    <Card onClick={onClick} className={className}>
      <Div>
        <div className="d-flex align-center justify-space-between Card__header">
          <div className="d-flex align-center ">
            {leftIcon}
            <Caption
              level="2"
              weight="regular"
              style={{ opacity: 0.7, marginLeft: 8 }}
            >
              {title}
            </Caption>
          </div>
          {rightIcon}
        </div>

        {children}
      </Div>
    </Card>
  );
}

export const MemoizedCard = React.memo(IosCard);
