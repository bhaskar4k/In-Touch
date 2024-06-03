package chat_service;

import java.sql.SQLException;
import java.util.*;

import model.Chat_list;
import model.Message_entity;
import model.New_chat_entry;
import model.Past_chat_input_entity;

public class Chat_service {
	private DB_Chat_service db_chat_service;
	
	public Chat_service() throws SQLException{
		this.db_chat_service=new DB_Chat_service();
	}
	
	
	/*--------- Get all chatting user list ------------------------------------------------------------------------------*/
	public List<Chat_list> get_all_chatting_user_list(String user_name){
		return db_chat_service.get_all_chatting_user_list(user_name);
	}
	/*-----------------------------------------------------------------------------------------------------------------------*/
	
	
	/*--------- Insert new chat person into DB ------------------------------------------------------------------------------*/
	public String insert_new_chat_person_into_DB(New_chat_entry new_chat_entry) {
		int chat_id=db_chat_service.is_new_chat_person_already_in_db(new_chat_entry);
		if(chat_id!=-1) {
			return Integer.toString(chat_id);
		}
		
		if(db_chat_service.insert_new_chat_person_into_DB(new_chat_entry)==true) {
			return "ok";
		}else {
			return "fail";
		}
	}
	/*-----------------------------------------------------------------------------------------------------------------------*/

	
	/*--------- Insert message into DB ------------------------------------------------------------------------------*/
	public String send_message(Message_entity message) {		
		if(db_chat_service.send_message(message)==true) {
			return "ok";
		}else {
			return "fail";
		}
	}
	/*-----------------------------------------------------------------------------------------------------------------------*/

	
	/*--------- Pull past chat ------------------------------------------------------------------------------*/
	public List<Message_entity> pull_past_chat(Past_chat_input_entity entity) {		
		return db_chat_service.pull_past_chat(entity);
	}
	/*-----------------------------------------------------------------------------------------------------------------------*/
}
