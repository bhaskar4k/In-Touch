package user_information_service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import database_configuration.Logical_sharding;
import database_configuration.MySQLDatabaseConfig;
import model.User;

public class DB_user_information_service {
	private Connection connection;
	
	public DB_user_information_service() throws SQLException{
		System.out.println("DB user information service object created");
		connection = MySQLDatabaseConfig.getConnection();
	}
	
	
	/*--------- Checking if the user_name is available to use or not ----------------------------------*/
	public boolean valid_username(String user_name) {
		PreparedStatement preparedStatement=null;
		ResultSet resultSet=null;
        Boolean username_not_available=false;
		
        try{
        	String database_shard=Logical_sharding.get_shard_name(user_name);
            String sql = "SELECT count(*) AS count FROM touch.user_"+database_shard+" where user_name=?;";  
            
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, user_name);
            
            resultSet = preparedStatement.executeQuery();          
            
            int count=0;
            while (resultSet.next()) {
            	count += resultSet.getInt("count");
            }            
            if(count>0) username_not_available=true;
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
        
        return username_not_available;
	}
	/*-------------------------------------------------------------------------------------------------*/
	
	
	/*--------- Checking if the email is available to use or not --------------------------------------*/
	public boolean valid_email(String email) {
		PreparedStatement preparedStatement=null;
	    Boolean email_not_available=false;
			
	    try{    
	    	String sql1 = "SELECT count(*) AS count FROM touch.user_a_to_i where email=?;"; 
	        String sql2 = "SELECT count(*) AS count FROM touch.user_j_to_s where email=?;"; 
	        String sql3 = "SELECT count(*) AS count FROM touch.user_t_to_z where email=?;"; 
	            
	        for(int i=0; i<3; i++) {
	        	if(i==0) preparedStatement = connection.prepareStatement(sql1);
	            else if(i==1) preparedStatement = connection.prepareStatement(sql2);
	            else if(i==2) preparedStatement = connection.prepareStatement(sql3);
	            	
		        preparedStatement.setString(1, email);
		            
		        ResultSet resultSet = preparedStatement.executeQuery();          
		            
		        int count=0;
		        while (resultSet.next()) {
		        	count += resultSet.getInt("count");
		        }
		            
		        if(count>0) {
		        	email_not_available=true;
		        	break;
		        }
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
	        
	    return email_not_available;
	}
	/*-------------------------------------------------------------------------------------------------*/
	
	
	/*--------- Registering the user if the user_name and email is available --------------------------*/
	@SuppressWarnings("resource")
	public boolean register_user(User user) {
		PreparedStatement preparedStatement=null;
        Boolean registration_status=false;
		
        try{
        	String database_shard=Logical_sharding.get_shard_name(user.getUser_name());
            String sql = "insert into `touch`.`user_"+database_shard+"` (`user_name`,`birthdate`,`gender`,`phone`,`email`,`password`,`bio`) values(?,?,?,?,?,?,?)";            
            
            preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setString(1, user.getUser_name());
            preparedStatement.setString(2, user.getBirthdate());
            preparedStatement.setString(3, user.getGender());
            preparedStatement.setString(4, user.getPhone());
            preparedStatement.setString(5, user.getEmail());
            preparedStatement.setString(6, user.getPassword());
            preparedStatement.setString(7, user.getBio());

            int count = preparedStatement.executeUpdate();
                                 
            if(count>0) {
            	sql = "insert into `touch`.`profile_photo_"+database_shard+"` (`user_name`) values(?)";                          
                preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setString(1, user.getUser_name());

                count = preparedStatement.executeUpdate();  
                
                if(count>0) {                	
                	sql = "insert into touch.post_count (username,count) values (?, 0)";                          
                    preparedStatement = connection.prepareStatement(sql);
                    preparedStatement.setString(1, user.getUser_name());

                    count = preparedStatement.executeUpdate();
                    
                    if(count>0) {
                    	registration_status=true;
                    }else {
                    	delete_account(user.getUser_name());
                    }
                }else {
                	delete_account(user.getUser_name());
                }
            }else {
            	delete_account(user.getUser_name());
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
        
        return registration_status;
	}
	/*-------------------------------------------------------------------------------------------------*/
	
	@SuppressWarnings("resource")
	public boolean delete_account(String user_name) {
		PreparedStatement preparedStatement=null;
	    Boolean account_deletion_status=false;
	    String database_shard=Logical_sharding.get_shard_name(user_name);
			
	    try{    
	    	String sql = "delete from touch.user_"+database_shard+" where user_name="+user_name;                          
            preparedStatement = connection.prepareStatement(sql);

            preparedStatement.executeUpdate();	          
            
            sql = "delete from touch.post_count where username="+user_name;                          
            preparedStatement = connection.prepareStatement(sql);

            preparedStatement.executeUpdate();
            
            account_deletion_status=true;
	    } catch (Exception e) {
	        e.printStackTrace();
	    } finally {
	        try {
	        	preparedStatement.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
	            
	    }
	        
	    return account_deletion_status;
	}
	
	/*--------- Login the user and return his user_name -----------------------------------------------*/
	public User login_user(User user) {
		PreparedStatement preparedStatement=null;
		String user_name="null", birthdate="null", gender="null", phone="null", email="null", password="null", bio="null";
		
        try{        
            String sql1 = "SELECT * FROM touch.user_a_to_i where email=? and password=?;"; 
            String sql2 = "SELECT * FROM touch.user_j_to_s where email=? and password=?;";  
            String sql3 = "SELECT * FROM touch.user_t_to_z where email=? and password=?;";  
            
            for(int i=0; i<3; i++) {
            	if(i==0) preparedStatement = connection.prepareStatement(sql1);        
            	else if(i==1) preparedStatement = connection.prepareStatement(sql2);
            	else preparedStatement = connection.prepareStatement(sql3);
            	
                preparedStatement.setString(1, user.getEmail());
                preparedStatement.setString(2, user.getPassword());
                
                ResultSet resultSet = preparedStatement.executeQuery();          
                                
                while (resultSet.next()) {
                	user_name = resultSet.getString("user_name");
                	birthdate = resultSet.getString("birthdate");
                	gender = resultSet.getString("gender");
                	phone = resultSet.getString("phone");
                	email = resultSet.getString("email");
                	password = resultSet.getString("password");
                	bio = resultSet.getString("bio");
                }
                resultSet.close();
                
                if(user_name!="null") break;
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
        
        User login_user=new User(user_name,birthdate,gender,phone,email,password,bio);
        
        return login_user;
	}
	/*-------------------------------------------------------------------------------------------------*/
}
