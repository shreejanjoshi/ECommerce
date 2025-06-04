import configPromise from "@payload-config";
import { getPayload } from "payload";

import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilters } from "./search-filters";
import { Category } from "@/payload-types";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    // 0 will not populate the subcategory 1 will
    depth: 1, // populate subcategories, subcategories.[0] will be a type of "Category"
    pagination: false, // show all
    where: {
      parent: {
        exists: false,
      },
    },
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

  console.log(data, formattedData);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
