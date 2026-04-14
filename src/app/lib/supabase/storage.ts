import { File } from "expo-file-system";
import { supabase } from "./client";

export const uploadProfileImage = async (userId: string, imageUri: string) => {
  try {
    const fileExtension = imageUri.split(".").pop() || "jpg";
    const fileName = `${userId}/profiles.${fileExtension}`;
    const file = new File(imageUri);
    const byte = await file.bytes();

    const { error } = await supabase.storage
      .from("profiles")
      .upload(fileName, byte, {
        contentType: `image/${fileExtension}`,
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("profiles")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading profiles image", error);
    throw error;
  }
};
