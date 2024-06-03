package model;

public class Message_entity {
	public int chat_id;
	public String sent_by, message, sent_time;
	
	public Message_entity(int chat_id, String sent_by, String message, String sent_time) {
		super();
		this.chat_id = chat_id;
		this.sent_by = sent_by;
		this.message = message;
		this.sent_time = sent_time;
	}

	public int getChat_id() {
		return chat_id;
	}

	public void setChat_id(int chat_id) {
		this.chat_id = chat_id;
	}

	public String getSent_by() {
		return sent_by;
	}

	public void setSent_by(String sent_by) {
		this.sent_by = sent_by;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getSent_time() {
		return sent_time;
	}

	public void setSent_time(String sent_time) {
		this.sent_time = sent_time;
	}
}
