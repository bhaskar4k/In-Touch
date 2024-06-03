package model;

public class Chat_list{
	private int chat_id;
	private String username;
	
	public Chat_list(int chat_id, String username) {
		super();
		this.chat_id = chat_id;
		this.username = username;
	}
	
	public int getChat_id() {
		return chat_id;
	}
	
	public void setChat_id(int chat_id) {
		this.chat_id = chat_id;
	}
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
}
