import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/models/post.server";

type LoaderData = {
    // this is a handy way to say: "posts is whatever type getPosts resolves to"
    posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader = async () => {
    return json<LoaderData>({
        posts: await getPosts(),
    });
};


export default function Posts() {
    const { posts } = useLoaderData() as LoaderData;
    return (
        <main className="p-8 mr-auto  bg-slate-100">
            <h1 className="py-8 text-4xl">Posts</h1>
            <Link to="admin" className="p-2 text-xl text-blue-800 bg-blue-700 bg-opacity-5 rounded-xl hover:underline hover:text-yellow-700">Admin</Link>
            <ul className="my-8 border-2 ">
                {posts.map((post) => (
                    <li key={post.slug} className="py-2">
                        <Link
                            to={post.slug}
                            className="text-blue-800 hover:underline hover:text-yellow-700"
                        >
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
