import type { ActionFunction } from '@remix-run/node';
import { Form, useActionData, useTransition } from "@remix-run/react";
import { json, redirect } from '@remix-run/node'

import { createPost } from "~/models/post.server";

import invariant from "tiny-invariant";

// Types
type ActionData = | { title: null | string, slug: null | string, markdown: null | string } | undefined;

// Styling
const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;
const inputErrorClassName = 'text-red-600'


export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData()

    const title = await formData.get("title")
    invariant(typeof title === "string", "'title' must be of type 'string'")

    const slug = await formData.get("slug")
    invariant(typeof slug === "string", "'slug' must be of type 'string'")

    const markdown = await formData.get("markdown")
    invariant(typeof markdown === "string", "'markdown' must be of type 'string'")


    // Error handling
    const errors: ActionData = {
        title: title ? null : 'Title is required',
        slug: slug ? null : 'Slug is required',
        markdown: markdown ? null : 'Markdown is required',
    }

    const hasErrors = Object.values(errors).some(
        (errorMessage) => errorMessage
    )

    if (hasErrors) { return json<ActionData>(errors) }

    // Results
    await createPost({ title, slug, markdown })

    return redirect('/posts/admin')
}


export default function NewPost() {
    const errors = useActionData();

    const transition = useTransition();
    const isCreating = Boolean(transition.submission)

    return (
        <Form method="post">
            <p>
                <label>
                    Post Title:{" "}
                    {errors?.title ? (
                        <em className={inputErrorClassName}>{errors.title}</em>
                    )
                        : null
                    }
                    <input
                        type="text"
                        name="title"
                        className={inputClassName}
                    />
                </label>
            </p>
            <p>
                <label>
                    Post Slug:{" "}
                    {errors?.slug ? (
                        <em className={inputErrorClassName}>{errors.slug}</em>
                    ) : null}
                    <input
                        type="text"
                        name="slug"
                        className={inputClassName}
                    />
                </label>
            </p>
            <p>
                <label htmlFor="markdown">Markdown:</label>
                {errors?.markdown ? (
                    <em className={inputErrorClassName}>
                        {errors.markdown}
                    </em>
                ) : null}
                <br />
                <textarea
                    id="markdown"
                    rows={20}
                    name="markdown"
                    className={`${inputClassName} font-mono`}
                />
            </p>
            <p className="text-right">
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
                    disabled={isCreating}
                >
                    {isCreating ? "Creating..." : "Create Post"}
                </button>
            </p>
        </Form>
    );
}