import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import { generateOgpImage } from "../../../components/OGP";

export const getStaticPaths = async () => {
  const allBlogPosts = await getCollection("blog", (item) => {
    return import.meta.env.MODE === "production" ? item.data.published : true;
  });
  return allBlogPosts.map((post) => {
    return {
      params: { id: post.id },
    };
  });
};

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) {
    return new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const post = await getEntry("blog", id);
  if (!post) {
    return new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const png = await generateOgpImage(post.data.title);

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
