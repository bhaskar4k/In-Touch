package searchbar_service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import database_configuration.Logical_sharding;
import database_configuration.MySQLDatabaseConfig;
import model.Search_user_request_parameter;
import model.Profile_photo;
import user_information_get_service.User_information_get_service;

public class DB_searchbar_service {
    private Connection connection;
	private User_information_get_service user_information_get_service;
	
	public DB_searchbar_service() throws SQLException{
		System.out.println("DB searchbar service object created");
		this.connection = MySQLDatabaseConfig.getConnection();
		this.user_information_get_service=new User_information_get_service();
	}
	
	
	public ArrayList<Profile_photo> get_search_suggession(Search_user_request_parameter search_user_request_parameter) {
		ArrayList<Profile_photo> suggession=new ArrayList<>();
		PreparedStatement preparedStatement=null;
		ResultSet resultSet=null;
		
        try{
        	String database_shard=Logical_sharding.get_shard_name(search_user_request_parameter.getPrefix());
            String sql = "select user_name from touch.user_"+database_shard+" where user_name like '"+search_user_request_parameter.getPrefix()+"%' limit 10 offset "+search_user_request_parameter.getOffset();            
            
            preparedStatement = connection.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();  
            
            while (resultSet.next()) {
            	String user_name=resultSet.getString("user_name");
            	String profile_photo=user_information_get_service.get_profile_photo(user_name);
            	Profile_photo searchbar_suggession=new Profile_photo(user_name,profile_photo);
            	suggession.add(searchbar_suggession);            	
            }                   
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
            	preparedStatement.close();
            	resultSet.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
            
        }
        
        return suggession;
	}
}
