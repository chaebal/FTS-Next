import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { z } from "zod";

type Context = {
  userId: string;
  userRole: "admin" | "user";
};

function createContext({ req }: CreateContextOptions): Context {
  // get the session from your auth provider
  // const session = getSession(req);
  console.log("Request received:", req.method, req.url);

  return {
    userId: "1234",
    userRole: "user",
  };
}

const es = initEdgeStore.context<Context>().create();

const edgeStoreRouter = es.router({
  myPublicImages: es
    .imageBucket({
      maxSize: 1024 * 1024 * 1, // 1MB
    })
    .input(
      z.object({
        type: z.enum(["post", "profile"]),
      })
    )
    // e.g. /post/my-file.jpg
    .path(({ input }) => [{ type: input.type }]),

  myProtectedFiles: es
    .fileBucket()
    // e.g. /123/my-file.pdf
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({
      OR: [
        {
          userId: { path: "owner" },
        },
        {
          userRole: { eq: "user" },
        },
      ],
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST };

export type EdgeStoreRouter = typeof edgeStoreRouter;

// import { initEdgeStore } from "@edgestore/server";
// import {
//   CreateContextOptions,
//   createEdgeStoreNextHandler,
// } from "@edgestore/server/adapters/next/app";
// // const es = initEdgeStore.context<Context>().create();
// const es = initEdgeStore.create();
// /**
//  * This is the main router for the Edge Store buckets.
//  */

// // type Context = {
// //   userId: string;
// //   userRole: "admin" | "user";
// // };

// // function createContext({ req }: CreateContextOptions): Context {
// //   //get session from auth provider

// //   return {
// //     userId: "1234",
// //     userRole: "user",
// //   };
// // }

// const edgeStoreRouter = es.router({
//   publicImages: es.imageBucket(),
//   publicFiles: es.fileBucket(),
//   // .path(({ ctx }) => [{ owner: ctx.userId }])
//   // .accessControl({
//   //   OR: [
//   //     {
//   //       userId: { path: "owner" },
//   //     },
//   //     {
//   //       userRole: { eq: "admin" },
//   //     },
//   //   ],
//   // }), //  e.g /123/my-file.pdf
// });

// const handler = createEdgeStoreNextHandler({
//   router: edgeStoreRouter,
//   // createContext,
// });
// export { handler as GET, handler as POST };
// /**
//  * This type is used to create the type-safe client for the frontend.
//  */
// export type EdgeStoreRouter = typeof edgeStoreRouter;
