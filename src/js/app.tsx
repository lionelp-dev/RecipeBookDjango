import "vite/modulepreload-polyfill";

import { createInertiaApp } from "@inertiajs/react";
import type { ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { FlashNotifications } from "./components/FlashNotifications";
import "../css/app.css";

type PageModule = {
  default: ComponentType<unknown>;
};

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob<PageModule>("./pages/**/*.tsx", {
      eager: true,
    });

    return pages[`./pages/${name}.tsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <App {...props}>
        {({ Component, props: pageProps, key }) => {
          const Page = Component as ComponentType<Record<string, unknown>>;
          return <><Page key={key} {...pageProps} /><FlashNotifications /><Toaster position="top-center" richColors /></>;
        }}
      </App>,
    );
  },
});
