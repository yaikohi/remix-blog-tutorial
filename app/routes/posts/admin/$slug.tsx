import type { LoaderFunction } from "@remix-run/node";
import type { Post } from '~/models/post.server'

import { marked } from 'marked'
import invariant from "tiny-invariant";

import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { getPost } from "~/models/post.server";

type LoaderData = { post: Post, html: string }

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.slug, `params.slug is required`)

    const post = await getPost(params.slug)

    invariant(post, `Post not found: ${params.slug}`)

    const html = marked(post.markdown)

    return json<LoaderData>({ post, html })
}

export default function PostSlug() {
    const { post, html } = useLoaderData() as LoaderData;
    return (
        <main className="max-w-lg mx-auto">
            <h2 className="text-xl text-center border-b-2 ">
                Some post: {post.title}
            </h2>
            <div className="mb-12 text-sm italic font-light text-right">
                <p>created at: {post.createdAt}</p>
                <p>updated at: {post.updatedAt}</p>
            </div>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </main>
    )
}