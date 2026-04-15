import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase/client";
import { uploadPost } from "../lib/supabase/storage";

export interface PostUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export interface Post {
  id: string;
  user_id: string;
  image_url: string;
  description?: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  profiles?: PostUser;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(
          `*,
         profiles:profiles!posts_user_id_fkey (
             id,
             name,
             username,
            profile_image_url
            )
          `,
        )
        .eq("is_active", true)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error loading posts:", postsError);
        throw postsError;
      }

      if (!postsData || postsData?.length === 0) {
        setPosts([]);
        return;
      }

      console.log("Data", postsData);

      const postsWithProfiles = postsData.map((post) => ({
        ...post,
        profiles: post.profiles || null,
      }));

      setPosts(postsWithProfiles);
    } catch (error) {
      console.error("Error in loadPosts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (imageUri: string, description?: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const { error: deactivatedError } = await supabase
        .from("posts")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("is_active", true);
      if (deactivatedError) {
        console.error("Error deactivating old posts:", deactivatedError);
      }

      const imageUrl = await uploadPost(user.id, imageUri);

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const { error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          description: description || null,
          expires_at: expiresAt.toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.log("Error creating post:", error);
        throw error;
      }

      await loadPosts();
    } catch (error) {
      console.error("Error in createPost:", error);
      throw error;
    }
  };

  const refreshPosts = async () => {
    await loadPosts()
  }

  return { createPost, posts, refreshPosts };
};
