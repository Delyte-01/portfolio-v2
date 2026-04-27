import localFont from "next/font/local";

export const syne = localFont({
  src: [
    {
      path: "./fonts/Syne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Syne-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Syne-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Syne-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Syne-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-syne",
});




export const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});

export const clashDisplay = localFont({
  src: [
    {
      path: "./fonts/ClashDisplay-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/ClashDisplay-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/ClashDisplay-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clashDisplay",
});