import { usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { FlashMessage } from "../types";

export function useFlashNotifications() {
  const page = usePage();
  const flashMessages = (page.flash.messages as FlashMessage[] | undefined) ?? [];
  const displayed = useRef(new Set<string>());

  useEffect(() => {
    for (const message of flashMessages) {
      const key = `${message.level}:${message.message}`;
      if (displayed.current.has(key)) continue;

      displayed.current.add(key);
      if (message.level === "error") toast.error(message.message);
      else if (message.level === "warning") toast.warning(message.message);
      else if (message.level === "success") toast.success(message.message);
      else toast(message.message);
    }
  }, [flashMessages]);
}
