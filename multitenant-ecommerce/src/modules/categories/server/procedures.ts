import { Category } from "@/payload-types";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "categories",
      // 0 will not populate the subcategory 1 will
      depth: 1, // populate subcategories, subcategories.[0] will be a type of "Category"
      pagination: false, // show all
      where: {
        parent: {
          exists: false,
        },
      },

      sort: "name",
    });

    const formattedData = data.docs.map((doc) => ({
      ...doc,
      //optional so
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        // got error here because if the dept i 0 it will be string and 1 then object
        // because of "depth: 1" we are confident "doc" will be a type of Category
        ...(doc as Category),
        subcategories: undefined, //so that subcategories does not have subcategories
      })),
    }));

    return formattedData;
  }),
});
