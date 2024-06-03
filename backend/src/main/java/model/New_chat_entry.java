package model;

public class New_chat_entry {
	public String person1, person2;

	public New_chat_entry(String person1, String person2) {
		super();
		this.person1 = person1;
		this.person2 = person2;
	}

	public String getPerson1() {
		return person1;
	}

	public void setPerson1(String person1) {
		this.person1 = person1;
	}

	public String getPerson2() {
		return person2;
	}

	public void setPerson2(String person2) {
		this.person2 = person2;
	}
}
