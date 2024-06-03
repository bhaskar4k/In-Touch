package user_information_update_service;

import java.io.InputStream;
import java.sql.SQLException;

import model.Update_user;
import user_information_service.User_information_service;

public class User_information_update_service {
	private DB_user_information_update_service db_user_information_update_service;
	private User_information_service user_information_service;
	
	public User_information_update_service() throws SQLException{
		this.db_user_information_update_service=new DB_user_information_update_service();
		this.user_information_service=new User_information_service();
	}
	
	
	/*--------- Change profile photo ------------------ -----------------------------------------------*/
	public String change_profile_photo(InputStream fileInputStream, String user_name) {
		if(db_user_information_update_service.change_profile_photo(fileInputStream,user_name)==true) {
			return "0|Profile photo updated successfully.";
		}
		
		return "2|Internal Server Error.";
	}
	/*-------------------------------------------------------------------------------------------------*/
	
	
	/*--------- Update user information ------------------ -----------------------------------------------*/
	public String update_user_information(Update_user update_user) {
		String field=update_user.getField_name(), updated_value=update_user.getUpdated_value();
		
		if(field.equals("user_name") && user_information_service.is_this_username_available(updated_value)==true) {			
			return "3";
		}
		
		if(field.equals("email") && user_information_service.is_this_email_available(updated_value)==true) {			
			return "3";
		}
		
		if(db_user_information_update_service.update_user_information(update_user)==true) {
			return "0";
		}
		
		return "2|Internal Server Error.";
	}
	/*-------------------------------------------------------------------------------------------------*/


	
	/*--------- Update post count -----------------------------------------------------------------*/
	public String update_post_count(String user_name) {
		if(db_user_information_update_service.update_post_count(user_name)==true) {
			System.out.println("ASCHE KHANKIR CHELE"+user_name);
			return "0";
		}
		return "2|Internal Server Error.";
	}
	/*-------------------------------------------------------------------------------------------------*/
}
