import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#060606",
    description:
      "Centro de comando pessoal para tarefas, financas e estudos.",
    display: "standalone",
    icons: [
      {
        sizes: "800x800",
        src: "/logo.png",
        type: "image/png",
      },
    ],
    name: "Secret",
    short_name: "Secret",
    start_url: "/dashboard",
    theme_color: "#060606",
  };
}
