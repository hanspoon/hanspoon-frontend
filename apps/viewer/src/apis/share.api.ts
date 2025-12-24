import { supabase } from "../lib/supabase";

export const fetchAnnotations = async (shareId: string) => {
	const { data: annotations, error: fetchError } = await supabase
		.from("annotations")
		.select()
		.eq("share_id", shareId);
	if (fetchError) throw fetchError;

	return annotations;
};

export const fetchPost = async (shareId: string) => {
	const { data: post, error: fetchError } = await supabase
		.from("posts")
		.select()
		.eq("share_id", shareId)
		.single();

	if (fetchError) throw fetchError;

	return post;
};
