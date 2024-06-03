package user_information_update_service;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import database_configuration.Logical_sharding;
import database_configuration.MySQLDatabaseConfig;
import model.Update_user;

public class DB_user_information_update_service {
	private Connection connection;
	
	public DB_user_information_update_service() throws SQLException{
		connection = MySQLDatabaseConfig.getConnection();
	}
	
	
	/*--------- Change profile photo ------------------------------------------------------------------*/
	public Boolean change_profile_photo(InputStream fileInputStream, String user_name) {
		PreparedStatement preparedStatement=null;
        Boolean photo_updation_status=false;
		
        try{
        	String database_shard=Logical_sharding.get_shard_name(user_name);
            String sql = "update `touch`.`profile_photo_"+database_shard+"` set profile_photo=? WHERE user_name=?";           
            
            preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setBlob(1, fileInputStream);
            preparedStatement.setString(2, user_name);

            int count = preparedStatement.executeUpdate();
                                 
            if(count>0) photo_updation_status=true;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
            	preparedStatement.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
            
        }
        
        return photo_updation_status;
	}
	/*-------------------------------------------------------------------------------------------------*/
	
	
	/*--------- Update user information ------------------------------------------------------------------*/
	public Boolean update_user_information(Update_user update_user) {
		PreparedStatement preparedStatement=null;
        Boolean field_updation_status=false;
		
        try{
        	String database_shard=Logical_sharding.get_shard_name(update_user.getUser_name());
            String sql = "update `touch`.`user_"+database_shard+"` set "+update_user.getField_name()+"=? WHERE user_name=?";           
            
            preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setString(1, update_user.getUpdated_value());
            preparedStatement.setString(2, update_user.getUser_name());

            int count = preparedStatement.executeUpdate();
                                 
            if(count>0) field_updation_status=true;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
            	preparedStatement.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
            
        }
        
        return field_updation_status;
	}
	/*-------------------------------------------------------------------------------------------------*/
	

	
	/*--------- Update post count ------------------------------------------------------------------*/
	public Boolean update_post_count(String user_name) {
		PreparedStatement preparedStatement=null;
        Boolean update_post_count_status=false;
		
        try{
            String sql = "update touch.post_count set count=count+1 where username='"+user_name+"'";           
            
            preparedStatement = connection.prepareStatement(sql);
            int count = preparedStatement.executeUpdate();
                                 
            if(count>0) update_post_count_status=true;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
            	preparedStatement.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
            
        }
        
        return update_post_count_status;
	}
	/*-------------------------------------------------------------------------------------------------*/
}
