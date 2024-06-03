package chat_service;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;
import java.util.*;

import database_configuration.Logical_sharding;
import database_configuration.MySQLDatabaseConfig;
import model.Chat_list;
import model.Message_entity;
import model.New_chat_entry;
import model.Past_chat_input_entity;


public class DB_Chat_service {
	private Connection connection;
	
	public DB_Chat_service() throws SQLException{
		connection = MySQLDatabaseConfig.getConnection();
	}
	
	
	/*--------- Get all chatting user list ------------------------------------------------------------------------------*/
	@SuppressWarnings("resource")
	public List<Chat_list> get_all_chatting_user_list(String user_name){
		List<Chat_list> list=new ArrayList<Chat_list>();
		PreparedStatement preparedStatement=null;
		
        try {
            String sql = "SELECT chat_id, person1 FROM touch.chat_id WHERE person2=?";
            
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, user_name);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {       
            	list.add(new Chat_list(resultSet.getInt("chat_id"),resultSet.getString("person1")));            
            }
            
            sql = "SELECT chat_id, person2 FROM touch.chat_id WHERE person1=?";
            
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, user_name);
            resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {       
            	list.add(new Chat_list(resultSet.getInt("chat_id"),resultSet.getString("person2")));            
            }
            
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }  finally {
            try {
            	preparedStatement.close();				
			} catch (SQLException e) {
				e.printStackTrace();
			}
            
        }
        
        return list;
	}
	/*-----------------------------------------------------------------------------------------------------------------------*/
	
	
	/*--------- Is neew chat person already in DB ------------------------------------------------------------------------------*/
	public int is_new_chat_person_already_in_db(New_chat_entry chat) {
		int chat_id=-1;
		PreparedStatement preparedStatement=null;
		
        try {
            String sql = "SELECT chat_id FROM touch.chat_id WHERE (person1 = '"+chat.getPerson1()+"' AND person2 = '"+chat.getPerson2()+"') OR (person1 = '"+chat.getPerson2()+"' AND person2 = '"+chat.getPerson1()+"')";
            
            preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {       
            	chat_id=resultSet.getInt("chat_id");
            }         
            
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }  finally {
            try {
            	preparedStatement.close();				
			} catch (SQLException e) {
				e.printStackTrace();
			}
            
        }
        
        return chat_id;
	}
	
	
	/*--------- Insert new chat person into DB ------------------------------------------------------------------------------*/
	public boolean insert_new_chat_person_into_DB(New_chat_entry new_chat_entry) {
		PreparedStatement preparedStatement=null;
        Boolean insertion_status=false;
		
        try{
            String sql = "insert into `touch`.`chat_id` (`person1`,`person2`) values(?,?)";            
            
            preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setString(1, new_chat_entry.getPerson1());
            preparedStatement.setString(2, new_chat_entry.getPerson2());

            int count = preparedStatement.executeUpdate();
                                 
            if(count>0) {
            	insertion_status=true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
            	preparedStatement.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
            
        }
        
        return insertion_status;
	}
	/*-----------------------------------------------------------------------------------------------------------------------*/

	
	/*--------- Insert new chat person into DB ------------------------------------------------------------------------------*/
	public boolean send_message(Message_entity message) {
		PreparedStatement preparedStatement=null;
        Boolean insertion_status=false;
		
        try{
            String sql = "insert into `touch`.`chat` (`chat_id`,`sent_by`,`message`,`sent_time`) values(?,?,?,SYSDATE())";            
            
            preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setInt(1, message.getChat_id());
            preparedStatement.setString(2, message.getSent_by());
            preparedStatement.setString(3, message.getMessage());

            int count = preparedStatement.executeUpdate();
                                 
            if(count>0) {
            	insertion_status=true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
            	preparedStatement.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
            
        }
        
        return insertion_status;
	}
	/*-----------------------------------------------------------------------------------------------------------------------*/

	
	/*--------- Pull past chat ------------------------------------------------------------------------------*/
	@SuppressWarnings("resource")
	public List<Message_entity> pull_past_chat(Past_chat_input_entity entity){
		List<Message_entity> list=new ArrayList<Message_entity>();
		PreparedStatement preparedStatement=null;
		
        try {
            String sql = "SELECT * FROM touch.chat WHERE chat_id=? ORDER BY sent_time DESC LIMIT 20 OFFSET "+entity.getOffset();
            
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, entity.getChat_id());
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {       
            	list.add(new Message_entity(resultSet.getInt("chat_id"),resultSet.getString("sent_by"),
            			resultSet.getString("message"),resultSet.getString("sent_time")));            
            }        
            
            resultSet.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }  finally {
            try {
            	preparedStatement.close();				
			} catch (SQLException e) {
				e.printStackTrace();
			}
            
        }
        
        return list;
	}
	/*-----------------------------------------------------------------------------------------------------------------------*/
}
