package searchbar_service;

import java.sql.SQLException;
import java.util.ArrayList;

import model.Search_user_request_parameter;
import model.Profile_photo;

public class Searchbar_service {
	private DB_searchbar_service db_searchbar_service;
	
	public Searchbar_service() throws SQLException {
		this.db_searchbar_service=new DB_searchbar_service();
	}
	
	public ArrayList<Profile_photo> get_search_suggession(Search_user_request_parameter search_user_request_parameter) {
		return db_searchbar_service.get_search_suggession(search_user_request_parameter);
	}
}
