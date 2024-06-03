package model;

public class Past_chat_input_entity {
	public String chat_id, offset;

	public Past_chat_input_entity(String chat_id, String offset) {
		super();
		this.chat_id = chat_id;
		this.offset = offset;
	}

	public String getChat_id() {
		return chat_id;
	}

	public void setChat_id(String chat_id) {
		this.chat_id = chat_id;
	}

	public String getOffset() {
		return offset;
	}

	public void setOffset(String offset) {
		this.offset = offset;
	}
}
