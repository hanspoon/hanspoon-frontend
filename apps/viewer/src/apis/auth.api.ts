import { supabase } from "../lib/supabase";

export const fetchUserInfo = async () => {
	const { data: userInfo, error: userError } = await supabase.auth.getUser();
	if (userError) throw userError;
	return userInfo;
};
