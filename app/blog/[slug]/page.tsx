import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import Image from "next/image";

async function getBlog(slug: string) {
  const response = await fetch(`${process.env.API}/blog/${slug}`, {
    method: "GET",
    next: { revalidate: 1 },
  });

  const data = await response.json();
  return data;
}

export default async function BlogViewPage({ params }) {
  console.log("params: " + params.slug);
  const blog = await getBlog(params.slug);
  return (
    <main className="p-2">
      {/* <pre>{JSON.stringify(blog, null, 4)}</pre> */}

      <div className="w-full mt-10 bg-slate-50 shadow-sm">
        <div>
          <Image
            src={blog?.image || "/mountains.png"}
            className="object-contain w-full"
            width={200}
            height={200}
            alt={blog?.title}
          />
        </div>

        <div className="p-1">
          <h5 className="text-2xl font-semilbold text-blue-400">
            {blog?.title}
          </h5>
          <hr />
          <div className="pt-4">
            <div
              className=""
              dangerouslySetInnerHTML={{
                __html: blog.content,
              }}
            ></div>

            <footer className="flex flex-col space-y-2 mt-5">
              <hr />
              <span className="text-sm">
                <strong>Category:</strong> {blog?.category}
              </span>
              <span className="text-sm pt-1">
                <strong>Author:</strong> {blog?.postedBy?.name || "Admin"}
              </span>
              <span className="text-sm pt-1">
                <b>Source:</b>{" "}
                <a
                  href={blog?.link}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-blue-400"
                >
                  {blog?.link}
                </a>
              </span>
              <div className="flex justify-between pt-3 text-sm">
                <p>❤️ {blog?.likes?.length} likes</p>
                <strong className="text-sm">
                  Posted {dayjs(blog?.createdAt).fromNow()}
                </strong>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}