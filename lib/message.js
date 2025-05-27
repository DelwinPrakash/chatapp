import { supabase } from "./supabase";

export const sendMessage = async ({ conversationId, senderId, content }) => {
    try{
        const { data, error } = await supabase
            .from("messages")
            .insert({
                conversation_id: conversationId,
                sender_id: senderId,
                content
            }).select()

        if(error){
            throw error
        }

        return data?.[0];
    }catch(error){
        console.log("Error sending message:", error);
        return null;
    }
}