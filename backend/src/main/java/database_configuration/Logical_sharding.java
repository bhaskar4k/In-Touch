package database_configuration;

public class Logical_sharding {
	public static String get_shard_name(String user_name) {
		String db_shard="a_to_i";
    	if(user_name.charAt(0)>='j' && user_name.charAt(0)<='s') {
    		db_shard="j_to_s";
    	}else if(user_name.charAt(0)>='t' && user_name.charAt(0)<='z') {
    		db_shard="t_to_z";
    	}
    	
    	return db_shard;
	}
}
