import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import type { PropsWithChildren, ReactNode } from "react";
import "./Modal.css";

export type ModalProps = PropsWithChildren<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title: string;
  description?: string;
}>;

export const Modal = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
}: ModalProps) => {
  return (
    <DialogPrimitive.Root {...(open !== undefined ? { open } : {})} {...(onOpenChange !== undefined ? { onOpenChange } : {})}>
      {trigger ? (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      ) : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="ModalOverlay" />
        <DialogPrimitive.Content className="ModalContent">
          <div className="ModalHeader">
            <DialogPrimitive.Title className="ModalTitle">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="ModalClose" aria-label="Close">
              <Cross2Icon />
            </DialogPrimitive.Close>
          </div>
          {description ? (
            <DialogPrimitive.Description className="ModalDescription">
              {description}
            </DialogPrimitive.Description>
          ) : null}
          <div className="ModalBody">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
