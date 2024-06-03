package model;

public class Search_user_request_parameter {
	private String prefix, offset;

	public Search_user_request_parameter(String prefix, String offset) {
		super();
		this.prefix = prefix;
		this.offset = offset;
	}

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public String getOffset() {
		return offset;
	}

	public void setOffset(String offset) {
		this.offset = offset;
	}

	@Override
	public String toString() {
		return "Search_user_request_parameter [prefix=" + prefix + ", offset=" + offset + "]";
	}
}
