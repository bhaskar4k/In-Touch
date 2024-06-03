package model;

public class Update_user {
	private String updated_value, field_name, user_name;

	public Update_user(String updated_value, String field_name, String user_name) {
		super();
		this.updated_value = updated_value;
		this.field_name = field_name;
		this.user_name = user_name;
	}

	public String getUpdated_value() {
		return updated_value;
	}

	public void setUpdated_value(String updated_value) {
		this.updated_value = updated_value;
	}

	public String getField_name() {
		return field_name;
	}

	public void setField_name(String field_name) {
		this.field_name = field_name;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	@Override
	public String toString() {
		return "UpdateUser [updated_value=" + updated_value + ", field_name=" + field_name + ", user_name=" + user_name
				+ "]";
	}
}
